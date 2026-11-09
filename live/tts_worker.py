"""Giữ VieNeu trong bộ nhớ, nhận từng câu qua stdin và ghi ra mp3 theo voice_config.json."""
import json
import subprocess
import sys
from pathlib import Path

import vieneu

CONFIG = json.loads((Path(__file__).resolve().parent.parent / "voices" / "voice_config.json").read_text(encoding="utf-8"))


def reply(**msg):
    print("@@" + json.dumps(msg, ensure_ascii=False), flush=True)


tts = vieneu.Vieneu()
voice = tts.get_preset_voice(CONFIG["voice"])
reply(ready=True)

for line in sys.stdin:
    job = json.loads(line)
    try:
        out = Path(job["out"])
        wav = out.with_suffix(".wav")
        tts.save(tts.infer(job["text"], voice=voice, **CONFIG["infer"]), wav)
        subprocess.run(
            ["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-af", CONFIG["ffmpeg_af"], "-ar", "48000", "-b:a", "160k", str(out)],
            check=True,
        )
        wav.unlink()
        reply(id=job["id"])
    except Exception as err:
        reply(id=job["id"], error=str(err))
