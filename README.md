# NOVA — Serverless AI Chat Studio ✨

A modern conversational AI chatbot built with HTML, CSS, JavaScript and Node.js, featuring a serverless API architecture, prompt engineering and an extensible LLM integration layer.

NOVA provides an elegant chat experience with conversation management, persistent chat history, suggested prompts and an independently testable backend.

## ✨ Features

- **Modern Chat Interface:** Premium dark-themed, responsive chatbot interface.
- **Conversation Management:** Create, switch between and clear conversations.
- **Chat Persistence:** Automatically save and restore conversations using browser LocalStorage.
- **Suggested Prompts:** Start conversations using predefined prompts.
- **Prompt Engineering:** Centralized system instructions and contextual conversation handling.
- **Serverless API:** HTTP GET and POST handlers for processing chat requests.
- **Demo Response Engine:** Test the complete application without an external API key.
- **LLM Integration Layer:** Modular backend architecture designed for an approved LLM provider.
- **Input Validation:** Validate incoming messages, request formats and conversation history.
- **Error Handling:** Handle invalid requests, interrupted requests and provider failures.
- **Responsive Design:** Adapted for desktop, tablet and mobile devices.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Chat interface structure |
| CSS3 | Styling, animations and responsive design |
| JavaScript | Frontend interactions and state management |
| Node.js | Backend runtime |
| Vercel Functions | Serverless deployment target |
| LocalStorage | Conversation persistence |
| Node.js Test Runner | Automated backend testing |

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

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Visual Studio Code or another code editor

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
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

The application runs in local demo mode without requiring an external LLM API key.

## 🔌 API Endpoints

NOVA includes a serverless chat API.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat` | Check API health and operating mode |
| POST | `/api/chat` | Process chat messages and return responses |

### Example request

```json
{
  "message": "Explain serverless computing.",
  "history": []
}
```

### Example response

```json
{
  "reply": "Serverless computing lets you run backend code without managing the servers yourself.",
  "mode": "demo"
}
```

## 🧠 Prompt Engineering

NOVA uses a centralized system prompt defined in `lib/prompt.js`.

The prompt establishes:

- Assistant identity and behaviour.
- Response style and clarity.
- Accuracy and uncertainty handling.
- Conversation context management.
- Safety and responsible AI guidelines.

Conversation history is validated and normalized before being passed to the response engine.

## ⚙️ Application Architecture

The application follows a modular architecture:

1. **Frontend:** Collects user messages and displays conversations.
2. **API Handler:** Validates incoming requests and coordinates response generation.
3. **Prompt Engine:** Defines assistant instructions and validates conversation context.
4. **LLM Client:** Handles the model-provider integration.
5. **Response Handler:** Returns the generated or demo response to the frontend.

The frontend communicates with the backend through the `/api/chat` endpoint. API credentials, when configured for an approved provider, remain on the server.

## 🔐 Security Practices

- Keep API credentials in server-side environment variables.
- Exclude local environment files from Git.
- Never expose API keys in frontend JavaScript.
- Validate messages and conversation history.
- Use safe DOM text insertion when displaying messages.
- Enforce message length and request-size limits.
- Handle API failures without exposing credentials.
- Keep local development files separate from public frontend assets.

## 🧪 Testing

NOVA uses the built-in Node.js test runner.

Run the automated test suite:

```bash
npm test
```

The backend test suite currently covers:

- API health checks.
- Valid chat requests.
- Empty message validation.
- Message length validation.
- Invalid JSON handling.
- Unsupported content types.
- Conversation history validation.

**Latest local test result:** 7 passed, 0 failed.

## 📌 Current Development Status

| Component | Status |
|---|---|
| Chat interface | Implemented |
| Responsive UI | Implemented |
| Conversation history | Implemented |
| LocalStorage persistence | Implemented |
| Suggested prompts | Implemented |
| Prompt engineering | Implemented |
| Serverless API handler | Implemented |
| Local demo response engine | Working |
| Automated backend tests | 7/7 passed |
| LLM provider configuration | Pending approved provider |
| Cloud deployment | Prepared, not yet verified |

The current application operates in demo mode by default. The LLM client is designed for provider integration, but a live external model connection has not yet been configured or verified.

## 🌱 Future Improvements

- Integration with an approved live LLM provider.
- Streaming AI responses.
- User authentication.
- Cloud-based conversation storage.
- Conversation export and download.
- Usage analytics and request monitoring.
- Improved API rate limiting.
- Additional model-provider adapters.

## 🎯 Learning Outcomes

This project demonstrates practical understanding of:

- Serverless application architecture.
- REST API development.
- JavaScript event handling and DOM manipulation.
- State management and browser storage.
- Prompt engineering and LLM integration architecture.
- Backend input validation and error handling.
- Environment-variable security.
- Automated backend testing.
- Cloud deployment preparation.

---

**NOVA — A space for ideas to become conversations.**