from pathlib import Path
from xml.sax.saxutils import escape
import json

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parent

# Retain the detailed text plan; build_brief supplies the three-page branded PDF.
pages = []
def page(title, blocks): pages.append((title, blocks))
def p(text): return ('p', text)
def h(text): return ('h', text)
def b(text): return ('b', text)
def t(headers, rows, widths): return ('t', headers, rows, widths)

page('TRAYN Launch and First 90 Days Plan', [
    p('Prepared for the TRAYN founder and marketing partner | 22 October 2026'),
    p('Our launch should earn trust in the product, convert that trust into first purchases, and build repeat demand. This brief sets the selected positioning, preparation schedule, launch activity and first 90 days of work. The marketer should use it to prepare a weekly calendar, costed media plan and reporting dashboard.'),
    h('Selected USP'),
    p('<b>Chosen to a standard. Tested before release.</b>'),
    p('Our launch commitment is to select ingredients against documented quality specifications, independently test manufactured finished batches against defined release criteria before sale, and make relevant batch results accessible to customers.'),
    p('The customer benefit is a clear basis for understanding what goes into the product and what testing found. Explain the specific ingredient choices and standards; testing and report access alone are not verified exclusive features.'),
    p('<b>Before public claims:</b> finalise ingredient standards, supplier qualification, the testing programme, release controls and report access. The USP is selected; the supporting practices must be documented and implemented before they are described as established facts.'),
    h('What we know and what we must decide'),
    p('The founder intends to avoid lower-quality substitutions and to test the manufactured batch before sale. The working launch scope is one whey product, sold directly online in India. Final product specifications, price, stock quantity, launch date and marketing budget need confirmation.'),
    p('The initial audience hypothesis is regular gym-goers who already buy whey and want clearer evidence from a new brand. We will test this through customer conversations and early purchase feedback.'),
    h('How the timeline works'),
    t(['Phase', 'Timing', 'Outcome'], [
        ['Pre-launch', 'Weeks -6 to -1', 'Product readiness and a qualified waitlist'],
        ['Launch', 'Days 0 to 7', 'Reliable first purchases and deliveries'],
        ['Immediate post-launch', 'Days 8 to 30', 'Customer feedback and fixes'],
        ['Build repeat demand', 'Days 31 to 60', 'Better conversion and replenishment'],
        ['90 day review', 'Days 61 to 90', 'Decisions on spend and the next batch'],
    ], [0.27, 0.22, 0.51]),
    p('Day 0 is the first day the product is available for purchase. If manufacturing or testing takes longer, move the schedule; do not promise a fixed public date before readiness is sufficiently certain.'),
])

page('Pre launch preparation', [
    p('Objective: establish a clear offer, prepare the product for release and collect interest from people likely to buy. Build the public calendar around confirmed production and lab turnaround times.'),
    h('Weeks 6 and 5 before launch'),
    b('<b>Founder:</b> confirm the SKU, final label, units, price, delivery coverage and quality adviser. Document ingredient specifications and supplier qualification. Agree the laboratory, sampling, tests, release criteria and how customers will access relevant reports.'),
    b('<b>Marketer:</b> interview 10 to 15 prospective whey buyers about their current product, trust and switching barriers. Test understanding of ingredient standards and testing before release. Arrange taste and mixability feedback on released product; do not imply superiority without evidence.'),
    b('<b>Marketer:</b> review 3 to 5 relevant competitors using public evidence. Compare price per serving, disclosed formulation, batch report access and delivery offer. Record sources; avoid unsupported superiority claims.'),
    p('<b>Deliverables:</b> agreed audience and offer, competitor comparison, cost inputs, testing schedule and first marketing calendar.'),
    h('Weeks 4 and 3 before launch'),
    b('<b>Marketer and website owner:</b> publish a waitlist page with a clear product introduction, reason to join and consent for updates. Track traffic source and sign-ups. Prepare the product page and batch-report page.'),
    b('<b>Founder and marketer:</b> record the founder story and explain concrete formulation decisions. Prepare product photos, usage demonstrations, FAQs and an explanation of how testing works. Use accurate concept labels until final stock can be photographed.'),
    b('<b>Marketer:</b> shortlist 5 to 10 suitable trainers, gyms or creators for a small launch trial. Assess audience fit and credible reviews. Arrange any paid or gifted relationships transparently.'),
    p('<b>Deliverables:</b> working waitlist, tracked links, approved core messages and two weeks of launch content.'),
    h('Weeks 2 and 1 before launch'),
    b('<b>Founder and quality adviser:</b> arrange testing of samples from the manufactured finished batch and review results against the agreed criteria. Keep stock on hold pending release. Confirm that the report identifies the actual batch.'),
    b('<b>Operations and website owner:</b> test checkout, payment, stock deductions, shipping charges, order messages, refunds and customer support. Complete a test fulfilment run and verify the batch-report link on mobile.'),
    b('<b>Marketer:</b> send factual progress updates to the waitlist. Once readiness is confirmed, communicate the launch date and prepare the launch email, social posts and customer response scripts.'),
    p('<b>Exit condition:</b> the founder confirms the product can be released, the store works, fulfilment is ready and all public product claims have supporting evidence.'),
])

page('Launch and immediate post launch', [
    h('Before sales open'),
    p('The founder owns the release decision with the qualified quality adviser. Independent lab testing is one part of readiness; it does not replace applicable product, label and business requirements.'),
    b('Confirm that the finished batch meets the agreed release criteria and that any unexpected result has been resolved before release.'),
    b('Publish the matching report with its lab, sample identity, batch number, test date and tested parameters. Explain the results accurately and keep the report accessible.'),
    b('Check the final ingredients, nutrition information, allergens, pack size, price, inventory, shipping promises and support contact against the actual product.'),
    b('Confirm end-to-end ordering and dispatch, and ensure all launch collaborators have the final approved product information.'),
    h('Days 0 to 7'),
    p('Open sales to the waitlist first, then publish the launch announcement across the core channels. The product page should answer what the product is, who it is for, what is in it, what has been tested, how much it costs and when it will arrive.'),
    p('Run a small trial with approximately 15 to 25 relevant customers, trainers or creators, subject to available released stock and budget. Collect structured feedback; product gifts should not require positive reviews. Use tracked links to distinguish creator traffic from other sources.'),
    p('Review orders, payment failures, stock, customer questions and dispatch daily. If paid advertising is affordable, start with one channel, one audience hypothesis and a small set of distinct messages. Set a spend cap and evaluation period before the test.'),
    h('Days 8 to 14'),
    p('Follow up after delivery to check that the product arrived correctly and ask about the experience. Capture taste, mixability, packaging, value and any concerns. Fix repeated issues before increasing traffic.'),
    p('Review the purchase journey: visits, product views, checkout starts and completed orders. Read the reasons customers give for not buying. Change the highest-impact issue first and record the change.'),
    h('Days 15 to 30'),
    p('Request honest reviews once customers have used the product. Seek permission before reusing customer content. Update FAQs and product information using actual questions. Publish useful evidence and credible experience reports as they become available.'),
    p('Compare paid, organic, waitlist and partner results using completed orders, costs and complaints. At day 30, agree which messages and channels to continue, revise or stop. Produce a short report with customer findings and the next month of activity.'),
    p('<b>Suggested operating targets:</b> acknowledge customer queries within one business day; make the matching report accessible for every released batch; check dispatch against the delivery promises made to customers. These are proposed service commitments, not measured results.'),
])

page('Days 31 to 90', [
    h('Days 31 to 60'),
    p('<b>Objective:</b> improve the first purchase experience and learn what leads customers to buy again.'),
    b('<b>Marketer:</b> develop the messages that customers respond to, using genuine questions and purchase feedback. Test one major variable at a time, such as message, audience or product-page explanation.'),
    b('<b>Founder and operations:</b> resolve recurring product or delivery issues, review returned orders and complaint patterns, and carry the learning into the next production plan.'),
    b('<b>Marketer:</b> schedule a replenishment reminder based on the final pack size, serving size and reported usage. Do not assume every customer uses a serving daily. Keep marketing follow-ups permission based.'),
    b('<b>Founder and marketer:</b> assess a limited referral or bundle offer only after checking contribution per order. Continue trainer and gym relationships that produce suitable customers and useful feedback.'),
    p('<b>Day 60 deliverables:</b> customer feedback summary, changes made, channel economics, repeat-purchase evidence from eligible customers and an updated stock forecast.'),
    h('Days 61 to 90'),
    p('<b>Objective:</b> decide whether the current product and acquisition approach justify greater investment.'),
    b('<b>Marketer:</b> compare customer groups by acquisition period and source. Separate paid acquisition performance from the blended average, so organic sales do not hide an expensive paid channel.'),
    b('<b>Founder:</b> forecast the next production requirement from sellable stock, observed demand, manufacturing time and the time needed for testing before release. Use conservative demand assumptions.'),
    b('<b>Founder and marketer:</b> consider new flavours or packs only when customers request them and the current product, supply and economics are working. Record demand before committing to more inventory.'),
    p('<b>Day 90 deliverable:</b> a decision memo recommending whether to increase spend, maintain the current level, or fix a specific problem first. Include sales, contribution, acquisition costs, eligible repeat purchases, customer issues, stock and the next 90 day priorities.'),
    h('Decisions at each review'),
    t(['Checkpoint', 'Decision required'], [
        ['Day 30', 'What prevents first purchases or a good delivery experience?'],
        ['Day 60', 'Which customer groups and channels merit further testing?'],
        ['Day 90', 'Can we support more demand while maintaining quality and economics?'],
    ], [0.22, 0.78]),
    p('Increase spend only when tracking is reliable, customer and delivery issues are controlled, stock can support demand, and acquisition costs fit the agreed economics. If a product-quality concern appears, the founder and quality adviser should assess the affected stock before further promotion.'),
])

page('Messaging and content plan', [
    h('Language we can use'),
    p('<b>Before testing is complete:</b> "We plan to independently test samples from our manufactured batch before it goes on sale. We will share the scope and results when available."'),
    p('<b>After results and release are confirmed:</b> "See the independent test report for this batch, including the parameters tested and the reported results." Link directly to the matching report.'),
    p('<b>After the ongoing process is confirmed:</b> "Every manufactured batch is independently tested before release, with reports available by batch number." Use this only while the practice is consistently maintained.'),
    p('Avoid "certified pure," "100% safe," "zero contaminants," or "NABL certified product" as substitutes for specific evidence. A report applies to the sample and tests described; lab accreditation is not blanket certification of the product. Any ingredient-quality comparison must identify the actual difference and supporting evidence.'),
    h('Content that supports the purchase decision'),
    t(['Theme', 'Example content', 'Customer action'], [
        ['Product evidence', 'How to find and read the report for your batch', 'View the report'],
        ['Ingredient choices', 'What is in the final formulation and why', 'Read the ingredients'],
        ['Everyday use', 'An accurate mixing demonstration and taste description', 'Explore the product'],
        ['Founder story', 'The decisions behind starting TRAYN', 'Join the waitlist'],
        ['Customer experience', 'Honest reviews and answers to recurring questions', 'Check fit and buy'],
    ], [0.24, 0.52, 0.24]),
    h('Proposed weekly publishing rhythm'),
    p('Start with three feed posts per week: one product or testing explanation, one practical demonstration, and one founder or customer story. Use stories on three days to answer questions and share factual updates. Reuse strong material across formats instead of adding channels faster than the team can maintain them.'),
    p('Use Instagram as the initial social channel and an opted-in email list for direct communication. Consider WhatsApp only with explicit opt-in and the ability to manage replies. Add paid media and creator partnerships in small, measured tests.'),
    p('Set up a waitlist welcome email, material progress updates, the launch announcement, a delivery check-in and a review request. Introduce replenishment reminders once usage timing is understood. Order updates should remain distinct from optional marketing.'),
    h('Initial creative tests'),
    p('Use "Chosen to a standard. Tested before release." across launch content. Test supporting messages about documented ingredient choices, independent finished-batch results and release criteria. Judge messages by qualified sign-ups and completed purchases. Use customer feedback to improve the product experience.'),
])

page('Measurement budget and responsibilities', [
    p('Agree numerical sales targets after confirming sellable stock, price, costs and marketing funds. The quantities proposed elsewhere in this plan describe activities; they are not forecasts or industry benchmarks.'),
    h('Weekly scorecard'),
    t(['Measure', 'Definition or use'], [
        ['Qualified waitlist', 'Opted-in prospects who fit the intended audience; track source.'],
        ['Purchase conversion', 'Completed orders divided by website sessions; segment by source.'],
        ['Paid acquisition cost', 'Paid media spend divided by new customers attributed to that spend.'],
        ['Contribution after marketing', 'Net sales less product, fulfilment, payment, return and allocated marketing costs.'],
        ['Eligible repeat purchase', 'Repeat buyers divided by first-time buyers in a group that has had time to use the pack. State the observation window.'],
        ['Service and stock', 'Dispatch performance, complaints, refunds and sellable units remaining.'],
    ], [0.30, 0.70]),
    p('Set the acquisition-cost ceiling below the expected first-order contribution before marketing, leaving the contribution the business needs. Do not assume future repeat purchases will cover losses until repeat behaviour is observed. Track creator fees and gifted-stock costs separately, then include them in the full acquisition view.'),
    h('Proposed allocation of the marketing budget'),
    p('Allocate 20% to pre-launch research and creative preparation, 30% to launch distribution and trials, 30% to days 15 to 90 testing and retention, and hold 20% as a reserve. This is a discussion framework, not a spending authorisation. Manufacturing, laboratory testing, website setup and baseline operating costs need separate provision. Reduce channel count if the available budget is small.'),
    h('Ownership and working cadence'),
    p('The founder owns product decisions, quality, pricing, stock and budget approval. The marketer owns the calendar, creative, acquisition experiments and reporting. The website or operations owner owns purchase tracking, checkout, dispatch and customer support. The qualified quality adviser owns technical interpretation and advises on release and product claims. One person may cover several roles.'),
    p('Hold a 30 minute weekly review of results, customer issues, stock and next actions. The marketer maintains one action list with an owner, due date and success measure for each item. Review launch operations daily during the first week.'),
    h('Decisions for the first planning meeting'),
    p('Confirm the launch SKU and final specifications; testing and report-publication commitments; available units; price and costs; total marketing budget; delivery coverage; named owners; and the earliest credible launch window. Then agree the first-month order target and the activity required to support it.'),
    p('<b>Target-setting example only:</b> if the goal were 50 waitlist orders and the assumed waitlist purchase rate were 10%, the plan would require 500 qualified sign-ups. Replace both inputs with agreed assumptions and revise them using actual results.'),
])

page('Product evidence and marketer handoff', [
    h('How to make the quality promise concrete'),
    p('Agree a finished-product sampling and testing programme with the laboratory and qualified quality adviser. Discuss protein content, amino acid profile, relevant contaminants and microbiological parameters, with methods, limits and acceptance criteria appropriate to the actual product. This is a discussion list, not a complete testing specification.'),
    p('Record the batch identity, sample collection, laboratory submission, results review and release decision. Keep raw-material supplier documents distinct from the finished-product report. A sample report does not establish the composition of every individual pack or constitute a shelf-life study.'),
    p('If TRAYN adopts public batch reports, make them easy to find from the product page and a stable pack link or QR code where feasible. Let customers identify their batch and see what was tested. Publish results faithfully; explain units and limits without extending claims beyond the evidence.'),
    p('For an Indian launch, verify that the laboratory accreditation scope covers the relevant tests and methods. Confirm applicable product, label and operating requirements with the qualified adviser. Testing and marketing review should run alongside the release process.'),
    h('What we need from the marketer'),
    b('A weekly calendar from pre-launch through day 90, mapped to the phases in this brief, with named owners and due dates.'),
    b('A costed channel plan showing media spend, creative fees, creator activity and sampling costs separately.'),
    b('A clear audience hypothesis and competitor comparison that checks whether the proposed positioning gives TRAYN a useful reason to be chosen.'),
    b('A launch asset list covering the waitlist page, product page, batch-report explanation, FAQs, launch messages, customer follow-ups and creator brief.'),
    b('A dashboard with metric definitions, agreed assumptions and day 30, day 60 and day 90 review dates.'),
    p('The first version should identify decisions needed from the founder, dependencies on manufacturing or testing, and the activities that can proceed immediately.'),
    h('References for product evidence wording'),
    p('NABL, Frequently Asked Questions, including scope of accreditation: <link href="https://nabl-india.org/faq/" color="#243d57">https://nabl-india.org/faq/</link>'),
    p('FSSAI, FSSAI Empowers Consumers to Report Misleading Claims on Food Products, 30 April 2025. Explains that food claims must be truthful and not misleading, and nutritional or health attributes need scientific substantiation: <link href="https://fssai.gov.in/upload/uploadfiles/files/Press%20Release_Misleading%20Claims.pdf" color="#243d57">Read the FSSAI release</link>.'),
    p('Sources checked 22 October 2026. The launch activities and budget split in this brief are recommendations for TRAYN; they are not results reported by these sources.'),
])

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='PlanTitle', fontName='Helvetica-Bold', fontSize=23, leading=27, textColor=colors.black, spaceAfter=15))
styles.add(ParagraphStyle(name='PlanHead', fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=colors.black, spaceBefore=10, spaceAfter=6, keepWithNext=True))
styles.add(ParagraphStyle(name='PlanBody', fontName='Helvetica', fontSize=10.2, leading=14.2, textColor=colors.HexColor('#252a30'), spaceAfter=8))
styles.add(ParagraphStyle(name='PlanBullet', parent=styles['PlanBody'], leftIndent=11, firstLineIndent=-8, spaceAfter=6))
styles.add(ParagraphStyle(name='Cell', fontName='Helvetica', fontSize=9.1, leading=12, spaceAfter=0, textColor=colors.HexColor('#252a30')))
styles.add(ParagraphStyle(name='CellHeader', parent=styles['Cell'], fontName='Helvetica-Bold', textColor=colors.white))

story = []
md = []
page_width, page_height = A4
usable_width = page_width - 104

import re
def plain(s):
    s = re.sub(r'<link href="([^"]+)"[^>]*>(.*?)</link>', r'[\2](\1)', s)
    s = s.replace('<b>', '**').replace('</b>', '**')
    return s

for i, (title, blocks) in enumerate(pages):
    if i: story.append(PageBreak())
    story.append(Paragraph(escape(title), styles['PlanTitle']))
    md.append(('# ' if i == 0 else '## ') + title + '\n')
    for block in blocks:
        kind = block[0]
        if kind in ['p', 'h', 'b']:
            text = block[1]
            sty = {'p': 'PlanBody', 'h': 'PlanHead', 'b': 'PlanBullet'}[kind]
            story.append(Paragraph(('&#8226; ' if kind == 'b' else '') + text, styles[sty]))
            md.append(('### ' if kind == 'h' else '- ' if kind == 'b' else '') + plain(text) + '\n')
        elif kind == 't':
            _, headers, rows, widths = block
            data = [[Paragraph(escape(c), styles['CellHeader']) for c in headers]]
            data += [[Paragraph(escape(c), styles['Cell']) for c in row] for row in rows]
            table = Table(data, colWidths=[usable_width * w for w in widths], repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#243d57')),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f2f4f6')]),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#d9d9d9')),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 8), ('RIGHTPADDING', (0,0), (-1,-1), 8),
                ('TOPPADDING', (0,0), (-1,-1), 7), ('BOTTOMPADDING', (0,0), (-1,-1), 7),
            ]))
            story += [table, Spacer(1,10)]
            md += ['| ' + ' | '.join(headers) + ' |', '| ' + ' | '.join(['---'] * len(headers)) + ' |']
            md += ['| ' + ' | '.join(row) + ' |' for row in rows]
            md.append('')

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#68727d'))
    canvas.drawString(52, 30, 'TRAYN Nutrition | Launch planning brief | 22 October 2026')
    canvas.drawRightString(page_width-52, 30, str(doc.page))
    canvas.restoreState()

(ROOT / 'TRAYN_Launch_and_90_Day_Plan.md').write_text('\n'.join(md), encoding='utf-8')
from build_brief import build
build()
