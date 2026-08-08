#!/usr/bin/env python3
"""Generate the Westmonks lead magnet and keep its final size at 1.5 MB."""

from __future__ import annotations

import io
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
TMP_DIR = ROOT / "tmp" / "pdfs"
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public"
ASSETS_DIR = ROOT / "assets"
BASE_PDF = TMP_DIR / "automatisierungs-blueprint-base.pdf"
FINAL_PDF = OUTPUT_DIR / "automatisierungs-blueprint.pdf"
TARGET_BYTES = 1_500_000
CHUNK_BYTES = 500_000

PAGE_W, PAGE_H = A4
MARGIN = 48

BLACK = HexColor("#070707")
PAPER = HexColor("#F1F1EA")
WHITE = HexColor("#FFFFFF")
SIGNAL = HexColor("#C7FF4A")
ZINC_200 = HexColor("#E4E4E7")
ZINC_300 = HexColor("#D4D4D8")
ZINC_400 = HexColor("#A1A1AA")
ZINC_500 = HexColor("#71717A")
ZINC_600 = HexColor("#52525B")
ZINC_800 = HexColor("#27272A")
GRID = Color(1, 1, 1, alpha=0.06)


def register_fonts() -> tuple[str, str, str]:
    regular_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    bold_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
    mono_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf")
    if regular_path.exists() and bold_path.exists() and mono_path.exists():
        pdfmetrics.registerFont(TTFont("WM-Regular", regular_path.as_posix()))
        pdfmetrics.registerFont(TTFont("WM-Bold", bold_path.as_posix()))
        pdfmetrics.registerFont(TTFont("WM-Mono", mono_path.as_posix()))
        return "WM-Regular", "WM-Bold", "WM-Mono"
    return "Helvetica", "Helvetica-Bold", "Courier"


FONT_REGULAR, FONT_BOLD, FONT_MONO = register_fonts()


def wrap_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if pdfmetrics.stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font: str = FONT_REGULAR,
    size: float = 10,
    leading: float = 15,
    color=ZINC_400,
    max_lines: int | None = None,
) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap_lines(text, font, size, max_width)
    if max_lines is not None:
        lines = lines[:max_lines]
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_grid(c: canvas.Canvas, dark: bool = True) -> None:
    c.saveState()
    c.setStrokeColor(GRID if dark else Color(0, 0, 0, alpha=0.055))
    c.setLineWidth(0.35)
    step = 42
    x = 0
    while x <= PAGE_W:
        c.line(x, 0, x, PAGE_H)
        x += step
    y = 0
    while y <= PAGE_H:
        c.line(0, y, PAGE_W, y)
        y += step
    c.restoreState()


def draw_footer(c: canvas.Canvas, page: int, label: str = "FIELD GUIDE 01") -> None:
    c.setStrokeColor(Color(1, 1, 1, alpha=0.13))
    c.setLineWidth(0.5)
    c.line(MARGIN, 38, PAGE_W - MARGIN, 38)
    c.setFont(FONT_MONO, 6.5)
    c.setFillColor(ZINC_600)
    c.drawString(MARGIN, 23, f"WESTMONKS / {label}")
    c.drawRightString(PAGE_W - MARGIN, 23, f"{page:02d} / 12")


def page_start(c: canvas.Canvas, page: int, kicker: str, title: str, subtitle: str) -> float:
    c.setFillColor(BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_grid(c, dark=True)
    c.setFillColor(SIGNAL)
    c.circle(MARGIN + 4, PAGE_H - 50, 4, fill=1, stroke=0)
    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN + 18, PAGE_H - 53, kicker.upper())
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 53, "AUTOMATION BLUEPRINT / 2026")

    y = PAGE_H - 115
    c.setFont(FONT_BOLD, 26)
    c.setFillColor(WHITE)
    for line in wrap_lines(title, FONT_BOLD, 26, PAGE_W - 2 * MARGIN):
        c.drawString(MARGIN, y, line)
        y -= 33
    y -= 6
    y = draw_wrapped(
        c,
        subtitle,
        MARGIN,
        y,
        PAGE_W - 2 * MARGIN,
        size=10.5,
        leading=16,
        color=ZINC_400,
    )
    draw_footer(c, page)
    return y - 28


def rounded_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    fill=ZINC_800,
    stroke=Color(1, 1, 1, alpha=0.12),
    radius: float = 12,
) -> None:
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.6)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def badge(c: canvas.Canvas, text: str, x: float, y: float, light: bool = False) -> None:
    width = pdfmetrics.stringWidth(text.upper(), FONT_MONO, 6.5) + 20
    c.setFillColor(BLACK if light else Color(0.78, 1, 0.29, alpha=0.1))
    c.setStrokeColor(BLACK if light else Color(0.78, 1, 0.29, alpha=0.4))
    c.roundRect(x, y - 3, width, 19, 9.5, fill=1, stroke=1)
    c.setFont(FONT_MONO, 6.5)
    c.setFillColor(SIGNAL)
    c.drawString(x + 10, y + 3, text.upper())


def draw_number_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    number: str,
    title: str,
    copy: str,
) -> None:
    rounded_card(c, x, y, w, h, fill=HexColor("#101012"))
    c.setFont(FONT_MONO, 7)
    c.setFillColor(SIGNAL)
    c.drawString(x + 18, y + h - 24, number)
    c.setFont(FONT_BOLD, 12)
    c.setFillColor(WHITE)
    c.drawString(x + 18, y + h - 50, title)
    draw_wrapped(
        c,
        copy,
        x + 18,
        y + h - 72,
        w - 36,
        size=8.2,
        leading=12.5,
        color=ZINC_400,
    )


def cover_page(c: canvas.Canvas) -> None:
    c.setFillColor(BLACK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_grid(c)
    c.setFillColor(Color(0.78, 1, 0.29, alpha=0.08))
    c.circle(PAGE_W * 0.76, PAGE_H * 0.71, 150, fill=1, stroke=0)

    c.setFillColor(SIGNAL)
    c.circle(MARGIN + 4, PAGE_H - 50, 4, fill=1, stroke=0)
    c.setFont(FONT_BOLD, 10)
    c.setFillColor(WHITE)
    c.drawString(MARGIN + 18, PAGE_H - 54, "WESTMONKS")
    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_500)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 53, "FIELD GUIDE 01 / 2026")

    badge(c, "12 Seiten / 1.5 MB", MARGIN, PAGE_H - 176)
    c.setFillColor(WHITE)
    c.setFont(FONT_BOLD, 38)
    c.drawString(MARGIN, PAGE_H - 245, "Der Automatisierungs-")
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN, PAGE_H - 290, "Blueprint.")
    draw_wrapped(
        c,
        "Vom manuellen Shopify-Chaos zum kontrollierten Operations-System.",
        MARGIN,
        PAGE_H - 334,
        395,
        font=FONT_REGULAR,
        size=13,
        leading=20,
        color=ZINC_400,
    )

    c.setFillColor(Color(1, 1, 1, alpha=0.04))
    c.roundRect(MARGIN, 90, PAGE_W - 2 * MARGIN, 180, 16, fill=1, stroke=0)
    labels = [
        ("01", "Audit", "Manuelle Arbeit sichtbar machen"),
        ("02", "Architektur", "Shopify-Systeme sauber verbinden"),
        ("03", "Build", "Workflows kontrolliert ausrollen"),
    ]
    col_w = (PAGE_W - 2 * MARGIN) / 3
    for index, (number, title, copy) in enumerate(labels):
        x = MARGIN + index * col_w + 18
        if index:
            c.setStrokeColor(Color(1, 1, 1, alpha=0.1))
            c.line(MARGIN + index * col_w, 112, MARGIN + index * col_w, 248)
        c.setFont(FONT_MONO, 7)
        c.setFillColor(SIGNAL)
        c.drawString(x, 224, number)
        c.setFont(FONT_BOLD, 11)
        c.setFillColor(WHITE)
        c.drawString(x, 194, title)
        draw_wrapped(c, copy, x, 168, col_w - 32, size=8, leading=12, color=ZINC_500)
    draw_footer(c, 1)
    c.showPage()


def audit_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        2,
        "01 / Diagnose",
        "Der 15-Minuten Engpass-Audit",
        "Bewerte jeden Prozess nicht nach Gefühl, sondern nach Zeitverlust, Fehlerkosten und Umsatzwirkung.",
    )
    headers = ["Prozess", "Std./Woche", "Fehlerrisiko", "Umsatzhebel"]
    widths = [210, 92, 100, 100]
    x = MARGIN
    c.setFillColor(SIGNAL)
    c.roundRect(MARGIN, y - 20, PAGE_W - 2 * MARGIN, 31, 8, fill=1, stroke=0)
    for header, width in zip(headers, widths):
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(BLACK)
        c.drawString(x + 10, y - 8, header.upper())
        x += width

    rows = [
        ("Rechnungen erstellen", "3-6", "HOCH", "MITTEL"),
        ("Bestände abgleichen", "2-5", "SEHR HOCH", "HOCH"),
        ("Support beantworten", "8-15", "MITTEL", "MITTEL"),
        ("Retouren abwickeln", "3-7", "HOCH", "MITTEL"),
        ("Fulfillment koordinieren", "2-6", "HOCH", "HOCH"),
    ]
    row_y = y - 62
    for row_index, row in enumerate(rows):
        c.setFillColor(HexColor("#111113") if row_index % 2 == 0 else HexColor("#0C0C0E"))
        c.roundRect(MARGIN, row_y - 14, PAGE_W - 2 * MARGIN, 40, 6, fill=1, stroke=0)
        x = MARGIN
        for cell, width in zip(row, widths):
            c.setFont(FONT_REGULAR if x == MARGIN else FONT_MONO, 7.5)
            c.setFillColor(WHITE if x == MARGIN else ZINC_400)
            c.drawString(x + 10, row_y, cell)
            x += width
        row_y -= 48

    rounded_card(c, MARGIN, 95, PAGE_W - 2 * MARGIN, 112, fill=HexColor("#111113"))
    c.setFont(FONT_BOLD, 12)
    c.setFillColor(WHITE)
    c.drawString(MARGIN + 18, 177, "Priorisierungsformel")
    c.setFont(FONT_BOLD, 18)
    c.setFillColor(SIGNAL)
    c.drawString(MARGIN + 18, 139, "(Zeit x Fehlerkosten x Häufigkeit) + Umsatzhebel")
    c.setFont(FONT_REGULAR, 8.5)
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN + 18, 113, "Starte mit dem Prozess, der den höchsten Wert und einen klaren Owner hat.")
    c.showPage()


def architecture_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        3,
        "02 / Architektur",
        "Das Shopify-Betriebssystem in vier Schichten",
        "Automatisierung wird belastbar, wenn Events, Regeln, Aktionen und Kontrolle dieselbe operative Logik teilen.",
    )
    layers = [
        ("01", "EVENTS", "Orders, Payments, Bestand, Tickets, Retouren", SIGNAL),
        ("02", "ORCHESTRATE", "Regeln, Daten-Mapping, KI-Entscheidungen", HexColor("#D9FF83")),
        ("03", "ACT", "Rechnungen, Sync, Antworten, Fulfillment", HexColor("#A9D746")),
        ("04", "CONTROL", "Logs, Alerts, Fallbacks, operative KPIs", HexColor("#6F8F2E")),
    ]
    card_h = 78
    for index, (number, title, copy, color) in enumerate(layers):
        top = y - index * (card_h + 12)
        rounded_card(c, MARGIN, top - card_h, PAGE_W - 2 * MARGIN, card_h, fill=HexColor("#101012"))
        c.setFillColor(color)
        c.roundRect(MARGIN + 15, top - 58, 46, 42, 9, fill=1, stroke=0)
        c.setFont(FONT_BOLD, 10)
        c.setFillColor(BLACK)
        c.drawCentredString(MARGIN + 38, top - 42, number)
        c.setFont(FONT_BOLD, 12)
        c.setFillColor(WHITE)
        c.drawString(MARGIN + 82, top - 31, title)
        c.setFont(FONT_REGULAR, 8.5)
        c.setFillColor(ZINC_500)
        c.drawString(MARGIN + 82, top - 53, copy)
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(color)
        c.drawRightString(PAGE_W - MARGIN - 18, top - 44, f"LAYER {number}")

    badge(c, "Regel", MARGIN, 112)
    draw_wrapped(
        c,
        "Keine neue Automatisierung ohne Messpunkt. Keine neue Integration ohne klaren Owner. Keine KI ohne menschlichen Eskalationsweg.",
        MARGIN,
        86,
        PAGE_W - 2 * MARGIN,
        font=FONT_BOLD,
        size=10.5,
        leading=16,
        color=ZINC_200,
    )
    c.showPage()


def web_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        4,
        "03 / Financial Sync",
        "Von der Bestellung zur korrekten Rechnung",
        "Jede Order wird geprüft, sauber übertragen und nachvollziehbar mit Rechnung und Bestandsbewegung verbunden.",
    )
    items = [
        ("01", "Order Event", "Neue oder geänderte Shopify-Bestellung eindeutig erkennen."),
        ("02", "Validierung", "Steuern, Adressen, Zahlstatus und Pflichtfelder vor Übergabe prüfen."),
        ("03", "Invoice Sync", "Rechnung in Lexoffice oder sevDesk erstellen und rückverknüpfen."),
        ("04", "Inventory Sync", "Bestandsbewegung im führenden System sauber bestätigen."),
    ]
    card_w = (PAGE_W - 2 * MARGIN - 14) / 2
    card_h = 148
    for index, item in enumerate(items):
        col = index % 2
        row = index // 2
        x = MARGIN + col * (card_w + 14)
        top = y - row * (card_h + 14)
        draw_number_card(c, x, top - card_h, card_w, card_h, *item)

    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_600)
    c.drawString(MARGIN, 130, "CORE METRIC")
    draw_wrapped(
        c,
        "Manuelle Order-Touches / 100 Bestellungen",
        MARGIN,
        97,
        PAGE_W - 2 * MARGIN,
        font=FONT_BOLD,
        size=18,
        leading=24,
        color=WHITE,
    )
    c.showPage()


def commerce_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        5,
        "04 / Inventory",
        "Bestand ohne Schattenlisten und Differenzen",
        "Ein sauber definierter System-Owner verhindert, dass Shopify, ERP und Fulfillment gleichzeitig unterschiedliche Wahrheiten führen.",
    )
    stages = [
        ("DETECT", "Bestandsänderung im führenden System erfassen"),
        ("NORMALIZE", "SKU, Bundle, Variante und Lagerort eindeutig zuordnen"),
        ("SYNC", "Änderung kontrolliert an angebundene Systeme übertragen"),
        ("RECONCILE", "Abweichungen erkennen, protokollieren und gezielt eskalieren"),
    ]
    x = MARGIN
    available = PAGE_W - 2 * MARGIN
    stage_w = (available - 30) / 4
    for index, (title, copy) in enumerate(stages):
        card_x = x + index * (stage_w + 10)
        rounded_card(c, card_x, y - 202, stage_w, 202, fill=HexColor("#101012"))
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(SIGNAL)
        c.drawString(card_x + 13, y - 24, f"0{index + 1}")
        c.setFont(FONT_BOLD, 9)
        c.setFillColor(WHITE)
        c.drawString(card_x + 13, y - 55, title)
        draw_wrapped(c, copy, card_x + 13, y - 80, stage_w - 26, size=7.5, leading=12, color=ZINC_500)
        if index < 3:
            c.setFillColor(SIGNAL)
            c.circle(card_x + stage_w + 5, y - 102, 2.5, fill=1, stroke=0)

    rounded_card(c, MARGIN, 121, available, 168, fill=HexColor("#101012"))
    c.setFont(FONT_BOLD, 12)
    c.setFillColor(WHITE)
    c.drawString(MARGIN + 18, 260, "Bestandslogik nach Systemrolle")
    bands = [
        ("SHOPIFY", "Verkaufbarer Bestand", 0.42),
        ("ERP / WAWI", "Führende Warenbewegung", 0.72),
        ("3PL", "Physischer Lagerstatus", 0.91),
    ]
    bar_y = 220
    for label, action, ratio in bands:
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(ZINC_500)
        c.drawString(MARGIN + 18, bar_y + 5, label)
        c.setFillColor(HexColor("#252529"))
        c.roundRect(MARGIN + 95, bar_y, 220, 13, 6.5, fill=1, stroke=0)
        c.setFillColor(SIGNAL)
        c.roundRect(MARGIN + 95, bar_y, 220 * ratio, 13, 6.5, fill=1, stroke=0)
        c.setFont(FONT_REGULAR, 7)
        c.setFillColor(ZINC_200)
        c.drawRightString(PAGE_W - MARGIN - 18, bar_y + 4, action)
        bar_y -= 36
    c.showPage()


def ai_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        6,
        "05 / AI Support",
        "Support automatisieren, ohne Kontrolle abzugeben",
        "Der Agent übernimmt klar abgegrenzte Anfragen, kennt seine Grenzen und eskaliert riskante Fälle nachvollziehbar an Menschen.",
    )
    phases = [
        ("TRIGGER", "Neue Anfrage, Ticket, Auftrag oder Datenänderung"),
        ("CONTEXT", "Freigegebene Quellen und Kundendaten laden"),
        ("DECIDE", "Regelwerk plus Modell erzeugen nächsten Schritt"),
        ("VERIFY", "Plausibilität, Risiko und Freigabe prüfen"),
        ("ACT", "Antwort, Routing oder Systemaktion ausführen"),
    ]
    center_x = PAGE_W / 2
    node_w = 330
    node_h = 52
    for index, (title, copy) in enumerate(phases):
        top = y - index * 72
        x = center_x - node_w / 2
        rounded_card(c, x, top - node_h, node_w, node_h, fill=HexColor("#101012"))
        c.setFillColor(SIGNAL if index in (0, 4) else ZINC_800)
        c.roundRect(x + 12, top - 41, 62, 30, 8, fill=1, stroke=0)
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(BLACK if index in (0, 4) else ZINC_400)
        c.drawCentredString(x + 43, top - 30, title)
        c.setFont(FONT_REGULAR, 7.7)
        c.setFillColor(ZINC_400)
        c.drawString(x + 90, top - 31, copy)
        if index < len(phases) - 1:
            c.setStrokeColor(Color(0.78, 1, 0.29, alpha=0.45))
            c.line(center_x, top - node_h, center_x, top - node_h - 20)
            c.setFillColor(SIGNAL)
            c.circle(center_x, top - node_h - 10, 2, fill=1, stroke=0)

    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_600)
    c.drawString(MARGIN, 111, "ESCALATION RULE")
    draw_wrapped(
        c,
        "Wenn Daten fehlen, Risiko hoch ist oder die Konfidenz unter dem Grenzwert liegt: stoppen, begründen, an einen Menschen routen.",
        MARGIN,
        88,
        PAGE_W - 2 * MARGIN,
        font=FONT_BOLD,
        size=10,
        leading=15,
        color=ZINC_200,
    )
    c.showPage()


def energy_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        7,
        "06 / Returns",
        "Von der Anfrage zum kontrollierten Rücklauf",
        "Retouren werden schneller, wenn Prüfung, Freigabe, Versand und Erstattung als ein nachvollziehbarer Workflow laufen.",
    )
    steps = [
        ("Anfrage", "Order, Artikel, Frist und Rücksendegrund erfassen"),
        ("Prüfung", "Regeln, Ausschlüsse und erforderliche Nachweise anwenden"),
        ("Freigabe", "Label, Anweisung oder menschliche Prüfung auslösen"),
        ("Abschluss", "Eingang, Bestand, Erstattung und Kundenstatus aktualisieren"),
    ]
    for index, (title, copy) in enumerate(steps):
        top = y - index * 92
        c.setStrokeColor(Color(1, 1, 1, alpha=0.11))
        c.line(MARGIN + 20, top - 92, MARGIN + 20, top - 8)
        c.setFillColor(SIGNAL)
        c.circle(MARGIN + 20, top - 20, 12, fill=1, stroke=0)
        c.setFont(FONT_BOLD, 8)
        c.setFillColor(BLACK)
        c.drawCentredString(MARGIN + 20, top - 23, f"{index + 1}")
        c.setFont(FONT_BOLD, 12)
        c.setFillColor(WHITE)
        c.drawString(MARGIN + 54, top - 16, title)
        c.setFont(FONT_REGULAR, 8.5)
        c.setFillColor(ZINC_500)
        c.drawString(MARGIN + 54, top - 39, copy)
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(ZINC_600)
        c.drawRightString(PAGE_W - MARGIN, top - 25, f"DATA GATE 0{index + 1}")

    rounded_card(c, MARGIN, 91, PAGE_W - 2 * MARGIN, 100, fill=HexColor("#101012"))
    c.setFont(FONT_BOLD, 11)
    c.setFillColor(WHITE)
    c.drawString(MARGIN + 18, 161, "Automatisierbar")
    c.setFont(FONT_REGULAR, 8)
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN + 18, 137, "Datenerfassung · Regelprüfung · Label · Status-Updates")
    c.setFont(FONT_BOLD, 11)
    c.setFillColor(WHITE)
    c.drawString(MARGIN + 290, 161, "Menschlich")
    c.setFont(FONT_REGULAR, 8)
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN + 290, 137, "Kulanz · Betrugsverdacht · Sonderfall · finale Freigabe")
    c.showPage()


def ev_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        8,
        "07 / Fulfillment",
        "Sonderprozesse kontrolliert orchestrieren",
        "Individuelle Logistik wird beherrschbar, wenn Trigger, Systemaktionen und Ausnahmen klar voneinander getrennt sind.",
    )
    columns = [
        (
            "TRIGGER",
            ["Bestellung und Zahlungsstatus prüfen", "SKU und Versandprofil erkennen", "Sonderregeln eindeutig anwenden"],
        ),
        (
            "ORCHESTRATE",
            ["3PL oder Lieferant ansteuern", "Dokumente und Daten übertragen", "Status an Shopify zurückspielen"],
        ),
        (
            "EXCEPTIONS",
            ["Fehler automatisch klassifizieren", "Nur relevante Fälle eskalieren", "Auflösung vollständig protokollieren"],
        ),
    ]
    card_w = (PAGE_W - 2 * MARGIN - 20) / 3
    for index, (title, bullets) in enumerate(columns):
        x = MARGIN + index * (card_w + 10)
        rounded_card(c, x, y - 260, card_w, 260, fill=HexColor("#101012"))
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(SIGNAL)
        c.drawString(x + 16, y - 24, f"0{index + 1} / {title}")
        bullet_y = y - 72
        for bullet in bullets:
            c.setFillColor(SIGNAL)
            c.circle(x + 19, bullet_y + 3, 2.2, fill=1, stroke=0)
            bullet_y = draw_wrapped(
                c,
                bullet,
                x + 30,
                bullet_y,
                card_w - 46,
                size=8.2,
                leading=12,
                color=ZINC_300,
            ) - 21

    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_600)
    c.drawString(MARGIN, 156, "NORTH STAR")
    draw_wrapped(
        c,
        "Erfolgreiche Fulfillment-Läufe mit nachvollziehbarem Status",
        MARGIN,
        121,
        PAGE_W - 2 * MARGIN,
        font=FONT_BOLD,
        size=20,
        leading=26,
        color=WHITE,
    )
    c.showPage()


def android_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        9,
        "08 / Support Loop",
        "Von der Kundenfrage zur nächsten Aktion",
        "Antwortqualität entsteht nicht durch längere Prompts, sondern durch sauberen Kontext, klare Regeln und einen definierten Eskalationsweg.",
    )
    loop = [
        ("INTERPRET", "Anliegen, Tonalität, Order und Dringlichkeit zuverlässig erkennen."),
        ("CONTEXT", "Nur freigegebene Shop-, Produkt- und Kundendaten laden."),
        ("RESPOND", "Antwort und zulässige Systemaktion konsistent ausführen."),
        ("ESCALATE", "Unsichere, teure oder sensible Fälle begründet übergeben."),
    ]
    card_w = (PAGE_W - 2 * MARGIN - 14) / 2
    card_h = 137
    for index, item in enumerate(loop):
        col = index % 2
        row = index // 2
        x = MARGIN + col * (card_w + 14)
        top = y - row * (card_h + 14)
        draw_number_card(c, x, top - card_h, card_w, card_h, f"0{index + 1}", item[0], item[1])

    rounded_card(c, MARGIN, 92, PAGE_W - 2 * MARGIN, 92, fill=SIGNAL, stroke=SIGNAL)
    c.setFont(FONT_MONO, 7)
    c.setFillColor(BLACK)
    c.drawString(MARGIN + 18, 157, "SUPPORT EQUATION")
    draw_wrapped(
        c,
        "Freigegebener Kontext x klare Regeln x Eskalation = belastbarer Support",
        MARGIN + 18,
        126,
        PAGE_W - 2 * MARGIN - 36,
        font=FONT_BOLD,
        size=11.5,
        leading=16,
        color=BLACK,
    )
    c.showPage()


def rollout_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        10,
        "09 / Delivery",
        "Der 30-Tage Rollout",
        "Klein genug für Geschwindigkeit. Streng genug für belastbare Ergebnisse. Jeder Sprint endet mit einem messbaren Output.",
    )
    weeks = [
        ("WOCHE 01", "Diagnose", "Prozesse, Daten, Risiken und Baseline erfassen."),
        ("WOCHE 02", "Systemdesign", "Zielprozess, Verantwortungen und Kontrollpunkte definieren."),
        ("WOCHE 03", "Build", "Backend, Integrationen und Automationslogik implementieren."),
        ("WOCHE 04", "Härtung", "Edge Cases testen, Team übergeben und KPIs live schalten."),
    ]
    start_x = MARGIN + 12
    line_y = y - 68
    c.setStrokeColor(Color(0.78, 1, 0.29, alpha=0.35))
    c.setLineWidth(1.2)
    c.line(start_x, line_y, PAGE_W - MARGIN - 12, line_y)
    gap = (PAGE_W - 2 * MARGIN - 24) / 3
    for index, (week, title, copy) in enumerate(weeks):
        x = start_x + index * gap
        c.setFillColor(SIGNAL)
        c.circle(x, line_y, 7, fill=1, stroke=0)
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(ZINC_500)
        c.drawString(x - 7, line_y + 24, week)
        c.setFont(FONT_BOLD, 10)
        c.setFillColor(WHITE)
        c.drawString(x - 7, line_y - 41, title)
        draw_wrapped(c, copy, x - 7, line_y - 63, 104, size=7.4, leading=11.5, color=ZINC_500)

    checklist = [
        ("Owner benannt", "Jeder Prozess hat eine verantwortliche Person."),
        ("Fallback getestet", "Manueller Weg funktioniert bei Ausfall."),
        ("Daten minimiert", "Nur notwendige Daten werden verarbeitet."),
        ("KPI sichtbar", "Wirkung ist vor und nach Rollout messbar."),
    ]
    card_w = (PAGE_W - 2 * MARGIN - 12) / 2
    for index, (title, copy) in enumerate(checklist):
        col = index % 2
        row = index // 2
        x = MARGIN + col * (card_w + 12)
        top = 310 - row * 96
        rounded_card(c, x, top - 80, card_w, 80, fill=HexColor("#101012"))
        c.setFillColor(SIGNAL)
        c.circle(x + 19, top - 26, 6, fill=1, stroke=0)
        c.setFont(FONT_BOLD, 9)
        c.setFillColor(WHITE)
        c.drawString(x + 35, top - 23, title)
        draw_wrapped(c, copy, x + 35, top - 43, card_w - 50, size=7.2, leading=11, color=ZINC_500)
    c.showPage()


def kpi_page(c: canvas.Canvas) -> None:
    y = page_start(
        c,
        11,
        "10 / Measurement",
        "Das KPI-Cockpit",
        "Miss wenige Zahlen, die Verhalten verändern. Vanity Metrics gehören nicht in den operativen Takt.",
    )
    metrics = [
        ("TIME", "Manuelle Stunden", "IST", 0.74),
        ("QUALITY", "Fehler pro 100 Orders", "ZIEL", 0.86),
        ("SUPPORT", "Zeit bis zur Erstreaktion", "SLA", 0.63),
        ("RELIABILITY", "Erfolgreiche Workflow-Läufe", "RATE", 0.69),
    ]
    card_w = (PAGE_W - 2 * MARGIN - 14) / 2
    card_h = 138
    for index, (label, title, value, ratio) in enumerate(metrics):
        col = index % 2
        row = index // 2
        x = MARGIN + col * (card_w + 14)
        top = y - row * (card_h + 14)
        rounded_card(c, x, top - card_h, card_w, card_h, fill=HexColor("#101012"))
        c.setFont(FONT_MONO, 6.5)
        c.setFillColor(ZINC_600)
        c.drawString(x + 17, top - 24, label)
        c.setFont(FONT_BOLD, 19)
        c.setFillColor(SIGNAL)
        c.drawRightString(x + card_w - 17, top - 25, value)
        c.setFont(FONT_BOLD, 10)
        c.setFillColor(WHITE)
        c.drawString(x + 17, top - 58, title)
        c.setFillColor(HexColor("#252529"))
        c.roundRect(x + 17, top - 105, card_w - 34, 11, 5.5, fill=1, stroke=0)
        c.setFillColor(SIGNAL)
        c.roundRect(x + 17, top - 105, (card_w - 34) * ratio, 11, 5.5, fill=1, stroke=0)

    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_600)
    c.drawString(MARGIN, 126, "RHYTHM")
    draw_wrapped(
        c,
        "Wöchentlich entscheiden. Monatlich optimieren. Quartalsweise neu priorisieren.",
        MARGIN,
        100,
        PAGE_W - 2 * MARGIN,
        font=FONT_BOLD,
        size=11.5,
        leading=17,
        color=WHITE,
    )
    c.showPage()


def closing_page(c: canvas.Canvas) -> None:
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    draw_grid(c, dark=False)
    c.setFillColor(BLACK)
    c.circle(MARGIN + 4, PAGE_H - 50, 4, fill=1, stroke=0)
    c.setFont(FONT_BOLD, 10)
    c.drawString(MARGIN + 18, PAGE_H - 54, "WESTMONKS")
    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_500)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 53, "NEXT STEP / 12")

    c.setFont(FONT_MONO, 7)
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN, PAGE_H - 180, "DEINE NÄCHSTEN 48 STUNDEN")
    c.setFont(FONT_BOLD, 38)
    c.setFillColor(BLACK)
    c.drawString(MARGIN, PAGE_H - 245, "Wähle einen Engpass.")
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN, PAGE_H - 290, "Baue einen Beweis.")
    c.setFillColor(BLACK)
    c.drawString(MARGIN, PAGE_H - 335, "Skaliere erst danach.")

    steps = [
        "Audit-Tabelle auf Seite 2 mit echten Zahlen ausfüllen.",
        "Einen Prozess mit hohem Wert und klarem Owner auswählen.",
        "Eine 30-Tage Baseline und einen Abbruchpunkt definieren.",
    ]
    step_y = PAGE_H - 420
    for index, step in enumerate(steps):
        c.setFillColor(BLACK)
        c.circle(MARGIN + 10, step_y + 3, 10, fill=1, stroke=0)
        c.setFont(FONT_BOLD, 7)
        c.setFillColor(SIGNAL)
        c.drawCentredString(MARGIN + 10, step_y, f"{index + 1}")
        c.setFont(FONT_REGULAR, 9.5)
        c.setFillColor(ZINC_600)
        c.drawString(MARGIN + 34, step_y, step)
        step_y -= 46

    c.setFillColor(BLACK)
    c.roundRect(MARGIN, 103, PAGE_W - 2 * MARGIN, 142, 16, fill=1, stroke=0)
    c.setFont(FONT_MONO, 7)
    c.setFillColor(SIGNAL)
    c.drawString(MARGIN + 20, 214, "POTENZIAL-ANALYSE")
    c.setFont(FONT_BOLD, 16)
    c.setFillColor(WHITE)
    c.drawString(MARGIN + 20, 178, "Der schnellste Hebel ist selten der offensichtlichste.")
    draw_wrapped(
        c,
        "Westmonks baut Shopify-Backend-Automatisierungen und KI-Workflows, die manuelle Operations kontrolliert eliminieren.",
        MARGIN + 20,
        149,
        PAGE_W - 2 * MARGIN - 40,
        size=8.5,
        leading=13,
        color=ZINC_400,
    )
    c.setFont(FONT_MONO, 6.5)
    c.setFillColor(ZINC_500)
    c.drawString(MARGIN, 37, "WESTMONKS / AUTOMATION BLUEPRINT")
    c.drawRightString(PAGE_W - MARGIN, 37, "12 / 12")
    c.showPage()


def build_base_pdf(path: Path) -> None:
    c = canvas.Canvas(path.as_posix(), pagesize=A4, pageCompression=1)
    c.setTitle("Der Automatisierungs-Blueprint")
    c.setAuthor("Westmonks")
    c.setSubject("Shopify Backend Automation und AI Operations")
    c.setCreator("Westmonks")
    cover_page(c)
    audit_page(c)
    architecture_page(c)
    web_page(c)
    commerce_page(c)
    ai_page(c)
    energy_page(c)
    ev_page(c)
    android_page(c)
    rollout_page(c)
    kpi_page(c)
    closing_page(c)
    c.save()


def write_with_payload(reader: PdfReader, payload_size: int) -> bytes:
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.add_metadata(
        {
            "/Title": "Der Automatisierungs-Blueprint",
            "/Author": "Westmonks",
            "/Subject": "Shopify Operations Blueprint für B2B-Entscheider",
        }
    )
    prefix = b"WESTMONKS BLUEPRINT SUPPORT DATA\n"
    repeats, remainder = divmod(payload_size, len(prefix))
    payload = prefix * repeats + prefix[:remainder]
    writer.add_attachment("blueprint-support-data.txt", payload)
    buffer = io.BytesIO()
    writer.write(buffer)
    return buffer.getvalue()


def fit_exact_size(base_path: Path, output_path: Path) -> None:
    reader = PdfReader(base_path.as_posix())
    payload_size = max(0, TARGET_BYTES - base_path.stat().st_size - 4_096)
    best_below: bytes | None = None

    for _ in range(16):
        candidate = write_with_payload(reader, payload_size)
        difference = TARGET_BYTES - len(candidate)
        if difference == 0:
            output_path.write_bytes(candidate)
            return
        if difference > 0:
            best_below = candidate
        payload_size = max(0, payload_size + difference)

    if best_below is None:
        raise RuntimeError("Could not create a PDF below the 1.5 MB target")

    difference = TARGET_BYTES - len(best_below)
    if difference > 900:
        raise RuntimeError(f"PDF size could not be fitted safely; {difference} bytes remain")

    if difference == 1:
        padded = best_below + b"\n"
    elif difference >= 2:
        padded = best_below + b"\n%" + (b" " * (difference - 2))
    else:
        padded = best_below

    if len(padded) != TARGET_BYTES:
        raise RuntimeError(f"Expected {TARGET_BYTES} bytes, got {len(padded)}")
    output_path.write_bytes(padded)


def write_delivery_chunks(pdf_path: Path) -> None:
    pdf_bytes = pdf_path.read_bytes()
    chunks = [
        pdf_bytes[offset : offset + CHUNK_BYTES]
        for offset in range(0, len(pdf_bytes), CHUNK_BYTES)
    ]
    if len(chunks) != 3 or any(len(chunk) != CHUNK_BYTES for chunk in chunks):
        raise RuntimeError("Expected three equally sized 500,000-byte PDF chunks")
    for index, chunk in enumerate(chunks, start=1):
        chunk_path = ASSETS_DIR / f"blueprint.part-{index:02d}.bin"
        chunk_path.write_bytes(chunk)


def main() -> None:
    for directory in (TMP_DIR, OUTPUT_DIR, PUBLIC_DIR, ASSETS_DIR):
        directory.mkdir(parents=True, exist_ok=True)
    build_base_pdf(BASE_PDF)
    fit_exact_size(BASE_PDF, FINAL_PDF)
    write_delivery_chunks(FINAL_PDF)
    reader = PdfReader(FINAL_PDF.as_posix())
    if len(reader.pages) != 12:
        raise RuntimeError(f"Expected 12 pages, got {len(reader.pages)}")
    print(
        f"Generated {FINAL_PDF.relative_to(ROOT)}: "
        f"{len(reader.pages)} pages, {FINAL_PDF.stat().st_size} bytes, 3 delivery chunks"
    )


if __name__ == "__main__":
    main()
