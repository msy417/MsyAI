const { spawn } = require('child_process');
const fs = require('fs');

// Create a simple expect-like script
const script = `
set timeout 30
spawn ssh -o StrictHostKeyChecking=no root@121.40.118.127 "cd myapp && pwd && ls -la"
expect "password:"
send "@Msy618320\\r"
expect eof
`;

// Try with sshpass or other methods
console.log('Connecting to server...');

// Alternative approach: use child_process and send password (not recommended but for this task)
const ssh = spawn('ssh', ['-o', 'StrictHostKeyChecking=no', '-o', 'UserKnownHostsFile=/dev/null', 'root@121.40.118.127', 'cd myapp && pwd && ls -la']);

let sentPassword = false;

ssh.stdout.on('data', (data) => {
  console.log(data.toString());
});

ssh.stderr.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  if (output.includes('password:') && !sentPassword) {
    sentPassword = true;
    ssh.stdin.write('@Msy618320\n');
  }
});

ssh.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// Set timeout
setTimeout(() => {
  ssh.kill();
  console.log('Connection timeout');
}, 30000);
