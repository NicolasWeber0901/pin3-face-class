# Exemplo do backend Python com Flask e CORS habilitado
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importando o CORS
import base64
import cv2
import numpy as np

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Permitindo apenas o frontend no localhost:3000

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.get_json()
    image_data = data.get('image')  # Imagem enviada como base64
    if image_data:
        try:
            # Decodifica a imagem Base64
            img_data = base64.b64decode(image_data.split(',')[1])  # Remove o prefixo 'data:image/jpeg;base64,'
            # Converte os dados para um array NumPy
            nparr = np.frombuffer(img_data, np.uint8)
            # Decodifica o array NumPy em uma imagem OpenCV
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # Exemplo de processamento: Converter para escala de cinza
            gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # Apenas retorna a dimensão da imagem processada
            height, width = gray_img.shape
            return jsonify({"message": "Presença registrada com sucesso!"}), 200
        except Exception as e:
            return jsonify({"message": f"Erro ao processar imagem: {str(e)}"}), 500
    return jsonify({"message": "Nenhuma imagem recebida!"}), 400

if __name__ == '__main__':
    app.run(debug=True)
