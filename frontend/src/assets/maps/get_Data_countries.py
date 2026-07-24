from pathlib import Path
import json

# Carpeta donde está este script
BASE_DIR = Path(__file__).resolve().parent

# Archivo GeoJSON
geojson_path = BASE_DIR / "countries.geojson"

with open(geojson_path, "r", encoding="utf-8") as f:
    geo = json.load(f)

countries = sorted({
    feature["properties"]["name"]
    for feature in geo["features"]
    if feature.get("properties", {}).get("name")
})
