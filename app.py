import os
import base64
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Diretório de uploads
UPLOAD_FOLDER = os.path.join("static", "fotos")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ---------------- Funções Auxiliares ---------------- #
def extrair_rosto_e_embedding(imagem_bytes):
    try:
        imagem = Image.open(io.BytesIO(imagem_bytes)).convert("RGB")
        img_path = "temp.jpg"
        imagem.save(img_path)

        embedding = DeepFace.represent(
            img_path=img_path,
            model_name="Facenet",
            detector_backend="retinaface",
            enforce_detection=True
        )[0]["embedding"]

        return np.array(embedding), None
    except Exception as e:
        return None, str(e)


# ---------------- Rotas ---------------- #
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/busca")
def busca():
    return render_template("busca.html")


@app.route("/salvar", methods=["POST"])
def salvar():
    data = request.json
    nome = data["nome"]
    imagem_b64 = data["foto"]

    header, encoded = imagem_b64.split(",", 1)
    imagem_bytes = base64.b64decode(encoded)

    vetor, erro = extrair_rosto_e_embedding(imagem_bytes)
    if vetor is None:
        return jsonify({"status": "error", "msg": erro}), 400

    pasta_usuario = os.path.join(UPLOAD_FOLDER, nome)
    os.makedirs(pasta_usuario, exist_ok=True)

    caminho_foto = os.path.join(pasta_usuario, "foto.jpg")
    with open(caminho_foto, "wb") as f:
        f.write(imagem_bytes)

    caminho_vetor = os.path.join(pasta_usuario, "vetor.npy")
    np.save(caminho_vetor, vetor)

    return jsonify({"status": "success", "msg": f"Foto de {nome} salva com sucesso!"})


@app.route("/buscar_rosto", methods=["POST"])
def buscar_rosto():
    data = request.json
    imagem_b64 = data["foto"]

    try:
        header, encoded = imagem_b64.split(",", 1)
        imagem_bytes = base64.b64decode(encoded)
    except Exception:
        return jsonify({"status": "error", "msg": "Imagem inválida"}), 400

    vetor_consulta, erro = extrair_rosto_e_embedding(imagem_bytes)
    if vetor_consulta is None:
        return jsonify({"status": "error", "msg": erro}), 400

    correspondencia = None
    maior_similaridade = -1
    foto_caminho = None

    for nome in os.listdir(UPLOAD_FOLDER):
        caminho_vetor = os.path.join(UPLOAD_FOLDER, nome, "vetor.npy")
        caminho_foto = os.path.join(UPLOAD_FOLDER, nome, "foto.jpg")

        if os.path.isfile(caminho_vetor):
            vetor_salvo = np.load(caminho_vetor)
            sim = cosine_similarity([vetor_consulta], [vetor_salvo])[0][0]

            if sim > maior_similaridade:
                maior_similaridade = sim
                correspondencia = nome
                if os.path.exists(caminho_foto):
                    foto_caminho = f"/static/fotos/{nome}/foto.jpg"

    LIMIAR = 0.7
    if maior_similaridade >= LIMIAR:
        return jsonify({
            "status": "success",
            "msg": f"Essa é a {correspondencia}!",
            "similaridade": float(maior_similaridade),
            "foto": foto_caminho
        })
    else:
        return jsonify({
            "status": "error",
            "msg": "Nenhuma correspondência encontrada.",
            "similaridade": float(maior_similaridade)
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
