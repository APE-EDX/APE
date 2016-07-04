const exec = require('child_process').exec;
exec('tasklist /fo csv /nh', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

	 


