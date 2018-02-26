exports.name = "logger";
exports.verions = "0.0.1";

const fs = require('fs');

exports.install = function() {
  F.on('ready', function() {
    this.logger.verbose = verbose();
  });
};

function verbose() {

	var datetime = new Date();
	var filename = datetime.getFullYear() + '-' + (datetime.getMonth() + 1).toString().padLeft(2, '0') + '-' + datetime.getDate().toString().padLeft(2, '0');
	var time = datetime.getHours().toString().padLeft(2, '0') + ':' + datetime.getMinutes().toString().padLeft(2, '0') + ':' + datetime.getSeconds().toString().padLeft(2, '0');
	var str = '';
	var length = arguments.length;

	for (var i = 0; i < length; i++) {
		var val = arguments[i];
		if (val === undefined)
			val = 'undefined';
		else if (val === null)
			val = 'null';
		else if (typeof(val) === 'object')
			val = Util.inspect(val);
		str += (str ? ' ' : '') + val;
	}

	F.path.verify('logs');
	U.queue('F.log', 5, (next) => fs.appendFile(U.combine(F.config['directory-logs'], filename + '.log'), time + ' | ' + str + '\n', next));
	return F;
};