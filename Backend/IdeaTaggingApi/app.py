from flask import Flask, request, jsonify
from transformers import pipeline
import time
import logging
from flask_cors import CORS

logging.basicConfig(
    level=logging.INFO,  
    format='%(asctime)s - %(levelname)s - %(message)s',
)

app = Flask(__name__)
CORS(app)

s = time.time()
logging.info("LOADING BART...")
try:
    classifier = pipeline('zero-shot-classification', model="facebook/bart-large-mnli")
    logging.info(f'LOADING COMPLETED IN {time.time()-s}s')
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

@app.route('/classify', methods=['POST'])
def classify():
    logging.info("Received a request for classification.")
    
    try:
        data = request.get_json()  
        idea_id = data['id']
        title = data['title']
        description = data['description']
        categories = data['categories']

        logging.debug(f"Received data: {data}")

        category_names = [category['name'] for category in categories]
        combined_text = f"{title}. {description}"
        result = classifier(combined_text, category_names)

        threshold = 0.15
        matching_categories = []

        for label, score in zip(result['labels'], result['scores']):
            if score >= threshold:
                category = next((cat for cat in categories if cat['name'] == label), None)
                if category:
                    matching_categories.append({
                        "id": category['id'],
                        "name": label,
                        "score": score
                    })
        
        logging.info(f"Classification result for idea {idea_id}: {matching_categories}")
        
        return jsonify({
            "ideaID": idea_id,
            "categories": matching_categories
        })

    except Exception as e:
        logging.error(f"Error processing classification request: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    logging.info("Starting Flask app...")
    app.run(host='0.0.0.0', port=5000)
