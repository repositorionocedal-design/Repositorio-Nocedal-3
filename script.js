const scriptURL = "https://script.google.com/macros/s/AKfycbx7mMCf8oWXW2NjLAuSPgmJ_Hf8Mn9rKuEJTsIyuRsPvFNLIHViFKo8WdWGYe87NSes/exec";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = document.getElementById("fileInput").files;
  const progress = document.getElementById("progressBar");
  const status = document.getElementById("status");

  if (!files.length) {
    status.innerHTML = "⚠️ Selecciona al menos un archivo.";
    return;
  }

  progress.value = 0;
  status.innerHTML = "⏳ Subiendo archivos...";

  const fileDataArray = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await toBase64(file);
    fileDataArray.push({
      name: file.name,
      type: file.type,
      content: base64.split(",")[1] // quitamos el encabezado data:
    });
  }

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({ files: fileDataArray }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data.success) {
      progress.value = 100;
      status.innerHTML = "✅ Archivos subidos correctamente:<br>" +
        data.uploaded.map(f => `<a href="${f.url}" target="_blank">${f.name}</a>`).join("<br>");
    } else {
      status.innerHTML = "❌ Error: " + data.error;
    }

  } catch (error) {
    console.error(error);
    status.innerHTML = "⚠️ Error de red o conexión.";
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

