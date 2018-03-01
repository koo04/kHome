exports.install = function() {
	F.route('/', view_index);
};

function view_index() {
	var self = this;
	if(self.req.cookie('login'))
		self.view('index');
	else
		self.view('login');
}