"""
Launcher script for RadarQuest Search Engine.
Runs the FastAPI server with Uvicorn.
"""
import os
import sys
import uvicorn

# Configure stdout for utf-8 on Windows/Linux
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print("\n" + "=" * 65)
    print(f"RadarQuest Search Engine is running on {host}:{port}")
    print("=" * 65 + "\n")
    uvicorn.run("app:app", host=host, port=port, reload=False)
