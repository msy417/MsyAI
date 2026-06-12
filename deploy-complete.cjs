const Client = require('ssh2').Client;

const conn = new Client();

console.log('Connecting to 121.40.118.127...\n');

const steps = [
  { 
    desc: '1. Pull latest code from GitHub', 
    cmd: 'cd /root/myapp && git pull origin main || git clone https://github.com/msy417/MsyAI.git /root/myapp' 
  },
  { 
    desc: '2. Update package list', 
    cmd: 'apt-get update -y' 
  },
  { 
    desc: '3. Install Node.js and npm via NodeSource', 
    cmd: 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs' 
  },
  { 
    desc: '4. Verify Node.js installation', 
    cmd: 'node -v && npm -v' 
  },
  { 
    desc: '5. Install project dependencies', 
    cmd: 'cd /root/myapp && npm install' 
  },
  { 
    desc: '6. Build production version', 
    cmd: 'cd /root/myapp && npm run build' 
  },
  { 
    desc: '7. Install serve globally', 
    cmd: 'npm install -g serve' 
  },
  { 
    desc: '8. Stop existing serve processes', 
    cmd: 'pkill -f "serve -s dist" || true' 
  },
  { 
    desc: '9. Start web server on port 80', 
    cmd: 'cd /root/myapp && nohup serve -s dist -l 80 > server.log 2>&1 & echo $!' 
  },
  { 
    desc: '10. Verify server is running', 
    cmd: 'sleep 3 && ps aux | grep serve && netstat -tlnp 2>/dev/null || ss -tlnp' 
  }
];

let currentStepIndex = 0;

conn.on('ready', () => {
  console.log('✓ Connected! Starting deployment...\n');
  
  function executeNext() {
    if (currentStepIndex >= steps.length) {
      console.log('\n🎉 Deployment complete!');
      console.log('\nYour website should now be accessible at: http://121.40.118.127');
      conn.end();
      return;
    }
    
    const { desc, cmd } = steps[currentStepIndex];
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(desc);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error(`❌ Error:`, err);
        currentStepIndex++;
        executeNext();
        return;
      }
      
      stream.on('close', (code, signal) => {
        console.log(`\n✓ Step completed (exit code: ${code})`);
        currentStepIndex++;
        executeNext();
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  }
  
  executeNext();
  
}).on('error', (err) => {
  console.error('❌ Connection error:', err);
}).connect({
  host: '121.40.118.127',
  port: 22,
  username: 'root',
  password: '@Msy618320'
});
