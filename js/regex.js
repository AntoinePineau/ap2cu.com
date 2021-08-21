document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('textarea,input').forEach(function(t) {
      var id = t.getAttribute('id');
      document.querySelector('label[for='+id+']').innerText = t.getAttribute('placeholder');
    });
  }, false);