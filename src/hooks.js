import { useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true }); // phone address bar showing/hiding must not restart every animation

/* ---------- motion mode ----------
 * full = every animation. lite = gentle fades and line draws only (no pins, no smooth-scroll hijack).
 * Phones with "remove animations / battery saver" report reduced motion, so they start in lite mode,
 * and the Motion button (menu) lets the visitor switch to full. The choice is remembered. */
const SYSTEM_RM = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const saved = (() => { try { return localStorage.getItem('motion'); } catch { return null; } })();
export const MOTION = saved === 'full' || saved === 'lite' ? saved : SYSTEM_RM ? 'lite' : 'full';
export const RM = MOTION === 'lite';
export const setMotion = (m) => { try { localStorage.setItem('motion', m); } catch { /* ignore */ } location.reload(); };

export const THEMES = [
  { id: 'paper', name: 'Paper & Ink', ink: '#121110', sw: ['#ece8df', '#f2431e', '#0d0d0b'] },
  { id: 'mint', name: 'Mint & Forest', ink: '#0f1a12', sw: ['#e9efe3', '#1b8a46', '#0a1510'] },
  { id: 'blush', name: 'Blush & Plum', ink: '#1b0e17', sw: ['#f6e9ea', '#e2255f', '#170b14'] },
];
const $$ = (s) => gsap.utils.toArray(s);
const $ = (s) => document.querySelector(s);

/** Theme switch: coloured columns rise, the theme swaps while the screen is covered, the name flashes, columns lift away. */
let busy = false;
function stripes(theme, swap) {
  const N = innerWidth < 700 ? 5 : 8, el = document.createElement('div');
  el.className = 'tx'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = Array.from({ length: N }, () => '<i></i>').join('') + `<div class="txl"><span class="mono">Theme</span><b>${theme.name}</b></div>`;
  el.style.setProperty('--tb', theme.sw[0]); el.style.setProperty('--ta', theme.sw[1]); el.style.setProperty('--ti', theme.ink);
  document.body.appendChild(el);
  const cols = el.querySelectorAll('i'), words = el.querySelectorAll('.txl > *');
  gsap.timeline({ onComplete: () => { el.remove(); busy = false; } })
    .set(cols, { scaleY: 0, transformOrigin: '50% 100%' })
    .to(cols, { scaleY: 1, duration: 0.55, ease: 'power3.inOut', stagger: { each: 0.05, from: 'start' } })
    .add(swap)
    .fromTo(words, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power4.out' }, '-=0.05')
    .to(words, { yPercent: -115, opacity: 0, duration: 0.35, ease: 'power3.in', stagger: 0.04 }, '+=0.4')
    .set(cols, { transformOrigin: '50% 0%' })
    .to(cols, { scaleY: 0, duration: 0.6, ease: 'power3.inOut', stagger: { each: 0.05, from: 'end' } }, '-=0.1');
}

export function useTheme() {
  const [t, setT] = useState(() => { try { const v = localStorage.getItem('theme'); return THEMES.some((x) => x.id === v) ? v : 'paper'; } catch { return 'paper'; } });
  useLayoutEffect(() => { document.documentElement.dataset.theme = t; try { localStorage.setItem('theme', t); } catch { /* ignore */ } }, [t]);
  const pick = (id) => {
    const th = THEMES.find((x) => x.id === id); if (!th || id === t || busy) return;
    if (RM) { setT(id); return; }
    busy = true; stripes(th, () => { document.documentElement.dataset.theme = id; setT(id); });
  };
  return [t, pick];
}

/** Lenis smooth scroll driven by GSAP's ticker (keeps ScrollTrigger in sync). Locked until `ready`. Off in lite mode. */
export function useLenis(ready) {
  const [lenis, setLenis] = useState(null);
  useEffect(() => {
    if (RM) return;
    const l = new Lenis({ lerp: 0.08, wheelMultiplier: 0.95 });
    l.stop(); l.on('scroll', ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => { gsap.ticker.remove(tick); l.destroy(); setLenis(null); };
  }, []);
  useEffect(() => { if (lenis && ready) { lenis.start(); document.body.classList.remove('lock'); } }, [lenis, ready]);
  useEffect(() => { if (RM && ready) document.body.classList.remove('lock'); }, [ready]);
  return lenis;
}

/** scroll to a target with a duration that grows with the distance, so long jumps stay readable instead of snapping */
export function glide(lenis, target, offset = 0) {
  const to = target === 0 ? 0 : target.getBoundingClientRect().top + scrollY + offset, d = Math.abs(to - scrollY);
  if (!lenis) { scrollTo({ top: to, behavior: 'smooth' }); return; }
  lenis.scrollTo(to, { duration: Math.min(2.8, Math.max(0.9, d / 2400)), easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: () => d > 1500 && to === 0 && window.dispatchEvent(new Event('replayhero')) });
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#';

/** Every scroll animation of the page. Components stay plain markup.
 *  The animation set is rebuilt whenever the screen crosses a breakpoint (phone / tablet / desktop). */
export function useAnimations(ready) {
  useLayoutEffect(() => {
    document.documentElement.classList.add(RM ? 'rm' : 'js');
    const undo = [];
    const ctx = gsap.context(() => {
      /* hero letters wait below their line until the intro runs */
      const hs = new SplitText('.big .row > span', { type: 'chars', charsClass: 'ch' }); gsap.set(hs.chars, { yPercent: 118 });
      gsap.set(['.hmeta > div', '.hfoot > *', '.topbar'], { opacity: 0, y: 24 });
      gsap.to('#bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
      /* rolling role slot: any number of roles (the first is repeated at the end for a seamless loop) */
      const slot = $('.slot-in');
      if (slot) { const n = slot.children.length, tl = gsap.timeline({ repeat: -1 });
        for (let i = 1; i < n; i++) tl.to(slot, { yPercent: -(100 / n) * i, duration: 0.75, ease: 'power3.inOut' }, '+=1.7');
        tl.set(slot, { yPercent: 0 }, '+=1.7'); }
      /* small labels scramble in each time they enter */
      $$('[data-sc]').forEach((el) => { const t = el.textContent; undo.push(() => (el.textContent = t)); let run;
        const play = () => { run?.kill(); const o = { p: 0 }; run = gsap.to(o, { p: 1, duration: 0.9, ease: 'none', onUpdate: () => { const k = Math.floor(o.p * t.length); el.textContent = t.slice(0, k) + [...t.slice(k)].map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''); }, onComplete: () => (el.textContent = t) }); };
        ScrollTrigger.create({ trigger: el, start: 'top 94%', onEnter: play, onEnterBack: play }); });
      /* nav hides while scrolling down; marquee leans with scroll speed */
      let last = 0;
      if (!RM) ScrollTrigger.create({ onUpdate: (s) => { const y = scrollY; $('.topbar')?.classList.toggle('h', y > last && y > 500); last = y; const lim = innerWidth < 861 ? 6 : 10; gsap.to('.mqx', { skewX: gsap.utils.clamp(-lim, lim, -s.getVelocity() / 260), duration: 0.4, overwrite: 'auto' }); } });

      const mm = gsap.matchMedia();
      mm.add({ desk: '(min-width: 1024px)', tab: '(min-width: 861px) and (max-width: 1023px)', mob: '(max-width: 860px)' }, (c) => {
        const { mob, tab } = c.conditions, lite = RM; let alive = true;
        const Y = mob ? 26 : tab ? 38 : 52, D = mob ? 0.7 : tab ? 0.85 : 0.95, REPLAY = 'play none none reverse';
        /* ---- hero: pinned curtain on tablet/desktop, soft parallax fade on phones ---- */
        if (!lite) {
          const st = { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true };
          gsap.to('.r1', { xPercent: mob ? -4 : tab ? -5 : -7, ease: 'none', scrollTrigger: st });
          gsap.to('.r2', { xPercent: mob ? 4 : tab ? 5 : 7, ease: 'none', scrollTrigger: st });
          if (mob) gsap.to('.hin', { yPercent: -10, opacity: 0.15, ease: 'none', scrollTrigger: st });
          else { gsap.to('#hero .dim', { opacity: 0.92, ease: 'none', scrollTrigger: st }); ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', pin: true, pinSpacing: false }); }
        }
        /* ---- reveals replay every time a block comes back into view ---- */
        $$('.rv').forEach((e) => gsap.fromTo(e, { y: Y, opacity: 0 }, { y: 0, opacity: 1, duration: D, ease: 'power3.out', scrollTrigger: { trigger: e, start: mob ? 'top 95%' : 'top 90%', toggleActions: REPLAY } }));
        $$('.draw').forEach((e) => gsap.fromTo(e, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: e, start: 'top 95%', toggleActions: REPLAY } }));
        $$('[data-n]').forEach((e) => { const d = +(e.dataset.d || 0), o = { v: 0 }; const tw = gsap.to(o, { v: +e.dataset.n, duration: 1.7, ease: 'power2.out', paused: true, onUpdate: () => (e.textContent = o.v.toFixed(d)) });
          ScrollTrigger.create({ trigger: e, start: 'top 94%', onEnter: () => tw.restart(), onEnterBack: () => tw.restart(), onLeaveBack: () => { tw.pause(0); e.textContent = (0).toFixed(d); } }); });
        $$('.srow').forEach((r) => gsap.from(r.querySelectorAll('.chips span'), { scale: 0.7, opacity: 0, y: 10, stagger: 0.05, duration: 0.5, ease: 'back.out(2)', scrollTrigger: { trigger: r, start: 'top 90%', toggleActions: REPLAY } }));
        gsap.fromTo('.jl i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.jt', start: 'top 70%', end: 'bottom 70%', scrub: true } });
        if (!lite) gsap.from('.fbig', { yPercent: mob ? 25 : 45, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
        /* ---- process: line draws across on wide screens, down on phones; steps light up and un-light ---- */
        gsap.fromTo('.pline i', mob ? { scaleY: 0 } : { scaleX: 0 }, mob ? { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.pr', start: 'top 78%', end: 'bottom 70%', scrub: true } } : { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.pr', start: 'top 78%', end: 'bottom 70%', scrub: true } });
        $$('.ps').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 80%', onEnter: () => el.classList.add('on'), onLeaveBack: () => el.classList.remove('on') }));

        if (!lite && !mob) {
          /* ---- services: pinned storytelling, one idea at a time (pins are created in page order: hero, services, reel) ---- */
          const items = $$('.wi-item'), side = $$('.wi-side span'), cnt = $('.wi-count b'), N = items.length, len = () => '+=' + (N - 1) * (tab ? 80 : 95) + '%';
          gsap.set(items, { opacity: 0, yPercent: 28 }); gsap.set(items[0], { opacity: 1, yPercent: 0 });
          const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate: () => { const i = Math.max(0, Math.min(N - 1, Math.round(tl.time() - 0.1))); cnt.textContent = '0' + (i + 1); side.forEach((e, k) => e.classList.toggle('on', k === i)); },
            scrollTrigger: { trigger: '#services', start: 'top top', end: len, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true } });
          side[0]?.classList.add('on');
          items.forEach((el, i) => { if (!i) return; tl.to(items[i - 1], { opacity: 0, yPercent: -28, duration: 0.6 }, i - 1 + 0.2).to(el, { opacity: 1, yPercent: 0, duration: 0.6 }, i - 1 + 0.5); });
          tl.to({}, { duration: 0.4 });
          gsap.to('.wi-bg', { xPercent: -32, ease: 'none', scrollTrigger: { trigger: '#services', start: 'top top', end: len, scrub: true } });
          /* ---- projects: pinned horizontal reel ---- */
          const reel = $('.reel'), rc = $('.rcount b'), bar = $('.rline i'), n = $$('.pn').length, dist = () => Math.max(0, reel.scrollWidth - innerWidth);
          gsap.to(reel, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#work', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (s) => { bar.style.transform = `scaleX(${s.progress})`; rc.textContent = String(Math.min(n, Math.round(s.progress * (n - 1)) + 1)).padStart(2, '0'); } } });
          /* the phone / browser mockups float against the reel's movement */
          $$('.pn .pv > *').forEach((v) => gsap.fromTo(v, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '#work', start: 'top top', end: () => '+=' + dist(), scrub: true } }));
        } else if (!lite) {
          /* ---- phones: services and projects become vertical stories with their own motion ---- */
          $$('.wi-item').forEach((it) => gsap.from(it.children, { y: 36, opacity: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: it, start: 'top 88%', toggleActions: REPLAY } }));
          $$('.wi-n').forEach((el) => gsap.from(el, { x: -50, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 55%', scrub: true } }));
          $$('.pn').forEach((card) => { gsap.from(card, { y: 80, opacity: 0, scale: 0.96, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: REPLAY } });
            const v = card.querySelector('.pv > *'); if (v) gsap.fromTo(v, { y: 34 }, { y: -34, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
            gsap.from(card.querySelectorAll('.pc li'), { x: -18, opacity: 0, stagger: 0.07, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 70%', toggleActions: REPLAY } }); });
        } else {
          $$('.wi-item,.pn').forEach((el) => gsap.from(el, { y: 20, opacity: 0, duration: 0.6, scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: REPLAY } }));
        }
        /* ---- headings, lead paragraph and the big contact line need final fonts to split correctly ---- */
        document.fonts.ready.then(() => { if (!alive) return; c.add(() => {
          $$('.h2').forEach((h) => { if (lite) { gsap.from(h, { y: 18, opacity: 0, duration: 0.6, scrollTrigger: { trigger: h, start: 'top 90%', toggleActions: REPLAY } }); return; }
            const s = new SplitText(h, { type: 'lines', mask: 'lines' }); gsap.from(s.lines, { yPercent: 108, stagger: mob ? 0.08 : 0.12, duration: mob ? 0.8 : 1.05, ease: 'power4.out', scrollTrigger: { trigger: h, start: mob ? 'top 92%' : 'top 86%', toggleActions: REPLAY } }); });
          const lead = new SplitText('#lead', { type: 'words' }); gsap.fromTo(lead.words, { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '#lead', start: mob ? 'top 88%' : 'top 82%', end: mob ? 'bottom 60%' : 'bottom 50%', scrub: true } });
          if (!lite) { const say = new SplitText('.say > span', { type: 'chars' }); gsap.from(say.chars, { yPercent: 100, opacity: 0, stagger: 0.04, duration: 0.8, ease: 'power4.out', scrollTrigger: { trigger: '.say', start: 'top 90%', toggleActions: REPLAY } }); }
          ScrollTrigger.refresh(); }); });
        return () => { alive = false; };
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });
    return () => { undo.forEach((f) => f()); ctx.revert(); document.documentElement.classList.remove('js', 'rm'); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let offProx = () => {}, loop = null;
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ onComplete: () => { ScrollTrigger.refresh(); if (RM) return;
        if (matchMedia('(hover:hover)').matches) offProx = proximity(); else loop = touchShimmer(); } });
      if (RM) intro.to('.topbar', { opacity: 1, y: 0, duration: 0.4 }).to('.big .ch', { yPercent: 0, stagger: 0.02, duration: 0.6, ease: 'power3.out' }, 0).to(['.hmeta > div', '.hfoot > *'], { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 }, 0.2);
      else intro.to('.topbar', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }).to('.big .ch', { yPercent: 0, stagger: 0.05, duration: 1.15, ease: 'power4.out' }, '-=0.4').to(['.hmeta > div', '.hfoot > *'], { opacity: 1, y: 0, stagger: 0.09, duration: 0.8, ease: 'power3.out' }, '-=0.7');
    });
    /* back-to-top (or any long jump up) plays the hero introduction again */
    const replay = () => { if (RM) return; gsap.fromTo('.big .ch', { yPercent: 118 }, { yPercent: 0, stagger: 0.04, duration: 0.9, ease: 'power4.out', overwrite: true }); gsap.fromTo(['.hmeta > div', '.hfoot > *'], { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out' }); };
    window.addEventListener('replayhero', replay);
    return () => { window.removeEventListener('replayhero', replay); offProx(); loop?.kill(); ctx.revert(); };
  }, [ready]);
}

/** hero letters bend toward the pointer and light up (mouse devices) */
function proximity() {
  const chars = $$('.big .ch'), hero = $('#hero'); if (!hero) return () => {};
  const mv = (e) => chars.forEach((c) => { const r = c.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), k = Math.max(0, 1 - Math.hypot(dx, dy) / 240);
    gsap.to(c, { skewX: -(dx / 240) * k * 14, x: -(dx / 240) * k * 10, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); c.classList.toggle('hot', k > 0.5); });
  const lv = () => chars.forEach((c) => { gsap.to(c, { skewX: 0, x: 0, duration: 0.6, overwrite: 'auto' }); c.classList.remove('hot'); });
  hero.addEventListener('pointermove', mv); hero.addEventListener('pointerleave', lv);
  return () => { hero.removeEventListener('pointermove', mv); hero.removeEventListener('pointerleave', lv); };
}
/** touch screens have no hover, so a light sweeps across the hero letters now and then */
function touchShimmer() {
  const chars = $$('.big .ch'), tl = gsap.timeline({ repeat: -1, repeatDelay: 2.8, delay: 1.2 });
  chars.forEach((c, i) => tl.call(() => c.classList.add('hot'), null, i * 0.08).call(() => c.classList.remove('hot'), null, i * 0.08 + 0.5));
  return tl;
}
