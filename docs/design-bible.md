# Citizen Café Website Design Bible — Agent-Ready Markdown Spec

> Source transformed from the provided `.docx` design bible and its embedded visual comps.  
> Purpose: give an AI agent enough structured guidance to **design, build, review, and extend** the Citizen Café website without reducing the brand into a generic component library.

---

## 1) Mission of this document

This is **not** a generic brand guideline. It is a **build guide for a living website system**.

The website should communicate:

- **Warm belonging** through modern Hebrew, culture, and real human connection
- **Editorial + human + structured** visual language
- **Bold yellow energy** balanced by grounded charcoal and calm off-white
- A feeling that Hebrew learning means entering a **serious, alive, modern cultural world**, not merely purchasing an online course

### Core engineering implication

Build the site as a **reusable modular system**, not as a set of one-off page layouts.

---

## 2) Inputs that informed this design bible

The source document explicitly says the system was derived from:

- color sheet from the brandbook
- logo lockup files
- exported page comps for:
  - Home
  - Courses
  - Levels
  - Method
  - How It Works
  - Community
  - Corporate
  - Blog
  - Blog Post
  - Podcast
  - Our Story
  - Team
  - Foundation Tier

### Visual evidence extracted from the embedded comps

From the embedded page images and swatches, the design system clearly emphasizes:

- a warm off-white page field instead of flat pure white
- repeated **yellow CTA / accent zones**
- restrained thin borders
- large serif editorial headlines
- simple, slim header structure
- modular card families
- dark testimonial / footer bands for rhythm
- signature curved / quarter-circle corner treatment

---

## 3) What the visual system is saying

Across the exported pages, the site holds a deliberate tension:

- editorial but not elitist
- warm but not cute
- structured but not corporate

This tension is essential to preserve.

### Meaning of the core visual ingredients

- **Yellow is not decorative**
  - It signals invitation, warmth, visibility, optimism, action, momentum
- **Charcoal creates credibility**
  - It prevents the brand from becoming shallow or overly playful
- **Warm off-white / light grey creates editorial calm**
  - It softens the site and avoids sterile SaaS energy
- **Photography proves humanity**
  - People are central; the site sells community and cultural belonging
- **Serif headlines = authority + thoughtfulness**
- **Sans UI text = usability + clarity**
- **Curves and rounded cut-outs = human imperfection**
  - They keep the system from feeling rigid or generic

### Emotional promise

**Sparking belonging through language, culture, and people.**

The site should consistently frame Hebrew as:

- a social bridge
- a cultural identity layer
- a real human community experience

not merely as an academic product.

### Design stance

**Editorial storytelling merged with productized clarity.**

The references feel closer to:

- magazines
- cultural institutions
- podcast brands
- learning brands with taste

and less like:

- admin dashboards
- conventional EdTech SaaS
- conversion-heavy template marketing sites

---

## 4) Non-negotiable brand principles

| Principle | Implementation meaning |
|---|---|
| **Belonging first** | Every major section should help the visitor imagine themselves inside a living community. Prioritize faces, quotes, events, classes, stories, and human proof. |
| **Editorial clarity** | Layouts should feel curated and intentional. Prefer strong headlines, controlled whitespace, and balanced asymmetry over busy marketing collage. |
| **Warm confidence** | Use bold contrast and clear CTAs, but avoid shouting. Energy should come from contrast, scale, and yellow—not gimmicks. |
| **Real over generic** | Use real people, real places, real Citizen moments. Avoid sterile stock-photo tropes and generic tech illustration. |
| **Modular consistency** | Page variety should come from combining recurring module families, not inventing new visual systems per page. |
| **Imperfect humanity** | Rounded edges, hand-touched lines, irregular editorial spacing, and mixed-media touches keep the brand alive. Over-smoothing weakens it. |

### Review rule for agents

A module can be technically correct and still be wrong if it feels:

- too rigid
- too dense
- too cold
- too generic
- too SaaS
- too polished in a synthetic way

---

## 5) Color system

The source document includes explicit primary values and inferred support neutrals.

### Canonical brand tokens

| Token | Value | Role | Rule |
|---|---:|---|---|
| `brand.yellow` | `#F9E24C` | Primary accent, CTA buttons, highlights, marker words, key shapes | Use confidently but sparingly. Yellow should direct attention, not flood the whole interface. |
| `brand.charcoal` | `#373230` | Primary dark surface, headline text, footer backgrounds, dark banners | Prefer this over pure black. It gives the system weight and premium warmth. |
| `brand.white` | `#FFFFFF` | High-contrast inverse text or clean fields | Use as a utility color, not necessarily as the main site background. |

### Supporting neutrals inferred from the design bible and comps

| Token | Approx value | Use |
|---|---:|---|
| `surface.base` | `#F2F1EC` to `#EEECE6` | Main page background, article canvas, neutral sections |
| `text.muted` | `#716C66` | Dates, durations, supporting metadata, captions |
| `line.subtle` | `#D2CEC6` | Dividers, card strokes, subtle separators |

### Color usage rules

- Do **not** replace the warm neutral background with pure white site-wide
- Prefer **charcoal text on yellow**, not white text on yellow
- Yellow should indicate meaning:
  - CTA
  - marker words
  - loops
  - badges
  - numerical emphasis
  - active attention points
- Derive accessible hover / pressed states for yellow intentionally
- Avoid improvising different yellow behaviors page by page

### Practical color hierarchy for implementation

```yaml
colors:
  brand:
    yellow: "#F9E24C"
    charcoal: "#373230"
    white: "#FFFFFF"
  surface:
    base: "#F2F1EC"   # acceptable range from comps: #F2F1EC–#EEECE6
    raised: "#FFFFFF"
    dark: "#373230"
  text:
    primary: "#373230"
    muted: "#716C66"
    inverse: "#FFFFFF"
  border:
    subtle: "#D2CEC6"
```

---

## 6) Typography system

The source file defines a dual-type system with explicit intent.

### Font families

- **Fedra**
  - used for marketing and brand expression
  - campaigns
  - landing pages
  - editorial content
  - hero moments
- **Assistant**
  - used for product, web interface, and functional content
  - navigation
  - forms
  - buttons
  - UI labels
  - system text

### Core typography principle

- **Assistant = system**
- **Fedra = voice**

### Usage rules

- Use **Assistant** by default for:
  - navigation
  - labels
  - buttons
  - forms
  - general body copy
  - metadata
- Use **Fedra** selectively for:
  - H1 / hero headlines
  - H2 section titles
  - editorial emphasis
  - narrative page moments

### Avoid

- mixing both fonts inside the same small UI component
- using Fedra for dense UI
- replacing serif display with sans everywhere “for convenience”

### Recommended structural hierarchy

```yaml
typography:
  font-family-primary: "Assistant"
  font-family-brand: "Fedra"
  roles:
    display.hero:
      font: "Fedra"
      use: "hero headlines"
    heading.h1:
      font: "Fedra"
      use: "major page title"
    heading.h2:
      font: "Fedra"
      use: "section title"
    body.default:
      font: "Assistant"
      use: "body copy"
    ui.label:
      font: "Assistant"
      use: "labels, nav, controls"
    meta.small:
      font: "Assistant"
      use: "dates, durations, bylines"
    button.label:
      font: "Assistant"
      use: "CTA and control labels"
```

### Technical rules

- define both font families as tokens
- provide fallback stacks, especially for Fedra
- keep body line-height at **>= 1.4**
- avoid overly tight tracking in longer paragraphs

---

## 7) Logo and symbol usage

The document identifies three logo contexts:

- centered lockup for hero / major brand moment
- left-positioned lockup for header / footer
- large standalone symbol for oversized brand use or signage

### Rules

- Treat the circular mark as a **real brand asset**, not a decorative doodle
- Maintain generous clear space
- Use the full lockup in navigation/header contexts
- Use the symbol alone only when the brand is already established in context
- Do not recolor beyond approved palette without explicit art direction
- Do not shrink the lockup until “TEL AVIV” becomes illegible

---

## 8) Layout grammar

The page comps vary, but they clearly share one structural grammar.

### Repeating layout behavior

- slim, light header
  - logo left
  - simple nav
  - yellow CTA right
- alternating **full-bleed bands** and **contained blocks**
- generous side margins
- generous vertical whitespace
- repeated CTA bands near page bottoms
- repeated dark sections for contrast and pacing
- recurring rounded-corner / curved-cut modules

### Layout primitives to implement

| Primitive | Observed behavior | Implementation note |
|---|---|---|
| `Container` | Wide desktop content with generous side margins; some modules intentionally bleed wider | Use multiple max-width tokens, not one container |
| `Section spacing` | Large breathing room between modules | Create spacing tiers: compact / regular / spacious / feature |
| `Corner radius` | Mostly subtle, plus signature quarter-circle / swoop moments | Tokenize standard radius separately from signature curve |
| `Borders` | Thin neutral borders around cards, tiles, inputs | One subtle border token should cover most surfaces |
| `Divider lines` | Long soft rules between episodes and content groups | Keep consistent color, thickness, spacing |

### Layout implication for agents

Do **not** treat every page as a single central column of identical sections.  
The rhythm comes from contrast between:

- wide and contained
- light and dark
- image-heavy and text-heavy
- editorial and utilitarian
- neutral and yellow-accented

---

## 9) Reusable module families

The source explicitly recommends building the website around module families and mapping pages to sequences of those modules.

### Canonical modules

| Module family | What it must support |
|---|---|
| **Primary hero** | Left or center-aligned headline + supporting copy + image/video asset + primary CTA. May include highlighted keywords, stats tiles, or play button. |
| **Stat / proof tiles** | Small bordered cards with icon + value + descriptor. Needs consistent min-height, icon sizing, and responsive wrapping. |
| **Level / tier cards** | Large cards for Foundation / Flow / Freedom or level-specific explanations. Includes title, short description, item list, CTA. Some use pronounced curved bottom corners. |
| **Image + text split banner** | Yellow/photo or charcoal/yellow split compositions with CTA. Strong recurring pattern. |
| **Teacher / person cards** | Photo-led cards with name, role, and optional label, icon, or play state. |
| **Content cards** | Blog / magazine / community cards with image, title, byline, reading time, border, neutral background. |
| **Podcast list row** | Thumbnail, episode number, headline, date, duration, CTA, divider line. Must collapse gracefully on smaller screens. |
| **Newsletter / lead form band** | Bright yellow band with short headline, 2–4 fields, consent text, strong submit CTA. Needs compact and full variants. |
| **Quote / testimonial strip** | Dark section with multiple light quote cards and subtle structural lines/grid. |
| **Footer** | Spacious charcoal footer with grouped nav, newsletter field, social links, legal text. |

### Build recommendation

Create the design system as:

1. layout primitives
2. module family components
3. page templates composed from those modules

This reduces drift and keeps future pages on-brand.

---

## 10) Interaction and control rules

### Buttons

Primary CTA buttons should be:

- yellow fill
- dark text
- compact rectangular shape
- lightly rounded corners
- medium weight
- clear hover and focus states

### Forms

Forms should be:

- visually simple
- white inputs on yellow or neutral surfaces
- thin subtle borders
- concise placeholders / labels
- polished consent rows
- not browser-default-looking

### Audio / media controls

The podcast page implies a need for custom media chrome:

- minimal
- elegant
- yellow used as progress accent
- never loud or skeuomorphic

### Component behavior table

| Element | Spec intent | Avoid |
|---|---|---|
| `Primary button` | Yellow fill, dark text, clear hover/focus, generous horizontal padding | tiny CTAs, pill shapes, heavy shadows |
| `Text link CTA` | Dark text with subtle arrow / chevron when relevant | generic blue-link defaults, excessive underlining |
| `Input field` | White surface, subtle border, high legibility, strong accessibility states | heavy borders, dense placeholders |
| `Checkbox row` | Small control + concise legal text + tap-friendly spacing | browser-default checkbox with misaligned text |
| `Card hover state` | Gentle lift, border-darken, or mild image motion | e-commerce-like dramatic hover animation |

---

## 11) Imagery and illustration rules

Photography is not filler. It is a core proof layer.

### Required imagery qualities

Prioritize:

- real Citizen teachers
- real students
- real environments
- candid moments
- group class scenes
- cultural activity
- portraits with warmth and specificity

### Avoid

- sterile tech-office stock
- over-retouched skin
- generic laptop-person visuals
- staged-diversity clichés
- empty “modern startup” illustration language

### Graphic overlays

Yellow loops, markers, and editorial overlays are allowed when:

- they feel integrated
- they support composition
- they do not become sticker spam

### Mixed-media usage

Illustration or editorial collage is suitable especially for:

- Citizen Life / community
- blog cards
- cultural storytelling
- podcast / content brand expressions

---

## 12) Page family behavior

### Home

- Most modular
- Mixes method, proof, people, community, content, testimonials, CTA bands
- Treat as a showcase assembly of reusable modules

### Courses / Levels / Foundation

- Most product-oriented
- Need level hierarchy, card system, and conversion structure
- Schedule-friendly layouts matter

### Method / How It Works

- Narrative explainer pages
- Need deliberate module sequencing and pacing

### Community / Blog / Blog Post

- Strong editorial side of the brand
- Require reusable content model and article card templates

### Podcast

- Sub-brand feel
- Oversized display typography
- custom media UI
- still must preserve global header/footer and CTA logic

### Corporate

- More brochure / B2B in information hierarchy
- still clearly Citizen
- should include trust signals and strong form UX

### Our Story / Team

- Documentary / institutional trust pages
- should support people grids, mission storytelling, and timeline / milestone patterns

---

## 13) Motion tone

Motion should feel:

- calm
- confident
- editorial
- restrained

### Favor

- soft fades
- subtle slides
- image crop shifts
- modest reveal-on-scroll
- clear but restrained CTA state changes

### Avoid

- bouncy motion
- flashy yellow animation
- overly playful interactions
- performance-heavy reveal systems that hide content without JS

---

## 14) Implementation token proposal

The original document explicitly suggests converting the bible into a token sheet + component inventory + page-template map.

### Token groups

| Token group | Examples | Status | Notes |
|---|---|---|---|
| Colors | `brand.yellow`, `brand.charcoal`, `surface.base`, `line.subtle` | Ready to define | Primary values known; some neutrals still need final Figma extraction |
| Typography | `display.hero`, `heading.h1`, `body.default`, `meta.small`, `button.label` | Partially inferred | Final font weights / exact styles should be checked against source design files |
| Spacing | `space.xs`, `space.sm`, `space.md`, `space.lg`, `space.xl`, `space.section` | Needs extraction | Should be measured from Figma to reduce drift |
| Radius | `radius.sm`, `radius.md`, `radius.signatureCurve` | Needs extraction | Signature curve may require special handling, not just border-radius |
| Shadows / elevation | `elevation.none`, `elevation.cardHover` | Minimal | Depth should remain very restrained |
| Borders | `border.default`, `border.strong` | Ready to derive | Elegant thin-rule system |
| Breakpoints | `mobile`, `tablet`, `desktop`, `wide` | Needs layout review | Responsive intention exists, but exact breakpoints need formalization |

### Suggested starter design-token scaffold

```yaml
tokens:
  colors:
    brand.yellow: "#F9E24C"
    brand.charcoal: "#373230"
    brand.white: "#FFFFFF"
    surface.base: "#F2F1EC"
    text.muted: "#716C66"
    line.subtle: "#D2CEC6"

  typography:
    font.family.primary: "Assistant"
    font.family.brand: "Fedra"
    role.display.hero: { family: "Fedra" }
    role.heading.h1: { family: "Fedra" }
    role.heading.h2: { family: "Fedra" }
    role.body.default: { family: "Assistant" }
    role.meta.small: { family: "Assistant" }
    role.button.label: { family: "Assistant" }

  spacing:
    space.xs: "to extract from design source"
    space.sm: "to extract from design source"
    space.md: "to extract from design source"
    space.lg: "to extract from design source"
    space.xl: "to extract from design source"
    space.section: "to extract from design source"

  radius:
    radius.sm: "standard small rounding"
    radius.md: "card/input rounding"
    radius.signatureCurve: "large quarter/swoop treatment"

  borders:
    border.default:
      color: "#D2CEC6"
      width: "1px"
      style: "solid"
```

---

## 15) Guardrails and failure modes

The source document is very clear that these are brand-damaging mistakes.

### Do not do these things

- over-standardize until the site feels like a generic component library
- use pure white everywhere
- replace serif headlines with sans across the site
- use yellow as a large background fill too often
- leave forms, consent rows, or metadata in browser-default styles
- allow inconsistent card radii / paddings / borders between page families
- use poor-quality or generic stock imagery
- over-polish the site until it loses editorial life
- over-animate hover/motion until it feels commercial or gimmicky

---

## 16) What an AI agent should do with this document

An agent consuming this file should interpret it as a **design-system and page-architecture brief**.

### Expected agent outputs

Depending on role, the next artifacts should be:

1. **Design tokens**
   - color tokens
   - typography tokens
   - spacing tokens
   - border/radius tokens
   - motion rules

2. **Component inventory**
   - hero
   - CTA band
   - content card
   - testimonial strip
   - level card
   - footer
   - etc.

3. **Page template map**
   - Home = module sequence
   - Courses = module sequence
   - Blog Post = article + side modules
   - Corporate = trust + brochure + form layout
   - etc.

4. **Implementation guardrails**
   - acceptance criteria
   - visual QA checklist
   - brand drift checklist

### Suggested execution order

```text
1. Define tokens
2. Build layout primitives
3. Build reusable module families
4. Map each page family to module sequences
5. Add motion rules
6. QA against guardrails
```

---

## 17) Acceptance criteria for implementation

A page is on-brand when it satisfies all of the following:

- feels editorial, warm, and structured
- uses yellow as emphasis, not wallpaper
- preserves warm off-white background logic
- uses Fedra selectively for voice and emphasis
- uses Assistant for UI and system clarity
- foregrounds real people and real culture
- has generous whitespace and pacing
- uses recurring module families rather than ad hoc inventions
- contains refined inputs, consent rows, and CTA states
- feels distinctly Citizen Café and distinctly Tel Aviv-cultural rather than generic EdTech

A page is off-brand when it feels:

- too white
- too black
- too playful
- too SaaS
- too sterile
- too dense
- too symmetrical
- too templated
- too stock-photo-driven
- too “growth marketing” in tone

---

## 18) Condensed implementation brief for autonomous agents

```yaml
project_intent:
  brand_promise: "Warm belonging through modern Hebrew, culture, and real human connection."
  design_character: "Editorial + human + structured."
  engineering_directive: "Build a reusable modular website system, not one-off pages."

must_feel_like:
  - warm
  - alive
  - cultural
  - thoughtful
  - editorial
  - human
  - premium but approachable

must_not_feel_like:
  - generic SaaS
  - sterile edtech
  - shallow playful startup branding
  - rigid corporate brochure
  - stock-template marketing site

core_system:
  typography:
    expressive: "Fedra"
    functional: "Assistant"
  colors:
    primary_accent: "#F9E24C"
    grounding_dark: "#373230"
    base_surface: "#F2F1EC"
  visual_motifs:
    - thin borders
    - large whitespace
    - curved corner moments
    - human photography
    - restrained editorial asymmetry

reusable_modules:
  - primary_hero
  - proof_tiles
  - level_cards
  - image_text_split_banner
  - teacher_cards
  - content_cards
  - podcast_rows
  - newsletter_band
  - testimonial_strip
  - global_footer

guardrails:
  - do_not_replace_neutral_background_with_pure_white
  - do_not_remove_serif_display_voice
  - do_not_overuse_yellow_backgrounds
  - do_not_use_browser_default_form_styling
  - do_not_use_generic_stock_imagery
  - do_not_flatten_editorial_character_into_generic_component_library
```

---

## 19) Final note

This file represents a **translation of the design bible into execution language**.  
It should be used by product, design, engineering, and AI agents as a shared source of truth for:

- tokenization
- component architecture
- page composition
- visual QA
- future site extension

The central idea to preserve is simple:

> Citizen Café should feel like a warm, modern, culturally alive world that people want to belong to.

