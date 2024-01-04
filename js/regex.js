var id = 1;
var exitSite = true;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('textarea,input').forEach(function(t) {
      var id = t.getAttribute('id');
      document.querySelector('label[for="'+id+'"]').innerText = t.getAttribute('placeholder');
    });
    addTest(true);

    
    document.addEventListener('click', function (event) {
      exitSite = event.target.tagName === 'A' && new URL(event.target.href).hostname != window.location.hostname
    });
    window.addEventListener('beforeunload', function (event) {
      if(exitSite) {
        var confirmationMessage = 'Are you sure you want to leave?';
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    });
  }, false);

function testRegex() {
  var r = document.querySelector('#regex').value;
  var f = document.querySelector('#flags').value;
  var regex = new RegExp(r,f);
  var replacement = document.querySelector('#replacement').value;
  document.querySelectorAll('.test').forEach(function(t){
    if(t.classList.contains('hidden')) return;
    var text = t.querySelector('.text').value;
    var repl = t.querySelector('.repl');
    repl.innerHTML = text.replace(regex, replacement);
    repl.parentNode.classList.remove('hidden');
  });
  return false;
}

function addTest(first) {
  var newItem = document.querySelector('.item.test.template').cloneNode(true);
  newItem.classList.remove('template');
  newItem.classList.remove('hidden');
  newItem.querySelector('span:first-child>label').setAttribute('for', 'text-'+id);
  newItem.querySelector('span:first-child>textarea').setAttribute('id', 'text-'+id);
  newItem.querySelector('span.hidden>label').setAttribute('for', 'repl-'+id);
  newItem.querySelector('span.hidden>div').setAttribute('id', 'repl-'+id);
  var remove = newItem.querySelector('.remove');
  remove.setAttribute('id', 'remove-'+id);
  remove.setAttribute('onclick', 'removeTest(this)');
  if(!first) {
    remove.classList.remove('hidden');
  }
  document.querySelector('#test-form .item:last-child').parentNode.appendChild(newItem);
  id++;
  return false;
}

function removeTest(e) {
  var item = e.parentNode;
  item.parentNode.removeChild(item);
  return false;
}