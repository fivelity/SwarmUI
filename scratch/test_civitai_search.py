import urllib.request
import urllib.parse
import json

test_names = [
    "wet-pussy-2",
    "Krea2_GOTD_GAB_ASS_DOGGY_V01_-_v1-0",
    "MysticXXX",
    "amateur_style_v1_pony"
]

key = "359c342f371c00683bc3021e18576634"

for name in test_names:
    clean_q = name.replace("_", " ").replace("-", " ")
    q = urllib.parse.quote(clean_q)
    url = f"https://civitai.com/api/v1/models?query={q}&limit=2"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Authorization": f"Bearer {key}"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            print(f"Query: {name} (query='{clean_q}')")
            for item in data.get("items", []):
                print(f"  Model: [{item.get('id')}] {item.get('name')}")
                for v in item.get("modelVersions", [])[:2]:
                    print(f"    Version: [{v.get('id')}] {v.get('name')}")
                    for f in v.get("files", []):
                        print(f"      File: {f.get('name')}, size={f.get('sizeKB')}KB, dl={f.get('downloadUrl')}")
    except Exception as e:
        print(f"Query {name} failed: {e}")
