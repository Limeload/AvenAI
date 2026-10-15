# AvenAI - 🤖 AI Customer Support Agent for Aven


A voice- and chat-enabled AI support agent that can answer questions about [Aven](https://www.aven.com) using real company documentation. Built using **React**, **TypeScript**, **Next.js**, **OpenAI**, **Pinecone**, and **Vapi**.

> 🏆 Project submission for the [Headstarter Accelerator](https://app.headstarter.co/content/accelerator/project/ai-customer-support) – AI Customer Support Agent challenge.

---

## 🧠 What It Does

This project allows users to:
- Ask any question about Aven via **chat or voice**
- Receive **accurate, contextual answers** using **RAG (Retrieval-Augmented Generation)**
- View **citations** from Aven documentation
- (Bonus) Trigger **meeting scheduling logic**
- (Bonus) Includes **guardrails** for legal, financial, or inappropriate queries

---

## 🛠️ Tech Stack

| Layer        | Tools / Libraries                          |
|--------------|---------------------------------------------|
| Frontend     | Next.js, React, TypeScript, Tailwind CSS    |
| Voice AI     | [Vapi](https://vapi.ai)                    |
| Backend      | OpenAI API, LangChain (or custom logic)     |
| Vector DB    | [Pinecone](https://www.pinecone.io)         |
| Scraping     | Exa.ai, Cheerio, Puppeteer                  |
| Moderation   | OpenAI Moderation API (Guardrails)          |
| Deployment   | Vercel + GitHub                             |

---

## 🧩 How It Works

### 🗂️ Step 1: Web Scraping Aven
We extracted data from Aven’s [support site](https://www.aven.com/support) using scraping tools and cleaned the text.

### 🔎 Step 2: Embedding & Indexing
- Content was chunked and embedded using **OpenAI Embedding API**
- Stored in **Pinecone** vector database

### 🤖 Step 3: RAG Pipeline
- On a user query:
  - Top-k relevant chunks are retrieved from Pinecone
  - These are passed to **GPT-3.5/4** to generate a contextual response
  - Source citations are included in the answer

### 💬 Step 4: Chat + Voice UI
- Built using **Next.js** and **React**
- Voice input handled using **Vapi**
- Chat UI provides instant answers with source references

### 🔒 Bonus Features
- **Guardrails**: Filters sensitive or inappropriate questions
- **Meeting Scheduler**: Triggers appointment logic (e.g., Calendly/Google Calendar)
- **Evaluation Set**: Manual test set with ~50 user-style queries

---

## 📦 Installation & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Limeload/AvenAI.git
cd AvenAI

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your OpenAI, Pinecone, and Vapi keys

# 4. Run the dev server
npm run dev
```
# landing
