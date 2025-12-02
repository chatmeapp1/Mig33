const { spawn } = require('child_process');
const path = require('path');

console.log('Starting mig33 Application...\n');

const backendProcess = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backendProcess.on('error', (err) => {
  console.error('Backend failed to start:', err);
});

setTimeout(() => {
  console.log('\nStarting Expo...\n');
  
  const expoProcess = spawn('npx', ['expo', 'start', '--tunnel'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, EXPO_NO_DOCTOR: '1' }
  });

  expoProcess.on('error', (err) => {
    console.error('Expo failed to start:', err);
  });
}, 3000);

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});
