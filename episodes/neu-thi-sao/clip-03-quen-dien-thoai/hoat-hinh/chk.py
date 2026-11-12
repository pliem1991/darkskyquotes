import sys, json
from faster_whisper import WhisperModel
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=3)
for f in ["c3_duyen","c4_duyen","c5_duyen","c6_duyen","c1_duyen"]:
    for prompt in [None, "Ghé tiệm bánh mì, trong ví còn đúng mười ngàn, hai mươi lăm, Zalo, chịu thua, kể cả số của má"]:
        seg,_ = m.transcribe(f"audio/lines/{f}.wav", language="vi", beam_size=5, initial_prompt=prompt, condition_on_previous_text=False)
        print(f, "P" if prompt else "-", " ".join(s.text for s in seg).strip(), flush=True)
