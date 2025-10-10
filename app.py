from flask import Flask, render_template, request, jsonify
import os
import cv2
import base64
import numpy as np
from deepface import DeepFace
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

UPLOAD_FOLDER = 'fotos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ----------- FUNÇÃO BASE ------------
def extrair_rosto_e_embedding(imagem_bytes):
    """
    Recebe bytes de imagem e tenta extrair embedding facial.
    Retorna (embedding, erro)
    """
    try:
        nparr = np.frombuffer(imagem_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return None, "Falha ao decodificar imagem."

        result = DeepFace.represent(
            img_path=img,
            model_name="Facenet",
            detector_backend="retinaface",  # Mais robusto que 'opencv'
            enforce_detection=True
        )

        if isinstance(result, dict):
            result = [result]

        if len(result) == 0:
            return None, "Nenhum rosto detectado."

        if len(result) > 1:
            return None, f"{len(result)} rostos detectados. Só é permitido 1."

        return np.array(result[0]["embedding"]), None

    except ValueError as ve:
        print("Erro DeepFace:", ve)
        return None, "Nenhum rosto detectado."
    except Exception as e:
        print("Erro geral:", e)
        return None, "Falha ao processar imagem."


# ----------- ROTAS ------------
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/busca')
def busca():
    return render_template('busca.html')


@app.route('/salvar_foto', methods=['POST'])
def salvar_foto():
    data = request.json
    nome = data['nome'].strip()
    imagem_b64 = data['foto']

    if not nome:
        return jsonify({'status': 'error', 'msg': 'Nome não informado'}), 400

    try:
        header, encoded = imagem_b64.split(",", 1)
        imagem_bytes = base64.b64decode(encoded)
    except Exception:
        return jsonify({'status': 'error', 'msg': 'Base64 inválido'}), 400

    embedding, erro = extrair_rosto_e_embedding(imagem_bytes)
    print("Embedding:", embedding)

    if embedding is None:
        return jsonify({'status': 'error', 'msg': erro}), 400

    pasta_usuario = os.path.join(UPLOAD_FOLDER, nome)
    os.makedirs(pasta_usuario, exist_ok=True)

    try:
        with open(os.path.join(pasta_usuario, 'foto.jpg'), 'wb') as f:
            f.write(imagem_bytes)
        np.save(os.path.join(pasta_usuario, 'vetor.npy'), embedding)
    except Exception as e:
        return jsonify({'status': 'error', 'msg': str(e)}), 500

    return jsonify({'status': 'success', 'msg': 'Foto salva com sucesso!'})


@app.route('/buscar_rosto', methods=['POST'])
def buscar_rosto():
    data = request.json
    imagem_b64 = data['foto']

    try:
        header, encoded = imagem_b64.split(",", 1)
        imagem_bytes = base64.b64decode(encoded)
    except Exception:
        return jsonify({'status': 'error', 'msg': 'Imagem inválida'}), 400

    vetor_consulta, erro = extrair_rosto_e_embedding(imagem_bytes)
    print("Consulta:", vetor_consulta)

    if vetor_consulta is None:
        return jsonify({'status': 'error', 'msg': erro}), 400

    correspondencia = None
    maior_similaridade = -1

    for nome in os.listdir(UPLOAD_FOLDER):
        caminho = os.path.join(UPLOAD_FOLDER, nome, 'vetor.npy')
        if os.path.isfile(caminho):
            vetor_salvo = np.load(caminho)
            sim = cosine_similarity([vetor_consulta], [vetor_salvo])[0][0]
            print(f"Comparando com {nome}: {sim:.4f}")

            if sim > maior_similaridade:
                maior_similaridade = sim
                correspondencia = nome

    LIMIAR = 0.7

    if maior_similaridade >= LIMIAR:
        return jsonify({
            'status': 'success',
            'msg': f'Essa é a {correspondencia}!',
            'similaridade': float(maior_similaridade)
    })
    else:
        return jsonify({
            'status': 'error',
            'msg': 'Nenhuma correspondência encontrada.',
            'similaridade': float(maior_similaridade)
    })



if __name__ == '__main__':
    app.run(debug=True, port=5001)
