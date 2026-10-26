import { useEffect, useState } from "react";
//import { Analytics } from "@vercel/analytics/next";
import { glide, useAnimations, useLenis, useTheme } from "./hooks.js";
import {
  Cursor,
  MenuOverlay,
  Preloader,
  ProgressBar,
  ToTop,
  TopBar,
} from "./ui.jsx";
import {
  About,
  Contact,
  FAQSec,
  Footer,
  GitHub,
  Hero,
  Journey,
  Marquee,
  Process,
  Projects,
  Skills,
  TerminalSec,
  WhatIDo,
} from "./sections.jsx";

export default function App() {
  const [ready, setReady] = useState(false),
    [menu, setMenu] = useState(false);
  const [theme, pick] = useTheme();
  const lenis = useLenis(ready);
  useAnimations(ready);
  useEffect(() => {
    document.body.classList.add("lock");
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.body.classList.toggle("lock", menu);
    if (lenis) menu ? lenis.stop() : lenis.start();
  }, [menu, ready, lenis]);
  useEffect(() => {
    const k = (e) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  const jump = (id) => {
    const t = document.getElementById(id);
    if (!t) return;
    glide(lenis, id === "hero" ? 0 : t);
  };
  const go = (id) => {
    setMenu(false);
    setTimeout(() => jump(id), 380);
  };
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Cursor />
      <ProgressBar />
      <Preloader onDone={() => setReady(true)} />
      <TopBar
        onJump={jump}
        theme={theme}
        onTheme={pick}
        onMenu={() => setMenu(true)}
      />
      <MenuOverlay
        open={menu}
        onClose={() => setMenu(false)}
        onJump={go}
        theme={theme}
        onTheme={pick}
      />
      <ToTop onTop={() => jump("hero")} />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <WhatIDo />
        <Projects />
        <Skills />
        <Journey />
        <TerminalSec />
        <Process />
        <GitHub />
        <FAQSec />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
