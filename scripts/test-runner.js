const { spawn } = require('child_process');
const path = require('path');

// Function to run tests
function runTests() {
  console.log('Running tests...');
  
  const testProcess = spawn('npm', ['test'], {
    stdio: 'inherit',
    shell: true
  });

  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Tests passed successfully!');
    } else {
      console.error(`Tests failed with code ${code}`);
    }
  });
}

// Run tests immediately
runTests();

// Watch for file changes
const chokidar = require('chokidar');
const watcher = chokidar.watch([
  'src/**/*.js',
  'src/**/*.jsx',
  'src/**/*.ts',
  'src/**/*.tsx',
  '__tests__/**/*.js',
  '__tests__/**/*.jsx',
  '__tests__/**/*.ts',
  '__tests__/**/*.tsx'
], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Run tests when files change
watcher.on('change', (path) => {
  console.log(`File ${path} has changed. Running tests...`);
  runTests();
}); 