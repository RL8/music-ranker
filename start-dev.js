/**
 * Development startup script
 * Starts both the MusicBrainz proxy server and the Vue application
 */

const { spawn } = require('child_process');
const path = require('path');

// Start the proxy server
const serverProcess = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'server'),
  shell: true,
  stdio: 'inherit'
});

// Start the Vue application
const clientProcess = spawn('npm', ['run', 'serve'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down development servers...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit(0);
});

console.log('Development servers started!');
console.log('- MusicBrainz Proxy Server: http://localhost:3001');
console.log('- Vue Application: http://localhost:8080');
