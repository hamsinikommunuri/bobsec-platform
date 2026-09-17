# Generator for all dataset sources
import json
from pathlib import Path

OUT_DIR = Path('ml/src/dataset_sources')
OUT_DIR.mkdir(parents=True, exist_ok=True)
print('OUT_DIR ready:', OUT_DIR.resolve())
