# Sistema de Reconhecimento Facial com Flask + DeepFace

Este projeto implementa um sistema de **cadastro e busca facial** utilizando **Flask**, **DeepFace** (modelo Facenet) e **cosine similarity**.  
Ele permite cadastrar rostos no sistema e depois identificar pessoas através da webcam, comparando a face detectada com as armazenadas.

---

## 📌 Funcionalidades

- 📷 **Cadastro de usuários** com foto
- 🧠 **Extração de embeddings faciais** usando DeepFace (Facenet + RetinaFace)
- 🔎 **Busca automática** por similaridade de rostos
- ✅ Retorna o nome da pessoa reconhecida + nível de similaridade
- 🖼️ Mostra também a foto cadastrada do usuário reconhecido

---

## 📂 Estrutura do Projeto

```bash
project04/
│── app.py                # Backend Flask
│── venv/                 # Ambiente virtual (opcional)
│
├── static/
│   ├── fotos/            # Fotos salvas por usuário (cada pasta = 1 pessoa)
│   ├── busca.js          # Script da tela de busca
│   └── script.js         # Script da tela de cadastro
│
├── templates/
│   ├── index.html        # Página inicial / Cadastro
│   └── busca.html        # Página de busca facial
