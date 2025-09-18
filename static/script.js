const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const capturarBtn = document.getElementById('capturar');
const enviarBtn = document.getElementById('enviar');
const resultadoDiv = document.getElementById('resultado');
const nomeInput = document.getElementById('nome');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream; })
  .catch(err => { alert("Erro ao acessar webcam: " + err); });

capturarBtn.addEventListener('click', () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  preview.src = canvas.toDataURL('image/jpeg');
  preview.style.display = 'block';
});

enviarBtn.addEventListener('click', () => {
  const nome = nomeInput.value.trim();
  if (!nome) {
    alert("Digite um nome!");
    return;
  }
  fetch('/salvar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: nome, foto: canvas.toDataURL('image/jpeg') })
  })
  .then(res => res.json())
  .then(data => {
    resultadoDiv.classList.remove('d-none');
    resultadoDiv.textContent = data.msg;
    resultadoDiv.className = data.status === "success" ? "alert alert-success mt-3" : "alert alert-danger mt-3";
  });
});
