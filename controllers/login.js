exports.dependencies = ['settings'];

exports.install = () => {
  F.route('/login', login, ['post']);
};

function login() {
  var self = this;
  if(self.body.username === F.settings.login.username && self.body.password === F.settings.login.password) {
    self.res.cookie('login', true, new Date().add('day', 1));
    self.redirect('/');
  } else {
    self.plain(false);
  }
}