import sys
from pathlib import Path
from PIL import Image
d = Path(sys.argv[1]); out = sys.argv[2]; cols = int(sys.argv[3]); w = int(sys.argv[4])
fs = sorted(d.glob('f_*.png'))
h = int(w*16/9)
rows = (len(fs)+cols-1)//cols
im = Image.new('RGB', (cols*w, rows*h), 'white')
for i, f in enumerate(fs):
    im.paste(Image.open(f).convert('RGB').resize((w, h)), ((i % cols)*w, (i//cols)*h))
im.save(out, quality=88)
