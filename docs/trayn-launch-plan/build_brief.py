"""Build the three-page branded TRAYN PDF and its editable brief."""

from pathlib import Path
from io import BytesIO
from xml.sax.saxutils import escape
import json

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'assets'
WIDTH, HEIGHT = A4
MARGIN = 42
CONTENT = WIDTH - 2 * MARGIN
INK = '#101114'
RED = '#E51B2B'
TEXT = '#282C32'
MUTED = '#626971'
LINE = '#D8DADD'
WHITE = '#FFFFFF'
PAPER = '#FFFFFF'

USP = 'Chosen to a standard. Tested before release.'
POSITION = ('Our launch commitment is to select ingredients against documented quality standards, '
            'independently test manufactured finished batches before release, and make relevant batch results accessible.')
AUDIENCE = ('Initial audience: regular whey buyers who want clear ingredient choices and product evidence. '
            'Validate this audience through customer interviews.')
PRE = [
    ('WEEKS 6-5', 'Define the product and the standards',
     'Founder: confirm the product, ingredient specifications, qualified suppliers, price, stock and delivery coverage. '
     'Agree sampling, tests and release criteria with the lab and quality adviser. '
     'Marketer: interview 10-15 prospective buyers and compare 3-5 relevant brands.'),
    ('WEEKS 4-3', 'Build the audience and the evidence pages',
     'Marketer: publish a tracked, opt-in waitlist. Prepare the product page, report page, FAQs, founder story and ingredient explanations. '
     'Shortlist suitable trainers or creators and prepare two weeks of launch content.'),
    ('WEEKS 2-1', 'Test the batch and the buying journey',
     'Founder and quality adviser: test the finished batch, review results and record the release decision. '
     'Operations: test checkout, stock, dispatch and support. '
     'Marketer: announce the launch date once readiness is confirmed.'),
]
LAUNCH = [
    ('DAYS 0-7', 'Launch to a focused audience',
     'Open to the waitlist, then the wider audience. Publish the matching batch report. '
     'Run a small sampling programme using released stock and tracked creator links. '
     'If budget allows, test one paid channel with a spend cap. Check orders and dispatch daily.'),
    ('DAYS 8-14', 'Listen and fix the first purchase experience',
     'Follow up after delivery. Gather feedback on taste, mixability, packaging and value. '
     'Check where visitors abandon checkout, answer recurring questions and fix repeated product or delivery issues before increasing traffic.'),
    ('DAYS 15-30', 'Turn customer learning into improvements',
     'Request honest reviews and permission to reuse customer content. Improve FAQs and product information. '
     'Compare waitlist, organic, paid and partner results. At day 30, agree what to continue, change or stop.'),
]
LATER = [
    ('DAYS 31-60', 'Build repeat demand', [
        'Improve the messages and channels that bring suitable customers; test one major change at a time.',
        'Use opted-in replenishment reminders based on actual usage. Continue productive gym and creator partnerships.',
        'Review repeat purchases among customers who have had time to finish their pack, customer issues and stock.',
    ]),
    ('DAYS 61-90', 'Decide what to scale', [
        'Compare sales, acquisition costs, contribution, repeat buying and remaining stock.',
        'Increase spend only when economics, supply and customer experience support it.',
        'Plan the next batch including testing time. Add flavours only where demand supports them.',
    ]),
]
METRICS = [
    ('Qualified waitlist', 'Opted-in prospects and their acquisition source.'),
    ('Conversion', 'Completed orders / website sessions, by source.'),
    ('Acquisition cost', 'Paid media spend / attributed new customers.'),
    ('Contribution', 'Net sales less product, fulfilment, fees, returns and marketing.'),
    ('Repeat and service', 'Eligible repeat buyers, complaints, dispatch and sellable stock.'),
]


def build():
    pdfmetrics.registerFont(TTFont('Manrope', str(ASSETS / 'Manrope.ttf')))
    logo_buffer = BytesIO()
    Image.open(ASSETS / 'TRAYN-logo.webp').save(logo_buffer, format='PNG')
    logo_buffer.seek(0)
    logo = ImageReader(logo_buffer)
    output = ROOT / 'TRAYN_Launch_and_90_Day_Plan.pdf'
    c = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    c.setTitle('TRAYN Nutrition Launch and First 90 Days Plan')
    c.setAuthor('TRAYN Nutrition')
    c.setSubject('Three-page marketing plan with selected USP and phase actions')
    bounds = []

    def rect(x, top, width, height, fill):
        c.setFillColor(colors.HexColor(fill))
        c.rect(x, HEIGHT-top-height, width, height, fill=1, stroke=0)

    def rule(top, x=MARGIN, width=CONTENT, color=LINE, weight=0.6):
        c.setStrokeColor(colors.HexColor(color))
        c.setLineWidth(weight)
        c.line(x, HEIGHT-top, x+width, HEIGHT-top)

    def label(text, x, top, color=MUTED, size=7.6):
        c.setFillColor(colors.HexColor(color))
        c.setFont('Helvetica-Bold', size)
        c.drawString(x, HEIGHT-top-size, text)

    def para(text, x, top, width, size=10.1, leading=14.4, color=TEXT, font='Manrope'):
        style = ParagraphStyle('p', fontName=font, fontSize=size, leading=leading,
                               textColor=colors.HexColor(color))
        obj = Paragraph(text, style)
        _, height = obj.wrap(width, 1000)
        obj.drawOn(c, x, HEIGHT-top-height)
        bounds.append((c.getPageNumber(), text[:45], top, top+height))
        assert top+height <= 794, f'Overflow: page {c.getPageNumber()} {text[:60]} {top+height}'
        return top+height

    def logo_at(x, top, width):
        c.drawImage(logo, x, HEIGHT-top-width*440/740, width, width*440/740, mask='auto')

    def footer(n):
        rule(803)
        label('TRAYN NUTRITION  /  MARKETING PLAN', MARGIN, 814, size=7)
        label(f'{n:02d} / 03', WIDTH-MARGIN-38, 814, size=7)

    def header(section, title):
        rect(0, 0, WIDTH, 119, INK)
        logo_at(MARGIN, 23, 112)
        label(section, 211, 30, '#C3C7CD', size=7.6)
        para(title, 211, 49, 340, size=26, leading=29, color=WHITE, font='Helvetica-Bold')
        rect(0, 116, WIDTH, 3, RED)

    def action(n, date, title, body, top):
        label(f'{n:02d}', MARGIN, top+1, RED, size=18)
        x = MARGIN+40
        label(date, x, top, RED)
        end = para(title, x, top+17, CONTENT-40, size=12, leading=15.5, font='Helvetica-Bold')
        end = para(escape(body), x, end+7, CONTENT-40)
        return end

    # Page 1: branded positioning and preparation, without a separate cover.
    rect(0, 0, WIDTH, 221, INK)
    logo_at(MARGIN, 20, 126)
    label('LAUNCH AND FIRST 90 DAYS', 319, 32, '#C3C7CD')
    label('MARKETER BRIEF  /  22 OCT 2026', 319, 48, '#C3C7CD', size=7)
    para('Chosen to a standard.<br/>Tested before release.', MARGIN, 112, CONTENT,
         size=28, leading=32, color=WHITE, font='Helvetica-Bold')
    label('SELECTED USP', MARGIN, 191, '#C3C7CD')
    rect(0, 218, WIDTH, 3, RED)
    end = para(escape(POSITION), MARGIN, 244, CONTENT, size=10.4, leading=15.3)
    end = para(escape(AUDIENCE), MARGIN, end+8, CONTENT, size=9, leading=13, color=MUTED)
    top = end+25
    label('01 / PREPARE', MARGIN, top, RED)
    para('Pre-launch', MARGIN, top+15, CONTENT, size=24, leading=28, font='Helvetica-Bold')
    top += 59
    for n, (date, title, body) in enumerate(PRE, 1):
        end = action(n, date, title, body, top)
        if n < 3:
            rule(end+13, x=MARGIN+40, width=CONTENT-40)
        top = end+27
    rule(top-5, color=RED, weight=1)
    end = para('<b>Release condition</b>  The batch meets agreed criteria, relevant reports are accessible, '
               'claims are supported, and ordering and fulfilment are ready.', MARGIN, top+7, CONTENT,
               size=9.1, leading=13)
    footer(1)
    c.showPage()

    # Page 2: immediate post-launch execution and the content rhythm.
    header('02 / LAUNCH AND POST-LAUNCH', 'Days 0 to 30')
    end = para('Make the first purchase work', MARGIN, 148, CONTENT, size=23, leading=28,
               font='Helvetica-Bold')
    end = para('Day 0 is the first day sales open. Launch after readiness is confirmed; '
               'adjust the date if manufacturing or testing takes longer.', MARGIN, end+10,
               CONTENT, size=10.1)
    top = end+30
    for n, (date, title, body) in enumerate(LAUNCH, 1):
        end = action(n, date, title, body, top)
        if n < 3:
            rule(end+14, x=MARGIN+40, width=CONTENT-40)
        top = end+30
    rule(top-4, color=RED, weight=1)
    label('CONTENT AND CONTACT', MARGIN, top+11, RED)
    end = para('A manageable weekly rhythm', MARGIN, top+28, CONTENT,
               size=16, leading=20, font='Helvetica-Bold')
    col_gap = 22
    col_width = (CONTENT-col_gap)/2
    row_top = end+14
    label('SOCIAL', MARGIN, row_top)
    para('Start with 3 feed posts weekly: ingredient choices, product evidence and practical use. '
         'Use stories to answer questions. Instagram is the initial channel.', MARGIN,
         row_top+17, col_width, size=9.5, leading=14)
    right = MARGIN+col_width+col_gap
    label('DIRECT FOLLOW-UP', right, row_top)
    end = para('Use an opted-in waitlist, launch message, delivery check-in and review request. '
               'Add replenishment reminders when usage timing is understood.', right,
               row_top+17, col_width, size=9.5, leading=14)
    para('Keep ingredient and testing claims specific to documented practice and the scope of the report.',
         MARGIN, max(end+21, 755), CONTENT, size=8.3, leading=11.8, color=MUTED)
    footer(2)
    c.showPage()

    # Page 3: retention, operating economics and a concrete handoff.
    header('03 / REPEAT PURCHASE AND REVIEW', 'Days 31 to 90')
    gap = 25
    col = (CONTENT-gap)/2
    lower = []
    for i, (date, title, bullets) in enumerate(LATER):
        x = MARGIN+i*(col+gap)
        label(date, x, 147, RED)
        top = para(title, x, 165, col, size=19.5, leading=23, font='Helvetica-Bold')+12
        for item in bullets:
            rect(x, top+5, 3, 3, RED)
            top = para(escape(item), x+12, top, col-12, size=9.6, leading=14)+9
        lower.append(top)
    top = max(lower)+8
    rule(top, color=RED, weight=1)
    label('REVIEW WEEKLY  /  DECIDE AT DAYS 30, 60 AND 90', MARGIN, top+14, RED, size=7.2)
    end = para('The scorecard', MARGIN, top+30, CONTENT, size=18, leading=23, font='Helvetica-Bold')
    row = end+11
    for i, (name, definition) in enumerate(METRICS):
        if i % 2 == 0:
            rect(MARGIN, row, CONTENT, 27, '#F2F3F4')
        para(escape(name), MARGIN+8, row+6, 125, size=9, leading=12, font='Helvetica-Bold')
        para(escape(definition), MARGIN+141, row+6, CONTENT-149, size=8.4, leading=11.6)
        row += 27
    end = para('Set sales targets and an acquisition-cost ceiling after confirming stock, price, '
               'costs and budget. Do not rely on unproven repeat purchases to cover losses.',
               MARGIN, row+10, CONTENT, size=8.6, leading=12.1, color=MUTED)
    top = end+20
    label('PROPOSED MARKETING BUDGET SPLIT', MARGIN, top, RED)
    bar_top = top+18
    offset = MARGIN
    for proportion, fill, text in [
        (.20, '#E51B2B', '20%  PREP'), (.30, '#101114', '30%  LAUNCH'),
        (.30, '#555D67', '30%  DAYS 15-90'), (.20, '#D8DADD', '20%  RESERVE')]:
        width = CONTENT*proportion
        rect(offset, bar_top, width, 23, fill)
        label(text, offset+7, bar_top+8, INK if fill == '#D8DADD' else WHITE, size=6.5)
        offset += width
    end = para('Illustrative allocation, not a spending commitment. Fund manufacturing, lab testing '
               'and baseline operating costs separately.', MARGIN, bar_top+30,
               CONTENT, size=8, leading=11.2, color=MUTED)
    top = end+17
    label('OWNERSHIP AND MARKETER HANDOFF', MARGIN, top, RED)
    end = para('<b>Founder + quality adviser:</b> ingredient standards, testing and release. '
               '<b>Marketer:</b> calendar, content, acquisition and reporting. '
               '<b>Operations:</b> checkout, stock, dispatch and support.',
               MARGIN, top+17, CONTENT, size=8.8, leading=12.3)
    end = para('Next: agree a weekly calendar, costs, owners and targets. Hold a 30-minute weekly review. '
               'At day 90, decide on spend, the next batch and the next 90 days.',
               MARGIN, end+7, CONTENT, size=8.8, leading=12.3)
    end = para('Evidence guidance: <link href="https://nabl-india.org/faq/" color="#626971">NABL scope of accreditation</link> '
               'and <link href="https://fssai.gov.in/upload/uploadfiles/files/Press%20Release_Misleading%20Claims.pdf" '
               'color="#626971">FSSAI claims guidance</link>. Confirm product requirements with the quality adviser.',
               MARGIN, end+10, CONTENT, size=7.1, leading=10, color=MUTED)
    footer(3)
    c.save()

    # Keep a concise editable companion without replacing the detailed plan.
    lines = ['# TRAYN Nutrition launch and first 90 days brief', '', f'**{USP}**', '',
             POSITION, '', AUDIENCE, '', '## Pre launch', '']
    for date, title, body in PRE:
        lines += [f'### {date} {title}', '', body, '']
    lines += ['Release only when the batch meets criteria, reports are accessible, claims are supported and ordering and fulfilment are ready.', '', '## Launch and post launch', '']
    for date, title, body in LAUNCH:
        lines += [f'### {date} {title}', '', body, '']
    lines += ['Day 0 is the first day sales open. Adjust the date if manufacturing or testing takes longer.', '',
              'Content: 3 feed posts weekly, stories for questions, and opted-in waitlist and customer follow-ups.', '', '## Days 31 to 90', '']
    for date, title, bullets in LATER:
        lines += [f'### {date} {title}', '']+[f'- {b}' for b in bullets]+['']
    lines += ['## Weekly scorecard', '']+[f'- **{n}:** {d}' for n,d in METRICS]+['',
              'Set targets after confirming stock, price, costs and budget. Proposed marketing allocation: 20% pre-launch, 30% launch, 30% days 15-90 and 20% reserve. Fund manufacturing, testing and baseline operations separately.', '',
              'Ownership: founder and quality adviser own standards, testing and release; marketer owns calendar, content, acquisition and reporting; operations owns checkout, stock, dispatch and support.', '',
              'Handoff: agree a weekly calendar, costs, owners and targets, with weekly reviews and decisions at days 30, 60 and 90.', '',
              'The supporting practices must be documented and implemented before public claims. Reports apply to the sample and parameters tested.', '']
    (ROOT/'TRAYN_Launch_Brief.md').write_text('\n'.join(lines), encoding='utf-8')
    (ROOT/'qa/layout_bounds.json').write_text(json.dumps(bounds, indent=2), encoding='utf-8')
    print(json.dumps({'pdf': str(output), 'pages': 3, 'lowest_content_point': max(b[3] for b in bounds)}))


if __name__ == '__main__':
    build()
