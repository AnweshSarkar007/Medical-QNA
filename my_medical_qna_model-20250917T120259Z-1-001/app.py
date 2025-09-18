# app.py

from flask import Flask, request, jsonify, render_template
from transformers import pipeline
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)

# 1. Initialize the Flask App
app = Flask(__name__)

# 2. Load your fine-tuned model
model_path = "./my_medical_qna_model"
logging.info(f"Loading model from: {model_path}")
try:
    qa_pipeline = pipeline("question-answering", model=model_path, tokenizer=model_path, device=-1)
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    qa_pipeline = None

# 3. Create a route to serve the HTML webpage
@app.route('/')
def home():
    """Renders the HTML user interface."""
    return render_template('index.html')

# 4. Create the API endpoint for predictions (this remains the same)
@app.route('/predict', methods=['POST'])
def predict():
    """Receives a request and returns the model's answer."""
    if qa_pipeline is None:
        return jsonify({"error": "Model is not available."}), 500
    
    json_data = request.get_json()
    question = json_data.get('question')
    context = json_data.get('context')

    if not question or not context:
        return jsonify({"error": "Missing 'question' or 'context'"}), 400
    
    result = qa_pipeline(question=question, context=context)
    return jsonify(result)

# 5. Run the App
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)