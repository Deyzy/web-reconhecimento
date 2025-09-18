const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const preview = document.getElementById('preview');
const capturarBtn = document.getElementById('capturar');
const buscarRostoBtn = document.getElementById('buscar_rosto');
const resultadoDiv = document.getElementById('resultado');
const fotoEncontrada = document.getElementById('fotoEncontrada');

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

buscarRostoBtn.addEventListener('click', () => {
  if (!preview.src) {
    alert("Tire uma foto primeiro!");
    return;
  }

  fetch('/buscar_rosto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foto: canvas.toDataURL('image/jpeg') })
  })
  .then(res => res.json())
  .then(data => {
    resultadoDiv.classList.remove('d-none');
    if (data.status === 'success') {
      resultadoDiv.className = 'alert alert-success mt-3';
      resultadoDiv.textContent = `${data.msg} (similaridade: ${data.similaridade.toFixed(2)})`;
      if (data.foto) {
        fotoEncontrada.src = data.foto;
        fotoEncontrada.style.display = 'block';
      }
    } else {
      resultadoDiv.className = 'alert alert-danger mt-3';
      resultadoDiv.textContent = `${data.msg} (similaridade: ${data.similaridade.toFixed(2)})`;
      fotoEncontrada.style.display = 'none';
    }
  });
});
