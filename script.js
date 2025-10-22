const scriptURL = "https://script.google.com/macros/s/AKfycbxKWdp8mizWYT6h8u2kGv75Q7U2uCAQbGsyep5qz137kdDAnP-_MZ7-WBLDr-Uf_R5a/exec";

const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 👈 evita el reinicio

  const files = fileInput.files;
  if (files.length === 0) {
    statusText.innerHTML = "⚠️ Selecciona al menos un archivo.";
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`file${i}`, files[i]);
  }

  statusText.innerHTML = "⏳ Subiendo archivos...";
  progressBar.value = 0;

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      progressBar.value = 100;
      statusText.innerHTML = "✅ Archivos subidos:<br>" +
        data.uploaded.map(f => `<a href="${f.url}" target="_blank">${f.name}</a>`).join("<br>");
    } else {
      statusText.innerHTML = `❌ Error: ${data.error}`;
    }
  } catch (err) {
    console.error(err);
    statusText.innerHTML = "🚫 Error de red o conexión.";
  }
});
