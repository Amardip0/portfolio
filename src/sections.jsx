import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ABOUT,
  FAQ,
  GH_USER,
  JOURNEY,
  MARQUEE,
  PROCESS,
  PROFILE,
  PROJECTS,
  SERVICES,
  SKILLS,
  STATS,
} from "./data.js";
import { Btn } from "./ui.jsx";

function Clock() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  const [v, setV] = useState(fmt);
  useEffect(() => {
    const i = setInterval(() => setV(fmt()), 15000);
    return () => clearInterval(i);
  }, []);
  return <>{v} IST</>;
}
const SecHead = ({ n, t }) => (
  <div className="shead">
    <b className="mono">{n}</b>
    <i className="draw" />
    <span className="mono" data-sc>
      {t}
    </span>
  </div>
);

const Music = () => (
  <div className="ph">
    <div className="mono">Now playing</div>
    <div className="art" />
    <div className="eq">
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} style={{ "--d": `${(i * 0.17) % 1}s` }} />
      ))}
    </div>
    <div className="pbar">
      <i />
    </div>
  </div>
);
const Web = () => (
  <div className="vb">
    <div className="bar">
      <i />
      <i />
      <i />
    </div>
    <div className="bd">
      <b />
      <div className="g3">
        <u />
        <u />
        <u />
      </div>
      <s />
      <s />
      <s />
    </div>
  </div>
);
const ML = () => (
  <svg className="vc" viewBox="0 0 300 200" fill="none">
    <g stroke="var(--line)">
      {[40, 80, 120, 160].map((y) => (
        <path key={y} d={`M0 ${y}H300`} />
      ))}
      {[75, 150, 225].map((x) => (
        <path key={x} d={`M${x} 0V200`} />
      ))}
    </g>
    {[
      [20, 170],
      [50, 150],
      [70, 155],
      [95, 120],
      [120, 125],
      [150, 95],
      [175, 100],
      [205, 65],
      [235, 55],
      [270, 30],
    ].map((p) => (
      <rect
        key={p}
        x={p[0] - 4}
        y={p[1] - 4}
        width="8"
        height="8"
        fill="var(--ink)"
      />
    ))}
    <path
      className="ln"
      d="M10 178 C90 140 150 100 290 22"
      stroke="var(--acc)"
      strokeWidth="3"
    />
  </svg>
);
const Students = () => (
  <div className="ph">
    <div className="mono">Students</div>
    <div className="fld">
      <i />
      <i />
      <i />
    </div>
    <div className="fbtn" />
    <div className="rows">
      <b />
      <b />
      <b />
    </div>
  </div>
);
const Food = () => (
  <div className="ph">
    <div className="mono">YummCart</div>
    <div className="hero2" />
    <div className="dishes">
      <i />
      <i />
      <i />
      <i />
    </div>
    <div className="nav4">
      <b />
      <b />
      <b />
      <b />
    </div>
  </div>
);
const VIS = {
  music: Music,
  web: Web,
  ml: ML,
  students: Students,
  food: Food,
};
const WORDS = [
  "ZERO",
  "ONE",
  "TWO",
  "THREE",
  "FOUR",
  "FIVE",
  "SIX",
  "SEVEN",
  "EIGHT",
  "NINE",
  "TEN",
];

export const Hero = () => (
  <section id="hero" className="sec">
    <div className="hin">
      <div className="hmeta mono">
        <div>
          <em>Based in</em>
          {PROFILE.city}
        </div>
        <div>
          <em>Status</em>MCA, Semester 1
        </div>
        <div>
          <em>Available for</em>Internships &amp; projects
        </div>
        <div>
          <em>Local time</em>
          <Clock />
        </div>
      </div>
      <h1 className="big">
        <span className="row r1">
          <span>{PROFILE.name.toUpperCase()}</span>
        </span>
        <span className="row r2">
          <span>{PROFILE.surname.toUpperCase()}</span>
        </span>
      </h1>
      <div className="hfoot">
        <div className="roles">
          <div className="slot">
            <div className="slot-in">
              {[...PROFILE.roles, PROFILE.roles[0]].map((r, i) => (
                <span key={i}>{r}</span>
              ))}
            </div>
          </div>
        </div>
        <p>{PROFILE.tagline}</p>
        <div className="cta">
          <Btn p href="#work">
            View projects &darr;
          </Btn>
          <Btn href={PROFILE.resume} download>
            Download resume
          </Btn>
        </div>
      </div>
    </div>
    <div className="dim" />
  </section>
);

export const Marquee = ({ reverse }) => {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="mqw cover">
      <div
        className="mqx"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[0, 1].map((k) => (
          <div key={k} className="mqr">
            {row.map((w, i) => (
              <span key={i} className={w === "✦" ? "sep" : i % 2 ? "out" : ""}>
                {w === "✦" ? "/" : w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const About = () => (
  <section id="about" className="sec cover">
    <div className="wrap">
      <SecHead n="01" t="About" />
      <h2 className="h2">
        WHO'S BEHIND
        <br />
        THE CODE.
      </h2>
      <p id="lead">{PROFILE.lead}</p>
      <dl className="facts">
        {ABOUT.map(([k, h, p]) => (
          <div className="frow rv" key={k}>
            <i className="draw" />
            <dt className="mono">{k}</dt>
            <dd>
              <b>{h}</b>
              <span>{p}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="stats">
        {STATS.map(([n, l, d]) => (
          <div className="stat rv" key={l}>
            <b data-n={n} data-d={d || 0}>
              0
            </b>
            <span className="mono">{l}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Projects = () => (
  <section id="work" className="sec cover work">
    <div className="reel">
      <div className="rintro">
        <SecHead n="03" t="Selected work" />
        <h2 className="h2">
          {WORDS[PROJECTS.length] || PROJECTS.length}
          <br />
          PROJECTS,
          <br />
          <span className="acc">END TO END.</span>
        </h2>
        <p className="mono hint">Keep scrolling &rarr;</p>
      </div>
      {PROJECTS.map((p, i) => {
        const V = VIS[p.v];
        return (
          <article className="pn" key={p.title}>
            <header>
              <span className="pnum">0{i + 1}</span>
              <span className="mono">{p.kind}</span>
            </header>
            <div className="pgrid">
              <div className="pc">
                <h3 className={p.title.length > 17 ? "long" : ""}>{p.title}</h3>
                <p className="tg">{p.tag}</p>
                <dl className="spec">
                  <div>
                    <dt className="mono">Languages</dt>
                    <dd>{p.lang}</dd>
                  </div>
                  <div>
                    <dt className="mono">Team</dt>
                    <dd>{p.team}</dd>
                  </div>
                  <div>
                    <dt className="mono">My role</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div>
                    <dt className="mono">Built as</dt>
                    <dd>{p.built}</dd>
                  </div>
                </dl>
                <ul>
                  {p.pts.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="tags">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="acts">
                  {p.live && (
                    <Btn p href={p.live} target="_blank" rel="noopener">
                      Live demo &#8599;
                    </Btn>
                  )}
                  <Btn p={!p.live} href={p.code} target="_blank" rel="noopener">
                    Source code &#8599;
                  </Btn>
                </div>
              </div>
              <div className="pv">
                <V />
              </div>
            </div>
          </article>
        );
      })}
    </div>
    <div className="rbar">
      <div className="rcount mono">
        <b>01</b> / {String(PROJECTS.length).padStart(2, "0")}
      </div>
      <div className="rline">
        <i />
      </div>
    </div>
  </section>
);

export const Skills = () => (
  <section id="skills" className="sec cover dk">
    <div className="wrap">
      <SecHead n="04" t="Toolkit" />
      <h2 className="h2">
        SKILLS &amp;
        <br />
        STACK.
      </h2>
      <div className="srows">
        {SKILLS.map(([t, d, list], i) => (
          <div className="srow rv" key={t}>
            <span className="mono sn">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <div className="chips">
              {list.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Journey = () => (
  <section id="path" className="sec cover">
    <div className="wrap">
      <SecHead n="05" t="Journey" />
      <h2 className="h2">
        THE PATH
        <br />
        SO FAR.
      </h2>
      <div className="jt">
        <div className="jl">
          <i />
        </div>
        {JOURNEY.map(([k, h, p], i) => (
          <div className="ji rv" key={k}>
            <span className="jk mono">
              0{i + 1} &middot; {k}
            </span>
            <div>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export function Contact() {
  const [s, setS] = useState("idle");
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setS("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "failed");
      setS("sent");
      form.reset();
    } catch {
      setS("error");
    }
  }
  const links = [
    ["Email", PROFILE.email, `mailto:${PROFILE.email}`],
    ["GitHub", "github.com/Amardip0", PROFILE.github],
    ["LinkedIn", "linkedin.com/in/amardip-chaudhari", PROFILE.linkedin],
    ["Resume", "Download PDF (ATS-friendly)", PROFILE.resume],
    ["Resume", "Download Word (.docx)", PROFILE.resumeDocx],
  ];
  return (
    <section id="contact" className="sec cover dk">
      <div className="wrap">
        <SecHead n="10" t="Contact" />
        <a className="say rv" href={`mailto:${PROFILE.email}`}>
          <span>LET'S TALK</span>
          <b>&#8599;</b>
        </a>
        <div className="cgrid">
          <div className="clinks">
            {links.map(([k, v, h]) => (
              <a
                className="crow rv"
                key={k + v}
                href={h}
                {...(k === "Resume"
                  ? { download: true }
                  : k === "Email"
                    ? {}
                    : { target: "_blank", rel: "noopener" })}
              >
                <i className="draw" />
                <span className="mono">{k}</span>
                <span>{v}</span>
                <b>&rarr;</b>
              </a>
            ))}
          </div>
          <form className="cf rv" onSubmit={submit}>
            <div className="mono">Or leave a message</div>
            <input
              name="name"
              placeholder="Your name"
              required
              minLength={2}
              maxLength={100}
            />
            <input
              name="email"
              type="email"
              placeholder="Your email"
              required
              maxLength={200}
            />
            <textarea
              name="message"
              placeholder="Tell me about your project or role"
              required
              minLength={5}
              maxLength={2000}
              rows={3}
            />
            <input
              name="website"
              className="hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <Btn p disabled={s === "sending"}>
              {s === "sending" ? "Sending…" : "Send message →"}
            </Btn>
            {s === "sent" && (
              <p className="ok">
                Thanks! Your message was saved. I'll reply soon.
              </p>
            )}
            {s === "error" && (
              <p className="er">
                Couldn't send right now. Please email me directly:{" "}
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export const Footer = () => (
  <footer className="cover">
    <div className="fbig" aria-hidden="true">
      AMARDIP
    </div>
    <div className="frow2 mono">
      <span>&copy; 2026 Amardip Chaudhari</span>
      <span>{PROFILE.city}</span>
    </div>
  </footer>
);

export const WhatIDo = () => (
  <section id="services" className="sec cover dk wi">
    <div className="wi-bg" aria-hidden="true">
      WHAT I DO
    </div>
    <div className="wi-stage">
      <div className="wi-top">
        <SecHead n="02" t="What I do" />
      </div>
      <div className="wi-list">
        {SERVICES.map(([t, d, chips], i) => (
          <article className="wi-item" key={t}>
            <span className="wi-n">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
            <div className="chips">
              {chips.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <aside className="wi-side mono">
        {SERVICES.map((x, i) => (
          <span key={x[0]}>
            0{i + 1} {x[0]}
          </span>
        ))}
      </aside>
      <div className="wi-count mono">
        <b>01</b> / 0{SERVICES.length}
      </div>
    </div>
  </section>
);

export const Process = () => (
  <section id="process" className="sec cover">
    <div className="wrap">
      <SecHead n="07" t="Process" />
      <h2 className="h2">
        HOW I<br />
        WORK.
      </h2>
      <div className="pr">
        <div className="pline">
          <i />
        </div>
        {PROCESS.map(([t, d], i) => (
          <div className="ps rv" key={t}>
            <span className="pnode" />
            <b className="psn">0{i + 1}</b>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/** Interactive terminal: types a first command by itself, then answers real commands. */
export function TerminalSec() {
  const [lines, setLines] = useState([
    ["sys", 'Type a command or tap a chip below. Try "help".'],
  ]);
  const [val, setVal] = useState(""),
    body = useRef(null),
    seen = useRef(false),
    root = useRef(null);
  const out = {
    help: () => [
      "Commands: about, skills, projects, experience, education, contact, resume, clear",
    ],
    about: () => [PROFILE.lead],
    skills: () => SKILLS.map(([t, , l]) => `${t.padEnd(13)} ${l.join(", ")}`),
    projects: () =>
      PROJECTS.map((p, i) => `0${i + 1}  ${p.title.padEnd(24)} ${p.lang}`),
    experience: () => [
      "Web Design / UI-UX Intern   Preyan Technosys, Chikhli, Gujarat",
      "Nov 2025 - Jan 2026         120 hours",
    ],
    education: () => [
      "MCA  2026-2028 (pursuing)   Uka Tarsadia University, Bardoli",
      "BCA  2023-2026  CGPA 7.45   CASPS, VNSGU",
    ],
    contact: () => [
      `email     ${PROFILE.email}`,
      `github    ${PROFILE.github}`,
      `linkedin  ${PROFILE.linkedin}`,
    ],
    resume: () => {
      const a = document.createElement("a");
      a.href = PROFILE.resume;
      a.download = "";
      a.click();
      return ["Downloading resume…"];
    },
  };
  const run = (raw) => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    if (c === "clear") {
      setLines([]);
      return;
    }
    setLines((l) => [
      ...l,
      ["cmd", c],
      ...(out[c] ? out[c]() : [`command not found: ${c}. Type "help".`]).map(
        (t) => ["out", t],
      ),
    ]);
  };
  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);
  useEffect(() => {
    // type the first command when the section scrolls into view
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || seen.current) return;
        seen.current = true;
        io.disconnect();
        const w = "about";
        let i = 0;
        const t = setInterval(() => {
          i++;
          setVal(w.slice(0, i));
          if (i === w.length) {
            clearInterval(t);
            setTimeout(() => {
              run(w);
              setVal("");
            }, 350);
          }
        }, 110);
      },
      { threshold: 0.45 },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, []); // eslint-disable-line
  return (
    <section id="terminal" className="sec cover dk">
      <div className="wrap" ref={root}>
        <SecHead n="06" t="Terminal" />
        <h2 className="h2">
          ASK ME
          <br />
          <span className="acc">ANYTHING.</span>
        </h2>
        <div className="term rv">
          <div className="term-bar">
            <i />
            <i />
            <i />
            <span className="mono">amardip@portfolio ~ %</span>
          </div>
          <div
            className="term-body"
            ref={body}
            onClick={() => document.getElementById("tin")?.focus()}
          >
            {lines.map(([k, t], i) => (
              <div key={i} className={"tl-" + k}>
                {k === "cmd" && <b>$ </b>}
                {t}
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(val);
                setVal("");
              }}
              className="tline"
            >
              <b>$ </b>
              <input
                id="tin"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                aria-label="terminal command"
              />
              <i className="caret" />
            </form>
          </div>
          <div className="term-chips">
            {Object.keys(out)
              .concat("clear")
              .map((c) => (
                <button key={c} onClick={() => run(c)}>
                  {c}
                </button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GitHub() {
  const [d, setD] = useState(null),
    root = useRef(null);
  useEffect(() => {
    let off = false;
    Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`).then((r) =>
        r.ok ? r.json() : null,
      ),
      fetch(
        `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=30`,
      ).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([u, r]) => {
        if (!off)
          setD({
            u,
            repos: (Array.isArray(r) ? r : [])
              .filter((x) => !x.fork)
              .slice(0, 6),
          });
      })
      .catch(() => {
        if (!off) setD({ u: null, repos: [] });
      });
    return () => {
      off = true;
    };
  }, []);
  useLayoutEffect(() => {
    if (!d || !d.repos.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".repo", {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".repos", start: "top 88%" },
      });
    }, root);
    return () => ctx.revert();
  }, [d]);
  const fmt = (x) =>
    new Date(x).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  return (
    <section id="github" className="sec cover dk">
      <div className="wrap" ref={root}>
        <SecHead n="08" t="Open source" />
        <h2 className="h2">
          LIVE FROM
          <br />
          <span className="acc">GITHUB.</span>
        </h2>
        <div className="ghh rv">
          <div className="ghs">
            {d?.u && (
              <>
                <div>
                  <b>{d.u.public_repos}</b>
                  <span className="mono">Public repos</span>
                </div>
              </>
            )}
          </div>
          <Btn p href={PROFILE.github} target="_blank" rel="noopener">
            Open GitHub &#8599;
          </Btn>
        </div>
        <div className="repos">
          {!d &&
            [0, 1, 2].map((i) => (
              <div className="repo sk" key={i}>
                <i />
                <i />
                <i />
              </div>
            ))}
          {d?.repos.map((r) => (
            <a
              className="repo"
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noopener"
            >
              <h3>{r.name}</h3>
              <p>{r.description || "No description yet."}</p>
              <div className="rmeta mono">
                <span>{r.language || "Code"}</span>
                <span>&#9733; {r.stargazers_count}</span>
                <span>{fmt(r.pushed_at)}</span>
              </div>
            </a>
          ))}
          {d && !d.repos.length && (
            <p className="nogh">
              Your public repositories appear here automatically as soon as you
              publish them on GitHub.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function FAQSec() {
  const [o, setO] = useState(0),
    refs = useRef([]);
  useLayoutEffect(() => {
    refs.current.forEach(
      (el, i) =>
        el &&
        gsap.to(el, {
          height: o === i ? "auto" : 0,
          duration: 0.55,
          ease: "power3.inOut",
        }),
    );
  }, [o]);
  return (
    <section id="faq" className="sec cover">
      <div className="wrap">
        <SecHead n="09" t="Questions" />
        <h2 className="h2">
          GOOD TO
          <br />
          KNOW.
        </h2>
        <div className="faq">
          {FAQ.map(([q, a], i) => (
            <div className={"fa rv" + (o === i ? " on" : "")} key={q}>
              <button
                className="fq"
                onClick={() => setO(o === i ? -1 : i)}
                aria-expanded={o === i}
              >
                <span>{q}</span>
                <b className="plus">+</b>
              </button>
              <div
                className="fa-b"
                ref={(el) => (refs.current[i] = el)}
                style={{ height: i === 0 ? "auto" : 0 }}
              >
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
