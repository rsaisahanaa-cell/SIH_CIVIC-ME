from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
import re
import shutil

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
UPLOADS = BASE / "uploads"
UPLOADS.mkdir(exist_ok=True)

app = FastAPI(
    title="CIVIC@ME API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_data(filename):
    with open(DATA / filename, "r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "CIVIC@ME"
    }


@app.get("/api/approvals")
def get_approvals(
    sector: str = "food_processing",
    location: str = "maharashtra"
):
    approvals = load_data("approvals.json")

    return [
        approval
        for approval in approvals
        if approval["sector"] == sector
        and approval["location"] == location
    ]


@app.post("/api/profile/check")
def check_profile(profile: dict):

    approvals = load_data("approvals.json")

    matches = [
        approval
        for approval in approvals
        if approval["sector"] == profile.get(
            "sector",
            "food_processing"
        )
        and approval["location"] == profile.get(
            "location",
            "maharashtra"
        )
    ]

    return {
        "approval_count": len(matches),
        "approvals": matches,
        "message": f"{len(matches)} potentially applicable approvals identified."
    }


@app.post("/api/documents/validate")
async def validate_document(
    file: UploadFile = File(...)
):

    safe_name = re.sub(
        r"[^A-Za-z0-9._-]",
        "_",
        file.filename or "document"
    )

    target = UPLOADS / safe_name

    with target.open("wb") as output:
        shutil.copyfileobj(file.file, output)

    return {
        "filename": safe_name,
        "status": "REVIEW",
        "message": "Document uploaded successfully.",
        "checks": [
            {
                "name": "File received",
                "status": "PASS"
            },
            {
                "name": "Required field extraction",
                "status": "REVIEW"
            },
            {
                "name": "Cross-document consistency",
                "status": "REVIEW"
            }
        ]
    }


@app.get("/api/applications")
def get_applications():
    return load_data("applications.json")


@app.get("/api/incentives")
def get_incentives():
    return load_data("incentives.json")


@app.get("/api/dashboard")
def dashboard():

    applications = load_data("applications.json")

    return {
        "total_applications": len(applications),

        "pending": sum(
            application["status"] == "Pending"
            for application in applications
        ),

        "approved": sum(
            application["status"] == "Approved"
            for application in applications
        ),

        "sla_risk": sum(
            application["sla_status"] == "At Risk"
            for application in applications
        )
    }


@app.post("/api/rag/query")
def rag_query(payload: dict):

    question = (
        payload.get("question") or ""
    ).lower()

    documents = load_data("knowledge.json")

    matches = []

    for document in documents:

        score = sum(
            1
            for term in question.split()
            if term in document["text"].lower()
        )

        if score:
            matches.append(
                (score, document)
            )

    matches.sort(
        key=lambda x: x[0],
        reverse=True
    )

    if not matches:
        return {
            "answer": (
                "No matching regulatory information "
                "was found in the knowledge base."
            ),
            "sources": []
        }

    return {
        "answer": matches[0][1]["text"],
        "sources": [
            item[1]["source"]
            for item in matches[:3]
        ]
    }
