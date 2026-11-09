"""Tạo mẫu giọng VieNeu khoảng 10 giây để chọn giọng cho kênh."""
import subprocess
import time
from pathlib import Path

import vieneu

TEXT = (
    "Ánh sao bạn nhìn thấy đêm nay, đã rời ngôi sao từ rất nhiều năm trước. "
    "Nó đi suốt quãng đường dài ấy trong im lặng, rồi mới chạm đến mắt bạn. "
    "Những điều bạn đang làm hôm nay, cũng vậy."
)

VOICES = [
    "Thiện Minh",
    "Thanh Bình",
    "Thiền Tâm Đức",
    "Thái Sơn",
    "Đức Trí",
    "Ngọc Linh",
    "Quỳnh Anh",
    "Thục Đoan",
    "Kim Thanh",
    "Mỹ Duyên",
]

OUT = Path(__file__).resolve().parent.parent / "voices" / "samples"
OUT.mkdir(parents=True, exist_ok=True)

tts = vieneu.Vieneu()
for i, name in enumerate(VOICES, 1):
    start = time.time()
    audio = tts.infer(TEXT, voice=tts.get_preset_voice(name))
    wav = OUT / f"{i:02d}-{name}.wav"
    tts.save(audio, wav)
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(wav), "-b:a", "128k", str(wav.with_suffix(".mp3"))],
        check=True,
    )
    wav.unlink()
    print(f"{name}: {len(audio) / tts.sample_rate:.1f}s audio, {time.time() - start:.0f}s render", flush=True)
