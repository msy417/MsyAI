const Client = require('ssh2').Client;

const conn = new Client();

console.log('Connecting to 121.40.118.127...');

conn.on('ready', () => {
  console.log('✓ Connected!\n');
  
  const commands = [
    { desc: 'Checking OS type', cmd: 'cat /etc/os-release 2>/dev/null || cat /etc/issue 2>/dev/null || uname -a' },
    { desc: 'Checking package manager', cmd: 'which apt-get 2>/dev/null || which yum 2>/dev/null || which dnf 2>/dev/null || which apk 2>/dev/null' }
  ];
  
  let currentCmdIndex = 0;
  
  function executeNext() {
    if (currentCmdIndex >= commands.length) {
      console.log('\n✓ All checks complete!');
      conn.end();
      return;
    }
    
    const { desc, cmd } = commands[currentCmdIndex];
    console.log(`\n=== ${desc} ===`);
    
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error(`Error:`, err);
        currentCmdIndex++;
        executeNext();
        return;
      }
      
      stream.on('close', (code, signal) => {
        currentCmdIndex++;
        executeNext();
      }).on('data', (data) => {
        console.log(data.toString());
      }).stderr.on('data', (data) => {
        console.error('STDERR:', data.toString());
      });
    });
  }
  
  executeNext();
  
}).on('error', (err) => {
  console.error('Connection error:', err);
}).connect({
  host: '121.40.118.127',
  port: 22,
  username: 'root',
  password: '@Msy618320'
});
