#!/usr/bin/env python3
"""Generate a lightweight, seamless motion background for the hero section."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
VIDEO_PATH = PUBLIC_DIR / "shopify-operations-loop.mp4"
POSTER_PATH = PUBLIC_DIR / "shopify-operations-poster.webp"

WIDTH = 960
HEIGHT = 540
FPS = 24
DURATION_SECONDS = 8
FRAME_COUNT = FPS * DURATION_SECONDS

SIGNAL = (199, 255, 74)


def build_static_grid() -> Image.Image:
    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid)

    for x in range(0, WIDTH + 1, 60):
        draw.line((x, 0, x, HEIGHT), fill=(255, 255, 255, 8), width=1)
    for y in range(0, HEIGHT + 1, 60):
        draw.line((0, y, WIDTH, y), fill=(255, 255, 255, 7), width=1)

    draw.rectangle(
        (WIDTH * 0.49, HEIGHT * 0.14, WIDTH * 0.92, HEIGHT * 0.84),
        outline=(255, 255, 255, 10),
        width=1,
    )
    return grid


def base_frame(phase: float) -> Image.Image:
    y, x = np.mgrid[0:HEIGHT, 0:WIDTH]
    xn = x / WIDTH
    yn = y / HEIGHT

    base = 2.5 + 5.5 * (1 - yn)
    core_x = 0.72 + 0.035 * math.cos(phase)
    core_y = 0.46 + 0.045 * math.sin(phase)
    glow = np.exp(
        -(
            ((xn - core_x) ** 2) / (2 * 0.21**2)
            + ((yn - core_y) ** 2) / (2 * 0.31**2)
        )
    )
    secondary = np.exp(
        -(
            ((xn - (0.86 - 0.04 * math.sin(phase))) ** 2) / (2 * 0.12**2)
            + ((yn - (0.76 + 0.025 * math.cos(phase))) ** 2) / (2 * 0.16**2)
        )
    )

    vignette = np.clip(
        1 - 0.74 * ((xn - 0.54) ** 2 + (yn - 0.50) ** 2), 0.38, 1
    )

    frame = np.empty((HEIGHT, WIDTH, 3), dtype=np.float32)
    frame[..., 0] = base + glow * 20 + secondary * 9
    frame[..., 1] = base + glow * 36 + secondary * 17
    frame[..., 2] = base + glow * 8 + secondary * 4
    frame *= vignette[..., None]

    noise = (
        np.sin(x * 0.071 + phase * 2)
        + np.sin(y * 0.093 - phase * 2)
        + np.sin((x + y) * 0.039 + phase)
    ) * 0.58
    frame += noise[..., None]

    return Image.fromarray(np.uint8(np.clip(frame, 0, 255)), mode="RGB").convert(
        "RGBA"
    )


def rail_y(x: float, track: int, phase: float) -> float:
    bases = (176, 270, 364)
    return bases[track] + 11 * math.sin((x / 145) + phase + track * 0.85)


def draw_motion(frame: Image.Image, phase: float) -> Image.Image:
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    scan_x = int(((phase / (2 * math.pi)) % 1) * (WIDTH + 280) - 140)
    scan = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    scan_draw = ImageDraw.Draw(scan)
    scan_draw.rectangle(
        (scan_x - 45, 0, scan_x + 45, HEIGHT), fill=(*SIGNAL, 9)
    )
    scan = scan.filter(ImageFilter.GaussianBlur(38))
    frame = Image.alpha_composite(frame, scan)

    for track in range(3):
        points = [
            (x, rail_y(x, track, phase * (0.32 + track * 0.05)))
            for x in range(310, WIDTH + 30, 12)
        ]
        draw.line(points, fill=(*SIGNAL, 33), width=1)

        for pulse in range(5):
            progress = (
                phase / (2 * math.pi) + pulse / 5 + track * 0.11
            ) % 1
            px = 310 + progress * (WIDTH - 290)
            py = rail_y(px, track, phase * (0.32 + track * 0.05))

            halo = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            halo_draw = ImageDraw.Draw(halo)
            halo_draw.ellipse(
                (px - 13, py - 13, px + 13, py + 13),
                fill=(*SIGNAL, 52),
            )
            halo = halo.filter(ImageFilter.GaussianBlur(9))
            overlay = Image.alpha_composite(overlay, halo)
            draw = ImageDraw.Draw(overlay)
            draw.ellipse((px - 2, py - 2, px + 2, py + 2), fill=(*SIGNAL, 205))

    core_x = int(WIDTH * 0.72)
    core_y = int(HEIGHT * 0.46)
    rotation = int(math.degrees(phase))

    for radius, alpha, width, offset in (
        (96, 38, 1, 0),
        (71, 72, 2, 116),
        (47, 110, 2, 218),
    ):
        draw.arc(
            (core_x - radius, core_y - radius, core_x + radius, core_y + radius),
            start=rotation + offset,
            end=rotation + offset + 112,
            fill=(*SIGNAL, alpha),
            width=width,
        )
        draw.arc(
            (core_x - radius, core_y - radius, core_x + radius, core_y + radius),
            start=rotation + offset + 180,
            end=rotation + offset + 248,
            fill=(255, 255, 255, max(10, alpha // 2)),
            width=1,
        )

    node_positions = (
        (0.54, 0.25),
        (0.88, 0.29),
        (0.92, 0.67),
        (0.57, 0.72),
    )
    for index, (nx, ny) in enumerate(node_positions):
        x = int(nx * WIDTH)
        y = int(ny * HEIGHT)
        pulse = 0.5 + 0.5 * math.sin(phase + index * math.pi / 2)
        draw.line((x, y, core_x, core_y), fill=(255, 255, 255, 16), width=1)
        draw.ellipse(
            (x - 8, y - 8, x + 8, y + 8),
            outline=(*SIGNAL, int(55 + pulse * 90)),
            width=1,
        )
        draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(*SIGNAL, 210))

    draw.rounded_rectangle(
        (core_x - 33, core_y - 18, core_x + 33, core_y + 18),
        radius=18,
        fill=(5, 5, 5, 205),
        outline=(*SIGNAL, 96),
        width=1,
    )
    draw.ellipse(
        (core_x - 4, core_y - 4, core_x + 4, core_y + 4),
        fill=(*SIGNAL, 235),
    )

    return Image.alpha_composite(frame, overlay).convert("RGB")


def generate() -> None:
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    grid = build_static_grid()

    command = [
        "ffmpeg",
        "-y",
        "-loglevel",
        "error",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "25",
        "-pix_fmt",
        "yuv420p",
        "-g",
        str(FPS * 2),
        "-movflags",
        "+faststart",
        VIDEO_PATH.as_posix(),
    ]

    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None

    for index in range(FRAME_COUNT):
        phase = 2 * math.pi * index / FRAME_COUNT
        frame = base_frame(phase)
        frame = Image.alpha_composite(frame, grid)
        frame = draw_motion(frame, phase)

        if index == 0:
            frame.save(POSTER_PATH, "WEBP", quality=86, method=6)

        process.stdin.write(np.asarray(frame, dtype=np.uint8).tobytes())

    process.stdin.close()
    return_code = process.wait()
    if return_code:
        raise SystemExit(return_code)

    print(f"Generated {VIDEO_PATH.relative_to(ROOT)}")
    print(f"Generated {POSTER_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    generate()
