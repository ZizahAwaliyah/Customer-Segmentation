from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

# 1. Setup CORS (Agar frontend bisa akses)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load Model
try:
    current_dir = os.path.dirname(__file__)
    model_path = os.path.join(current_dir, 'model_clustering.pkl')
    model = joblib.load(model_path)
    print("✅ Model Clustering dimuat!")
except Exception as e:
    print(f"❌ Error: {e}")
    model = None

# 3. Format Data Input (Kita butuh 2 angka: Income & Spending)
class CustomerData(BaseModel):
    income: float  # Dalam Ribuan Dollar (k$)
    spending: float # Skor 1-100

# 4. Definisi Arti Cluster (Marketing Dictionary)
# Urutan 0-4 ini harus dicocokkan dengan hasil eksperimen tadi
# (Disini saya buat general dulu, nanti kita bisa sesuaikan)
CLUSTER_NAMES = {
    0: "Impulsive (Gaji Kecil, Boros)",
    1: "Saver (Hemat)",
    2: "Average (Standar)",
    3: "Target Hemat (Gaji Besar, Pelit)", 
    4: "Sultan (VIP Target)" 
}

@app.get("/")
def home():
    return {"message": "Customer Segmentation API Ready! 🚀"}

@app.post("/predict")
def predict_segment(data: CustomerData):
    if model is None:
        return {"error": "Model belum siap"}
    
    # Siapkan data untuk AI (format array 2D)
    features = np.array([[data.income, data.spending]])
    
    # Prediksi Cluster (0-4)
    cluster_index = model.predict(features)[0]
    cluster_index = int(cluster_index) # Ubah ke integer biasa
    
    # Ambil Julukan Marketing
    # Catatan: Di Scikit-Learn, nomor cluster (0,1,2..) itu acak setiap training.
    # Jadi kita kembalikan nomornya saja dulu, nanti frontend yang kasih warna.
    
    return {
        "cluster_id": cluster_index,
        "input_income": data.income,
        "input_spending": data.spending,
        "marketing_strategy": "Tawarkan Promo Khusus!" # Placeholder
    }