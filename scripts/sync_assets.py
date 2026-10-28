import concurrent.futures
import pathlib
import re
import shutil
import subprocess
import urllib.parse


ROOT = pathlib.Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ORIGIN = "https://lambdahumanoid.github.io/"
SOURCE_ORIGIN = "https://raw.githubusercontent.com/LambdaHumanoid/LambdaHumanoid.github.io/main/public/"
RESOURCE = re.compile(
    r"[\"'(`]((?:\./|/)?(?:figures|videos|motion|models|fonts)/"
    r"[^\s\"'<>`()*{}]+\.[a-zA-Z0-9]+(?:\?[^\s\"'<>`()*{}]*)?)"
)


def download(path):
    target = PUBLIC / path
    if target.is_file():
        return path
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = ROOT / ".cache" / "assets" / (path + ".part")
    temporary.parent.mkdir(parents=True, exist_ok=True)
    origin = ORIGIN if path == "videos/report-video.mp4" else SOURCE_ORIGIN
    url = origin + urllib.parse.quote(path, safe="/")
    if shutil.which("aria2c"):
        command = [
            "aria2c", "--allow-overwrite=true", "--auto-file-renaming=false",
            "--file-allocation=none", "--console-log-level=error", "--summary-interval=0",
            "--show-console-readout=false",
            "--http-accept-gzip=true",
            "--download-result=hide", "--split=8", "--max-connection-per-server=8",
            "--min-split-size=1M", "--connect-timeout=15", "--timeout=60",
            "--max-tries=4", "--retry-wait=2", "--dir=" + str(temporary.parent),
            "--out=" + temporary.name, url,
        ]
    else:
        command = [
            "curl", "--fail", "--location", "--silent", "--show-error", "--compressed",
            "--retry", "3", "--connect-timeout", "15", "--max-time", "600",
            url, "--output", str(temporary),
        ]
    result = subprocess.run(command)
    if result.returncode:
        print(f"FAILED: {path}", flush=True)
        return None
    temporary.replace(target)
    print(f"Downloaded: {path} ({target.stat().st_size:,} bytes)", flush=True)
    return path


if __name__ == "__main__":
    pending = {"favicon.png"}
    scanned = set()
    failed = set()
    documents = list((ROOT / "app").glob("*.tsx")) + list((ROOT / "app").glob("*.ts"))
    documents += list((ROOT / "app").glob("*.json")) + list((ROOT / "app").glob("*.svg"))
    documents += list(PUBLIC.rglob("*.json")) + list(PUBLIC.rglob("*.svg"))
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
        while documents or pending:
            for document in documents:
                text = document.read_text(encoding="utf-8")
                for resource in RESOURCE.findall(text):
                    path = urllib.parse.urlsplit(resource).path.removeprefix("./").lstrip("/")
                    if ".." not in pathlib.PurePosixPath(path).parts and path not in scanned:
                        pending.add(path)
                pending.update(f"figures/{name}.webp" for name in re.findall(r'<PaperFigure name="([^"]+)"', text))
                for clip in re.findall(r'recording\("([^"]+)"', text):
                    pending.update(f"videos/zero-transfer/{clip}.{extension}" for extension in ("jpg", "mp4"))
            if not scanned:
                for clip in ("basket", "close-drawer", "close-laptop", "open-fridge", "pull-curtain"):
                    for condition in ("human", "aligned", "unaligned"):
                        pending.update(f"videos/zero-transfer/{clip}-{condition}.{extension}" for extension in ("jpg", "mp4"))
                for clip in ("chair", "floor", "cart"):
                    pending.add(f"motion/{clip}.robot.json.gz")
            batch = sorted(pending - scanned, key=lambda path: (path.endswith(".mp4"), path))
            scanned.update(batch)
            pending.clear()
            documents = []
            for path, downloaded in zip(batch, executor.map(download, batch)):
                if downloaded is None:
                    failed.add(path)
                elif pathlib.Path(path).suffix in {".json", ".svg"}:
                    documents.append(PUBLIC / path)
    print(f"Assets checked: {len(scanned)}; failed: {len(failed)}", flush=True)
    if failed:
        print("Run npm run sync-assets again to retry failed downloads.")
        raise SystemExit(1)
