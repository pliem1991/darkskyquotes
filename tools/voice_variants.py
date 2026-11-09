"""Tạo 5 bản điều chỉnh của giọng Thiền Tâm Đức trên cùng một đoạn đọc."""
import subprocess
from pathlib import Path

import numpy as np
import vieneu

VOICE = "Thiền Tâm Đức"
TEXT = (
    "Ánh sao bạn nhìn thấy đêm nay, đã rời ngôi sao từ rất nhiều năm trước. "
    "Nó đi suốt quãng đường dài ấy trong im lặng, rồi mới chạm đến mắt bạn. "
    "Những điều bạn đang làm hôm nay, cũng vậy."
)
# Bản ngắt nhịp: mỗi cụm là (lời, số giây nghỉ sau đó).
PHRASES = [
    ("Ánh sao bạn nhìn thấy đêm nay,", 0.25),
    ("đã rời ngôi sao từ rất nhiều năm trước.", 0.55),
    ("Nó đi suốt quãng đường dài ấy trong im lặng,", 0.2),
    ("rồi mới chạm đến mắt bạn.", 0.8),
    ("Những điều bạn đang làm hôm nay,", 0.35),
    ("cũng vậy.", 0.0),
]

CLEAN = "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=3"
LOUD = "loudnorm=I=-14:TP=-1.5:LRA=9"

VARIANTS = [
    # tên file, mô tả, bộ lấy mẫu, chain FFmpeg
    ("A-nhanh-ro", {}, f"rubberband=tempo=1.12,{CLEAN},equalizer=f=3200:t=q:w=1:g=3,{LOUD}"),
    ("B-am-gan-mic", {}, f"rubberband=tempo=1.06:pitch=0.96,{CLEAN},equalizer=f=140:t=q:w=1:g=4,equalizer=f=3000:t=q:w=1:g=1.5,{LOUD}"),
    ("C-ngat-nhip", "phrases", f"rubberband=tempo=1.05,{CLEAN},equalizer=f=3000:t=q:w=1:g=2,{LOUD}"),
    ("D-nhieu-cam-xuc", {"temperature": 1.0, "top_k": 50}, f"rubberband=tempo=1.08,{CLEAN},equalizer=f=3000:t=q:w=1:g=2,{LOUD}"),
    ("E-ke-chuyen-dem", {"temperature": 0.9, "top_k": 35}, f"rubberband=tempo=1.04:pitch=0.97,{CLEAN},equalizer=f=160:t=q:w=1:g=3,aecho=0.8:0.5:45|85:0.12|0.07,{LOUD}"),
]

OUT = Path(__file__).resolve().parent.parent / "voices" / "thien-tam-duc"
OUT.mkdir(parents=True, exist_ok=True)

tts = vieneu.Vieneu()
voice = tts.get_preset_voice(VOICE)
sr = tts.sample_rate

for name, sampling, chain in VARIANTS:
    if sampling == "phrases":
        parts = []
        for text, pause in PHRASES:
            parts.append(tts.infer(text, voice=voice))
            parts.append(np.zeros(int(sr * pause), dtype=np.float32))
        audio = np.concatenate(parts)
    else:
        audio = tts.infer(TEXT, voice=voice, **sampling)
    wav = OUT / f"{name}.wav"
    tts.save(audio, wav)
    mp3 = wav.with_suffix(".mp3")
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-af", chain, "-ar", "48000", "-b:a", "160k", str(mp3)],
        check=True,
    )
    wav.unlink()
    print(name, flush=True)
