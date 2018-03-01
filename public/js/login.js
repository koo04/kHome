$(document).ready(() => {
  $('form').on('submit', (e) => {
    e.preventDefault();
    var form = $('form').serialize();

    $.post('/login', form, (data) => {
      if(data)
        window.location.href = "/";
    });
  });
});