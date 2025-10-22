const scriptURL = "https://script.google.com/macros/s/AKfycbxZJozVIaXD8XnVabFCUEa-juy_LW93alhogaor1M96EW-IpI5B3ein6R4DMFnwUO64/exec";

const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const progressBar = document.getElementById("progressBar");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  progressBar.value = 0;

  const files = fileInput.files;
  if (!files.length) {
    status.textContent = "⚠️ Selecciona al menos un archivo.";
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`file${i}`, files[i]);
  }

  try {
    status.textContent = "Subiendo archivos...";

    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      progressBar.value = 100;
      status.innerHTML =
        "✅ Archivos subidos correctamente:<br>" +
        result.uploaded.map(f => `<a href="${f.url}" target="_blank">${f.name}</a>`).join("<br>");
    } else {
      status.textContent = "❌ Error: " + result.error;
    }
  } catch (error) {
    console.error(error);
    status.textContent = "⚠️ Error de conexión o de red.";
  }
});
