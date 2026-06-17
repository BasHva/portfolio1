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
        desc: 'Drie opdrachten, drie richtingen. Van letters met de hand knippen uit karton tot het bouwen van een speelbare retro-game en een mobiele webpagina.',
        tasks: [
            {
                label: 'Opdracht 01 · Typografisch kalenderblad',
                desc: 'Voor deze opdracht maakte ik van mijn eigen verjaardag een typografisch kalenderblad. Elk cijfer en elke letter knipte ik met de hand uit blauw karton en bouwde ik laagje voor laagje op zodat ze 3D lijken. Klinkt simpel, maar het kostte echt veel tijd. Het eindresultaat zag er vet uit en ik was er trots op.'
            },
            {
                label: 'Opdracht 02 · Pixel Font Type Specimen',
                desc: 'Mijn pixel font presenteerde ik als een speelbare retro-game, gebouwd in HTML en CSS. Je speelt door meerdere levels en leert zo de geschiedenis van het lettertype. Ik koos voor een game omdat dat de beperkingen van een pixel font goed laat zien: kleine pixels, strakke rasters, maar toch vol karakter.'
            },
            {
                label: 'Opdracht 03 · Typografie voor scherm',
                desc: 'In de derde opdracht keek ik hoe mijn pixel font werkt op een echt telefoonscherm. Ik maakte er een artikel van met aandacht voor leesbaarheid, lettergrootte en contrast. Het punt: ook een pixel font kan er serieus en goed uitzien als je het goed toepast.',
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
        desc: 'The Morning Brew is een conceptuele koffieshop-app voor persona Mark. Ik ontwierp twee versies: een warme dagmodus en een donkere nachtmodus, beiden onderbouwd met kleurpsychologie en gestalt.',
        tasks: [
            {
                label: 'Dagmodus · Persona vertaling & branding',
                desc: 'Voor persona Mark maakte ik een warme dagmodus met crème, donkergroen en mauve roze. Kleuren die passen bij een serieuze koffieliefhebber. Met glassmorphism-kaarten over sfeervolle foto\'s geef je het geheel een premium gevoel. Elke keuze, van de tekst tot de productfoto, past bij wie Mark is.'
            },
            {
                label: 'Kleurpsychologie & visuele compositie',
                desc: 'Elke kleur- en lay-outkeuze is onderbouwd met theorie. Groen staat voor natuur en duurzaamheid, crème voor warmte en kwaliteit. De pagina is opgebouwd met een F-patroon en een 8pt grid. Gestalt-principes zorgen ervoor dat je producten automatisch als groepen ziet. En alles haalt de WCAG-contrastnorm voor toegankelijkheid.'
            },
            {
                label: 'Nachtmodus · Dashboard & smaakprofiel',
                desc: 'De nachtmodus voelt compleet anders. Donkergroen, functioneel en overzichtelijk. Het dashboard toont het smaakprofiel van Mark in een radar-grafiek, met zijn laatste bestelling en een aanbeveling. Eén toggle, maar de hele sfeer verandert.'
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
        desc: 'Drie opdrachten rond semiotiek, retorica en gestalt. Van het analyseren van een bestaande campagneposter tot het ontwerpen van mijn eigen poster over plasticvervuiling.',
        tasks: [
            {
                label: 'Opdracht 01 · Semiotiek',
                desc: 'Voor de semiotiek-opdracht koos ik schoenen als onderwerp en plaatste ze in drie totaal verschillende contexten. Dezelfde schoen, maar elke keer een andere betekenis. Ik voegde ook een indexicaal teken toe, iets wat naar iets anders verwijst zonder het direct te laten zien. Moddersporen bij de deur zeggen genoeg zonder dat je iemand hoeft te zien.'
            },
            {
                label: 'Opdracht 02 · Retorica',
                desc: 'Voor retorica analyseerde ik de WWF-poster "Out of the Plastic Trap". Ik keek hoe ze overtuiging, timing en stijl gebruiken om de boodschap te versterken. Daarna maakte ik een verbeterde versie: de schildpad verstikt nu echt door het plastic, de kleuren zijn feller en de tekst directer. Meer impact, sneller.'
            },
            {
                label: 'Eindoplevering · Eigen poster',
                desc: 'Als eindopdracht maakte ik mijn eigen poster over plasticvervuiling, gericht op jongeren. De poster is opgesplitst: aan de ene kant een vervuilde wereld, aan de andere schone natuur. De schildpad staat voor alles wat er misgaat, en de boodschap "Plastic? Niet met mij!" maakt het persoonlijk.'
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
        desc: 'Een geanimeerd Lego-poppetje in Cavalry, met drie knoppen die elk een andere beweging starten. Van eerste schets tot werkende interactieve animatie.',
        tasks: [
            {
                label: 'Concept & technisch onderzoek',
                desc: 'Ik keek naar meerdere concepten, van een alien tot een robot, maar koos uiteindelijk voor het Lego-poppetje. Herkenbaar, simpele vormen en makkelijk te animeren. Ik deed onderzoek naar Cavalry en de geschiedenis van het poppetje, dat al sinds 1978 bestaat. Juist die eenvoud maakt het interessant om mee te werken.'
            },
            {
                label: 'Moving icons & storyboard',
                desc: 'Ik ontwierp drie knoppen in Figma die elk een andere animatie starten. Bij hover verandert de achtergrond en speelt er een laadanimatie af. In mijn storyboard werkte ik de drie bewegingen uit: een blokje opgooien en vangen, het poppetje uit elkaar laten vallen, en een pet die via zijn voeten op zijn hoofd landt.'
            },
            {
                label: 'Eindproduct · Animatie in Cavalry',
                desc: 'Het eindresultaat is een volledig geanimeerd poppetje in Cavalry. Druk je op een knop, dan speelt de bijbehorende animatie. Cavalry heeft nauwelijks tutorials, dus het was echt uitzoeken. Maar het werkte: herhaalbare bewegingen en speelse animaties die het poppetje echt tot leven brengen.'
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
        desc: 'Een interactieve website over social media verslaving. Je ervaart zelf hoe scrollen langzaam verandert in iets waar je geen controle meer over hebt.',
        tasks: [
            {
                label: 'Concept & visueel onderzoek',
                desc: 'Ik koos dit onderwerp omdat ik het zelf herken en ook om mij heen zie. Als basis gebruikte ik een artikel van het AD over smartphoneverslaving. Ik maakte drie kleurpaletten en koos voor een donkere, digitale sfeer die past bij \'s avonds eindeloos scrollen. Het moodboard laat de opbouw zien: van rustig en normaal naar compleet chaos.'
            },
            {
                label: 'Interface ontwerp · Figma',
                desc: 'In Figma werkte ik de vijf fases uit: rust, scrollen, verslaving, chaos en overload. Elke fase heeft een eigen sfeer die steeds drukker wordt. Donkere kleuren met paarse en roze accenten, die doen denken aan schermlicht en notificaties. Hoe verder je komt, hoe meer visuele prikkels.'
            },
            {
                label: 'Eindproduct · Interactieve website',
                desc: 'Het eindproduct is een werkende website gebouwd in HTML, CSS en JavaScript. Het begint als een gewone feed, maar hoe langer je scrollt, hoe meer likes, notificaties en posts er verschijnen zonder dat je erom vraagt. De animaties worden sneller en drukker. Het idee: jij denkt dat je scrollt, maar de interface stuurt jou.',
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
