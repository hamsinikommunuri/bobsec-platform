"""Vercel Python Serverless Endpoint for BobSec Neural Network Inference.

Exposes POST /api/ml/predict for real-time scam classification using the
trained custom Multilayer Perceptron (MLP) neural network.
"""
import json
import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path

# Add project root to sys.path to enable importing ml subsystem
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from ml.src.inference import predict_scam

class handler(BaseHTTPRequestHandler):
    """Vercel serverless request handler."""

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self._send_cors_headers()
        self.end_headers()
        response = {
            "status": "UP",
            "service": "bobsec-python-mlp-inference",
            "model_version": "bobsec-mlp-v2-academic",
            "architecture": "MLP (256, 128, 64) with Word+Char TF-IDF"
        }
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 100_000:  # Max 100KB payload
                self.send_response(413)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Payload too large"}).encode("utf-8"))
                return
                
            post_data = self.rfile.read(content_length) if content_length > 0 else b"{}"
            try:
                data = json.loads(post_data.decode("utf-8"))
            except Exception:
                data = {}
                
            text = data.get("text", "") or data.get("content", "")
            prediction = predict_scam(str(text))
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(prediction).encode("utf-8"))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            error_response = {
                "error": "Internal Inference Error",
                "message": str(e),
                "model_version": "bobsec-mlp-v2-academic",
                "fallback": True
            }
            self.wfile.write(json.dumps(error_response).encode("utf-8"))
