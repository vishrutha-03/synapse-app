# Synapse

Synapse is an AI-powered study companion for BMS College of Engineering students. It turns pasted notes and uploaded study material into concise summaries and flashcard decks, then helps learners review them through quizzes while tracking progress and study streaks.

## Features

- BMSCE email sign-up with email OTP verification and JWT-based authentication
- AI-generated summaries and five question-and-answer flashcards from text
- OCR-powered image/document processing with EasyOCR
- Create, rename, edit, and delete decks and individual flashcards
- Flashcard and quiz review experiences with study-session analytics, accuracy, and streak tracking
- Light and dark themes across Android, iOS, and web

## Tech stack

| Layer | Technology |
| --- | --- |
| Client | Expo, React Native, Expo Router, TypeScript, Zustand |
| API | FastAPI, Uvicorn, JWT, Motor |
| Data | MongoDB |
| AI & OCR | Google Gemini 2.5 Flash, EasyOCR |
| Email | Brevo transactional email |

## Project structure

```text
frontend/  Expo application and UI components
backend/   FastAPI service, MongoDB models, AI and email integrations
```

## Run locally

### Backend

Requires Python 3.11+ and a running MongoDB instance.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create `backend/.env` with your service credentials:

```env
MONGODB_URI=mongodb://localhost:27017
GEMINI_API_KEY=your_gemini_key
GEMINI_API_KEY2=your_optional_backup_gemini_key
BREVO_API_KEY=your_brevo_key
```

The API will be available at `http://127.0.0.1:8000`, with interactive endpoint documentation at `/docs`.

### Frontend

Requires Node.js and npm.

```powershell
cd frontend
npm install
npx expo start
```

Use the Expo prompt to launch Android, iOS, or the web client. The app currently points to the deployed Synapse API; when working against a local backend, update the API URLs in the frontend to your reachable development-server address (use your machine's LAN IP for a physical device).

## API overview

- `POST /auth/signup`, `POST /auth/login` - account registration and sign-in
- `POST /otp/send`, `POST /otp/verify` - BMSCE email verification
- `POST /upload` - generate study material from pasted text or uploaded content
- `POST /ai/upload-images` - OCR an uploaded image and generate study material
- `GET|POST /decks/` and `GET|PATCH|DELETE /decks/{deck_id}` - deck management
- `PATCH|DELETE /decks/{deck_id}/cards/{card_id}` - flashcard management
- `GET /users/me/`, `POST /users/study-logs/` - learner analytics and review tracking

Most study and deck endpoints require an `Authorization: Bearer <token>` header.

## Deployment

The backend includes a Dockerfile configured to serve FastAPI on port `7860`, suitable for container-based deployments such as Hugging Face Spaces.

## Security note

Keep `.env` files and API keys out of source control. Before deploying beyond a development environment, replace the hard-coded JWT secret and restrict CORS origins.
