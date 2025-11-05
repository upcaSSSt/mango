from glob import glob
from pathlib import Path

from PIL import Image

paths = [Path(path) for path in sorted(glob('*.png') + glob('*.jpg') + glob('*.gif'))]

for i in range(len(paths)):
    print(paths[i].stem)
    if paths[i].suffix == '.png':
        with Image.open(paths[i]) as img:
            img.convert('RGB').save(f'{i + 1}.jpg', 'JPEG')
            paths[i].unlink()
    elif paths[i].suffix == '.jpg' or paths[i].suffix == '.gif':
        paths[i].rename(f'{i + 1}{paths[i].suffix}')

