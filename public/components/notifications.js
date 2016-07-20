var path = require('path');
var options = [
  {
    title: "notificacion 1",
    body: "notificacion con texto"
  },
  {
    title: "Notificacion tipo 2",
    body: "notificacion con imagen",
    icon: path.join(__dirname, 'LogoApe.ico')
  }
]

function doNotify(evt) {
  if (evt.srcElement.id == "basico") {
    new Notification(options[0].title, options[0]);
  }
  else if (evt.srcElement.id == "imagen") {
    new Notification(options[1].title, options[1]);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("basico").addEventListener("click", doNotify);
  document.getElementById("imagen").addEventListener("click", doNotify);
})