#!/usr/bin/env python3
"""
IST Auto — add-listings.py

Reads OLX listing URLs from `listings.txt`, fetches each page, parses Open Graph
meta tags (the same tags WhatsApp uses for link previews), downloads each car's
photo into `assets/img/listings/`, and writes `assets/data/listings.json`.

Usage:
    python3 add-listings.py

After a successful run, refresh the website — the cards update from the new JSON.

This script is the local equivalent of the GitHub Action that will eventually
run on a 6-hour schedule. The output (`listings.json` + downloaded images) is
identical regardless of where the script runs.
"""

import json
import os
import re
import sys
import urllib.request
import urllib.parse
import urllib.error
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LISTINGS_TXT = ROOT / "listings.txt"
JSON_OUT = ROOT / "assets" / "data" / "listings.json"
IMG_DIR = ROOT / "assets" / "img" / "listings"

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

OG_TAG_RE = re.compile(
    r'<meta[^>]+property=["\']og:(title|description|image)["\'][^>]+content=["\']([^"\']*)["\']',
    re.IGNORECASE,
)

JSON_LD_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.+?)</script>',
    re.IGNORECASE | re.DOTALL,
)

CURRENCY_SYMBOL = {"EUR": "€", "RON": "lei", "USD": "$"}


def read_urls(path):
    if not path.exists():
        return []
    urls = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if not line.startswith("http"):
            print(f"  ! skipping non-URL line: {line}", file=sys.stderr)
            continue
        urls.append(line)
    return urls


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ro,en;q=0.8"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()
        if binary:
            return data
        charset = resp.headers.get_content_charset() or "utf-8"
        return data.decode(charset, errors="replace")


def parse_og(html):
    out = {}
    for m in OG_TAG_RE.finditer(html):
        key = m.group(1).lower()
        val = unescape(m.group(2)).strip()
        if val and key not in out:
            out[key] = val
    return out


def parse_json_ld(html):
    """Find the first JSON-LD block whose @type is Vehicle/Product/Offer."""
    for m in JSON_LD_RE.finditer(html):
        try:
            obj = json.loads(m.group(1).strip())
        except Exception:
            continue
        if isinstance(obj, dict) and obj.get("@type") in ("Vehicle", "Product", "Car"):
            return obj
    return None


def clean_title(t):
    # OLX appends " • OLX.ro" / " - OLX.ro" to og:title — drop it.
    t = re.sub(r"\s*[•\-–|]\s*OLX(\.ro)?\s*$", "", t, flags=re.IGNORECASE).strip()
    return t


def build_description(og_desc, ld, html):
    """Compose a short subtitle: price first, then km / location if available.
    Falls back to og:description, then to a price scraped from visible HTML."""
    price_str = None
    km_str = None
    location = None

    if ld:
        offers = ld.get("offers") or {}
        if isinstance(offers, list) and offers:
            offers = offers[0]
        if isinstance(offers, dict):
            price = offers.get("price")
            cur = offers.get("priceCurrency") or offers.get("priceCurrencyCode") or ""
            if price:
                try:
                    n = int(float(price))
                    pretty = f"{n:,}".replace(",", " ")
                    sym = CURRENCY_SYMBOL.get(cur.upper(), cur)
                    price_str = f"{pretty} {sym}".strip()
                except (TypeError, ValueError):
                    pass
            area = offers.get("areaServed")
            if isinstance(area, dict):
                location = area.get("name")
        # mileage may live at top level
        for key in ("mileageFromOdometer", "vehicleMileage"):
            val = ld.get(key)
            if isinstance(val, dict):
                v = val.get("value")
                if v:
                    try:
                        km_str = f"{int(float(v)):,}".replace(",", " ") + " km"
                    except (TypeError, ValueError):
                        pass

    # Fall back to scanning visible HTML for the first "1 234 €" / "12 345 EUR" hit
    if not price_str:
        m = re.search(r"(\d[\d\s.]*\d)\s*(€|EUR|lei|RON)", html)
        if m:
            price_str = m.group(1).strip() + " " + (CURRENCY_SYMBOL.get(m.group(2).upper(), m.group(2)))

    parts = [p for p in (price_str, km_str, location) if p]
    if parts:
        return " · ".join(parts)
    return (og_desc or "").strip()


def slug_from_url(url):
    path = urllib.parse.urlparse(url).path.strip("/")
    last = path.split("/")[-1]
    last = re.sub(r"\.html?$", "", last, flags=re.IGNORECASE)
    last = re.sub(r"[^a-zA-Z0-9._-]", "-", last)
    last = re.sub(r"-+", "-", last).strip("-")
    return last[:80] or "listing"


def download_image(img_url, dest):
    data = fetch(img_url, binary=True)
    dest.write_bytes(data)
    return dest


def main():
    urls = read_urls(LISTINGS_TXT)
    if not urls:
        print(f"No URLs found in {LISTINGS_TXT.name}.")
        print("Add one OLX listing URL per line, then run this script again.")
        # Still write an empty list so the site falls back gracefully.
        JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
        JSON_OUT.write_text("[]\n", encoding="utf-8")
        return 0

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)

    entries = []
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] {url}")
        try:
            html = fetch(url)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            print(f"  ! fetch failed ({e}) — skipping")
            continue

        og = parse_og(html)
        if not og.get("title") or not og.get("image"):
            print("  ! missing og:title or og:image — skipping")
            continue

        ld = parse_json_ld(html)
        title = clean_title(og["title"])
        description = build_description(og.get("description", ""), ld, html)

        slug = slug_from_url(url)
        ext = ".jpg"
        m = re.search(r"\.(jpg|jpeg|png|webp)(?:\?|$)", og["image"], re.IGNORECASE)
        if m:
            ext = "." + m.group(1).lower()
        photo_path = IMG_DIR / f"{slug}{ext}"
        try:
            download_image(og["image"], photo_path)
        except Exception as e:
            print(f"  ! image download failed ({e}) — skipping")
            continue

        entries.append({
            "title": title,
            "description": description,
            "photo": f"assets/img/listings/{photo_path.name}",
            "url": url,
        })
        print(f"  ok — {title[:60]}  |  {description[:40]}")

    JSON_OUT.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nWrote {len(entries)} entr{'y' if len(entries) == 1 else 'ies'} to {JSON_OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
