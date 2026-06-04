const Client = require('ssh2').Client;

const conn = new Client();

console.log('Connecting to server...');

conn.on('ready', () => {
  console.log('✓ Connected!\n');
  
  const commands = [
    { cmd: 'cd /root/myapp && git pull', desc: 'Pull latest code' },
    { cmd: 'cd /root/myapp && ls -la', desc: 'Check files' }
  ];
  
  let current = 0;
  
  function runNext() {
    if (current >= commands.length) {
      conn.end();
      return;
    }
    
    const { cmd, desc } = commands[current];
    console.log(`=== ${desc} ===`);
    
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      
      stream.on('close', (code) => {
        console.log(`\n--- ${desc} completed (code: ${code}) ---\n`);
        current++;
        runNext();
      }).on('data', (data) => {
        console.log(data.toString());
      }).stderr.on('data', (data) => {
        console.error(data.toString());
      });
    });
  }
  
  runNext();
}).connect({
  host: '121.40.118.127',
  port: 22,
  username: 'root',
  password: '@Msy618320'
});
