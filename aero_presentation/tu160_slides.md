# Tupolev Tu-160 "White Swan" — 5-minute deck

Slide-by-slide content with a spoken script for every page. The script follows the sources closely —
Wikipedia, FAS, Airforce Technology and the Kremlin transcripts. Chinese glosses in brackets are
vocabulary notes, not part of the slide text.

**Data source of record:** Jane's All the World's Aircraft 2003–04 via Wikipedia; USAF B-1B fact
sheet; Kremlin transcripts for the two presidential flights.

**Script length:** 738 words — 5:06 at 145 words per minute. The derivation on
page 4 is the longest single block; if you need a hard 5:00, cut it to steps 3, 6 and 8.

---

## Timing

| Page | Time | Words |
|---|---|---|
| 1 Title | 0:00–0:08 | 19 |
| 2 Outline | 0:08–0:21 | 31 |
| 3 Background | 0:21–0:52 | 74 |
| 4 Design — Wing | 0:52–1:49 | 138 |
| 5 Design — Engines | 1:49–2:19 | 73 |
| 6 Specs — General | 2:19–2:38 | 46 |
| 7 Specs — Performance | 2:38–2:59 | 51 |
| 8 Armament | 2:59–3:33 | 81 |
| 9 History | 3:33–4:33 | 144 |
| 10 Challenges | 4:33–5:03 | 73 |
| 11 Closing | 5:03–5:06 | 8 |

---

## 1 · Title

**On slide**

> **Tupolev Tu-160**
> White Swan: the largest, fastest bomber ever built, the last strategic bomber designed for the
> Soviet Air Forces
>
> EXPLORING THE MYSTERIES OF FLIGHT
> Presented by 郭绍宇 · 24 November 2026

**Image** `assets/photos/Tupolev_Tu-160.jpg` — Tu-160 on static display, anti-flash white paint.
Credit: Kobel, public domain, via Wikimedia Commons.

**Script** (19 words)
"Good morning. The aircraft I want to present is the Tupolev Tu-160, the largest and fastest bomber ever built."

---

## 2 · Outline

**On slide**

| | | |
|---|---|---|
| **01** | **Background** | Why the aircraft exists |
| **02** | **Design** | Swing wing and four engines |
| **03** | **Specifications** | Dimensions, weights, performance |
| **04** | **Armament** | Twelve cruise missiles |
| **05** | **History** | Service record and two presidential flights |
| **06** | **Challenges** | What the design costs |

**Script** (31 words)
"I will begin with the background of the programme, then describe the wing and the engines, give the main specifications, and turn to the armament, the history and finally the trade-offs."

---

## 3 · Background

**On slide**

- The first competition for a supersonic strategic heavy bomber was launched in 1967.
- In 1972 a new competition called for a supersonic, variable-geometry bomber with a maximum speed of Mach 2.3, in response to the American B-1.
- The Tupolev design, named Aircraft 160M, incorporated(吸收) elements of the Tu-144 and competed against the Myasishchev M-18 and the Sukhoi T-4.
- The prototype flew on 18 December 1981, and production was authorised at Kazan in 1984.

**Image** Three small pictures in the right-hand column:
(1) B-1B photograph, captioned "the aircraft it was built to answer" —
[File:2021-10-11 B-1B in Spangdahlem 2.jpg](https://commons.wikimedia.org/wiki/File:2021-10-11_B-1B_in_Spangdahlem_2.jpg),
U.S. Air Force photo by Staff Sgt. Chance Nardone, public domain.
(2) Myasishchev M-18 — [File:Самолёт М-18.jpg](https://commons.wikimedia.org/wiki/File:Самолёт_М-18.jpg),
check the licence on the file page.
(3) Sukhoi T-4 — [File:Sukhoi T-4 (Monino museum).JPG](https://commons.wikimedia.org/wiki/File:Sukhoi_T-4_(Monino_museum).JPG),
check the licence on the file page.
Captions: "the two losing designs" under (2) and (3).

**Script** (74 words)
"The first competition for a supersonic strategic heavy bomber was launched in the Soviet Union in 1967, and in 1972 a new competition called for a supersonic, variable-geometry bomber with a maximum speed of Mach 2.3, in response to the American B-1. The Tupolev 160M incorporated elements of the Tu-144 and beat the Myasishchev M-18 and the Sukhoi T-4, and the prototype flew on 18 December 1981, with production authorised at Kazan in 1984."

**Source** Wikipedia (Development); FAS programme history.

---

## 4 · Design

### Variable-Geometry Wing

**On slide — the derivation, step by step**

```
Given: wing area S, span b, streamwise chord c, so S = b · c.
Shear the wing through the sweep angle θ.

1  Resolve the flow normal to the leading edge:
       V_n = V cos θ        (the spanwise component does no lifting work)

2  The chord measured normal to the swept edge is the streamwise chord
   projected onto that direction:
       c_n = c cos θ

3  Equivalent (normal) area — the area the normal flow actually sees:
       A_e = b · c_n = b c cos θ = S cos θ

4  Dynamic pressure and Mach number normal to the edge:
       q_n = ½ ρ V_n² = q cos² θ          M_n = M cos θ

5  The section works in that normal flow, so its circulation is
       Γ = ½ V_n c_n C_l = ½ V c cos² θ · C_l

6  Kutta–Joukowski gives the lift per unit span, perpendicular to V:
       L′ = ρ V Γ = ½ ρ V² c cos² θ · C_l

7  Over the span b, with S = b c:
       L = b L′ = q S cos² θ · C_l

8  Hence the lift coefficient of the swept wing:
       C_L = L / (q S) = C_l cos² θ
```

- The factor cos²θ is 0.88 at 20° but only 0.18 at 65°, so the swept wing can only work at a small lift coefficient — which is exactly the supersonic case.
- Aspect ratio(展弦比): AR = b² / S = 55.7² / 400 = 7.76 forward, 35.6² / 360 = 3.52 swept.
- Induced drag C_Di = C_L² / (π e AR), so at a fixed C_L sweeping raises it by 7.76 / 3.52 ≈ 2.2 times.
- Wing loading: 275,000 / 400 = 688 kg/m² forward, 267,600 / 360 = 743 kg/m² swept.
- Titanium is about 30% of the 110 t empty weight, and the swing-wing hinge(铰链) alone weighs six tonnes.

**Image** Two planform outlines at 20° and 65°, with span dimensions 55.7 m and 35.6 m and the areas
400 m² and 360 m² marked; no Mach-number chart.

**Script** (138 words)
"The wing is the heart of the design. Shear a wing of area S through an angle theta, and the flow normal to the leading edge is only V cos theta, so the chord normal to that edge is c cos theta and the equivalent area the normal flow sees is S cos theta, with a dynamic pressure of q cos squared theta. The circulation is fixed by the normal section, gamma equals half V cos theta times c cos theta times C_l, and the Kutta–Joukowski theorem then gives a lift per unit span of rho V gamma, so the total lift is q S cos squared theta C_l and the lift coefficient falls as cos squared theta — only 0.18 at 65 degrees, which is why the wing is swept only when the lift coefficient is small."

**Source** Wikipedia (Design); Airforce Technology; derivation from standard sweep theory.

### Engines

**On slide**

```
Installed thrust:   4 × 245 kN            = 0.98 MN
Weight:             275 t × 9.81 m/s²     = 2.70 MN
Thrust/weight:      0.98 / 2.70           = 0.36

Drag at Mach 2:     D = W / (L/D) = 2.70 / 6 = 0.45 MN
Excess thrust:      0.98 − 0.45            = 0.53 MN
```

- Unlike the B-1B, which reduced the Mach 2+ requirement of the B-1A to achieve a smaller radar cross-section, the Tu-160 retained its variable intake ramps(斜道) and Mach 2.05 at altitude.
- Four Kuznetsov NK-32 afterburning(加力) turbofans(涡扇), the most powerful engines ever fitted to a combat aircraft: 137 kN dry, 245 kN with reheat.
- The variable ramps schedule oblique(倾斜) shocks(激波) and keep pressure recovery usable at Mach 2.
- The engines are sized for the dash(猛冲), not the cruise, hence the long runway and the low thrust-to-weight ratio.

**Script** (73 words)
"The aircraft has four Kuznetsov NK-32 afterburning turbofans, the most powerful engines ever fitted to a combat aircraft, each giving 245 kilonewtons with reheat for about 980 in total. Thrust-to-weight is only 0.36, but at Mach 2 the lift-to-drag ratio is about six, so drag at 275 tonnes is roughly 0.45 meganewtons and half a meganewton remains for acceleration and climb, with the variable intake ramps keeping pressure recovery usable at Mach 2."

**Source** Wikipedia (Design); Jane's; drag from D = W/(L/D).

---

## 5 · Specifications

### General characteristics

**On slide**

| Item | Value |
|---|---|
| Crew | 4 — pilot, co-pilot, bombardier, defensive systems officer |
| Length | 54.1 m (177 ft 6 in) |
| Wingspan | 55.7 m (182 ft 9 in) at 20°, 35.6 m (117 ft) at 65° |
| Height | 13.1 m (43 ft 0 in) |
| Wing area | 400 m² (4,300 sq ft) spread, 360 m² (3,875 sq ft) swept |
| Empty weight | 110,000 kg (242,508 lb) |
| Gross weight | 267,600 kg (589,957 lb) |
| Maximum take-off weight | 275,000 kg (606,271 lb) |
| Powerplant | 4 × Samara NK-32 afterburning turbofans, 137.3 kN (30,900 lbf) dry, 245 kN (55,000 lbf) with afterburner |

**Script** (46 words)
"The aircraft carries a crew of four — pilot, co-pilot, bombardier and defensive systems officer — and is 54.1 metres long, 13.1 metres high, with a wing area of 400 square metres and an empty weight of 110 tonnes, rising to 275 tonnes at maximum take-off."

**Source** Wikipedia (Specifications, Jane's data).

### Performance

**On slide**

| Item | Value |
|---|---|
| Maximum speed | Mach 2.05 (2,220 km/h at 12,200 m) |
| Cruise speed | 960 km/h / Mach 0.9 |
| Range | 12,300 km with six Kh-55SM and 5% fuel reserve |
| Combat range | 7,300 km subsonic, 2,000 km at Mach 1.5 |
| Service ceiling | 16,000 m (52,000 ft) |
| Rate of climb | 70 m/s (14,000 ft/min) |
| Lift-to-drag ratio | 18.5–19 subsonic, above 6 supersonic |
| Wing loading | 742 kg/m² with wings fully swept |
| Thrust/weight | 0.37 |

**Script** (51 words)
"At altitude the aircraft reaches Mach 2.05, about 2,220 kilometres per hour, and cruises at Mach 0.9; its practical range without refuelling is 12,300 kilometres, its combat range 7,300 kilometres subsonic, and its service ceiling 16,000 metres, while the lift-to-drag ratio falls from about nineteen subsonic to just above six supersonic."

**Source** Wikipedia (Specifications, Jane's data).

---

## 6 · Armament

**On slide**

- Two internal weapon bays for 45,000 kg (99,208 lb) of ordnance(军火).
- Two internal rotary(旋转) launchers, each holding 6 × Kh-55SM/101/102/555/BD cruise missiles (primary armament), or 12 × Kh-15 short-range nuclear missiles.
- Combat radius 7,300 km subsonic, or 2,000 km at Mach 1.5.
- No defensive weapons are provided; the Tu-160 was the first post-war Soviet bomber to lack them.

**Image** Two pictures: (1) a rotary launcher being loaded —
[File:Blackjack-loading-AS-16-DIA.jpg](https://commons.wikimedia.org/wiki/File:Blackjack-loading-AS-16-DIA.jpg),
U.S. Defense Intelligence Agency illustration, public domain; (2) a Kh-55 cutaway model —
[File:Ch-55 Schnittmodell.jpg](https://commons.wikimedia.org/wiki/File:Ch-55_Schnittmodell.jpg), check
the licence. There is no clean Kh-101 photograph on Commons (only debris from shoot-downs), so either
use the Kh-55 model and caption it as representative, or take a Kh-101 museum photo yourself.

**Script** (81 words)
"Weapons are carried in two internal bays, each capable of holding 22,500 kilograms of free-fall weapons or a rotary launcher for missiles, for a total weapons load of 45,000 kilograms — in practice twelve Kh-55, Kh-101 or Kh-555 cruise missiles with ranges of up to 3,000 kilometres — and no defensive weapons are provided, because the Tu-160 was the first post-war Soviet bomber to lack them; as a standoff missile carrier it survives by distance rather than by speed or stealth."

**Source** Wikipedia (Armament); FAS.

---

## 7 · History

**On slide**

`1981` first flight · `1987` service entry · `1992` production stops ·
`1999` Ukraine returns 8 · `2015` Syria debut · `2022` new-build M · `2024` in series

- Production stopped in 1992; Russia and Ukraine inherited 13 and 19 aircraft, and Russia later bought eight of the Ukrainian ones.
- About 36 aircraft were built, and roughly 17 remain in service.
- The type made its combat debut in Syria in 2015, and the first newly built Tu-160M flew in 2022.
- The Tu-160 holds 44 world records, including a 23-hour, 18,000 km patrol flown in 2010.

**16 August 2005 · Olenegorsk, Kola Peninsula**

Putin took the commander's seat for a five-hour flight of more than 5,000 km, with in-flight
refuelling, a supersonic run, and four Kh-555 missiles fired. All four hit an abandoned building
on the Pemboy range: two went through the windows, two through the doors.

**22 February 2024 · Kazan**

Thirty minutes in a new-build Tu-160M, *Ilya Muromets*: "The technology is excellent. It really
belongs to a new generation. Of course, it can be accepted by the Armed Forces."

**Image** Kremlin photograph of Putin with the crew after the 2005 flight
(`assets/photos/krem1.jpg`, kremlin.ru, CC BY 4.0), small, beside the 2005 paragraph.

**Script** (144 words)
"Production stopped in 1992, when Russia and Ukraine inherited thirteen and nineteen aircraft; Russia bought eight of the Ukrainian ones and the rest were scrapped. The type made its combat debut in Syria in 2015, and in 2022 the first new-build Tu-160M flew, so the Kazan line had been restarted after twenty years; about thirty-six were built, roughly seventeen remain, and the type holds forty-four world records, including a twenty-three-hour patrol of eighteen thousand kilometres in 2010. In August 2005 Putin flew to Olenegorsk in a Tu-160 and took the commander's seat, and during the five-hour flight the crews refuelled, went supersonic and launched four Kh-555 missiles, all of which hit a building at Pemboy, two through the windows and two through the door. In February 2024 he flew for thirty minutes in a new-build Tu-160M and said it belonged to a new generation."

**Source** Wikipedia (Operational history); Airforce Technology; kremlin.ru (2005, 2024); TASS.

---

## 8 · Challenges

**On slide**

| What the design buys | What it costs |
|---|---|
| Range and payload no other bomber matches | Radar cross-section you cannot hide |
| Supersonic dash and short-field capability | 6 t hinge(铰链), heavy maintenance |
| Design experience from the Tu-144 | 1980s avionics: electromechanical cockpit(驾驶舱), no HUD |
| A proven standoff missile platform | About 17 airframes, high cost per hour |

- In the cockpit all the data is presented on conventional electro-mechanical monitors, and updating them is one reason the M version exists.
- The design is coherent rather than compromised: it does one job better than anything else.

**Image** Photograph of the original cockpit —
[File:Всередині кабіни.JPG](https://commons.wikimedia.org/wiki/File:Всередині_кабіни.JPG), check the
licence; crop to the instrument panel and caption it "electromechanical instruments, no HUD".

**Script** (73 words)
"The size that gives range also gives a radar cross-section that cannot be hidden, and the wing that gives Mach 2 costs six tonnes of hinge and heavy maintenance, while in the cockpit all the data is presented on conventional electro-mechanical indicators rather than head-up displays. The fleet is small, about seventeen aircraft, so each flight hour is expensive, yet the design remains coherent because it does one job better than anything else."

**Source** Wikipedia (Design); Airforce Technology.

---

## 9 · Closing

**On slide**

`\bitclosingpage{Thank You}{Questions & discussion}`

**Script** (8 words)
"Thank you. I am happy to take questions."

---

## Files and credits

| File | What it is |
|---|---|
| `main.tex` | Beamer source, `bitbeamer` theme, 16:9 |
| `main.pdf` | last compiled deck, 16 pages — still the old structure |
| `assets/photos/Tupolev_Tu-160.jpg` | Tu-160 on display, Kobel, public domain |
| `assets/photos/krem1.jpg` | Putin with the crew, 16 Aug 2005, kremlin.ru, CC BY 4.0 |
| `assets/photos/B-1B.jpg` | B-1B at Spangdahlem, USAF/SSgt Chance Nardone, public domain |
| `assets/photos/M-18.jpg` | Myasishchev M-18 model, V. M. Myasishchev, CC BY-SA 4.0 |
| `assets/photos/T-4.jpg` | Sukhoi T-4 at Monino, Sergey Dukachev, CC BY-SA 3.0 |
| `assets/photos/loading.jpg` | rotary-launcher loading, DIA illustration, public domain |
| `assets/photos/Kh-55.jpg` | Kh-55 cutaway, Schneeleopard2, CC BY-SA 4.0 |
| `assets/photos/cockpit.jpg` | Tu-160 cockpit, Kseniia Pyvovarska, CC BY-SA 3.0 |

All pictures are now in `assets/photos/` with their credits on the slides. The Kh-55 image is the
cutaway engine, not the whole missile; there is still no clean Kh-101 photograph on Commons.
