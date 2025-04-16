/**
 * SQL Validation Script
 * 
 * This script validates SQL files for common issues and PostgreSQL compatibility.
 * Usage: node validate-sql.js path/to/sql/file.sql
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

console.log(`Validating SQL file: ${fullPath}`);

// Basic validation checks
function validateSql(sql) {
  const issues = [];
  
  // Check for unquoted identifiers that might cause case sensitivity issues
  const potentialIdentifiers = sql.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
  
  potentialIdentifiers.forEach(identifier => {
    if (!identifier.includes('"') && !identifier.match(/^[0-9]+\./)) {
      // Skip common SQL functions and keywords
      const skipList = ['COUNT(', 'SUM(', 'AVG(', 'MIN(', 'MAX(', 'COALESCE(', 'NULLIF('];
      if (!skipList.some(skip => identifier.includes(skip))) {
        issues.push(`Potential unquoted identifier: ${identifier} - consider using double quotes for PostgreSQL compatibility`);
      }
    }
  });
  
  // Check for transaction blocks
  if (!sql.includes('BEGIN') || !sql.includes('COMMIT')) {
    issues.push('Missing transaction block (BEGIN/COMMIT) - recommended for safety');
  }
  
  // Check for error handling
  if (!sql.includes('EXCEPTION') && !sql.includes('DO $$')) {
    issues.push('Consider adding error handling with DO $$ blocks and EXCEPTION handling');
  }
  
  return issues;
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

// Enhance SQL with proper quoting
function enhanceSql(sql) {
  console.log('\nGenerating enhanced SQL with proper quoting...');
  
  // Replace unquoted table.column patterns with quoted ones
  let enhancedSql = sql.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match, table, column) => {
    // Skip if already quoted or is a number
    if (match.includes('"') || match.match(/^[0-9]+\./)) return match;
    
    // Skip common SQL functions and keywords
    const skipList = ['COUNT(', 'SUM(', 'AVG(', 'MIN(', 'MAX(', 'COALESCE(', 'NULLIF('];
    if (skipList.some(skip => match.includes(skip))) return match;
    
    return `${table}."${column}"`;
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
  const enhancedFilePath = fullPath.replace('.sql', '.enhanced.sql');
  fs.writeFileSync(enhancedFilePath, enhancedSql);
  
  console.log(`\nEnhanced SQL written to: ${enhancedFilePath}`);
  console.log('Use this version for better PostgreSQL compatibility');
}

validateAndEnhance().catch(err => {
  console.error('Error during validation:', err);
  process.exit(1);
});
