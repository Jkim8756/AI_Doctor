# AI Doctor Backend

Backend workspace for generating and serving 3D body model assets.

## Mesh Export Pipeline

The first backend task is to generate a static `.glb` human body model that the frontend can load with Three.js or React Three Fiber.

This uses Anny's default topology, not the optional `smplx` topology.

## Setup

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run API Server

Make sure Ollama is running first.

```powershell
cd Backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:

```text
http://localhost:8000
```

To generate and store an AI response for the latest user message in a session, call:

```text
POST /chat/respond-latest
```

Request body:

```json
{
  "user_id": "user uuid",
  "session_id": 1,
  "selected_body_part": "Head"
}
```

Set the Ollama model in `.env` if needed:

```env
OLLAMA_MODEL=qwen3.6
```

The response-ingestion endpoint also needs Supabase credentials in `Backend/.env`:

```env
SUPABASE_URL=...
SUPABASE_KEY=...
```

Use backend-only credentials here. Do not put service-role keys in the frontend.

If you want to use the lighter test model instead:

```powershell
ollama pull qwen2.5:0.5b
```

## Export Default Body Model

```powershell
python .\scripts\export_anny_body.py --output .\generated_models\anny_default_body.glb
```

The generated file should later be copied or served to the frontend as a static asset.
