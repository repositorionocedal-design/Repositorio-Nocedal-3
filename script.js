const scriptURL = "https://script.google.com/macros/s/AKfycbyf5VFbktAAiu8AhVbBF64bdEu4X8IblG11boLXDkoQL08jNtAMhUKU9OM-PPg0N5-H/exec"; 
// Ejemplo: https://script.google.com/macros/s/AKfycbx1234567/exec

const form = document.getElementById("uploadForm");
const input = document.getElementById("fileInput");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const files = input.files;
  if (!files.length) return alert("Selecciona al menos un archivo.");

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append(`file${i}`, files[i]);
  }

  progressBar.value = 0;
  statusText.textContent = "Subiendo...";

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      statusText.textContent = "✅ Archivos subidos correctamente: " + result.uploaded.join(", ");
    } else {
      statusText.textContent = "❌ Error: " + result.error;
    }
  } catch (error) {
    statusText.textContent = "⚠️ Error de red o de servidor: " + error.message;
  }
});
