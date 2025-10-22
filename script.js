// ⚠️ Cambia esta URL por tu propia URL del despliegue de Apps Script (la que termina en /exec)
const scriptURL = "https://script.google.com/macros/s/AKfycbyKYc_laQjQHTB93mFdPrnNGizKi-kFp9F_dgZQx-fxEaP4k0hXilfrSLskYxeB_79a/exec";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");
  const progress = document.getElementById("progressBar");

  if (!fileInput.files.length) {
    status.innerHTML = "⚠️ Selecciona un archivo antes de subir.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    progress.value = 25;
    status.innerHTML = "⏳ Subiendo...";

    const base64Data = event.target.result.split(",")[1];
    const contentType = file.type;

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: base64Data,
        headers: {
          "Content-Type": contentType,
        },
      });

      const data = await response.json();

      if (data.success) {
        progress.value = 100;
        status.innerHTML = `✅ Archivo subido correctamente:<br>
          <a href="${data.uploaded[0].url}" target="_blank">${data.uploaded[0].name}</a>`;
      } else {
        status.innerHTML = `❌ Error: ${data.error}`;
      }
    } catch (err) {
      status.innerHTML = "⚠️ Error de red o de conexión.";
      console.error(err);
    }
  };

  reader.readAsDataURL(file);
});
