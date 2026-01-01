from flask import Flask, request, jsonify
from supabase import create_client
from dotenv import load_dotenv
from flask_cors import CORS

import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ADMIN_SECRET = os.getenv("ADMIN_SECRET")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)


# --- Simple admin check ---



def is_admin(req):
    auth = req.headers.get("Authorization")
    return auth == f"Bearer {ADMIN_SECRET}"

# --- Get all reviews ---
@app.route("/reviews", methods=["GET"])
def get_reviews():
    response = supabase.table("reviews").select("*").order("date").execute()
    return jsonify(response.data), 200





# --- Create or update a review ---
@app.route("/reviews", methods=["POST"])
def upsert_review():
    try:
        if not is_admin(request):
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json
        print("Incoming data:", data)

        response = (
            supabase
            .table("reviews")
            .upsert({
                "date": data["date"],
                "mood": data["mood"],
                "score": data["score"],
                "stress": data["stress"],
                "note": data.get("note"),
            }, on_conflict="date")
            .execute()
        )

        print("Supabase response:", response)

        return jsonify(response.data), 200

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
