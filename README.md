# 🔍 Reconhecimento Facial com Flask

Este projeto permite:
- **Cadastrar** rostos com nome e foto via webcam.
- **Buscar** rostos em tempo real comparando com os já cadastrados.
- Utiliza **DeepFace** (com modelo FaceNet) e **MediaPipe** para detecção e comparação facial.

---

## 📦 Funcionalidades

- 📸 **Captura de foto via webcam** no navegador.
- 👤 **Cadastro de usuário** com nome e imagem.
- 🔍 **Busca de rosto** comparando com os perfis salvos.
- 📊 **Similaridade numérica** (baseada em *cosine similarity*).
- 🖼️ **Armazenamento local** de fotos e *embeddings* faciais.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML, JavaScript, Bootstrap 5  
- **Bibliotecas JavaScript**:
  - [`@mediapipe/face_detection`](https://google.github.io/mediapipe/) — detecção de rostos em tempo real
- **Backend**: Python + Flask  
- **Bibliotecas Python**:
  - [`deepface`](https://github.com/serengil/deepface) — extração de *embeddings* faciais (modelo: FaceNet)
  - `opencv-python` — processamento de imagens
  - `scikit-learn` — cálculo de similaridade (`cosine_similarity`)
  - `numpy` — manipulação de arrays numéricos

---

## 📁 Estrutura do Projeto
```bash
project04/
│── app.py                # Backend Flask
│── venv/                 # Ambiente virtual (opcional)
├── fotos/               # Fotos salvas por usuário (cada pasta = 1 pessoa
│
├── static/
│   ├── busca.js          # Script da tela de busca
│   └── script.js         # Script da tela de cadastro
│
├── templates/
│   ├── index.html        # Página inicial / Cadastro
│   └── busca.html        # Página de busca facial
│
├── README.md
│
├── notes.txt
│
├── requeriments.txt

```
---

## ▶️ Como Executar

### 1. **Pré-requisitos**
- Python 3.8 ou superior
- `pip` instalado
- Câmera web funcional
- Navegador moderno (Chrome, Edge, Firefox)

### 2. **Criar e ativar um ambiente virtual**

> ⚠️ **Importante**: Sempre use um ambiente virtual para isolar as dependências do projeto e evitar conflitos.

### Criar ambiente virtual (Linux e MacOS)
```bash
python3 -m venv venv
```
### Ativar
```bash
source venv/bin/activate
```