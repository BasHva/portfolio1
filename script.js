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
        title: 'Typografie',
        meta: 'Typografie · 2026',
        role: 'Figma, Handwerk',
        desc: 'Driedelig typografisch onderzoek binnen de minor Visual Interface Design. Van handmatig knippen tot een volledig uitgewerkte interactieve webgame.',
        tasks: [
            {
                label: 'Opdracht 01 · Typografisch kalenderblad',
                desc: 'Voor deze opdracht heb ik mijn eigen verjaardag omgezet in een typografisch kalenderblad. Twee cijfers en drie letters, allemaal nagemaakt als 3D pixelletters van blauw karton. Elke letter heb ik met de hand gesneden en laagje voor laagje opgebouwd zodat ze driedimensionaal lijken. Het was een behoorlijk arbeidsintensief proces, maar het eindresultaat oogt meer als een kunstwerk dan als een gewone typografie-opdracht.'
            },
            {
                label: 'Opdracht 02 · Pixel Font Type Specimen',
                desc: 'Mijn pixel font heb ik gepresenteerd als een volledig speelbare retro-game, gebouwd in HTML en CSS. De website bestaat uit meerdere levels waarbij je door de geschiedenis van het pixel font heen speelt. Elk level vertelt een ander deel van het verhaal, met lopende tekst in het lettertype zelf en een quiz als afsluiting. Ik koos voor een game als format omdat het de beperking van het pixel font precies laat zien: kleine pixels, strakke rasters, maar toch vol karakter.'
            },
            {
                label: 'Opdracht 03 · Typografie voor scherm',
                desc: 'In de derde opdracht onderzocht ik hoe mijn pixel font presteert op een echt mobiel scherm. Ik heb een artikel over responsive typografie opgemaakt met het lettertype, met extra aandacht voor leesbaarheid, lettergrootte, regelafstand en contrast. Het doel was laten zien dat een pixel font ook serieus en functioneel kan zijn als je het goed toepast. Het eindresultaat was specifiek ontworpen voor weergave op de eigen telefoon.',
            },
        ],
        images: [
            'projects/game-1.png',
            'projects/game-3.png',
            'projects/papier-1.png',
            'projects/papier-2.png',
            'projects/typografie-1.png',
        ],
        collage: true
    },
    {
        num: '02',
        title: 'Kleur & Compositie',
        meta: 'Kleur & Compositie · 2026',
        role: 'Figma',
        desc: 'The Morning Brew is een conceptuele koffieshop-app, ontworpen voor persona Mark. Binnen de minor Visual Interface Design heb ik twee volledige modi uitgewerkt: een warme verleidende dagmodus en een functionele nachtmodus. Kleurpsychologie, compositie en gestalt-principes staan centraal in elke keuze.',
        tasks: [
            {
                label: 'Dagmodus · Persona vertaling & branding',
                desc: 'Voor persona Mark heb ik een warme, premium dagmodus ontworpen. Het palet combineert zacht crème, diepgroen en mauve roze, kleuren die passen bij de serieuze koffiecultuur die Mark waardeert. Glassmorphism-kaarten over sfeervolle achtergrondbeelden geven het merk warmte en diepte. De microcopy, typografische keuzes en productpresentatie sluiten allemaal aan op de verfijnde smaak van de persona. Het eindresultaat voelt als een uitnodiging om te ontdekken.'
            },
            {
                label: 'Kleurpsychologie & visuele compositie',
                desc: 'Elke kleur- en compositiekeuze is bewust onderbouwd met theorie. Groen staat voor natuur, duurzaamheid en rust, terwijl crème warmte en een premiumgevoel uitstraalt. De productpagina is opgebouwd met een F-patroon en een consistent 8pt grid. Gestalt-principes als nabijheid en overeenkomst zorgen ervoor dat gerelateerde koffieproducten als visuele groep worden waargenomen. Alle teksten en CTA-knoppen voldoen aan de WCAG AA contrastnorm.'
            },
            {
                label: 'Nachtmodus · Dashboard & smaakprofiel',
                desc: 'De nachtmodus schakelt de sfeer volledig om naar een donkergroen, functioneel scherm. Het dashboard toont het persoonlijke smaakprofiel van Mark als een octagonale radar met assen als Frisheid, Complexiteit, Body en Duurzaamheid. Loyalty stamps, de laatste bestelling en een productaanbeveling geven de pagina directe bruikbaarheid. De switch van dag naar nacht is één toggle, maar de totale beleving van de interface verandert compleet.'
            }
        ],
        images: [
            'projects/brew-1.png',
            'projects/brew-2.png',
            'projects/brew-3.png',
            'projects/brew-4.png',
        ],
        collage4: true
    },
    {
        num: '03',
        title: 'Beeldtaal',
        meta: 'Beeldtaal · 2026',
        role: 'Onderzoek, Ontwerp',
        desc: 'Drie opdrachten rond semiotiek, retorica en gestalt binnen de minor Visual Interface Design. Van het analyseren van bestaande campagnes tot het ontwerpen van een eigen poster over plasticvervuiling.',
        tasks: [
            {
                label: 'Opdracht 01 · Semiotiek',
                desc: 'Voor de semiotiek-opdracht koos ik schoenen als object en plaatste ze in drie volledig verschillende sferen. Door steeds de context en omgeving te veranderen, verandert ook de betekenis van hetzelfde object. In elke uitwerking verwerkte ik bewust een indexicaal teken om een extra betekenislaag toe te voegen. Moddersporen laten bijvoorbeeld zien dat iemand door de modder heeft gelopen en net is thuisgekomen, zonder dat je de persoon zelf hoeft te zien. Het onderzoek laat zien hoe krachtig context is in visuele communicatie.'
            },
            {
                label: 'Opdracht 02 · Retorica',
                desc: 'Voor de retorica-opdracht analyseerde ik de WWF-campagneposter "Out of the Plastic Trap" op logos, kairos, stijlfiguren, indexicale tekens, framing en gestaltwetten. Het realistische beeld van een schildpad in visnetten maakt de boodschap direct geloofwaardig. Daarna maakte ik een verbeterde versie waarbij de urgentie nog sterker overkomt. De schildpad wordt nu daadwerkelijk verstikt door plastic, de kleuren zijn intenser en de tekst directer. Het resultaat is een poster die de kijker emotioneel raakt en meteen aanzet tot actie.'
            },
            {
                label: 'Eindoplevering · Eigen poster',
                desc: 'Als eindopdracht ontwierp ik een eigen poster over plasticvervuiling, gericht op jongeren en jongvolwassenen. De poster is visueel gesplitst in twee helften: een vervuilde wereld vol plastic afval en een gezonde, schone natuur. De schildpad aan de vervuilde kant staat symbool voor alle negatieve gevolgen van plastic, terwijl de aarde in het midden als symbolisch teken dient voor de keuze die de hele wereld elke dag maakt. De boodschap "Plastic? Niet met mij!" plaatst de verantwoordelijkheid direct bij de kijker.'
            }
        ],
        images: [
            'projects/beeldtaal-1.png',
            'projects/beeldtaal-3.png',
            'projects/beeldtaal-5.png',
        ],
        collage3: true
    },
    {
        num: '04',
        title: 'Interface & Beweging',
        meta: 'Interface & Beweging · 2026',
        role: 'Cavalry, Figma',
        desc: 'Animatieproject binnen de minor Visual Interface Design. Ik heb een geanimeerd Lego-poppetje ontworpen en gebouwd in Cavalry, waarbij drie interactieve knoppen elk een andere beweging triggeren. Van eerste schets tot werkende interactieve animatie.',
        tasks: [
            {
                label: 'Concept & technisch onderzoek',
                desc: 'Na het verkennen van meerdere concepten zoals een Alien monster en een Liefdoes robot koos ik uiteindelijk voor het Lego-poppetje. Het is een simpel en herkenbaar karakter met duidelijke vormen, wat ideaal is voor animatie. Ik heb onderzoek gedaan naar het programma Cavalry en de geschiedenis van het Lego-figuurtje, dat in 1978 werd geïntroduceerd. De eenvoudige opbouw van het poppetje maakt het geschikt om in veel verschillende verhalen en contexten te gebruiken.'
            },
            {
                label: 'Moving icons & storyboard',
                desc: 'Ik heb drie interactieve moving icons ontworpen in Figma, die elk een andere animatie van het poppetje triggeren. De achtergrond van de knop verandert bij hover, en rondom elke knop speelt een rode loading-animatie af om het geheel dynamischer te maken. In het storyboard heb ik de drie bewegingen uitgewerkt: het poppetje gooit een blokje omhoog en vangt het op, laat zijn lichaam uit elkaar vallen en weer samenkomen, en vangt een pet op via zijn voeten en laat deze op zijn hoofd landen.'
            },
            {
                label: 'Eindproduct · Animatie in Cavalry',
                desc: 'Het eindproduct is een volledig geanimeerd Lego-poppetje gebouwd in Cavalry. De animatie speelt drie bewegingen af op basis van welke knop je indrukt. Het animeren in Cavalry was technisch uitdagend omdat er weinig tutorials beschikbaar zijn voor het programma. Ik heb de props en knoppen in Figma ontworpen en de animaties daarna in Cavalry afgemaakt. Het resultaat laat zien dat herhaalbare beweging, valbewegingen en speelse interactie samen een karakter écht tot leven kunnen brengen.'
            }
        ],
        images: [
            'projects/interface-1.png',
            'projects/interface-3.png',
        ],
        video: 'projects/interface-video.mp4'
    },
    {
        num: '05',
        title: 'De Meesterproef',
        meta: 'Meesterproef · 2026',
        role: 'Figma, HTML / CSS / JS',
        desc: 'Een interactieve website over social media verslaving waarbij de gebruiker zelf ervaart hoe scrollen langzaam verandert in controleverlies. De interface begint rustig en herkenbaar als een normale feed, maar wordt steeds chaotischer naarmate je verder scrollt.',
        tasks: [
            {
                label: 'Concept & visueel onderzoek',
                desc: 'Voor de meesterproef koos ik het onderwerp social media verslaving, omdat ik dit zelf herken en ook bij mensen om mij heen zie. Als basis gebruikte ik het artikel "Kun je verslaafd raken aan je smartphone?" van het AD. Ik heb drie kleurpaletten ontwikkeld en gekozen voor een donkere, digitale sfeer die past bij \'s avonds eindeloos scrollen. Het moodboard laat de ervaring stap voor stap zien: van rust en controle naar chaos en overload.'
            },
            {
                label: 'Interface ontwerp · Figma',
                desc: 'In Figma heb ik de vijf fases van de website uitgewerkt: rust, scrollen, verslaving, chaos en overload. Elke fase heeft een eigen visuele sfeer die steeds drukker en overweldigender wordt. Ik heb gewerkt met donkere kleuren, paarse en roze accenten die verwijzen naar schermlicht en notificaties, en een oplopende hoeveelheid visuele prikkels om het gevoel van controle verlies te versterken.'
            },
            {
                label: 'Eindproduct · Interactieve website',
                desc: 'Het eindproduct is een volledig werkende interactieve website gebouwd in HTML, CSS en JavaScript. De website begint als een rustige social media feed waarbij alles voorspelbaar voelt. Hoe langer de gebruiker scrollt, hoe meer likes, notificaties en nieuwe posts verschijnen zonder dat er om gevraagd wordt. De animaties worden sneller en drukker totdat de interface chaotisch is en de gebruiker het gevoel heeft de controle te verliezen. Het concept is: je denkt dat jij scrollt, maar de interface stuurt jouw gedrag.',
            }
        ],
        liveUrl: 'https://bashva.github.io/socialmediaverslaving/',
        images: [
            'projects/figma-1.png',
            'projects/figma-2.png',
            'projects/figma-3.png',
            'projects/degreep-1.png',
            'projects/degreep-2.png',
            'projects/degreep-3.png',
            'projects/degreep-4.png',
            'projects/degreep-5.png',
            'projects/degreep-6.png',
        ],
        collage3col: true,
        video: 'projects/socialmediaverslaving.mp4'
    }
];

const projOverlay = document.getElementById('projOverlay');
const poClose     = document.getElementById('poClose');
const poNum       = document.getElementById('poNum');
const poTitle     = document.getElementById('poTitle');
const poMeta      = document.getElementById('poMeta');
const poRole      = document.getElementById('poRole');
const poMedia     = document.getElementById('poMedia');
const poDesc      = document.getElementById('poDesc');
const poTasks     = document.getElementById('poTasks');

function openProject(idx) {
    const p = projectData[idx];
    if (!p || !projOverlay) return;
    poNum.textContent   = p.num;
    poTitle.textContent = p.title;
    poMeta.textContent  = p.meta;
    poRole.textContent  = p.role;
    poDesc.textContent  = p.desc;

    if (poTasks) {
        poTasks.innerHTML = p.tasks
            ? p.tasks.map(t => `<div class="po-task${t.image ? ' po-task-split' : ''}">
                <div class="po-task-text">
                    <span class="po-task-label">${t.label}</span>
                    <p class="po-task-desc">${t.desc}</p>
                </div>
                ${t.image ? `<img src="${t.image}" class="po-task-img" alt="${t.label}">` : ''}
              </div>`).join('')
            : '';
    }

    if (p.images && p.images.length) {
        poMedia.classList.add('has-imgs');
        const imgs = p.images;
        if (p.collage && imgs.length === 5) {
            const cg = imgs.slice(0, 4).map((s, i) =>
                `<img src="${s}" class="po-cg po-cg-${i + 1}" alt="">`
            ).join('');
            poMedia.innerHTML = `
                <div class="po-collage">
                    ${cg}
                    <div class="po-cside-wrap"><img src="${imgs[4]}" class="po-cside-g" alt="${p.title}"></div>
                </div>`;
        } else if (p.collage4 && imgs.length === 4) {
            const cg = imgs.map(s => `<img src="${s}" class="po-cg4" alt="">`).join('');
            poMedia.innerHTML = `<div class="po-collage-4">${cg}</div>`;
        } else if (p.collage3 && imgs.length === 3) {
            const cg = imgs.map(s => `<img src="${s}" class="po-c3" alt="">`).join('');
            poMedia.innerHTML = `<div class="po-collage-3">${cg}</div>`;
        } else if (p.collage3col) {
            const cg = imgs.map(s => `<img src="${s}" class="po-cgrid" alt="">`).join('');
            poMedia.innerHTML = `<div class="po-collage-3">${cg}</div>`;
        } else {
            poMedia.innerHTML = imgs.map((s, i) =>
                `<img src="${s}" class="${i === 0 ? 'po-img-hero' : 'po-img'}" alt="${i === 0 ? p.title : ''}">`
            ).join('');
        }
        if (p.video) {
            poMedia.innerHTML += `<video class="po-video" controls playsinline>
                <source src="${p.video}" type="video/mp4">
            </video>`;
        }
        poMedia.style.background = '';
        poMedia.style.color = '';
    } else {
        poMedia.classList.remove('has-imgs');
        poMedia.innerHTML = '';
        poMedia.style.background = p.bg || 'var(--sur)';
        poMedia.style.color      = p.color || 'var(--text)';
    }

    projOverlay.classList.add('open');
    projOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => poClose && poClose.focus(), 600);
}

function closeProject() {
    if (!projOverlay) return;
    projOverlay.classList.remove('open');
    projOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { poMedia.innerHTML = ''; poMedia.classList.remove('has-imgs'); }, 800);
}

if (poClose) poClose.addEventListener('click', closeProject);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && projOverlay && projOverlay.classList.contains('open')) closeProject();
});

document.querySelectorAll('.pcard').forEach((card, i) => {
    card.addEventListener('click', () => openProject(i));
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
