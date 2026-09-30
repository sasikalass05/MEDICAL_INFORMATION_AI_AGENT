# 🏥 Medical Information AI Agent

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/sasikalass05/MEDICAL_INFORMATION_AI_AGENT/blob/main/medical_information_agent%20(3).ipynb)
[![GitHub Repo](https://img.shields.io/badge/GitHub-sasikalass05%2FMEDICAL__INFORMATION__AI__AGENT-181717.svg?logo=github)](https://github.com/sasikalass05/MEDICAL_INFORMATION_AI_AGENT)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![Groq](https://img.shields.io/badge/Groq-openai%2Fgpt--oss--120b-orange.svg)](https://groq.com)
[![LangChain](https://img.shields.io/badge/LangChain-RAG%20Agent-darkgreen.svg)](https://langchain.com)
[![FAISS](https://img.shields.io/badge/FAISS-Vector%20Search-purple.svg)](https://github.com/facebookresearch/faiss)
[![Gradio](https://img.shields.io/badge/Gradio-Live%20Web%20UI-ff6b6b.svg)](https://gradio.app)

An autonomous clinical healthcare AI agent designed to run in **Google Colab** and locally. Powered by **Groq (`openai/gpt-oss-120b`)**, **LangChain RAG**, **HuggingFace dense vector embeddings**, **FAISS retrieval**, an intelligent **Medical Budget Calculator Tool**, and an interactive **Gradio Web Interface**.

---

## ⚡ Direct 1-Click Launch in Google Colab

Click either link below to launch and run the agent immediately in Google Colab:

- 🚀 **Direct Colab Link:** [https://colab.research.google.com/github/sasikalass05/MEDICAL_INFORMATION_AI_AGENT/blob/main/medical_information_agent%20(3).ipynb](https://colab.research.google.com/github/sasikalass05/MEDICAL_INFORMATION_AI_AGENT/blob/main/medical_information_agent%20(3).ipynb)
- 📌 **Interactive Badge:**

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/sasikalass05/MEDICAL_INFORMATION_AI_AGENT/blob/main/medical_information_agent%20(3).ipynb)

> **How to Run in Colab:**
> 1. Click the link above to open the notebook.
> 2. Select **Runtime ➔ Run all** (`Ctrl + F9`).
> 3. Scroll to the last cell to view your live **Gradio UI** and click the public `.gradio.live` link!

---

## 🏗️ Architecture & Pipeline

```text
               ┌────────────────────────────────────────────────────────┐
               │         medical_reference_guide.pdf (Clinical Data)   │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                  [PyPDFLoader]
                                           │
                        [RecursiveCharacterTextSplitter]
                                           │
                                    (Text Chunks)
                                           │
                     [HuggingFace: all-MiniLM-L6-v2 Embeddings]
                                           │
                              [FAISS Vector Store]
                                           │
                                           ▼
┌─────────────────┐       ┌─────────────────────────────────┐
│   User Query    │ ───►  │    Medical Information Agent    │
└─────────────────┘       │    Groq: openai/gpt-oss-120b    │
                          └──────┬────────────────────┬─────┘
                                 │                    │
                   [medical_knowledge_search]  [medical_budget_calculator]
                         (RAG Retrieval)         (Copay & Cost Benchmarks)
                                 │                    │
                                 └──────────┬─────────┘
                                            ▼
                              ┌───────────────────────────┐
                              │     Gradio Web UI         │
                              │  (Local & Public URL)     │
                              └───────────────────────────┘
```

---

## ✨ Key Capabilities

1. **Clinical Knowledge Retrieval (RAG)**:
   - Ingests structured medical handbooks with clinical guidance on **Hypertension**, **Type 2 Diabetes Mellitus**, **Asthma & Bronchospasms**, and **Medication Dosages** (Lisinopril, Metformin, Albuterol).
2. **Emergency Triage Protocols**:
   - Immediate step-by-step first aid guidance for **Thermal Burns** (flush cool water, avoid ice/oil) and suspected **Myocardial Infarction / Heart Attack** (911 dispatch, non-enteric Aspirin 325mg).
3. **Medical Budget & Expense Calculator**:
   - Calculates estimated gross procedural costs, regional out-of-pocket insurance copays, generic prescription costs, and potential savings for consultations, blood panels, MRIs, CT scans, and surgeries.
4. **Instant Gradio Interface**:
   - Launches interactive chat and budget tabs directly inside Google Colab or on a public `.gradio.live` link (`share=True`).

---

## 🚀 Quick Start in Google Colab

1. Open **[Google Colab](https://colab.research.google.com)**.
2. Click **Upload** and upload `medical_information_agent.ipynb` from this repository.
3. In Colab's menu, select **Runtime ➔ Run all** (`Ctrl + F9`).
4. Scroll to the last cell to interact with the Gradio UI directly in the notebook or click the generated public link!

---

## 💻 Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/sasikalass05/MEDICAL_INFORMATION_AI_AGENT.git
cd MEDICAL_INFORMATION_AI_AGENT
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set API Keys
```bash
export GROQ_API_KEY="your_groq_api_key_here"
export TAVILY_API_KEY="your_tavily_api_key_here"
```

### 4. Run the Agent
```bash
python main.py
```

The Gradio web interface will launch at `http://127.0.0.1:7860` with a shareable public link.

---

## 📂 Repository Structure

| File | Description |
| :--- | :--- |
| `medical_information_agent.ipynb` | Fully runnable, self-contained Google Colab Jupyter Notebook |
| `main.py` | Standalone Python script for local and cloud execution |
| `requirements.txt` | Python library dependencies |
| `README.md` | Documentation and architecture overview |

---

## 🩺 Clinical Safety Disclaimer

*Disclaimer: This Medical Information Agent is built for clinical educational guidance, RAG workflow demonstration, and informational support. It does not replace professional medical diagnosis, personalized treatment plans from a licensed physician, or emergency dispatch services. In a medical emergency, call 911 or your local emergency number immediately.*
