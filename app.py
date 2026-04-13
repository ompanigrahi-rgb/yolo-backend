from flask import Flask, request, jsonify
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)

# Load YOLO models
models = {
    "yolov8": YOLO("yolov8n.pt"),
    "yolov5": YOLO("yolov5s.pt")
}

@app.route("/detect", methods=["POST"])
def detect():
     print("FILES:", request.files)
     print("FORM:", request.form)

     if "image" not in request.files:
        return jsonify({"error": "No image received"}), 400

     file = request.files["image"]
     model_name = request.form.get("model", "yolov8")
     

     model = models.get(model_name, models["yolov8"])
    #convert image

     img = np.frombuffer(file.read(), np.uint8)
     img = cv2.imdecode(img, cv2.IMREAD_COLOR)

     if img is None:
        return jsonify({"error": "Invalid image"}), 400

     results = model(img) 

     detections = []
 
     for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            detections.append({
                "class_id": cls_id,
                "label": model.names[cls_id],   # ✅ human readable
                "confidence": float(box.conf[0])
            })

     return jsonify(detections)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)