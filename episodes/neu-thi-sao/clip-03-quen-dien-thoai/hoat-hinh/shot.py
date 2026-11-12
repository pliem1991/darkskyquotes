import sys, json
from pathlib import Path
from playwright.sync_api import sync_playwright
H = Path(__file__).parent
ts = [float(x) for x in sys.argv[1].split(',')]
out = Path(sys.argv[2]) if len(sys.argv) > 2 else H/'tam'
out.mkdir(exist_ok=True, parents=True)
with sync_playwright() as p:
    try:
        b = p.chromium.launch()
    except Exception:
        b = p.chromium.launch(channel='chrome')
    pg = b.new_page(viewport={'width':1080,'height':1920})
    pg.on('console', lambda m: print('console', m.text))
    pg.on('pageerror', lambda e: print('ERR', e))
    pg.set_default_timeout(60000); pg.goto((H/"hf/index.html").as_uri(), wait_until="commit")
    pg.wait_for_timeout(3000)
    for t in ts:
        pg.evaluate(f'window.__timelines.main.seek({t}); 0')
        pg.screenshot(path=str(out/f'f_{t:06.2f}.png'))
    b.close()
