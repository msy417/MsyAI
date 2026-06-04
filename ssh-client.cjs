const Client = require('ssh2').Client;

const conn = new Client();

console.log('Connecting to 121.40.118.127...');

conn.on('ready', () => {
  console.log('✓ Connected!');
  
  conn.exec('cd myapp && pwd && ls -la', (err, stream) => {
    if (err) throw err;
    
    stream.on('close', (code, signal) => {
      console.log(`\nCommand exited with code ${code}`);
      conn.end();
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error('STDERR:', data.toString());
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
