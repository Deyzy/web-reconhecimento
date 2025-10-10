const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d');

const canvasFoto = document.getElementById('canvas');
const preview = document.getElementById('preview');
const capturarBtn = document.getElementById('capturar');
const enviarBtn = document.getElementById('enviar');
const resultadoDiv = document.getElementById('resultado');
const nomeInput = document.getElementById('nome');

const faceDetection = new FaceDetection({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
});

faceDetection.setOptions({
  model: 'short',
  minDetectionConfidence: 0.5
});

faceDetection.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceDetection.send({ image: videoElement });
  },
  width: 640,
  height: 480
});

camera.start();

function onResults(results) {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.detections.length > 0) {
    for (const detection of results.detections) {
      const bbox = detection.boundingBox;

      const x = bbox.xCenter * canvasElement.width - bbox.width * canvasElement.width / 2;
      const y = bbox.yCenter * canvasElement.height - bbox.height * canvasElement.height / 2;
      const width = bbox.width * canvasElement.width;
      const height = bbox.height * canvasElement.height;

      canvasCtx.strokeStyle = 'green';
      canvasCtx.lineWidth = 4;
      canvasCtx.strokeRect(x, y, width, height);
    }
  }
}

// 📸 Captura a foto
capturarBtn.addEventListener('click', () => {
  canvasFoto.width = videoElement.videoWidth;
  canvasFoto.height = videoElement.videoHeight;
  canvasFoto.getContext('2d').drawImage(videoElement, 0, 0);

  const dataURL = canvasFoto.toDataURL('image/jpeg');
  preview.src = dataURL;
  preview.style.display = "block";
});

// 📤 Envia para o backend
enviarBtn.addEventListener('click', async () => {
  const nome = nomeInput.value.trim();
  if (!nome) {
    alert("Digite um nome antes de enviar!");
    return;
  }

  const fotoBase64 = canvasFoto.toDataURL('image/jpeg');

  try {
    const response = await fetch('/salvar_foto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nome, foto: fotoBase64 })
    });

    const result = await response.json();
    resultadoDiv.classList.remove('d-none');
    resultadoDiv.classList.add(result.status === 'success' ? 'alert-success' : 'alert-danger');
    resultadoDiv.innerText = result.msg;

  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    resultadoDiv.classList.remove('d-none');
    resultadoDiv.classList.add('alert-danger');
    resultadoDiv.innerText = "Erro ao enviar foto.";
  }
});
