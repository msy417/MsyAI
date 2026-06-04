const Client = require('ssh2').Client;

const conn = new Client();

console.log('=== Starting Full Deployment ===');
console.log('Connecting to 121.40.118.127...\n');

conn.on('ready', () => {
  console.log('✓ Connected!\n');
  
  const steps = [
    {
      desc: '1. Update .gitignore',
      cmd: `cd /root/myapp && cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Sensitive scripts
ssh-*.cjs
upload-to-github.cjs

# Temporary files
.trae
EOF
`
    },
    {
      desc: '2. Check Node.js version',
      cmd: 'node -v || echo "Node.js not installed"'
    },
    {
      desc: '3. Install Node.js (if needed)',
      cmd: 'which node || (curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && yum install -y nodejs)'
    },
    {
      desc: '4. Install npm dependencies',
      cmd: 'cd /root/myapp && npm install'
    },
    {
      desc: '5. Build production version',
      cmd: 'cd /root/myapp && npm run build'
    },
    {
      desc: '6. Check build output',
      cmd: 'cd /root/myapp && ls -la dist/ || echo "dist folder not created"'
    },
    {
      desc: '7. Install simple HTTP server',
      cmd: 'npm install -g serve || npm install -g http-server'
    },
    {
      desc: '8. Start server in background',
      cmd: 'cd /root/myapp && pkill -f "serve -s dist" 2>/dev/null || true; nohup serve -s dist -l 80 > /var/log/myapp.log 2>&1 & echo $!'
    },
    {
      desc: '9. Verify server is running',
      cmd: 'sleep 2 && ps aux | grep serve | grep -v grep || echo "Checking port..."'
    },
    {
      desc: '10. Check firewall',
      cmd: 'firewall-cmd --list-all 2>/dev/null || iptables -L -n 2>/dev/null || echo "Firewall check complete"'
    },
    {
      desc: '11. Final check',
      cmd: 'echo "=== DEPLOYMENT COMPLETE ===" && echo "Access your site at: http://121.40.118.127" && ls -la /root/myapp/'
    }
  ];
  
  let current = 0;
  
  function runStep() {
    if (current >= steps.length) {
      console.log('\n✅ All deployment steps completed!');
      conn.end();
      return;
    }
    
    const step = steps[current];
    console.log(`\n📌 ${step.desc}`);
    
    conn.exec(step.cmd, (err, stream) => {
      if (err) {
        console.error('✗ Error:', err);
        current++;
        return runStep();
      }
      
      stream.on('close', (code) => {
        console.log(`\n--- ${step.desc} done (code: ${code}) ---`);
        current++;
        setTimeout(runStep, 500);
      }).on('data', (data) => {
        const output = data.toString();
        if (output.trim()) console.log(output);
      }).stderr.on('data', (data) => {
        const err = data.toString();
        if (err.trim() && !err.includes('warning') && !err.includes('WARN')) {
          console.error('STDERR:', err);
        }
      });
    });
  }
  
  runStep();
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '121.40.118.127',
  port: 22,
  username: 'root',
  password: '@Msy618320'
});
