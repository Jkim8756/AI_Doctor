import json
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ollama import chat
from pydantic import BaseModel
from supabase import Client, create_client

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
AI_UID = os.getenv("SUPABASE_AI_UID")

SYSTEM_PROMPT = (
    "You are an educational health assistant. Do not diagnose or claim certainty. "
    "Explain possibilities in plain language, ask useful clarifying questions, "
    "and recommend urgent medical care for red-flag symptoms."
)

app = FastAPI(title="AI Doctor Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None
    selected_body_part: Optional[str] = None


class LatestSessionRequest(BaseModel):
    session_id: int
    selected_body_part: Optional[str] = None


def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY or not AI_UID:
        raise HTTPException(status_code=500, detail="Supabase env vars are missing.")

    return create_client(SUPABASE_URL, SUPABASE_KEY)


def latest_user_message(supabase: Client, request: LatestSessionRequest) -> Optional[dict]:
    response = (
        supabase.table("chat")
        .select("created_at, user_id, sender_id, sender_type, receiver_id, chat_id, message, session_id, isUser")
        .eq("session_id", request.session_id)
        .eq("sender_type", "user")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else None


def latest_ai_message(supabase: Client, request: LatestSessionRequest) -> Optional[dict]:
    response = (
        supabase.table("chat")
        .select("created_at, user_id, sender_id, sender_type, receiver_id, chat_id, message, session_id, isUser")
        .eq("sender_id", AI_UID)
        .eq("session_id", request.session_id)
        .eq("sender_type", "assistant")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else None


def insert_ai_message(
    supabase: Client,
    request: LatestSessionRequest,
    message: str,
) -> dict:
    response = (
        supabase.table("chat")
        .insert(
            {
                "user_id": AI_UID,
                "sender_id": AI_UID,
                "sender_type": "assistant",
                "session_id": request.session_id,
                "isUser": False,
                "message": message,
            }
        )
        .select("created_at, user_id, sender_id, sender_type, receiver_id, chat_id, message, session_id, isUser")
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=500, detail="AI message was not inserted.")

    return response.data[0]


def build_messages(request: ChatRequest) -> list[dict[str, str]]:
    user_message = request.message

    if request.selected_body_part:
        user_message = (
            f"Selected body area: {request.selected_body_part}\n\n"
            f"User message: {request.message}"
        )

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok", "model": OLLAMA_MODEL}


@app.post("/chat/respond")
def respond(request: ChatRequest) -> dict[str, str]:
    response = chat(
        model=OLLAMA_MODEL,
        messages=build_messages(request),
        stream=False,
    )

    return {"message": response["message"]["content"]}


@app.post("/chat/respond-latest")
def respond_to_latest_message(request: LatestSessionRequest) -> dict:
    try:
        supabase = get_supabase()
        user_message = latest_user_message(supabase, request)

        if not user_message:
            raise HTTPException(status_code=404, detail={
            "message": "No user message found for this session.",
            "session_id": request.session_id,
        },)

        existing_ai_message = latest_ai_message(supabase, request)
        if existing_ai_message and existing_ai_message["created_at"] > user_message["created_at"]:
            return {
                "status": "already_responded",
                "source_message": user_message,
                "ai_message": existing_ai_message,
            }

        response = chat(
            model=OLLAMA_MODEL,
            messages=build_messages(
                ChatRequest(
                    message=user_message["message"],
                    session_id=request.session_id,
                    selected_body_part=request.selected_body_part,
                )
            ),
            stream=False,
        )

        ai_message_text = response["message"]["content"].strip()
        ai_message = insert_ai_message(supabase, request, ai_message_text)

        return {
            "status": "created",
            "source_message": user_message,
            "ai_message": ai_message,
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@app.post("/chat/stream")
def stream_response(request: ChatRequest) -> StreamingResponse:
    def event_stream():
        stream = chat(
            model=OLLAMA_MODEL,
            messages=build_messages(request),
            stream=True,
        )

        for chunk in stream:
            content = chunk["message"]["content"]
            if content:
                yield f"data: {json.dumps({'content': content})}\n\n"

        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
