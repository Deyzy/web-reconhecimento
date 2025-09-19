# Sistema de Reconhecimento Facial com Flask + DeepFace

Este projeto implementa um sistema de **cadastro e busca facial** utilizando **Flask**, **DeepFace** (modelo Facenet) e **cosine similarity**.  
Ele permite cadastrar rostos no sistema e depois identificar pessoas através da webcam, comparando a face detectada com as armazenadas.

---

##  📌 Funcionalidades

- 📷 **Cadastro de usuários** com foto
- 🧠 **Extração de embeddings faciais** usando DeepFace (Facenet + RetinaFace)
- 🔎 **Busca automática** por similaridade de rostos
- ✅ Retorna o nome da pessoa reconhecida + nível de similaridade
- 🖼️ Mostra também a foto cadastrada do usuário reconhecido

---

## Estrutura do Projeto

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

```
---

## 📂 Estrutura do Projeto

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-diretorio
```

2. Crie um ambiente virtual (opcional)
```bash
python3 -m venv venv
```
- Linux/Mac 
```bash
source venv/bin/activate  
```
 - Windows
 ```bash
venv\Scripts\activate 
```


---

## ▶️ Como Executar

Inicie o servidor Flask:
```bash
python app.py
```
Abra no navegador:
```bash
http://localhost:5000
```

## 💻 Tecnologias Utilizadas

- Python 3.11+
- Flask
- DeepFace
- OpenCV
- scikit-learn
- Pillow

## ⚠️ Observações

É necessário GPU ou um bom processador para melhor desempenho do DeepFace.
As imagens são salvas em static/fotos/ para cada usuário cadastrado.
O limiar de similaridade está definido como 0.7. Você pode ajustar no app.py:

LIMIAR = 0.7

## 📜 Licença

Este projeto é de uso educacional. Modifique e use livremente conforme suas necessidades.