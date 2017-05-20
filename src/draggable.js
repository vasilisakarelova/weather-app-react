import $ from 'jquery';

$(document).ready(function() {

  $('.draggable').each(function() {
    var $this = $(this);
    $this.addClass('left right');
    if ($this.width() < $this.find('.draggable-inner').outerWidth()) {
      $this.removeClass('right');
    } else {
      $this.addClass('nodrag');
    }
  })

  $('.draggable').on('mousedown', '.draggable-wrap', function(e) {
    var $this = $(this);
    var x = e.pageX-parseInt($this.css('left'));
    $this.addClass('dragging').parents().on('mousemove', function(e) {
      var $drag = $('.dragging');
      var left = e.pageX-x;
      $drag.closest('.draggable').removeClass('left right');
      if (left > 0) {
        left = 0;
        $drag.closest('.draggable').addClass('left');

      }
      if (left < -$drag.find('.draggable-inner').outerWidth()+$drag.width()) {
        left = -$drag.find('.draggable-inner').outerWidth()+$drag.width();
        $drag.closest('.draggable').addClass('right');
      }
      $drag.css({left: left});
      $drag.on('mouseup', function() {
        $(this).removeClass('draggable');
      });
    });
      e.preventDefault();
  })
  $(document).on('mouseup', function() {
      $('.dragging').removeClass('dragging');
  });
});
