$(document).ready(function($){

  $('body').css({'z-index': 0});

  $('body').prepend($('<div class="cora-overlay"></div>'));

  $('#eow-title').addClass('cora-can-extract');
  $('#eow-description').addClass('cora-can-extract');
});