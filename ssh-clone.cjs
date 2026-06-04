const Client = require('ssh2').Client;

const conn = new Client();

console.log('Connecting to 121.40.118.127...');

conn.on('ready', () => {
  console.log('✓ Connected!\n');
  
  console.log('=== Cloning project from GitHub ===');
  conn.exec('cd myapp && git clone https://github.com/msy417/MsyAI.git .', (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code, signal) => {
      console.log(`\n--- Clone completed (exit code: ${code}) ---`);
      
      // Check what was cloned
      conn.exec('cd myapp && ls -la', (err2, stream2) => {
        if (err2) throw err2;
        
        stream2.on('close', () => {
          conn.end();
        }).on('data', (data) => {
          console.log(data.toString());
        }).stderr.on('data', (data) => {
          console.error(data.toString());
        });
      });
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error(data.toString());
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
