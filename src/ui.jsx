import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PROFILE } from './data.js';
import { MOTION, RM, THEMES, setMotion } from './hooks.js';

export const ProgressBar = () => <div id="bar" />;

/** switches between full animations and the gentle "lite" mode (remembered, page reloads once) */
export const MotionToggle = ({ className = '' }) => (
  <button className={'mot mono ' + className} onClick={() => setMotion(MOTION === 'full' ? 'lite' : 'full')} title="Switch animations between full and lite" aria-label={`Animations: ${MOTION}. Tap to switch`}>
    <i />Motion: {MOTION === 'full' ? 'Full' : 'Lite'}
  </button>
);

export const Btn = ({ p, href, children, ...r }) => {
  const C = href ? 'a' : 'button';
  return <C className={'btn' + (p ? ' p' : '')} href={href} {...r}><span>{children}</span></C>;
};

export function Preloader({ onDone }) {
  const root = useRef(null), num = useRef(null), bar = useRef(null);
  useEffect(() => {
    if (RM) { onDone(); return; }
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(o, { v: 100, duration: 1.6, ease: 'power2.inOut',
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0'); if (bar.current) bar.current.style.transform = `scaleX(${o.v / 100})`; },
        onComplete: () => { onDone(); gsap.to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power4.inOut', onComplete: () => { if (root.current) root.current.style.display = 'none'; } }); } });
    });
    return () => ctx.revert();
  }, []); // eslint-disable-line
  return RM ? null : (
    <div id="pre" ref={root}>
      <div className="mono">AMARDIP CHAUDHARI &mdash; PORTFOLIO 2026</div>
      <div className="pcount"><span ref={num}>000</span><em>%</em></div>
      <div className="bar0"><i ref={bar} /></div>
    </div>
  );
}

export function TopBar({ onJump, theme, onTheme, onMenu }) {
  const go = (e) => { e.preventDefault(); onJump(e.currentTarget.getAttribute('href').slice(1)); };
  return (
    <header className="topbar">
      <a className="brand mono" href="#hero" onClick={go}><span className="bf">AMARDIP CHAUDHARI</span><span className="bs">AC</span> <span className="c">&copy;26</span></a>
      <nav>{[['about', 'About'], ['services', 'Services'], ['work', 'Work'], ['skills', 'Skills'], ['path', 'Journey'], ['contact', 'Contact']].map(([id, l], i) => <a key={id} href={`#${id}`} onClick={go}><i>0{i + 1}</i>{l}</a>)}</nav>
      <div className="tools">
        <div className="sws" role="group" aria-label="Theme">{THEMES.map((t) => <button key={t.id} className={t.id === theme ? 'cur' : ''} title={t.name} aria-label={t.name + ' theme'} onClick={() => onTheme(t.id)} style={{ '--a': t.sw[0], '--c': t.sw[1], '--b': t.sw[2] }} />)}</div>
        <MotionToggle className="hide-sm" />
        <a className="rbtn mono" href={PROFILE.resume} download>Resume &darr;</a>
        <button className="mbtn mono" onClick={onMenu} aria-label="Open menu">Menu<i className="ham"><b /><b /></i></button>
      </div>
    </header>
  );
}

/** small square cursor that inverts what is under it and grows over links */
export function Cursor() {
  useEffect(() => {
    if (!matchMedia('(hover:hover)').matches || RM) return;
    const el = document.getElementById('cur'), qx = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3' }), qy = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3' });
    const move = (e) => { qx(e.clientX); qy(e.clientY); el.classList.toggle('g', !!e.target.closest?.('a,button,.srow,input,textarea')); };
    addEventListener('pointermove', move);
    /* primary buttons and the back-to-top button are gently pulled toward the pointer */
    const off = [...document.querySelectorAll('.btn.p,.totop')].map((b) => {
      const m = (e) => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.35, ease: 'power3.out' }); };
      const l = () => gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.45)' });
      b.addEventListener('pointermove', m); b.addEventListener('pointerleave', l);
      return () => { b.removeEventListener('pointermove', m); b.removeEventListener('pointerleave', l); };
    });
    return () => { removeEventListener('pointermove', move); off.forEach((f) => f()); };
  }, []);
  return <div id="cur" />;
}

/** square back-to-top button: fills with scroll progress, and the arrow launches when pressed */
export function ToTop({ onTop }) {
  const [show, setShow] = useState(false), [go, setGo] = useState(false), fill = useRef(null);
  useEffect(() => { const f = () => { const m = document.documentElement.scrollHeight - innerHeight; setShow(scrollY > 900); if (fill.current) fill.current.style.transform = `scaleY(${m > 0 ? scrollY / m : 0})`; }; addEventListener('scroll', f, { passive: true }); f(); return () => removeEventListener('scroll', f); }, []);
  const press = () => { setGo(true); setTimeout(() => setGo(false), 900); onTop(); };
  return <button className={'totop' + (show ? ' show' : '') + (go ? ' go' : '')} onClick={press} aria-label="Back to top"><i ref={fill} /><span>&uarr;</span></button>;
}

const MENU = [['about', 'About'], ['services', 'Services'], ['work', 'Work'], ['skills', 'Skills'], ['path', 'Journey'], ['terminal', 'Terminal'], ['contact', 'Contact']];
/** full-screen menu for tablets and phones: wipes down, links rise in one by one */
export function MenuOverlay({ open, onClose, onJump, theme, onTheme }) {
  const root = useRef(null), first = useRef(true);
  useEffect(() => {
    const el = root.current; if (!el) return;
    if (first.current) { first.current = false; return; }
    gsap.killTweensOf(el);
    if (open) {
      gsap.set(el, { display: 'flex' });
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power4.inOut' });
      gsap.fromTo(el.querySelectorAll('.mi'), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.8, ease: 'power4.out', delay: 0.3 });
      gsap.fromTo(el.querySelectorAll('.mfoot > *'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, delay: 0.7 });
    } else gsap.to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.55, ease: 'power4.inOut', onComplete: () => gsap.set(el, { display: 'none' }) });
  }, [open]);
  return (
    <div className="menu dk" ref={root} role="dialog" aria-label="Menu" aria-hidden={!open}>
      <button className="mclose mono" onClick={onClose}>Close &times;</button>
      <nav>{MENU.map(([id, l], i) => <span className="mrow" key={id}><a className="mi" href={`#${id}`} onClick={(e) => { e.preventDefault(); onJump(id); }}><i>0{i + 1}</i>{l}</a></span>)}</nav>
      <div className="mfoot">
        <div className="sws">{THEMES.map((t) => <button key={t.id} className={t.id === theme ? 'cur' : ''} title={t.name} aria-label={t.name + ' theme'} onClick={() => onTheme(t.id)} style={{ '--a': t.sw[0], '--c': t.sw[1], '--b': t.sw[2] }} />)}</div>
        <MotionToggle />
        <a className="mono" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        <a className="mono" href={PROFILE.resume} download>Resume &darr;</a>
      </div>
    </div>
  );
}
