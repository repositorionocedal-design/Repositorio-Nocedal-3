// ⚠️ Cambia esta URL por la tuya de implementación (la que termina en /exec)
const scriptURL = "https://script.google.com/macros/s/AKfycbzRVEz12ghSte6pi-XY9o38VI5Pd7zrtpD-vc-Ar4u7q_rQGjintyl_47VphG6pjk8V/exec";

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
  status.innerHTML = "Subiendo archivos...";

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`file${i}`, files[i]);
  }

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      status.innerHTML =
        "✅ Archivos subidos correctamente:<br>" +
        data.uploaded.map(f => `<a href="${f.url}" target="_blank">${f.name}</a>`).join("<br>");
      progress.value = 100;
    } else {
      status.innerHTML = `❌ Error: ${data.error}`;
    }
  } catch (err) {
    console.error(err);
    status.innerHTML = "⚠️ Error de red o conexión con el servidor";
  }
});
