const form = document.getElementById('uploadForm');
const progressBarFill = document.getElementById('progressBarFill');
const statusDiv = document.getElementById('status');

// ⚠️ Reemplaza esto con tu URL de Web App de Google Apps Script
const endpoint = 'https://script.google.com/macros/s/AKfycbytx4ILKKH3_OYxsNoo7rdAI0ZC02u-4LyuYV4VPDKjqR4Q_BIzc6DhL2J8CCqxjMMg/exec';

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const files = document.getElementById('files').files;
  if (files.length === 0) {
    statusDiv.textContent = 'Por favor selecciona al menos un archivo.';
    return;
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file, file.name);
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", endpoint, true);

  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      progressBarFill.style.width = percent + '%';
    }
  };

  xhr.onload = function () {
    if (xhr.status === 200) {
      const res = JSON.parse(xhr.responseText);
      if (res.status === 'success') {
        statusDiv.textContent = 'Subido correctamente: ' + res.files.join(', ');
      } else {
        statusDiv.textContent = 'Error del servidor: ' + res.message;
      }
    } else {
      statusDiv.textContent = 'Error en la conexión con el servidor.';
    }
    progressBarFill.style.width = '0%'; // Reiniciar la barra
  };

  xhr.onerror = function () {
    statusDiv.textContent = 'Error de red.';
  };

  xhr.send(formData);
});

