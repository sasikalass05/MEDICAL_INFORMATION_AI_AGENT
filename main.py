#!/usr/bin/env python3
"""
Medical Information Agent
=========================
An autonomous healthcare AI assistant powered by Groq LLM (openai/gpt-oss-120b),
LangChain, HuggingFaceEmbeddings, FAISS vector search, and a Gradio web interface.

Repository: sasikalass05/MEDICAL_INFORMATION_AI_AGENT
"""

import os
import sys
import subprocess
import urllib.request
import json

# Ensure required dependencies are installed
REQUIRED_PACKAGES = [
    "groq", "gradio", "langchain", "langchain-community", "langchain-core",
    "langchain-groq", "sentence-transformers", "faiss-cpu", "pypdf", "reportlab", "tavily-python"
]

def check_and_install_packages():
    missing = []
    for pkg in REQUIRED_PACKAGES:
        try:
            __import__(pkg.replace("-", "_"))
        except ImportError:
            missing.append(pkg)
    if missing:
        print(f"📦 Installing missing packages: {', '.join(missing)}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-q"] + missing)
        print("✅ All dependencies installed successfully.")

check_and_install_packages()

# Configure API Keys (Set your keys or load from environment)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "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")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY", "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")

os.environ["GROQ_API_KEY"] = GROQ_API_KEY
os.environ["TAVILY_API_KEY"] = TAVILY_API_KEY

PDF_FILENAME = "medical_reference_guide.pdf"

# 1. Create or verify Medical Knowledge PDF
def generate_sample_medical_pdf(filename=PDF_FILENAME):
    if os.path.exists(filename) and os.path.getsize(filename) > 0:
        print(f"📄 Found existing medical knowledge reference: {filename}")
        return

    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors

    doc = SimpleDocTemplate(filename, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=16, leading=20, textColor=colors.HexColor('#0f766e'))
    body_style = ParagraphStyle('Body', parent=styles['BodyText'], fontSize=9, leading=13)

    elements = [
        Paragraph("Clinical Medical Reference & Treatment Protocol Handbook", title_style),
        Spacer(1, 10),
        Paragraph("<b>Hypertension:</b> Diagnosed when systolic BP >= 130 mmHg or diastolic >= 80 mmHg. First-line: Lisinopril 10-40mg daily, Losartan 50-100mg daily, or Amlodipine 5-10mg daily. Sodium restriction < 2,000 mg/day.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Type 2 Diabetes:</b> Fasting glucose >= 126 mg/dL or HbA1c >= 6.5%. First-line: Metformin 500mg BID titrated to 1000mg BID with meals. Target HbA1c < 7.0%.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Asthma Exacerbation:</b> Albuterol (Salbutamol) inhaler 2 puffs Q4-6H PRN. Persistent asthma requires inhaled corticosteroids (Fluticasone/Budesonide).", body_style),
        Spacer(1, 6),
        Paragraph("<b>Severe Acute Burns:</b> Cool with running room-temperature water for 15-20 mins. Never apply ice, butter, or oil. Cover with sterile dressing and seek emergency care.", body_style),
        Spacer(1, 6),
        Paragraph("<b>Suspected Heart Attack (MI):</b> Immediate 911 dispatch. Administer chewable Aspirin 325mg non-enteric if no allergy. Keep patient seated at rest.", body_style),
        Spacer(1, 10)
    ]

    table_data = [
        ["Procedure / Medication", "Estimated Gross Cost", "Average Insurance Copay"],
        ["General Consultation", "$120 - $250", "$25 - $45"],
        ["Specialist Cardiology", "$280 - $550", "$50 - $90"],
        ["Comprehensive Blood Panel", "$180 - $400", "$15 - $50"],
        ["MRI Scan (Spine / Brain)", "$1,200 - $3,400", "$250 - $600"],
        ["Cataract Surgery (Per eye)", "$3,500 - $5,200", "$450 - $1,100"],
        ["Metformin 500mg (Monthly)", "$15 - $35", "$5 - $10"],
        ["Lisinopril 10mg (Monthly)", "$12 - $28", "$4 - $10"],
        ["Albuterol Inhaler", "$45 - $95", "$15 - $30"]
    ]
    t = Table(table_data, colWidths=[200, 150, 150])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f766e')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#99f6e4')),
        ('FONTSIZE', (0,0), (-1,-1), 8.5)
    ]))
    elements.append(t)
    doc.build(elements)
    print(f"✅ Created medical knowledge reference: {filename}")

generate_sample_medical_pdf()

# 2. Ingest, Split, and Vectorize Document with FAISS
print("⚙️ Indexing vector database with HuggingFace & FAISS...")
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document

try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter

try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_community.vectorstores import FAISS

try:
    loader = PyPDFLoader(PDF_FILENAME)
    documents = loader.load()
    if not documents:
        raise ValueError("Empty PDF")
except Exception:
    documents = [Document(page_content="Hypertension: Lisinopril 10-40mg daily. Diabetes: Metformin 500mg BID. Asthma: Albuterol inhaler. Burns: Cool water 15-20 min. Heart Attack: 911 + Aspirin 325mg.", metadata={"source": PDF_FILENAME})]

text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=60)
chunks = text_splitter.split_documents(documents)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True}
)

vector_db = FAISS.from_documents(documents=chunks, embedding=embeddings)
retriever = vector_db.as_retriever(search_kwargs={"k": 3})
print("✅ Vector retriever online (FAISS).")

# 3. Detect and Connect Active Groq Model (openai/gpt-oss-120b)
print("🤖 Connecting Groq LLM...")
from langchain_groq import ChatGroq
from groq import Groq

groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])

active_model = "openai/gpt-oss-120b"
try:
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/models",
        headers={"Authorization": f"Bearer {os.environ['GROQ_API_KEY']}"}
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        available = [m["id"] for m in data.get("data", [])]
        for candidate in ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]:
            if candidate in available:
                active_model = candidate
                break
except Exception:
    pass

print(f"✅ Active Groq model: '{active_model}'")
llm = ChatGroq(model_name=active_model, temperature=0.2, groq_api_key=os.environ["GROQ_API_KEY"])

# 4. Define Autonomous Tools
from langchain_core.tools import tool

@tool
def medical_knowledge_search(query: str) -> str:
    """Useful to look up medical information, disease symptoms, clinical protocols, and emergency first aid."""
    results = retriever.invoke(query)
    return "\n\n".join([f"[Source Chunk {i+1}]: {doc.page_content}" for i, doc in enumerate(results)])

COST_BENCHMARKS = {
    "doctor visit": {"gross": 180, "copay": 35},
    "specialist": {"gross": 400, "copay": 70},
    "blood panel": {"gross": 280, "copay": 30},
    "mri": {"gross": 2200, "copay": 450},
    "ct scan": {"gross": 1700, "copay": 320},
    "cataract surgery": {"gross": 4200, "copay": 750},
    "metformin": {"monthly_gross": 25, "monthly_copay": 8},
    "lisinopril": {"monthly_gross": 20, "monthly_copay": 6},
    "albuterol": {"monthly_gross": 70, "monthly_copay": 25}
}

@tool
def medical_budget_calculator(request: str) -> str:
    """Calculate healthcare budgets, out-of-pocket costs, and insurance copay estimates."""
    req_lower = request.lower()
    total_gross = 0
    total_insured = 0
    breakdown = []
    for item, costs in COST_BENCHMARKS.items():
        if item in req_lower:
            gross = costs.get("gross", costs.get("monthly_gross", 0) * 12)
            copay = costs.get("copay", costs.get("monthly_copay", 0) * 12)
            breakdown.append(f"• {item.title()}: Est. ${gross:,} gross | Copay: ${copay:,}")
            total_gross += gross
            total_insured += copay
    if not breakdown:
        return "💰 Estimated Budget: Specialist Copay ~$40-$90; Imaging Copay ~$200-$450; Generic Rx ~$10-$30/mo."
    return f"💰 Medical Budget Breakdown:\n" + "\n".join(breakdown) + f"\n\nTotal Gross: ${total_gross:,} | Insured Out-of-Pocket: ${total_insured:,}"

# 5. Agent Pipeline & Gradio UI
import gradio as gr
from langchain_core.messages import SystemMessage, HumanMessage

SYSTEM_PROMPT = (
    "You are the 'Medical Information Agent', an empathetic and clinical healthcare assistant.\n"
    "Consult the retrieved medical knowledge and budget calculations to answer user questions.\n"
    "Conclude every answer with a concise clinical disclaimer."
)

def run_agent(user_query: str) -> str:
    q_lower = user_query.lower()
    rag_text = ""
    try:
        rag_text = medical_knowledge_search.invoke({"query": user_query})
    except Exception:
        rag_text = ""
        
    budget_text = ""
    budget_terms = ["cost", "price", "budget", "copay", "insurance", "mri", "surgery", "blood panel", "metformin", "lisinopril", "albuterol"]
    if any(k in q_lower for k in budget_terms):
        try:
            budget_text = medical_budget_calculator.invoke({"request": user_query})
        except Exception:
            budget_text = ""
            
    full_prompt = f"{SYSTEM_PROMPT}\n\nClinical Guide Chunks:\n{rag_text}\n\n"
    if budget_text:
        full_prompt += f"Budget Calculations:\n{budget_text}\n\n"
    full_prompt += f"User Question: {user_query}"
    
    try:
        resp = llm.invoke([SystemMessage(content=SYSTEM_PROMPT), HumanMessage(content=full_prompt)])
        return resp.content.strip()
    except Exception:
        try:
            resp = groq_client.chat.completions.create(
                model=active_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": full_prompt}
                ]
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            return f"### 🏥 Medical Information\n\n{rag_text}\n\n{budget_text}\n\n*Disclaimer: Consult a physician for medical advice.*"

def chat_fn(msg, history=None):
    if not msg:
        return "Please enter a question."
    return run_agent(str(msg))

with gr.Blocks(theme=gr.themes.Soft(primary_hue="teal"), title="Medical Information Agent") as demo:
    gr.Markdown(f"# 🏥 Medical Information Agent\n*Powered by Groq ({active_model}), LangChain RAG & Medical Budget Tool*")
    with gr.Tab("💬 Medical AI Chat"):
        gr.ChatInterface(
            fn=chat_fn,
            examples=[
                "What is the first-line medication protocol for hypertension?",
                "What are the emergency first aid steps for severe burns?",
                "Estimate the budget for cataract surgery and specialist consultation.",
                "How is Type 2 Diabetes treated with Metformin?"
            ]
        )
    with gr.Tab("💰 Budget Tool Direct"):
        b_in = gr.Textbox(label="Enter procedures or medications", value="mri and lisinopril")
        b_btn = gr.Button("Calculate Budget", variant="primary")
        b_out = gr.Textbox(label="Calculation Result", lines=6)
        b_btn.click(lambda q: medical_budget_calculator.invoke({"request": q}), inputs=b_in, outputs=b_out)

if __name__ == "__main__":
    print("\n🌐 Starting Medical Information Agent on Gradio...")
    demo.launch(share=True, debug=False)
