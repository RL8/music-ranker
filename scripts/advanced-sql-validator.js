/**
 * Advanced SQL Validator
 * 
 * This script provides enhanced validation for PostgreSQL queries, including:
 * - Case sensitivity and identifier quoting
 * - Logical errors like referencing column aliases in the same SELECT
 * - Transaction and error handling validation
 * - PostgreSQL-specific syntax validation
 * 
 * Usage: node advanced-sql-validator.js path/to/sql/file.sql
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Get file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a SQL file path');
  process.exit(1);
}

const fullPath = path.resolve(filePath);

// Check if file exists
if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

// Read file content
const sqlContent = fs.readFileSync(fullPath, 'utf8');

console.log(`\n=== Advanced SQL Validator ===`);
console.log(`Validating SQL file: ${fullPath}`);

// Parse SQL into statements
function parseSQL(sql) {
  // Remove comments
  const noComments = sql.replace(/--.*$/gm, '');
  
  // Split by semicolons, but respect those inside quotes and dollar-quoted strings
  const statements = [];
  let currentStatement = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inDollarQuote = false;
  let dollarTag = '';
  
  for (let i = 0; i < noComments.length; i++) {
    const char = noComments[i];
    const nextChar = noComments[i + 1] || '';
    
    // Handle quotes
    if (char === "'" && !inDoubleQuote && !inDollarQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (char === '"' && !inSingleQuote && !inDollarQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === '$' && nextChar === '$' && !inSingleQuote && !inDoubleQuote && !inDollarQuote) {
      inDollarQuote = true;
      dollarTag = '$$';
      i++; // Skip the next $
    } else if (char === '$' && inDollarQuote && dollarTag === '$$' && nextChar === '$') {
      inDollarQuote = false;
      dollarTag = '';
      i++; // Skip the next $
    }
    
    // Handle statement termination
    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inDollarQuote) {
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim());
      }
      currentStatement = '';
    } else {
      currentStatement += char;
    }
  }
  
  // Add the last statement if it exists
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}

// Analyze SELECT statements for logical errors
function analyzeSelectStatement(statement) {
  const issues = [];
  
  // Check for column aliases used in window functions or ORDER BY
  const selectMatch = statement.match(/SELECT\s+(.*?)\s+FROM/is);
  if (selectMatch) {
    const selectClause = selectMatch[1];
    
    // Extract column aliases
    const aliasRegex = /\bAS\s+["']?([a-zA-Z0-9_]+)["']?/gi;
    const aliases = [];
    let match;
    
    while ((match = aliasRegex.exec(selectClause)) !== null) {
      aliases.push(match[1].replace(/["']/g, ''));
    }
    
    // Check if aliases are used in window functions
    aliases.forEach(alias => {
      const aliasPattern = new RegExp(`\\bOVER\\s*\\([^)]*\\b${alias}\\b`, 'i');
      if (aliasPattern.test(selectClause)) {
        issues.push(`Column alias "${alias}" is referenced in a window function in the same SELECT clause. This will cause an error in PostgreSQL.`);
      }
      
      // Check if aliases are used in ORDER BY within the SELECT clause
      const orderByInSelectPattern = new RegExp(`\\bORDER\\s+BY\\s+[^)]*\\b${alias}\\b`, 'i');
      if (orderByInSelectPattern.test(selectClause)) {
        issues.push(`Column alias "${alias}" is referenced in an ORDER BY within the same SELECT clause. This will cause an error in PostgreSQL.`);
      }
    });
    
    // Check for ORDER BY clause at the end of the statement
    const orderByMatch = statement.match(/\bORDER\s+BY\s+(.*?)(?:$|LIMIT|OFFSET|FOR|FETCH)/is);
    if (orderByMatch) {
      const orderByClause = orderByMatch[1];
      
      aliases.forEach(alias => {
        const aliasInOrderBy = new RegExp(`\\b${alias}\\b`, 'i');
        if (aliasInOrderBy.test(orderByClause)) {
          // This is actually valid in PostgreSQL, so we don't flag it as an issue
        }
      });
    }
  }
  
  return issues;
}

// Check for unquoted identifiers
function checkUnquotedIdentifiers(sql) {
  const issues = [];
  
  // Find potential table.column patterns
  const potentialIdentifiers = sql.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
  
  potentialIdentifiers.forEach(identifier => {
    // Skip if already quoted
    if (identifier.includes('"')) return;
    
    // Skip common SQL functions and keywords
    const skipList = ['COUNT(', 'SUM(', 'AVG(', 'MIN(', 'MAX(', 'COALESCE(', 'NULLIF('];
    if (skipList.some(skip => identifier.includes(skip))) return;
    
    // Check if it's a table.column pattern
    const parts = identifier.split('.');
    if (parts.length === 2) {
      issues.push(`Unquoted identifier: ${identifier} - column names should be quoted with double quotes for case sensitivity in PostgreSQL`);
    }
  });
  
  return issues;
}

// Check for transaction blocks
function checkTransactionBlocks(sql) {
  const issues = [];
  
  if (!sql.includes('BEGIN') || !sql.includes('COMMIT')) {
    issues.push('Missing transaction block (BEGIN/COMMIT) - recommended for safety');
  }
  
  return issues;
}

// Check for error handling
function checkErrorHandling(sql) {
  const issues = [];
  
  if (!sql.includes('EXCEPTION') && !sql.includes('DO $$')) {
    issues.push('Consider adding error handling with DO $$ blocks and EXCEPTION handling');
  }
  
  return issues;
}

// Main validation function
function validateSql(sql) {
  const issues = [];
  
  // Basic checks
  issues.push(...checkUnquotedIdentifiers(sql));
  issues.push(...checkTransactionBlocks(sql));
  issues.push(...checkErrorHandling(sql));
  
  // Parse SQL into statements for more advanced analysis
  const statements = parseSQL(sql);
  
  // Analyze each statement
  statements.forEach((statement, index) => {
    // Check if it's a SELECT statement
    if (statement.trim().toUpperCase().startsWith('SELECT')) {
      const selectIssues = analyzeSelectStatement(statement);
      if (selectIssues.length > 0) {
        issues.push(`In SELECT statement #${index + 1}:`);
        issues.push(...selectIssues.map(issue => `  - ${issue}`));
      }
    }
  });
  
  return issues;
}

// Enhance SQL with proper quoting and fixes
function enhanceSql(sql) {
  console.log('\nGenerating enhanced SQL with proper quoting and fixes...');
  
  // Replace unquoted table.column patterns with quoted ones
  let enhancedSql = sql.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match, table, column) => {
    // Skip if already quoted or is a number
    if (match.includes('"') || match.match(/^[0-9]+\./)) return match;
    
    // Skip common SQL functions and keywords
    const skipList = ['COUNT(', 'SUM(', 'AVG(', 'MIN(', 'MAX(', 'COALESCE(', 'NULLIF('];
    if (skipList.some(skip => match.includes(skip))) return match;
    
    return `${table}."${column}"`;
  });
  
  // Fix column aliases in window functions (more complex, would need a proper SQL parser)
  // This is a simplified approach that might not catch all cases
  enhancedSql = enhancedSql.replace(/\bROW_NUMBER\(\)\s+OVER\s*\(\s*ORDER\s+BY\s+["']?([a-zA-Z0-9_]+)["']?\s+/gi, (match, alias) => {
    // Check if this alias is defined in the same SELECT
    const selectClause = enhancedSql.match(/SELECT\s+(.*?)\s+FROM/is);
    if (selectClause) {
      const aliasDefinition = new RegExp(`\\bAS\\s+["']?${alias}["']?`, 'i');
      if (aliasDefinition.test(selectClause[1])) {
        // This is likely a logical error, try to find the actual expression
        const aliasExpr = selectClause[1].match(new RegExp(`([^,]+)\\s+AS\\s+["']?${alias}["']?`, 'i'));
        if (aliasExpr) {
          const expr = aliasExpr[1].trim();
          return `ROW_NUMBER() OVER (ORDER BY ${expr} `;
        }
      }
    }
    return match;
  });
  
  // Add transaction block if missing
  if (!enhancedSql.includes('BEGIN')) {
    enhancedSql = '-- Begin transaction for safety\nBEGIN;\n\n' + enhancedSql;
  }
  
  if (!enhancedSql.includes('COMMIT')) {
    enhancedSql = enhancedSql + '\n\nCOMMIT;';
  }
  
  return enhancedSql;
}

// Run sql-lint for more comprehensive validation
function runSqlLint(filePath) {
  return new Promise((resolve, reject) => {
    exec(`npx sql-lint --file=${filePath} --dialect=postgres`, (error, stdout, stderr) => {
      if (error && !stdout.includes('No errors found')) {
        resolve(stdout);
      } else {
        resolve('No errors found by sql-lint');
      }
    });
  });
}

// Main validation process
async function validateAndEnhance() {
  // Run basic validation
  const issues = validateSql(sqlContent);
  
  if (issues.length > 0) {
    console.log('\nPotential issues found:');
    issues.forEach(issue => console.log(`- ${issue}`));
  } else {
    console.log('\nNo basic issues found');
  }
  
  // Run sql-lint
  console.log('\nRunning sql-lint...');
  const lintResults = await runSqlLint(fullPath);
  console.log(lintResults);
  
  // Generate enhanced SQL
  const enhancedSql = enhanceSql(sqlContent);
  
  // Write enhanced SQL to a new file
  const enhancedFilePath = fullPath.replace('.sql', '.validated.sql');
  fs.writeFileSync(enhancedFilePath, enhancedSql);
  
  console.log(`\nEnhanced SQL written to: ${enhancedFilePath}`);
  console.log('Use this version for better PostgreSQL compatibility');
  
  // Add a warning about logical errors
  console.log('\nNOTE: While this validator catches many issues, some logical errors may still require manual review.');
  console.log('Always test your SQL queries in a development environment before running them in production.');
}

validateAndEnhance().catch(err => {
  console.error('Error during validation:', err);
  process.exit(1);
});
