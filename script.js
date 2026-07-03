/* ═══════════════════════════════════════════
   BAS WITMOND — PORTFOLIO  v3
   ═══════════════════════════════════════════ */


/* ────────────────────────────────────────────
   FIT NAME TO VIEWPORT WIDTH
   ──────────────────────────────────────────── */
const heroName = document.getElementById('heroName');
const heroWrap = document.getElementById('heroWrap');

function fitName() {
    if (!heroName || !heroWrap) return;
    const maxW = heroWrap.offsetWidth - 4;
    let size = 10;
    heroName.style.fontSize = size + 'px';
    while (heroName.scrollWidth < maxW * 0.98 && size < 500) {
        size += 2;
        heroName.style.fontSize = size + 'px';
    }
    while (heroName.scrollWidth > maxW && size > 1) {
        size -= 0.5;
        heroName.style.fontSize = size + 'px';
    }
}

document.fonts.ready.then(fitName);
window.addEventListener('resize', fitName);
fitName();


/* ────────────────────────────────────────────
   LOADER → split reveal
   ──────────────────────────────────────────── */
const loader    = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const nav       = document.getElementById('nav');

let prog = 0;
const fillTick = setInterval(() => {
    prog += 12 + Math.random() * 22;
    if (prog >= 100) {
        prog = 100;
        clearInterval(fillTick);
        loaderBar.style.width = '100%';

        setTimeout(() => {
            loader.classList.add('done');
            document.body.classList.remove('loading');
            nav.classList.add('vis');
            fitName();

            // Name starts in accent (lime), matching the loader panels
            heroName.style.color = 'var(--accent)';

            // Trigger per-letter clip-path reveal
            setTimeout(() => {
                heroWrap.classList.add('revealed');

                // After all letters revealed (~1.5s), fade name from lime → text
                setTimeout(() => {
                    heroName.style.transition = 'color 0.5s ease, opacity 0.1s linear';
                    heroName.style.color = 'var(--text)';
                    // Remove inline styles after transition so hover works normally
                    setTimeout(() => {
                        heroName.style.transition = '';
                        heroName.style.color = '';
                    }, 600);
                }, 1500);

                // Draw the horizontal rule (fires with hero-sub fadeUp at 1.8s)
                setTimeout(() => {
                    const rule = document.querySelector('.hero-rule');
                    if (rule) rule.classList.add('draw');
                }, 1800);

            }, 150);

            // Start wave animation after letters have revealed (~1.2s)
            setTimeout(() => {
                heroName.classList.add('wave');
            }, 1600);

            // Typewriter op hero subtitel
            const heroDisc = document.querySelector('.hero-disc');
            if (heroDisc) {
                const full = heroDisc.textContent.trim();
                heroDisc.textContent = '';
                setTimeout(() => {
                    let i = 0;
                    const iv = setInterval(() => {
                        heroDisc.textContent = full.slice(0, ++i);
                        if (i >= full.length) clearInterval(iv);
                    }, 48);
                }, 1900);
            }

        }, 350);
    }
    loaderBar.style.width = prog + '%';
}, 90);


/* ────────────────────────────────────────────
   CURSOR — dot + lagging ring
   ──────────────────────────────────────────── */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');

let mx = -300, my = -300;
let rx = -300, ry = -300;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cDot.style.left = mx + 'px';
    cDot.style.top  = my + 'px';
});

(function lerpRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cRing.style.left = rx + 'px';
    cRing.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
})();

document.querySelectorAll('a, button, .stag, .nc').forEach(el => {
    el.addEventListener('mouseenter', () => { cDot.classList.add('hov'); cRing.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { cDot.classList.remove('hov'); cRing.classList.remove('hov'); });
});


/* ────────────────────────────────────────────
   MAGNETIC BUTTONS
   ──────────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
    const P = 0.4;
    el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        el.style.transform = `translate(${dx * P}px, ${dy * P}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});


/* ────────────────────────────────────────────
   PROJECT CARDS — tilt + custom cursor
   ──────────────────────────────────────────── */
const cRingLabel = document.getElementById('cRingLabel');

document.querySelectorAll('.pcard').forEach(card => {
    const media  = card.querySelector('.pcard-media');
    const isLime = !!card.querySelector('.pph-lime');
    const hClass = isLime ? 'card-lime' : 'card-hov';

    card.addEventListener('mouseenter', () => {
        cDot.classList.add(hClass);
        cRing.classList.add(hClass);
    });

    card.addEventListener('mousemove', e => {
        const r = media.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        media.style.transform =
            `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        cDot.classList.remove('card-hov', 'card-lime');
        cRing.classList.remove('card-hov', 'card-lime');
        media.style.transform = '';
    });
});


/* ────────────────────────────────────────────
   HERO MOUSE PARALLAX
   ──────────────────────────────────────────── */
let pTargetX = 0, pTargetY = 0, pCurX = 0, pCurY = 0;
let heroScrollOffset = 0;
let heroVisible = true;

const heroEl = document.getElementById('hero');
if (heroEl) {
    new IntersectionObserver(entries => {
        heroVisible = entries[0].isIntersecting;
    }, { threshold: 0 }).observe(heroEl);
}

document.addEventListener('mousemove', e => {
    if (!heroVisible) return;
    pTargetX = (e.clientX / window.innerWidth  - 0.5) * 14;
    pTargetY = (e.clientY / window.innerHeight - 0.5) *  6;
});

(function animParallax() {
    if (heroVisible) {
        pCurX += (pTargetX - pCurX) * 0.05;
        pCurY += (pTargetY - pCurY) * 0.05;
        if (heroName) {
            heroName.style.transform =
                `translate(${pCurX * 0.4}px, calc(${pCurY * 0.4}px + ${heroScrollOffset}px))`;
        }
    }
    requestAnimationFrame(animParallax);
})();

const scrollProg = document.getElementById('scrollProg');

window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const vh = window.innerHeight;

    if (sy <= vh * 1.2) {
        heroScrollOffset = sy * 0.22;
        if (heroName) heroName.style.opacity = Math.max(0, 1 - (sy / vh) * 1.9).toString();
    }

    if (scrollProg) {
        const total = document.body.scrollHeight - vh;
        scrollProg.style.height = Math.min(100, (sy / total) * 100) + '%';
    }
}, { passive: true });


/* ────────────────────────────────────────────
   SCROLL IMAGE SHRINK
   ──────────────────────────────────────────── */
const simgJourney = document.getElementById('simgJourney');
const simgFrame   = document.getElementById('simgFrame');
window.addEventListener('scroll', () => {
    if (!simgJourney || !simgFrame) return;
    const rect = simgJourney.getBoundingClientRect();
    const vh   = window.innerHeight;
    // p: 0 = sectie onderaan viewport, 1 = sectie bovenaan viewport
    const p    = Math.max(0, Math.min(1, -rect.top / rect.height));
    simgFrame.style.transform = `scale(${1 - p * 0.52})`;
}, { passive: true });






/* ────────────────────────────────────────────
   SPLIT TEXT REVEAL
   ──────────────────────────────────────────── */
function splitReveal(el) {
    const parts = el.innerHTML.split(/(<br\s*\/?>)/i);
    el.innerHTML = parts.map(part => {
        if (/^<br/i.test(part)) return part;
        return part.trim().split(/\s+/).filter(Boolean).map(word =>
            `<span class="word-wrap"><span class="word-inner">${word}</span></span>`
        ).join(' ');
    }).join('');
}

const splitObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.word-inner').forEach((inner, i) => {
            setTimeout(() => inner.classList.add('up'), i * 90);
        });
        splitObs.unobserve(entry.target);
    });
}, { threshold: 0.2 });

document.querySelectorAll('.split-reveal').forEach(el => {
    splitReveal(el);
    splitObs.observe(el);
});


/* ────────────────────────────────────────────
   SCROLL REVEAL
   ──────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.querySelectorAll('.ri')];
        const idx     = siblings.indexOf(entry.target);
        const isPcard = entry.target.classList.contains('pcard');
        setTimeout(() => entry.target.classList.add('in'), idx * (isPcard ? 150 : 85));
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.ri').forEach(el => revealObs.observe(el));


/* ────────────────────────────────────────────
   PROJECT OVERLAY
   ──────────────────────────────────────────── */
const projectData = [
    {
        num: '01',
        title: 'Morning Brew',
        meta: 'UI Design · Figma · 2026',
        tags: ['UI Design', 'Figma', '2026'],
        role: 'UI Designer · Figma',
        desc: 'Een conceptuele website voor koffieshop The Morning Brew, ontworpen voor persona Mark. Ik ontwierp de volledige UI in Figma: van visuele identiteit tot klikbaar prototype, met een landingspagina en een persoonlijk dashboard.',
        heroImage: 'projects/brew-1.png',
        workImages: ['projects/eindschermg.png', 'projects/dashboard.png'],
        workImageLabels: ['Landing Page', 'Dashboard'],
        workImageAspects: ['4/5', null],
        workImageCovers:  [true, false],
        typography: {
            name: 'Unigeo64',
            specimen: 'Golden Roast',
            weights: [
                { label: 'Regular',  value: 400 },
                { label: 'Semibold', value: 600 },
                { label: 'Bold',     value: 700 }
            ],
            body: {
                name: 'Inter',
                usage: 'Subteksten & bodytekst',
                fontStack: 'Inter, sans-serif',
                weights: [
                    { label: 'Light',   value: 300 },
                    { label: 'Regular', value: 400 },
                    { label: 'Medium',  value: 500 }
                ]
            }
        },
        colorPalette: [
            { hex: '#FCEED4', name: 'Morning Cream', pct: '30%' },
            { hex: '#2A4636', name: 'Forest Green',  pct: '60%' },
            { hex: '#C9978E', name: 'Rosé Blush',    pct: '10%' }
        ],
        figmaUrl: 'https://www.figma.com/proto/56PuBSNeadvWzfTWBmmXkg/The-Morning-Brew?node-id=340-2&viewport=3699%2C-1500%2C0.09&t=w3V0kCYAK7mDqrBn-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1',
        tasks: [
            {
                label: 'Persona & visuele identiteit',
                desc: 'Mark is 34, houdt van kwaliteit en gaat niet voor de goedkoopste koffie. Ik maakte een visuele identiteit die daarbij past: crème, donkergroen en een vleugje mauve roze. De interface voelt premium maar niet overdreven. Glassmorphism-kaarten over sfeervolle productfoto\'s versterken dat gevoel van kwaliteit.'
            },
            {
                label: 'Kleurpsychologie & layout',
                desc: 'Alle kleur- en layoutkeuzes zijn bewust gemaakt. Ik paste de 60-30-10 regel toe: 60% Forest Green als dominante kleur, 30% Morning Cream voor rust en lucht, en 10% Rosé Blush als accent op knoppen en sleutelmomenten. Voor de layout werkte ik met een 12-kolommengrid met vaste marges, zodat alle elementen strak uitgelijnd zijn en de pagina een professionele, geordende uitstraling krijgt. Gestalt-principes zoals nabijheid en groepering zorgen dat producten als set worden gelezen, niet als losse items.'
            },
            {
                label: 'Nachtmodus & dashboard',
                desc: 'Eén toggle, maar de hele sfeer verandert. De nachtmodus is functioneel en donker: overzicht staat centraal. Het dashboard laat het smaakprofiel van Mark zien in een radar-grafiek, met zijn laatste bestelling en een aanbeveling op basis van zijn voorkeuren. Het voelt als een eigen pagina, niet als een donkere versie van hetzelfde scherm.'
            },
            {
                label: 'Prototype & reflectie',
                desc: 'Het eindresultaat is een volledig klikbaar Figma-prototype met twee complete gebruikersflows. Dit project heb ik van concept tot prototype volledig zelfstandig opgezet en uitgewerkt. Wat ik leerde: kleur stuurt gedrag meer dan je denkt. Een gebruiker voelt de sfeer van een website voordat hij ook maar iets aanklikt.'
            }
        ],
        quote: 'Kleur is geen decoratie, het is communicatie.',
        quoteDesc: 'Bij elke keuze vroeg ik me af: wat voelt de gebruiker bij deze kleur? Niet wat ziet hij, maar wat voelt hij.',
        en: {
            desc: 'A conceptual website for coffee shop The Morning Brew, designed for persona Mark. I designed the full UI in Figma: from visual identity to clickable prototype, with a landing page and a personal dashboard.',
            role: 'UI Designer · Figma',
            tasks: [
                { label: 'Persona & visual identity', desc: 'Mark is 34, values quality and doesn\'t go for the cheapest coffee. I created a visual identity to match: cream, dark green and a touch of mauve pink. The interface feels premium but not overdone. Glassmorphism cards over atmospheric product photos reinforce that sense of quality.' },
                { label: 'Color psychology & layout', desc: 'Every color and layout choice was deliberate. I applied the 60-30-10 rule: 60% Forest Green as the dominant color, 30% Morning Cream for breathing room, and 10% Rosé Blush as an accent on buttons and key interactions. For the layout I used a 12-column grid with fixed margins, keeping all elements tightly aligned and giving the page a professional, structured feel. Gestalt principles like proximity and grouping ensure products are read as a set, not individual items.' },
                { label: 'Night mode & dashboard', desc: 'One toggle, but the whole atmosphere changes. Night mode is functional and dark: overview takes center stage. The dashboard shows Mark\'s taste profile in a radar chart, with his last order and a recommendation based on his preferences. It feels like its own page, not a dark version of the same screen.' },
                { label: 'Prototype & reflection', desc: 'The end result is a fully clickable Figma prototype with two complete user flows. I set up and executed this project entirely independently from concept to prototype. What I learned: color drives behavior more than you think. A user feels the mood of a website before they click anything.' }
            ],
            quote: 'Color is not decoration, it\'s communication.',
            quoteDesc: 'With every choice I asked myself: what does the user feel with this color? Not what does he see, but what does he feel.'
        }
    },
    {
        num: '02',
        title: 'House of Horror',
        meta: 'Game Design · Unity · 2024',
        tags: ['Game Design', 'Unity', 'Canva', '2024'],
        role: 'Concept & Gamedesign · Unity, Adobe XD, Canva',
        desc: 'Een multiplayer horror-escape game voor een zelfbedachte CMD-community. Eén speler ontsnapt via een laptop uit een spookhuis, terwijl de rest van de groep via een app de zombies bestuurt die hem moeten tegenhouden.',
        heroImage: 'projects/houseofhorror.png',
        constrainGrid: true,
        workVideo: 'projects/houseofhorror-web.mp4',
        workImages: ['projects/app-2.png', 'projects/game-1.png', 'projects/game-2.png'],
        workImageFits: ['cover', null, null],
        workImagePositions: ['center center', null, null],
        figmaUrl: 'https://canva.link/s2nfrkf5jhf1bfz',
        protoLabel: 'Bekijk posters',
        boothImage: 'projects/horrorkraampje.jpg',
        boothCaption: 'Op de CMD Community Expo bouwden we ons eigen horrorkraampje: bezoekers speelden de game live achter de laptop, terwijl de rest meekeek op het scherm. Met een Scream-masker, een mysterieuze "durf je je hand erin te steken"-doos en horror-snoep creëerden we precies de sfeer waar de community om draait. Het mooiste moment was zien hoe mensen die elkaar niet kenden samen om de laptop stonden te gillen en te lachen.',
        tasks: [
            {
                label: 'Concept & doelgroep',
                desc: 'Ik deed onderzoek naar horror als genre en de community eromheen. Via interviews en een empathy map sprak ik met verschillende horrorliefhebbers om te begrijpen wat hen aanspreekt. Mijn eerste idee was een VR-horrorervaring, maar uit feedback bleek dat te complex voor een grote groep. Ik koos uiteindelijk voor een game die iedereen gewoon achter een laptop kan spelen, zonder gedoe.'
            },
            {
                label: 'De game bouwen in Unity',
                desc: 'Het horrorhuis zelf bouwde ik in Unity. De speler moet door het huis lopen, een sleutel vinden en ontsnappen voordat de zombies hem pakken. Het was pas de tweede keer dat ik met Unity werkte. Ik gebruikte tutorials, vroeg hulp aan de docent en daagde mezelf uit door extra interactie toe te voegen, zoals het zelf kunnen oppakken van de sleutel in plaats van een simpele trigger-zone.'
            },
            {
                label: 'Companion app in Adobe XD',
                desc: 'Om het spel écht spannend te maken ontwierp ik een companion app in Adobe XD. Andere spelers besturen via hun telefoon zombies die de hoofdspeler in het huis proberen te stoppen. Ik voegde ook een hartslagmeter toe: wie de laagste hartslag had tijdens het spelen, won. Samen met een zelfgemaakt Snapchat-filter zorgde dit voor een complete, interactieve spelervaring.'
            },
            {
                label: 'Promotiemateriaal in Canva & expo',
                desc: 'Voor de promotie ontwierp ik in Canva een A3-conceptposter, een promofilmpje en social content om de community te introduceren. Op de CMD Community Expo speelden bezoekers de game live tegen elkaar. Wat ik leerde: ik was soms zo druk met bouwen dat ik vergat de doelgroep actief te blijven bevragen. Aannames doen is makkelijk, maar blijven vragen stellen levert altijd meer op.'
            }
        ],
        quote: 'Angst voelt minder eng als je hem samen deelt.',
        quoteDesc: 'Of je nou sociaal bent of niet: door samen de zombies te slim af te zijn, leer je een community zonder dat je het doorhebt beter kennen.',
        en: {
            desc: 'A multiplayer horror escape game for a self-conceived CMD community. One player escapes from a haunted house via a laptop, while the rest of the group controls zombies via an app to stop them.',
            role: 'Concept & Game Design · Unity, Adobe XD, Canva',
            boothCaption: 'At the CMD Community Expo we built our own horror booth: visitors played the game live behind the laptop while the rest watched on screen. With a Scream mask, a mysterious "dare to put your hand in" box and horror candy, we created exactly the atmosphere the community is about. The best moment was seeing people who didn\'t know each other standing around the laptop screaming and laughing together.',
            tasks: [
                { label: 'Concept & target group', desc: 'I researched horror as a genre and the community around it. Through interviews and an empathy map I spoke with different horror fans to understand what appeals to them. My first idea was a VR horror experience, but feedback showed it was too complex for a large group. I ended up going with a game anyone can simply play on a laptop, no hassle.' },
                { label: 'Building the game in Unity', desc: 'I built the haunted house itself in Unity. The player walks through the house, finds a key and has to escape before the zombies catch them. It was only my second time working with Unity. I used tutorials, asked my teacher for help and challenged myself by adding extra interaction, like actually being able to pick up the key instead of using a simple trigger zone.' },
                { label: 'Companion app in Adobe XD', desc: 'To make the game truly exciting I designed a companion app in Adobe XD. Other players use their phone to control zombies that try to stop the main player in the house. I also added a heart rate monitor: whoever had the lowest heart rate while playing, won. Together with a self-made Snapchat filter, this created a complete, interactive game experience.' },
                { label: 'Promo materials in Canva & expo', desc: 'For the promotion I designed an A3 concept poster, a promo video and social content in Canva to introduce the community. At the CMD Community Expo, visitors played the game live against each other. What I learned: I was sometimes so busy building that I forgot to keep actively asking the target group questions. Making assumptions is easy, but keep asking. It always gets you further.' }
            ],
            quote: 'Fear feels less scary when you share it together.',
            quoteDesc: 'Whether you\'re social or not: by outsmarting the zombies together, you get to know a community better without even realizing it.'
        },
        colorPalette: [
            { hex: '#0D0D0D', name: 'Duisternis' },
            { hex: '#B41B1B', name: 'Bloedrood'  },
            { hex: '#9E9E9E', name: 'Betongrijs' },
            { hex: '#4A2C1A', name: 'Verrot Hout' }
        ]
    },
    {
        num: '03',
        title: 'Infinite Scroll',
        meta: 'Webdesign · 2026',
        tags: [],
        role: 'Designer & Developer · Figma, HTML / CSS / JS',
        desc: 'Je weet dat je moet stoppen. Toch scroll je door. Een website die social media verslaving niet uitlegt maar laat voelen.',
        heroImage: 'projects/greep2.png',
        mockupType: 'phone',
        liveUrl: 'https://bashva.github.io/socialmediaverslaving/',
        workImages: ['projects/degreep-1.png', 'projects/degreep-3.png', 'projects/degreep-6.png'],
        tasks: [
            {
                label: 'Concept & onderzoek',
                desc: 'Ik koos dit onderwerp omdat ik het zelf herken: \'s avonds scrollen en opeens is er een uur voorbij. Als basis gebruikte ik onderzoek over smartphoneverslaving en de technieken die sociale media platforms bewust inzetten. Ik werkte drie kleurpaletten uit en koos voor een donkere digitale sfeer die past bij dat gevoel van \'s nachts eindeloos door een feed gaan.'
            },
            {
                label: 'Visueel ontwerp in Figma',
                desc: 'In Figma ontwierp ik vijf visuele fases die de escalatie van scrollen laten voelen: rust, scrollen, verslaving, chaos en overload. Elke fase heeft een eigen kleurpalet en sfeer die steeds drukker en onrustiger wordt. Donkere achtergronden met paarse en roze accenten refereren aan schermlicht en notificaties in het donker. Ik was hier zowel conceptontwikkelaar als visueel ontwerper.'
            },
            {
                label: 'Ontwikkeling',
                desc: 'Ik bouwde de volledige website zelf in HTML, CSS en JavaScript. De feed begint rustig: gewone posts, normale snelheid. Hoe langer je scrollt, hoe meer likes, notificaties en content er verschijnen zonder dat je erom vraagt. Timing-functies in JavaScript laten de animaties geleidelijk sneller en drukker worden. De overgang is subtiel genoeg dat je hem niet ziet aankomen.'
            },
            {
                label: 'Publicatie & reflectie',
                desc: 'De website staat live op GitHub Pages. Bij test-sessies bleek dat gebruikers de overgang naar chaos eerder ervoeren dan ik had verwacht. Dat was precies het doel. Dit project liet me zien hoe bewust en hoe gevaarlijk design ingezet kan worden. De technieken die grote apps verslavend maken zijn niet geheim. Ik kon ze zelf inbouwen.'
            }
        ],
        quote: 'Jij denkt dat je scrollt, maar de interface stuurt jou.',
        quoteDesc: 'Dit project liet me zien hoe krachtig en gevaarlijk design kan zijn. De technieken die apps verslavend maken, kon ik zelf inbouwen.',
        en: {
            desc: 'You know you should stop. Yet you keep scrolling. A website that doesn\'t explain social media addiction. It makes you feel it.',
            role: 'Designer & Developer · Figma, HTML / CSS / JS',
            tasks: [
                { label: 'Concept & research', desc: 'I chose this topic because I recognize it myself: scrolling in the evening and suddenly an hour has passed. As a foundation I used research on smartphone addiction and the techniques social media platforms deliberately deploy. I worked out three color palettes and chose a dark digital atmosphere that fits that feeling of endlessly scrolling through a feed at night.' },
                { label: 'Visual design in Figma', desc: 'In Figma I designed five visual phases that make the escalation of scrolling felt: rest, scrolling, addiction, chaos and overload. Each phase has its own color palette and atmosphere that grows increasingly busy and restless. Dark backgrounds with purple and pink accents reference screen light and notifications in the dark.' },
                { label: 'Development', desc: 'I built the entire website in HTML, CSS and JavaScript. The feed starts calm: regular posts, normal speed. The longer you scroll, the more likes, notifications and content appear without you asking for it. Timing functions in JavaScript let animations gradually become faster and more intense. The transition is subtle enough that you don\'t see it coming.' },
                { label: 'Publication & reflection', desc: 'The website is live on GitHub Pages. During test sessions, users experienced the transition to chaos earlier than I expected. That was exactly the goal. This project showed me how deliberately and dangerously design can be used. The techniques that make large apps addictive are no secret. I could build them myself.' }
            ],
            quote: 'You think you\'re scrolling, but the interface is directing you.',
            quoteDesc: 'This project showed me how powerful and dangerous design can be. The techniques that make apps addictive. I could build them myself.'
        },
        colorPalette: [
            { hex: '#0F0B1A', name: 'Diepte'            },
            { hex: '#7B3FA8', name: 'Dopamine Paars'    },
            { hex: '#E03B8A', name: 'Notificatie Roze'  },
            { hex: '#00CFCF', name: 'Scherm Cyaan'      }
        ],
        typography: {
            name: 'SF Pro Display',
            specimen: 'De Greep',
            weights: [
                { label: 'Bold',    value: 700 },
                { label: 'Regular', value: 400 },
                { label: 'Light',   value: 300 }
            ]
        },
    },
    {
        num: '04',
        title: 'Boekenzoeker',
        meta: 'UI Design · Adobe XD · 2024',
        tags: ['UI Design', 'Adobe XD', '2024'],
        role: 'Visual Interface Design · Adobe XD',
        desc: 'Een iPad-kiosk app voor de schoolbibliotheek van de Gemeente Amsterdam. Leerlingen van 12 tot 15 jaar vinden snel een boek dat bij ze past door een paar voorkeuren in te stellen, en zetten geschikte titels op een verlanglijst die ze kunnen mailen.',
        heroImage: 'projects/boekensite.jpg',
        workVideo: 'projects/boekenzoeker-web.mp4',
        workImages: ['projects/boekenlijst.png', 'projects/boekinfo.png', 'projects/sorterenboeken.png'],
        tasks: [
            {
                label: 'Opdracht & doelgroep',
                desc: 'De opdracht was een zoekinterface ontwerpen voor de schoolbieb, bedoeld voor leerlingen van klas 1 tot 3. De app draait op een vaste iPad bij de ingang. Mijn vertrekpunt was: hoe maak je zoeken naar een boek zo laagdrempelig dat je er nauwelijks over hoeft na te denken? Geen zoekbalk vol typen, maar gewoon een paar keuzes tikken en een persoonlijk lijstje krijgen.'
            },
            {
                label: 'Visuele stijl & substijl',
                desc: 'Ik werkte binnen de huisstijl van de Gemeente Amsterdam maar ontwikkelde daar een eigen substijl in die de doelgroep aanspreekt. Speelse illustraties, heldere kleuren en een apegidsfiguur geven de app een vriendelijk en uitnodigend karakter. Elke kleur- en lettertypekeuze is bewust gemaakt: herkenbaar genoeg voor de gemeente, aantrekkelijk genoeg voor een 13-jarige.'
            },
            {
                label: 'Schermontwerpen',
                desc: 'Ik ontwierp de volledige flow in Adobe XD: van boektype kiezen (e-book, normaal boek, luisterboek) en voorkeuren instellen, tot een gesorteerde resultatenlijst met boekcovers, een detailpagina per boek en een verlanglijst die je kunt mailen. Elk scherm moest zelfstandig begrijpelijk zijn omdat er geen instructie is bij het kiosk.'
            },
            {
                label: 'Prototype & presentatie',
                desc: 'Het eindresultaat is een volledig klikbaar prototype in Adobe XD dat de gehele gebruikersstroom doorloopt. Bij de beoordeling presenteerde ik mijn schermontwerpen en stilistische keuzes aan de hand van een stijlblad en een demonstratie van de interactie. Dit project leerde me hoe je een functioneel en een visueel ontwerp tegelijkertijd kunt opbouwen zonder dat een van de twee achterloopt.'
            }
        ],
        quote: 'Goed design vraagt geen uitleg.',
        quoteDesc: 'Een kiosk heeft geen handleiding. Als een leerling bij de ingang van de bieb staat en het niet meteen snapt, haakt hij af. Dat dwong me om elk scherm zo helder mogelijk te maken.',
        en: {
            desc: 'An iPad kiosk app for the school library of the Municipality of Amsterdam. Students aged 12 to 15 quickly find a book that suits them by setting a few preferences, and add suitable titles to a wish list they can email.',
            role: 'Visual Interface Design · Adobe XD',
            tasks: [
                { label: 'Assignment & target group', desc: 'The assignment was to design a search interface for the school library, aimed at students in years 1 to 3. The app runs on a fixed iPad at the entrance. My starting point: how do you make finding a book so accessible that you barely have to think about it? No typing in a search bar, just tap a few choices and get a personal list.' },
                { label: 'Visual style & sub-style', desc: 'I worked within the Municipality of Amsterdam\'s brand identity but developed my own sub-style that appeals to the target group. Playful illustrations, bright colors and a guide character give the app a friendly and inviting character. Every color and typeface choice was deliberate: recognizable enough for the municipality, attractive enough for a 13-year-old.' },
                { label: 'Screen designs', desc: 'I designed the full flow in Adobe XD: from choosing book type (e-book, physical book, audiobook) and setting preferences, to a sorted results list with book covers, a detail page per book and a wish list you can email. Every screen had to be independently understandable since there\'s no instruction at the kiosk.' },
                { label: 'Prototype & presentation', desc: 'The end result is a fully clickable prototype in Adobe XD covering the entire user flow. During the assessment I presented my screen designs and stylistic choices via a style sheet and an interaction demo. This project taught me how to build a functional and visual design simultaneously without either falling behind.' }
            ],
            quote: 'Good design needs no explanation.',
            quoteDesc: 'A kiosk has no manual. If a student at the library entrance doesn\'t immediately get it, they walk away. That forced me to make every screen as clear as possible.'
        },
        colorPalette: [
            { hex: '#EC0000', name: 'Amsterdam Rood' },
            { hex: '#7B9C67', name: 'Bibliotheek Groen' },
            { hex: '#FFFFFF', name: 'Wit' }
        ],
        typography: {
            name: 'Amsterdam Sans',
            specimen: 'Zoek een boek',
            weights: [
                { label: 'Bold',    value: 700 },
                { label: 'Regular', value: 400 }
            ]
        }
    }
];

const projOverlay  = document.getElementById('projOverlay');
const poClose      = document.getElementById('poClose');
const poNum        = document.getElementById('poNum');
const poHeroR      = document.getElementById('poHeroR');
const poMeta       = document.getElementById('poMeta');
const poTitle      = document.getElementById('poTitle');
const poTags       = document.getElementById('poTags');
const poRole       = document.getElementById('poRole');
const poLiveBtn    = document.getElementById('poLiveBtn');
const poDesc       = document.getElementById('poDesc');
const poTasks      = document.getElementById('poTasks');
const poWork       = document.getElementById('poWork');
const poWorkImgs   = document.getElementById('poWorkImgs');
const poQuoteBlock = document.getElementById('poQuoteBlock');
const poQuoteText  = document.getElementById('poQuoteText');
const poQuoteSub   = document.getElementById('poQuoteSub');
const poProtoWrap  = document.getElementById('poProtoWrap');
const poProtoBtn   = document.getElementById('poProtoBtn');
const poProtoLabel = document.getElementById('poProtoLabel');
const poNext       = document.getElementById('poNext');
const poNextTitle  = document.getElementById('poNextTitle');

function makeBrowserFrame(imgSrc, cssClass, aspect, cover, fit, position) {
    const bodyClass = (aspect && cover) ? 'po-bc-body po-bc-body--fixed' : 'po-bc-body';
    const bodyStyle = aspect ? ` style="aspect-ratio:${aspect}"` : '';
    const imgStyles = [fit ? `object-fit:${fit}` : '', position ? `object-position:${position}` : ''].filter(Boolean).join(';');
    const imgStyle  = imgStyles ? ` style="${imgStyles}"` : '';
    return `<div class="po-browser">
        <div class="po-bc">
            <span class="po-bc-dot"></span>
            <span class="po-bc-dot"></span>
            <span class="po-bc-dot"></span>
            <div class="po-bc-url"></div>
        </div>
        <div class="${bodyClass}"${bodyStyle}>
            <img src="${imgSrc}" class="${cssClass}" alt=""${imgStyle}>
        </div>
    </div>`;
}

function makeBrowserVideoFrame(videoSrc) {
    return `<div class="po-browser po-browser-video">
        <div class="po-bc">
            <span class="po-bc-dot"></span>
            <span class="po-bc-dot"></span>
            <span class="po-bc-dot"></span>
            <div class="po-bc-url"></div>
        </div>
        <div class="po-bc-body">
            <video class="po-work-video" src="${videoSrc}" controls preload="metadata"></video>
        </div>
    </div>`;
}

function makePhoneFrame(imgSrc) {
    return `<div class="po-phone-mock">
        <div class="po-phone-top"><div class="po-phone-island"></div></div>
        <div class="po-phone-screen"><img src="${imgSrc}" alt=""></div>
        <div class="po-phone-bottom"><div class="po-phone-home"></div></div>
    </div>`;
}

function makeWorkPhoneFrame(imgSrc) {
    return `<div class="po-work-phone">
        <div class="po-wp-top"><div class="po-wp-island"></div></div>
        <div class="po-wp-screen"><img src="${imgSrc}" alt=""></div>
        <div class="po-wp-bottom"><div class="po-wp-home"></div></div>
    </div>`;
}

let _openProjectIdx = null;

function openProject(idx) {
    const p = projectData[idx];
    if (!p || !projOverlay) return;
    _openProjectIdx = idx;

    const en = (_lang === 'en' && p.en) ? p.en : null;
    const pt = (nl, key) => (en && en[key] != null) ? en[key] : nl;
    const ptasks = (en && en.tasks) ? en.tasks : (p.tasks || []);

    poNum.textContent   = p.num;
    const ghost = document.getElementById('poNumGhost');
    if (ghost) ghost.textContent = p.num;
    poTitle.textContent = p.title;
    poRole.textContent  = pt(p.role, 'role');
    poDesc.textContent  = pt(p.desc, 'desc');
    if (poMeta) poMeta.textContent = p.meta || '';

    if (poHeroR) {
        if (p.heroImage) {
            poHeroR.innerHTML = p.mockupType === 'phone'
                ? makePhoneFrame(p.heroImage)
                : makeBrowserFrame(p.heroImage, '');
        } else {
            poHeroR.innerHTML = '';
        }
    }

    if (poTags) {
        poTags.innerHTML = (p.tags || []).map(t => `<span class="po-tag">${t}</span>`).join('');
    }

    if (poLiveBtn) {
        poLiveBtn.style.display = p.liveUrl ? 'inline-flex' : 'none';
        if (p.liveUrl) poLiveBtn.href = p.liveUrl;
    }

    if (poTasks) {
        poTasks.innerHTML = ptasks.map((t, i) => `
            <div class="po-proc-item">
                <span class="po-proc-num">0${i + 1}</span>
                <h3 class="po-proc-heading">${t.label}</h3>
                <p class="po-proc-body">${t.desc}</p>
            </div>`).join('');
    }

    if (poWork && poWorkImgs) {
        const imgs = p.workImages || [];
        if (imgs.length || p.workVideo || p.boothImage) {
            poWork.style.display = '';
            if (p.mockupType === 'phone') {
                poWorkImgs.className = 'po-work-grid phone-grid';
                poWorkImgs.innerHTML = imgs.map(src => makeWorkPhoneFrame(src)).join('');
            } else {
                poWorkImgs.className = p.constrainGrid ? 'po-work-grid constrained' : 'po-work-grid';
                if (p.gridAspect) poWorkImgs.style.setProperty('--grid-aspect', p.gridAspect);
                else poWorkImgs.style.removeProperty('--grid-aspect');
                const videoHtml = p.workVideo ? makeBrowserVideoFrame(p.workVideo) : '';
                const imgsHtml = imgs.map((src, i) => {
                    const label  = (p.workImageLabels  || [])[i];
                    const aspect = (p.workImageAspects || [])[i];
                    const cover  = (p.workImageCovers  || [])[i];
                    const fit      = (p.workImageFits      || [])[i];
                    const position = (p.workImagePositions || [])[i];
                    const frame    = makeBrowserFrame(src, 'po-work-img', aspect, cover, fit, position);
                    return label
                        ? `<div class="po-work-tile">${frame}<p class="po-work-label">${label}</p></div>`
                        : frame;
                }).join('');
                const expoHtml = p.boothImage
                    ? `<div class="po-work-expo">${makeBrowserFrame(p.boothImage, 'po-work-img')}<p class="po-work-caption">${pt(p.boothCaption || '', 'boothCaption')}</p></div>`
                    : '';
                poWorkImgs.innerHTML = videoHtml + imgsHtml + expoHtml;
            }
        } else {
            poWork.style.display = 'none';
        }
    }

    const poDesignEl = document.getElementById('poDesignEl');
    const poTypoGrid = document.getElementById('poTypoGrid');
    if (poDesignEl && poTypoGrid) {
        if (p.typography) {
            poDesignEl.style.display = '';
            const t = p.typography;
            poTypoGrid.innerHTML = `
                <div class="po-type-card">
                    <div class="po-type-left">
                        <span class="po-type-name">${t.name}</span>
                        <div class="po-type-big">${t.specimen}</div>
                    </div>
                    <div class="po-type-right">
                        <div class="po-type-scale">
                            ${t.weights.map(w => `
                                <div class="po-type-scale-row">
                                    <span class="po-type-wlabel">${w.label}</span>
                                    <span class="po-type-wsample" style="font-weight:${w.value}">${t.specimen}</span>
                                </div>`).join('')}
                        </div>
                        ${t.tagline ? `<div class="po-type-rule"></div><p class="po-type-tagline">${t.tagline}</p><p class="po-type-desc">${t.desc || ''}</p>` : ''}
                    </div>
                </div>
                ${t.body ? `
                <div class="po-type-body-row">
                    <div class="po-type-body-meta">
                        <span class="po-type-name">${t.body.name}</span>
                        <span class="po-type-usage">${t.body.usage}</span>
                    </div>
                    ${t.body.weights.map(w => `
                        <div class="po-type-body-col">
                            <span class="po-type-wlabel">${w.label}</span>
                            <span class="po-type-wsample" style="font-weight:${w.value};font-family:${t.body.fontStack}">Premium single origin coffee.</span>
                        </div>`).join('')}
                </div>` : ''}`;
        } else {
            poDesignEl.style.display = 'none';
            if (poTypoGrid) poTypoGrid.innerHTML = '';
        }
    }

    const poPaletteGrid = document.getElementById('poPaletteGrid');
    if (poPaletteGrid) {
        if (p.colorPalette && p.colorPalette.length) {
            if (poDesignEl) poDesignEl.style.display = '';
            poPaletteGrid.innerHTML = p.colorPalette.map(c => `
                <div class="po-swatch">
                    <div class="po-swatch-color" style="background:${c.hex}">
                        ${c.pct ? `<span class="po-swatch-pct">${c.pct}</span>` : ''}
                    </div>
                    <span class="po-swatch-hex">${c.hex}</span>
                    <span class="po-swatch-name">${c.name}</span>
                </div>`).join('');
        } else {
            if (poPaletteGrid) poPaletteGrid.innerHTML = '';
        }
    }

    if (poQuoteBlock) {
        if (p.quote) {
            poQuoteBlock.style.display = '';
            poQuoteText.textContent = pt(p.quote, 'quote');
            poQuoteSub.textContent  = pt(p.quoteDesc || '', 'quoteDesc');
        } else {
            poQuoteBlock.style.display = 'none';
        }
    }

    if (poProtoWrap && poProtoBtn) {
        if (p.figmaUrl) {
            poProtoWrap.style.display = '';
            poProtoBtn.href = p.figmaUrl;
            if (poProtoLabel) poProtoLabel.textContent = p.protoLabel || 'Bekijk prototype';
        } else {
            poProtoWrap.style.display = 'none';
        }
    }

    if (poNext && poNextTitle) {
        const nextIdx = (idx + 1) % projectData.length;
        poNextTitle.textContent = projectData[nextIdx].title.toUpperCase();
        poNext.onclick = () => {
            const poContent = projOverlay.querySelector('.po-content');
            const poScroll  = projOverlay.querySelector('.po-scroll');
            poContent.classList.add('po-exit');

            setTimeout(() => {
                if (poScroll) poScroll.scrollTop = 0;
                poContent.classList.remove('po-exit');
                poContent.classList.add('po-enter');
                openProject(nextIdx);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    poContent.classList.remove('po-enter');
                }));
            }, 250);
        };
    }

    const poScroll = projOverlay.querySelector('.po-scroll');
    if (poScroll) poScroll.scrollTop = 0;

    // Scroll reveal — bidirectioneel
    if (window._revealObserver) window._revealObserver.disconnect();
    setTimeout(() => {
        const scrollEl = projOverlay.querySelector('.po-scroll');
        if (!scrollEl) return;

        const selectors = [
            '.po-split-hd',
            '.po-proc-item',
            '.po-work-tile, .po-work-grid > .po-browser, .po-browser-video',
            '.po-work-expo',
            '.po-swatch',
            '.po-type-card',
            '.po-type-body-row',
            '.po-quote-block',
            '.po-proto-wrap',
            '.po-next'
        ];
        const animEls = projOverlay.querySelectorAll(selectors.join(', '));

        animEls.forEach((el, i) => {
            el.classList.add('po-reveal');
            el.style.setProperty('--ri', i % 4);
        });

        window._revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                    el.classList.remove('is-past');
                } else {
                    const above = entry.boundingClientRect.top < entry.rootBounds.top;
                    if (above) {
                        el.classList.add('is-past');
                        el.classList.remove('is-visible');
                    } else {
                        el.classList.remove('is-visible', 'is-past');
                    }
                }
            });
        }, { root: scrollEl, threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animEls.forEach(el => window._revealObserver.observe(el));
    }, 400);

    projOverlay.classList.add('open');
    projOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => poClose && poClose.focus(), 600);
}

function closeProject() {
    if (!projOverlay) return;
    _openProjectIdx = null;
    projOverlay.classList.remove('open');
    projOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window._revealObserver) { window._revealObserver.disconnect(); window._revealObserver = null; }
}

if (poClose) poClose.addEventListener('click', closeProject);
const poBack = document.getElementById('poBack');
if (poBack) poBack.addEventListener('click', closeProject);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projOverlay && projOverlay.classList.contains('open')) closeProject();
});


document.querySelectorAll('.pcard[data-project]').forEach(card => {
    const idx = parseInt(card.dataset.project, 10);
    card.addEventListener('click', () => openProject(idx));
});




/* ────────────────────────────────────────────
   BACK TO TOP
   ──────────────────────────────────────────── */
const backTop = document.getElementById('backTop');
if (backTop) {
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ────────────────────────────────────────────
   MAILTO — garanteer dat mail-app opent
   ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = link.getAttribute('href');
    });
});


/* ────────────────────────────────────────────
   LANGUAGE TOGGLE  NL ↔ EN
   ──────────────────────────────────────────── */
const langBtn = document.getElementById('langBtn');
let _lang = 'nl';

function setLang(lang) {
    _lang = lang;
    if (langBtn) langBtn.textContent = lang === 'nl' ? 'EN' : 'NL';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
        if (!el.dataset.nl) el.dataset.nl = el.innerHTML;
        el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.nl;
    });
    if (typeof _openProjectIdx === 'number') openProject(_openProjectIdx);
}

if (langBtn) langBtn.addEventListener('click', () => setLang(_lang === 'nl' ? 'en' : 'nl'));


/* ────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
   ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        let t;
        try { t = document.querySelector(href); } catch { return; }
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth' });
    });
});
