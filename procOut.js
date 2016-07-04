var exec = require('child_process').exec;
exec('tasklist', function(err, stdout, stderr) {
	console.log(stdout)
});