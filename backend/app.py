from flask import Flask, request, jsonify
from flask_cors import CORS
from diffusers import AutoPipelineForText2Image
import torch
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the model directly from Hugging Face Model Hub
pipe = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')

    # Generate the image
    with torch.no_grad():
        image = pipe(prompt=prompt, num_inference_steps=3, guidance_scale=0.0).images[0]
    
    # Convert the image to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)

    return img_byte_arr.read(), 200, {'Content-Type': 'image/png'}

if __name__ == '__main__':
    app.run(debug=True)
