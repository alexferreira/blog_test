$(document).ready(function () {

  // confirmation of remove record
  $('.confirm').submit(function (e) {
    e.preventDefault();
    var self = this;
    var msg = 'Tem certeza que deseja remover o registro?';
    bootbox.confirm(msg, 'cancelar', 'Sim! Tenho certeza', function (action) {
      if (action) {
        $(self).unbind('submit');
        $(self).trigger('submit');
      }
    });
  });

  $('#tags').tagsInput({
    defaultText:'Adicionar tag',
  });

  $('[data-toggle=tooltip]').tooltip();

  $('#editor').wysihtml5({
    "font-styles": false,
    "html": true,
    "stylesheets": ["/css/bootstrap-wysihtml5.css"]
  });

  $(".alert").alert();

});