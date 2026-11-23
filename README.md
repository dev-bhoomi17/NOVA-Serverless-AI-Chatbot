# NOVA — Serverless AI Chat Studio ✨

A modern conversational chatbot built with HTML, CSS, JavaScript and Node.js, featuring a serverless API architecture, prompt engineering and an extensible Large Language Model (LLM) integration layer.

NOVA provides an elegant AI chat experience with conversation management, persistent chat history, suggested prompts and a modular backend designed for future LLM integrations.

<p align="center">
  <a href="https://nova-serverless-ai-chatbot.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20NOVA-8F80DB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
  <a href="https://github.com/dev-bhoomi17/NOVA-Serverless-AI-Chatbot">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
  </a>
</p>

---

## 🚀 Live Demo

**Experience NOVA:**  
https://nova-serverless-ai-chatbot.vercel.app/

**GitHub Repository:**  
https://github.com/dev-bhoomi17/NOVA-Serverless-AI-Chatbot

NOVA is publicly deployed on Vercel and currently operates using its demo response engine.

## ✨ Features

### Chat Experience
- **Modern Chat Interface:** A polished, responsive conversational workspace.
- **Suggested Prompts:** Start conversations using predefined prompts.
- **Real-Time Interface Updates:** Display messages and responses dynamically.
- **Typing Indicator:** Visual feedback while NOVA processes a request.
- **Error Notifications:** Informative messages when a request fails.

### Conversation Management
- **New Conversations:** Start separate chat sessions.
- **Conversation History:** Access previously created conversations.
- **Conversation Switching:** Switch between saved conversations.
- **Persistent Chat History:** Restore conversations after refreshing the browser using LocalStorage.
- **Clear Conversation:** Remove the currently selected conversation.

### Backend & AI Architecture
- **Serverless API:** HTTP GET and POST handlers for chat requests.
- **Prompt Engineering:** Centralized system instructions and conversational context.
- **LLM Integration Layer:** Modular backend designed to support an approved LLM provider.
- **Demo Response Engine:** Test the complete chatbot without an external API key.
- **Input Validation:** Validate messages, request formats and conversation history.
- **Error Handling:** Handle malformed requests, invalid inputs and provider failures.

### Design & Accessibility
- Dark-themed interface with lavender and coral accents.
- Responsive desktop, tablet and mobile layouts.
- Animated interface elements.
- Accessible form labels and keyboard interactions.
- Safe DOM-based message rendering.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | Styling, animations and responsive design |
| JavaScript | Frontend interactions and state management |
| Node.js | Backend runtime |
| Vercel Functions | Serverless deployment |
| LocalStorage | Conversation persistence |
| Node.js Test Runner | Automated backend testing |

## 🏗️ Application Architecture

NOVA follows a modular frontend and serverless backend architecture.

```text
              USER
                |
                v
       NOVA CHAT INTERFACE
          HTML / CSS / JS
                |
                v
          CHAT REQUEST
                |
                v
       SERVERLESS API HANDLER
             /api/chat
                |
          +-----+-----+
          |           |
          v           v
      PROMPT       LLM CLIENT
       ENGINE       MODULE
          |           |
          +-----+-----+
                |
                v
         RESPONSE ENGINE
                |
          +-----+-----+
          |           |
          v           v
      DEMO MODE    APPROVED LLM
                   PROVIDER
          |           |
          +-----+-----+
                |
                v
        JSON RESPONSE
                |
                v
        NOVA CHAT UI
```

The frontend communicates with the backend through the `/api/chat` endpoint. The backend validates requests, manages conversation context and generates responses through the configured response engine.

## 📁 Project Structure

```text
NOVA-Serverless-AI-Chatbot/
│
├── api/
│   └── chat.js
│
├── lib/
│   ├── prompt.js
│   └── llm.js
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── assets/
│   ├── images/
│   └── icons/
│
├── screenshots/
│
├── tests/
│   └── chat.test.js
│
├── index.html
├── dev-server.js
├── package.json
├── package-lock.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

### Directory Responsibilities

| Directory / File | Responsibility |
|---|---|
| `api/` | Serverless API request handlers |
| `lib/` | Prompt engine and LLM integration |
| `css/` | Application styling |
| `js/` | Frontend interactions and chat state |
| `assets/` | Images and icons |
| `screenshots/` | Project screenshots |
| `tests/` | Automated backend tests |
| `index.html` | Main chatbot interface |
| `dev-server.js` | Local development server |
| `vercel.json` | Deployment and security-header configuration |
| `.env.example` | Environment variable template |

## ⚙️ Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Git
- Visual Studio Code or another code editor

### 1. Clone the repository

```bash
git clone https://github.com/dev-bhoomi17/NOVA-Serverless-AI-Chatbot.git
```

### 2. Navigate to the project directory

```bash
cd NOVA-Serverless-AI-Chatbot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the local development server

```bash
npm run dev
```

### 5. Open NOVA

Visit:

```text
http://127.0.0.1:5500
```

The application starts in local demo mode and does not require an external LLM API key.

## 🔌 API Documentation

NOVA exposes a serverless chat API.

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat` | API health check |
| POST | `/api/chat` | Process chat messages and generate responses |

### GET — Health Check

**Request:**

```http
GET /api/chat
```

**Example response:**

```json
{
  "status": "ok",
  "service": "NOVA Chat API",
  "mode": "demo",
  "timestamp": "2026-11-24T00:00:00.000Z"
}
```

The timestamp is illustrative and will reflect the actual request time.

### POST — Send a Chat Message

**Request:**

```http
POST /api/chat
Content-Type: application/json
```

**Request body:**

```json
{
  "message": "Explain serverless computing.",
  "history": []
}
```

**Example response:**

```json
{
  "reply": "Serverless computing lets you run backend code without managing servers yourself.",
  "mode": "demo"
}
```

### Request Validation

The API validates:

- Message presence and data type.
- Maximum message length of 4,000 characters.
- JSON request format.
- Supported content type.
- Conversation history structure.
- Valid conversation roles.

## 🧠 Prompt Engineering

NOVA uses a centralized system prompt defined in `lib/prompt.js`.

The prompt establishes the assistant's:

- Identity and communication style.
- Response clarity and structure.
- Accuracy and uncertainty handling.
- Conversation-context management.
- Safety and responsible AI guidelines.

Conversation history is normalized before being sent to the response engine.

The context manager limits the conversation history to the latest 12 valid messages.

## 🔐 Security Practices

Security is considered throughout the application architecture.

- **Server-Side Credentials:** LLM API credentials are designed to be stored in server-side environment variables.
- **Git Protection:** Local environment files are excluded through `.gitignore`.
- **Input Validation:** Requests are validated before response generation.
- **Safe Rendering:** Chat messages are inserted using safe DOM text methods.
- **Request Limits:** Message length and local request body size are restricted.
- **Error Handling:** API failures are handled without exposing provider credentials.
- **Backend Separation:** API integrations remain separate from frontend code.

Never commit actual API keys, passwords or private environment files to GitHub.

## 🧪 Automated Testing

NOVA uses Node.js's built-in test runner.

Run the test suite:

```bash
npm test
```

### Current Test Coverage

| Test Case | Expected Result |
|---|---|
| API health check | Successful response |
| Valid chat request | Demo response generated |
| Empty message | Rejected |
| Oversized message | Rejected |
| Malformed JSON | Rejected |
| Unsupported content type | Rejected |
| Invalid conversation history | Invalid entries removed |

### Latest Verified Test Results

```text
tests 7
pass  7
fail  0
```

**7 tests passed with zero failures** in the latest local test run.

## ☁️ Deployment

NOVA is deployed on Vercel.

**Production URL:**  
https://nova-serverless-ai-chatbot.vercel.app/

The application uses Vercel's serverless deployment architecture for the backend API and serves its frontend from the same project.

The deployment currently runs in demo mode.

## 📌 Development Status

| Component | Status |
|---|---|
| Responsive chat interface | Completed |
| Suggested prompts | Completed |
| Message handling | Completed |
| Conversation management | Completed |
| LocalStorage persistence | Completed |
| Prompt engineering | Completed |
| Serverless API handler | Implemented |
| Local demo response engine | Working |
| Automated backend tests | 7/7 Passed |
| GitHub repository | Published |
| Vercel deployment | Published and verified |
| Live external LLM connection | Pending approved provider configuration |

**Current limitation:** NOVA currently uses its local demo response engine. The LLM integration module is implemented, but a live external model connection has not yet been configured and verified.

## 🌱 Future Improvements

- Integration with an approved live LLM provider.
- Streaming AI-generated responses.
- User authentication and account management.
- Cloud-based conversation storage.
- Conversation export and download.
- Usage analytics and request monitoring.
- API rate limiting and abuse protection.
- Additional LLM provider adapters.
- Improved conversation organization.

## 🎯 Learning Outcomes

This project demonstrates practical understanding of:

- Serverless application architecture.
- REST API development.
- JavaScript event handling and DOM manipulation.
- State management and browser storage.
- Prompt engineering and conversational context.
- LLM integration architecture.
- Backend validation and error handling.
- Environment-variable security.
- Automated testing with Node.js.
- Cloud deployment using Vercel.
- Git and GitHub version control.

---

<p align="center">
  <strong>NOVA — A space for ideas to become conversations. ✨</strong>
</p>

<p align="center">
  Built with curiosity and a passion for technology.
</p>