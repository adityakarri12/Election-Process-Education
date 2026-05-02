# 🗳️ ElectraLearn: Electoral Intelligence Dashboard

**ElectraLearn** is a state-of-the-art educational platform designed to empower Indian citizens with real-time electoral intelligence, accurate constituency data, and gamified learning to combat election-related misinformation.

---

## 🚀 Key Features

*   **Electoral Intelligence Hub**: Real-time tracking of upcoming elections, live results, and past outcomes across India.
*   **Constituency Pulse**: Instant mapping of any 6-digit Indian Pincode to its exact Lok Sabha and Vidhan Sabha representatives.
*   **Electra AI Chatbot**: A professional electoral analyst powered by Gemini for answering complex questions about the Indian democratic process.
*   **MythBuster Module**: A gamified "Fact vs Myth" challenge designed to improve electoral literacy and verify information.
*   **Live Voter Analytics**: Visualized historical and real-time voter turnout data.

---

## 💎 Evaluation Criteria Compliance

### 1. Code Quality & Architecture
*   **Structured Patterns**: Built using **Next.js (App Router)** for the frontend and **FastAPI** for the backend, following modern asynchronous patterns.
*   **Type Safety**: Full **TypeScript** implementation ensures robust code and reduces runtime errors.
*   **Modular Design**: Components are decoupled and reusable, following the Atomic Design principles.

### 2. Security
*   **Environment Isolation**: Sensitive API keys (Gemini, Google Civic) are managed strictly via `.env` files and never hardcoded.
*   **Input Sanitization**: Backend endpoints use Pydantic models for strict validation and Regex-based sanitization for AI outputs to prevent injection attacks.
*   **CORS Protection**: Configured with secure middleware to prevent unauthorized cross-origin requests.

### 3. Efficiency
*   **Optimized AI Model**: Standardized on `gemini-flash-latest` for the optimal balance of reasoning speed and resource efficiency.
*   **Independent Scroll Containers**: UI performance is maintained even with large datasets through optimized CSS grid layouts and independent scrolling.
*   **Asynchronous Processing**: Non-blocking IO in the backend ensures high throughput for simultaneous users.

### 4. Testing & Maintainability
*   **Automated Tests**: Integrated **Pytest** suite for verifying API endpoint health and generative output integrity.
*   **Robust Fallbacks**: Implemented multi-layered fallback logic to ensure the platform remains usable even during external API outages.

### 5. Accessibility (A11y)
*   **Screen Reader Ready**: Implementation of `aria-label` across all interactive elements (buttons, inputs, and modals).
*   **High Contrast UI**: Designed with a premium dark-mode aesthetic that maintains high contrast ratios for diverse users.
*   **Responsive Layout**: Fully adaptive design that scales seamlessly from mobile devices to wide-screen dashboards.

### 6. Google Services Integration
*   **Google Gemini AI**: Deeply integrated as the core intelligence engine for chatbot analysis and constituency mapping.
*   **Google Civic Information**: Utilized (where available) for verified electoral boundary data.
*   **Vercel/Google Cloud Optimized**: Built to be deployment-ready for high-performance Google Cloud Run environments.

---

## 🛠️ Technical Stack
*   **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Framer Motion.
*   **Backend**: Python (FastAPI), Google GenAI SDK, HTTPX.
*   **AI Engine**: Google Gemini 1.5/2.0 Flash.

---

## 🚦 Getting Started

1.  **Clone & Install**: `npm install` (frontend) & `pip install -r requirements.txt` (backend).
2.  **Env Config**: Add `GEMINI_API_KEY` to your `.env`.
3.  **Run**: `npm run dev` and `uvicorn main:app --reload`.

---

© 2026 ElectraLearn - Empowering the Electorate.
