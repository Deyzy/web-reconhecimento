const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const capturarBtn = document.getElementById('capturar');
const enviarBtn = document.getElementById('enviar');
const resultadoDiv = document.getElementById('resultado');
const nomeInput = document.getElementById('nome');

// 🎥 Ativar webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Erro ao acessar câmera:", err);
    alert("Não foi possível acessar a câmera: " + err.message);
  });

// 📸 Captura a imagem da webcam
capturarBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  
  const dataURL = canvas.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.style.display = "block";
});

// 📤 Envia imagem para o backend Flask
enviarBtn.addEventListener('click', async () => {
  const nome = nomeInput.value.trim();
  if (!nome) {
    alert("Digite um nome antes de enviar!");
    return;
  }

  const fotoBase64 = canvas.toDataURL('image/jpeg');

  try {
    const response = await fetch('/salvar_foto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nome, foto: fotoBase64 })
    });

    const result = await response.json();
    resultadoDiv.classList.remove('d-none', 'alert-success', 'alert-danger');
    resultadoDiv.classList.add(result.status === 'success' ? 'alert-success' : 'alert-danger');
    resultadoDiv.innerText = result.msg;
  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    resultadoDiv.classList.remove('d-none');
    resultadoDiv.classList.add('alert-danger');
    resultadoDiv.innerText = "Erro ao enviar foto.";
  }
});
