const scriptURL = "https://script.google.com/macros/s/AKfycbyzDUjeO0JFKH6C0vKFimyRdwt6v6pVJYarNuxCxlepzn-n9sXv3WYbvlVpQJIpYQf2/exec"; // <-- pega aquí la URL del paso anterior

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const files = document.getElementById("file").files;
  const progress = document.getElementById("progress");
  const result = document.getElementById("result");

  if (!files.length) {
    result.innerHTML = "Selecciona al menos un archivo.";
    return;
  }

  progress.value = 0;
  result.innerHTML = "Subiendo archivos...";

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
      result.innerHTML = "✅ Archivos subidos correctamente:<br>" +
        data.uploaded.map(f => `<a href="${f.url}" target="_blank">${f.name}</a>`).join("<br>");
      progress.value = 100;
    } else {
      result.innerHTML = `❌ Error: ${data.error}`;
    }
  } catch (err) {
    console.error(err);
    result.innerHTML = "⚠️ Error de red o de conexión";
  }
});

