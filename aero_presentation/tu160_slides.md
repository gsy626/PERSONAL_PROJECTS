# Tupolev Tu-160 "White Swan" — 5-minute deck

Slide-by-slide content plus a spoken script for every page. Titles are one or two words.
Slide text stays short; the script is in full sentences, written to be read aloud.

**Data source of record:** Jane's All the World's Aircraft 2003–04 via Wikipedia; USAF B-1B fact
sheet; Kremlin transcripts for the two presidential flights. Published Tu-160 figures vary
(built 35–41; payload 40 t or 45 t) — quote one source and stay with it.

**Script length:** 689 words — 4:54 at 145 words per minute, about 5:04 at 140. Counts are given
per page, so you can cut or add where you need to.

---

## Timing

| Page | Title | Time | Words |
|---|---|---|---|
| 1 | Title | 0:00–0:08 | 20 |
| 2 | Outline | 0:08–0:17 | 22 |
| 3 | §1 The Aircraft | 0:17–0:19 | — |
| 4 | Background | 0:19–0:53 | 82 |
| 5 | Design | 0:53–1:22 | 71 |
| 6 | §2 Flight | 1:22–1:24 | — |
| 7 | Aerodynamics | 1:24–2:05 | 98 |
| 8 | Engines | 2:05–2:34 | 70 |
| 9 | §3 Performance | 2:34–2:36 | — |
| 10 | Weapons | 2:36–2:59 | 56 |
| 11 | History | 2:59–3:21 | 54 |
| 12 | The President | 3:21–4:00 | 94 |
| 13 | §4 Challenges | 4:00–4:02 | — |
| 14 | Trade-offs | 4:02–4:32 | 72 |
| 15 | Takeaways | 4:32–4:53 | 50 |
| 16 | Closing | 4:53–4:54 | — |

> Section pages are given two seconds each, for the transition. If you speak more slowly than
> 145 wpm, drop the Outline page (9 s) and trim page 12 by one sentence.

---

## 1 · Title

**On slide**

> **Tupolev Tu-160**
> White Swan: the largest, fastest bomber ever built
>
> EXPLORING THE MYSTERIES OF FLIGHT
> Presented by [Your Name] · November 2026

**Script** (20 words)
"Good morning. Today I want to talk about one aircraft: the Tupolev Tu-160, the largest and fastest bomber ever built."

---

## 2 · Outline

**On slide**

| | | |
|---|---|---|
| **01** | **The Aircraft** | Why it exists, and what it is |
| **02** | **Flight** | Sweep, wave drag and thrust |
| **03** | **Performance** | Weapons and service record |
| **04** | **Challenges** | Trade-offs, and what remains |

**Script** (22 words)
"I will begin with the background, then the design and the aerodynamics, then the weapons and the history, and finally the trade-offs."

---

## 3 · §1 The Aircraft

`\bitsectionintro{Role, story and design at a glance}`

---

## 4 · Background

**On slide**

- 1967: first Soviet competition for a supersonic heavy bomber
- 1972: requirement fixed at Mach 2.3 and variable geometry, in answer to the American B-1
- Three bureaus competed; Tupolev won with the 160M, using experience from the Tu-144
- First flight 18 December 1981 · production at Kazan from 1984

**Visual** B-1B photograph beside the Tu-160, captioned "the aircraft it was built to answer".
Use a USAF photograph (public domain) from
[Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Rockwell_B-1_Lancer) — for
example `2021-10-11 B-1B in Spangdahlem 2.jpg`; check the licence line on the file page.

**Script** (82 words)
"Let me start with where the aircraft came from. In 1967 the Soviet Union began looking for a new heavy bomber, and by 1972 the requirement was clear: a variable-geometry aircraft able to reach Mach 2.3, as an answer to the American B-1. Tupolev won the competition with the 160M, which borrowed from the Tu-144. The prototype flew in December 1981, and production began at Kazan in 1984. It was not a copy of the B-1, but the Soviet answer to it."

**Source** Wikipedia (Development); FAS programme history.

---

## 5 · Design

**On slide**

| Parameter | Tu-160 | B-1B |
|---|---|---|
| Length | 54.1 m | 44.5 m |
| Span, 20° / 65° | 55.7 / 35.6 m | 41.8 / 24.1 m |
| Max take-off | 275 t | 216 t |
| Max speed | Mach 2.05 | Mach 1.25 |
| Internal payload | 45 t | 34 t |

- 27% heavier and about 60% faster than the B-1B
- The B-1B traded speed for a smaller radar signature; the Tu-160 refused that trade
- The result is visible on radar from much further away

**Script** (71 words)
"These numbers explain the aircraft better than any description. It is 54 metres long, weighs 110 tonnes empty and 275 at take-off, carries 45 tonnes of weapons internally, and still reaches Mach 2.05. Next to the B-1B it is ten metres longer, sixty tonnes heavier and sixty per cent faster. That is not an accident: the B-1B gave up speed to be harder to detect, and the Tu-160 refused that trade."

**Source** Jane's; USAF B-1B fact sheet.

---

## 6 · §2 Flight

`\bitsectionintro{Sweep, wave drag and thrust}`

---

## 7 · Aerodynamics

**On slide — the calculation**

```
Normal Mach number:      M_n = M · cos θ

θ = 20°:   M_n = 2.05 × cos 20° = 2.05 × 0.940 = 1.93   → supersonic, wave drag
θ = 65°:   M_n = 2.05 × cos 65° = 2.05 × 0.423 = 0.87   → subsonic, attached

Aspect ratio:            AR = b² / S
   wings forward:        55.7² / 400 = 7.76
   wings swept:          35.6² / 360 = 3.52

Wing loading at 275 t:   275,000 / 400 = 688 kg/m²   (forward)
                         267,600 / 360 = 743 kg/m²   (swept)

Stagnation temperature:  T₀ = T (1 + 0.2 M²) = 216.65 × 1.8405 = 398.7 K ≈ 125 °C
```

- The wing only feels the component normal to the leading edge
- Sweep trades aspect ratio for wave drag: induced drag scales as 1/AR, so 65° pays only when C_L is small

**Chart** M_n against sweep angle for M = 2.05, with the M_n = 1 line and points at 20° and 65°.

**Script** (98 words)
"The wing is where the design becomes interesting. A swept wing feels only the component of flow normal to its leading edge, so M normal equals M times cosine theta. At Mach 2.05 and 20 degrees, cosine is 0.94, giving 1.93: supersonic, with strong wave drag. At 65 degrees, cosine is 0.42, giving 0.87: subsonic, so the flow stays attached. In effect, the wing thinks it is flying at Mach 0.87 while the aircraft is doing two. Sweep also cuts aspect ratio from 7.8 to 3.5, and induced drag rises, so 65 degrees is only for the dash."

**Source** Own calculation from geometry in Jane's; standard sweep theory; ISA at 12 km.

---

## 8 · Engines

**On slide**

```
Installed thrust:   4 × 245 kN            = 0.98 MN
Weight:             275 t × 9.81 m/s²     = 2.70 MN
Thrust/weight:      0.98 / 2.70           = 0.36

Drag at Mach 2:     D = W / (L/D) = 2.70 / 6 = 0.45 MN
Excess thrust:      0.98 − 0.45            = 0.53 MN
```

- 4 × Kuznetsov NK-32: 137 kN dry, 245 kN with reheat
- Variable ramps schedule oblique shocks, which keeps pressure recovery usable at Mach 2
- The engines are sized for the dash, not the cruise — hence the long runway and the low T/W

**Script** (70 words)
"To accelerate 275 tonnes you need a great deal of thrust. Four NK-32 engines give 245 kilonewtons each with afterburner, about 980 in total. Thrust to weight is 0.36, which is low, and deliberately so. At Mach 2 the lift-to-drag ratio is about six, so drag is 2.7 meganewtons divided by six, around 0.45. That leaves half a meganewton of excess thrust, and the variable intake ramps make it possible."

**Source** Jane's (static, reheat); drag from D = W/(L/D).

---

## 9 · §3 Performance

`\bitsectionintro{Weapons and service record}`

---

## 10 · Weapons

**On slide**

- Two internal bays, 45 t, rotary launchers: twelve cruise missiles
- Kh-55SM / Kh-101 / Kh-555, ranges up to 3,000 km
- Combat radius 7,300 km subsonic, 2,000 km at Mach 1.5
- No defensive armament — the first post-war Soviet bomber without guns
- Survivability comes from distance

**Script** (56 words)
"The Tu-160 is not meant to fly into defended airspace. It carries twelve cruise missiles on two rotary launchers, with ranges up to three thousand kilometres. That is further than most air defences reach, so it launches from outside the threat envelope and turns away. It has no defensive guns, and its survival depends on distance."

**Source** Wikipedia (armament); FAS.

---

## 11 · History

**On slide**

`1981` first flight · `1987` service entry · `1992` production stops ·
`1999` Ukraine returns 8 · `2015` Syria debut · `2022` new-build M · `2024` in series

- About 36 built; roughly 17 in service
- 44 world records, including a 23-hour, 18,000 km patrol in 2010

**Script** (54 words)
"The service record is unusual. First flight in 1981, service in 1987, then production stopped when the Soviet Union collapsed. Ukraine returned eight aircraft in 1999 for gas debts. The type made its combat debut in Syria in 2015, and in 2022 a new-build Tu-160M flew again, so the Kazan line had been restarted."

**Source** Wikipedia; Airforce Technology.

---

## 12 · The President

**On slide**

**16 August 2005 · Olenegorsk, Kola Peninsula**

Putin took the commander's seat for a five-hour flight of more than 5,000 km, with in-flight
refuelling, a supersonic run, and four Kh-555 missiles fired. All four hit an abandoned building
on the Pemboy range: two went through the windows, two through the doors.

**22 February 2024 · Kazan**

Thirty minutes in a new-build Tu-160M, *Ilya Muromets*. "The technology is excellent. It really
belongs to a new generation."

**Visual** Photograph of Putin with the crew after the 2005 flight (kremlin.ru, CC BY 4.0).

**Script** (94 words)
"Two flights tell the political story. On 16 August 2005, after the MAKS air show, Vladimir Putin flew in a Tu-160 to Olenegorsk on the Kola Peninsula, in the commander's seat. The flight lasted five hours and covered five thousand kilometres, with refuelling, a supersonic run, and four Kh-555 missiles fired. All four hit an abandoned building on the Pemboy range: two through the windows, two through the doors. Nineteen years later he flew for thirty minutes in a new-build Tu-160M from Kazan. The first flight showed precision; the second certified the restarted line."

**Source** kremlin.ru (16 Aug 2005; 22 Feb 2024); TASS.

---

## 13 · §4 Challenges

`\bitsectionintro{Trade-offs and open questions}`

---

## 14 · Trade-offs

**On slide**

| What the design buys | What it costs |
|---|---|
| Range and payload no other bomber matches | Radar cross-section you cannot hide |
| Supersonic dash, short-field capability | 6 t hinge, heavy maintenance burden |
| Design experience from the Tu-144 programme | 1980s avionics: electromechanical cockpit, no HUD |
| A proven standoff missile platform | About 17 airframes, high cost per hour |

- The avionics are the weakest part of the original aircraft, and the main reason the M upgrade exists
- Not a stealth aircraft, and never meant to be
- Open question: a missile truck this size, in an age of drones and hypersonics

**Script** (72 words)
"Every advantage has a price. The size that gives range gives a radar cross-section you cannot hide. The wing that gives Mach 2 costs six tonnes of hinge and heavy maintenance. The avionics are another weakness: the original cockpit is full of electromechanical instruments, with no head-up display, which is one reason the M version exists. The fleet is small, so each flight hour is expensive. Even so, the design is coherent."

**Source** Wikipedia (design, avionics); Airforce Technology.

---

## 15 · Takeaways

**On slide**

1. **A clear design point beats a balanced one** — speed, range and payload, signature accepted
2. **Variable sweep is the enabler and the cost** — six tonnes of hinge for Mach 2 and a 3 km runway
3. **Weapons age better than airframes** — new missiles keep a 1981 airframe relevant

**Script** (50 words)
"Three lessons. First, a clear design point beats a balanced one: this aircraft chose speed, range and payload, and accepted the signature. Second, variable sweep is both the enabler and the cost. Third, an airframe stays relevant for forty years if its weapons improve faster than its wings. Thank you."

---

## 16 · Closing

`\bitclosingpage{Thank You}{Questions & discussion}`

---

## Files and credits

| File | What it is |
|---|---|
| `main.tex` | Beamer source, `bitbeamer` theme, 16:9 |
| `main.pdf` | compiled deck, 16 pages |
| `assets/photos/Tupolev_Tu-160.jpg` | Tu-160 on display, Kobel, public domain |
| `assets/photos/krem1.jpg` | Putin with the crew, 16 Aug 2005, kremlin.ru, CC BY 4.0 |

The Markdown uses θ for the sweep angle; the TikZ chart in `main.tex` still uses Λ, so the two
symbols need to be made consistent when the slides are updated.
