const Client = require('ssh2').Client;

const conn = new Client();

console.log('Connecting to 121.40.118.127...\n');

conn.on('ready', () => {
  console.log('✓ Connected!\n');

  // Check if server is running
  const cmd = `ps aux | grep "serve -s dist" | grep -v grep || echo "Server not running"`;

  console.log('Checking server status...\n');
  conn.exec(cmd, (err, stream) => {
    if (err) {
      console.error('Error:', err);
      conn.end();
      return;
    }

    let output = '';
    stream.on('data', (data) => {
      output += data.toString();
    });

    stream.on('close', () => {
      console.log('Server Status:');
      console.log(output || 'Server not running');

      // Check port 80
      console.log('\nChecking port 80...\n');
      conn.exec('netstat -tlnp 2>/dev/null | grep :80 || ss -tlnp 2>/dev/null | grep :80 || echo "Port 80 not listening"', (err2, stream2) => {
        if (err2) {
          console.error('Error checking port:', err2);
          conn.end();
          return;
        }

        let output2 = '';
        stream2.on('data', (data) => {
          output2 += data.toString();
        });

        stream2.on('close', () => {
          console.log(output2 || 'Port 80 not listening');

          // Try to restart if not running
          if (!output.includes('serve') && !output2.includes(':80')) {
            console.log('\n⚠️  Server not running, attempting to restart...\n');
            conn.exec('cd /root/myapp && nohup serve -s dist -l 80 > /tmp/server.log 2>&1 & sleep 2 && ps aux | grep serve', (err3, stream3) => {
              if (err3) {
                console.error('Error restarting server:', err3);
              }
              stream3.on('data', (data) => {
                console.log(data.toString());
              });
              stream3.on('close', () => {
                console.log('\n✅ Server restart attempted');
                conn.end();
              });
            });
          } else {
            console.log('\n✅ Server is running!');
            conn.end();
          }
        });
      });
    });
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '121.40.118.127',
  port: 22,
  username: 'root',
  password: '@Msy618320'
});
