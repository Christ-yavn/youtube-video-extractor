import json

with open('src/data/harvested_videos.json', 'r', encoding='utf-8') as f:
    vids = json.load(f)

seen = set()
unique_vids = []
for v in vids:
    if v['video_id'] not in seen:
        seen.add(v['video_id'])
        unique_vids.append(v)

print(f"Total unique: {len(unique_vids)}")
for i, v in enumerate(unique_vids):
    dur = f"{v['duree_s']//60:02d}:{v['duree_s']%60:02d}"
    print(f"{i+1:3d}. [{v['video_id']}] ({dur}) {v['titre']}")
