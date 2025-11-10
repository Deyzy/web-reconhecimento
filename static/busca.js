const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('overlay');
const canvasCtx = canvasElement.getContext('2d');

const capturarBtn = document.getElementById('capturar');
const enviarBtn = document.getElementById('enviar');
const resultadoDiv = document.getElementById('resultado');

let fotoBase64 = null; 

// Configuração do MediaPipe Face Detection
const faceDetection = new FaceDetection({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
});

faceDetection.setOptions({
  model: 'short',
  minDetectionConfidence: 0.5
});

faceDetection.onResults(onResults);

//iniciar a camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceDetection.send({ image: videoElement });
      },
      width: 640,
      height: 480
    });

    camera.start();

  } catch (err) {
    console.error("Erro ao acessar câmera:", err);
    alert("⚠️ Permissão da câmera negada ou dispositivo sem câmera.");
  }
}

startCamera();

function onResults(results) {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.detections && results.detections.length > 0) {
    for (const detection of results.detections) {
      const bbox = detection.boundingBox;

      const x = bbox.xCenter * canvasElement.width - bbox.width * canvasElement.width / 2;
      const y = bbox.yCenter * canvasElement.height - bbox.height * canvasElement.height / 2;
      const width = bbox.width * canvasElement.width;
      const height = bbox.height * canvasElement.height;

      canvasCtx.strokeStyle = "green";
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeRect(x, y, width, height);
    }
  }
}

// captura a imagem do vídeo
capturarBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth || 640;
  canvas.height = videoElement.videoHeight || 480;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(videoElement, 0, 0);

  fotoBase64 = canvas.toDataURL("image/jpeg"); 

  //previa da foto
  const preview = document.getElementById('preview');
  preview.src = fotoBase64;
  preview.style.display = "block";
});

// Envia a foto e busca de rosto no backend
enviarBtn.addEventListener('click', async () => {
  if (!fotoBase64) {
    resultadoDiv.className = "alert alert-warning d-block";
    resultadoDiv.innerText = "⚠️ Tire uma foto primeiro!";
    return;
  }

  resultadoDiv.className = "alert d-none";
  resultadoDiv.innerText = "";

  try {
    const response = await fetch("/buscar_rosto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foto: fotoBase64 })
    });

    const result = await response.json();

    resultadoDiv.classList.remove("d-none");
    resultadoDiv.classList.add(result.status === "success" ? "alert-success" : "alert-danger");
    resultadoDiv.innerText = result.msg + (result.similaridade ? ` (similaridade: ${result.similaridade.toFixed(3)})` : "");

  } catch (error) {
    console.error("Erro ao enviar foto:", error);
    resultadoDiv.classList.remove("d-none");
    resultadoDiv.classList.add("alert-danger");
    resultadoDiv.innerText = "Erro ao enviar foto.";
  }
});