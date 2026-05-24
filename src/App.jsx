import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility: typed text hook ───────────────────────────────────────────────
function useTyped(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, cIdx + 1));
        if (cIdx + 1 === word.length) setTimeout(() => setDeleting(true), pause);
        else setCIdx(c => c + 1);
      } else {
        setDisplay(word.slice(0, cIdx - 1));
        if (cIdx - 1 === 0) {
          setDeleting(false);
          setWIdx(w => (w + 1) % words.length);
          setCIdx(0);
        } else setCIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [cIdx, deleting, wIdx, words, speed, pause]);
  return display;
}

// ─── Utility: intersection observer hook ────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated Section wrapper ────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>
      {children}
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, onHide }) {
  useEffect(() => { const t = setTimeout(onHide, 2500); return () => clearTimeout(t); }, [onHide]);
  return (
    <div style={{
      position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999,
      background: "var(--accent)", color: "#fff",
      padding: "0.75rem 1.5rem", borderRadius: "999px",
      fontSize: "0.85rem", fontWeight: 600, boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      animation: "fadeInUp 0.3s ease"
    }}>{msg}</div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const SKILLS_TECH = [
  { name: "Core Python", pct: 88, icon: "🐍" },
  { name: "Java", pct: 82, icon: "☕" },
  { name: "SQL", pct: 80, icon: "🗄️" },
  { name: "HTML/CSS", pct: 85, icon: "🌐" },
  { name: "JavaScript", pct: 72, icon: "⚡" },
  { name: "Linux", pct: 70, icon: "🐧" },
  { name: "DevOps", pct: 60, icon: "🔧" },
  { name: "MS Office", pct: 90, icon: "📊" },
];
const SKILLS_SOFT = ["Communication", "Problem Solving", "Leadership", "Decision Making", "Teamwork", "Adaptability"];
const PROJECTS = [
  {
    cat: "Python",
    title: "AI Attendance Monitoring + Chatbot",
    desc: "Smart attendance tracking with an AI chatbot for user interaction and automated monitoring.",
    tech: ["Python", "AI Concepts", "Database"],
    icon: "🤖",
    color: "#3b82f6"
  },
  {
    cat: "Python",
    title: "Contact Book Application",
    desc: "Full-featured contact manager with add/edit/delete, search, and persistent data storage.",
    tech: ["Python", "File Handling"],
    icon: "📒",
    color: "#10b981"
  },
  {
    cat: "Web",
    title: "Computer Training Centre Website",
    desc: "Modern educational institute site with course listings, fees, reviews, and responsive UI.",
    tech: ["HTML", "CSS", "JavaScript"],
    icon: "🎓",
    color: "#f59e0b"
  },
  {
    cat: "Java",
    title: "Street Vendor Application",
    desc: "Vendor product listing, customer interaction, and simple order handling system.",
    tech: ["Java", "SQL", "JDBC"],
    icon: "🏪",
    color: "#ef4444"
  },
  {
    cat: "Java",
    title: "Multithreading Chat Application",
    desc: "Real-time multi-user chat with thread management and client-server architecture.",
    tech: ["Java", "Socket", "Multithreading"],
    icon: "💬",
    color: "#8b5cf6"
  },
  {
    cat: "Java",
    title: "AI-Based Recommendation System",
    desc: "Personalized recommendation engine with user preference analysis and AI suggestion logic.",
    tech: ["Java", "AI Concepts", "SQL"],
    icon: "🧠",
    color: "#ec4899"
  },
  {
    cat: "Java",
    title: "REST API Client",
    desc: "Robust API request handling with JSON parsing and external API integration.",
    tech: ["Java", "REST API", "JSON"],
    icon: "🔗",
    color: "#14b8a6"
  },
  {
    cat: "Java",
    title: "File Handling Utility",
    desc: "File read/write operations with organized data management and comprehensive error handling.",
    tech: ["Java", "File I/O"],
    icon: "📁",
    color: "#f97316"
  },
];
const INTERNSHIPS = [
  {
    company: "Ladybird Web Solutions Pvt Ltd",
    role: "Backend Development Intern",
    duration: "1 Month",
    work: "Worked on backend development concepts and database connectivity.",
    icon: "🌐"
  },
  {
    company: "CodTech IT Solutions Pvt Ltd",
    role: "Java Programmer Intern",
    duration: "Contract",
    work: "Developed basic Java applications and improved core programming skills.",
    icon: "💻"
  },
  {
    company: "Skybrisk Technology",
    role: "Python Developer Intern",
    duration: "1 Month",
    work: "Built Contact Book Application; strengthened Python development fundamentals.",
    icon: "🚀"
  },
];
const CERTS = [
  { name: "Google Cloud Engineering", org: "Naan Mudhalvan", icon: "☁️" },
  { name: "Soft Skill Development Program", org: "SGBS Unnati Foundation", icon: "🎯" },
  { name: "Soft Skills", org: "HP LIFE Online Platform", icon: "💡" },
  { name: "AWS Assessment", org: "learntube.ai", icon: "🔐" },
];
const STRENGTHS = [
  { label: "Fast Learner", icon: "⚡", desc: "Quickly adapts to new technologies and concepts" },
  { label: "Calm Decision-Maker", icon: "🧘", desc: "Analytical and composed under pressure" },
  { label: "Highly Adaptable", icon: "🔄", desc: "Thrives in diverse and changing environments" },
  { label: "Analytical Thinker", icon: "🔍", desc: "Breaks down complex problems systematically" },
  { label: "Team Player", icon: "🤝", desc: "Collaborates effectively with cross-functional teams" },
  { label: "Continuous Learner", icon: "📚", desc: "Committed to lifelong growth and improvement" },
  { label: "Clear Communicator", icon: "💬", desc: "Conveys ideas clearly in professional settings" },
  { label: "Leadership Potential", icon: "🌟", desc: "Takes initiative and inspires those around them" },
];

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [scrollY, setScrollY] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);
  const countersRef = useRef(null);
  const typed = useTyped(["Software Engineer", "Python Developer", "Backend Developer", "AI Enthusiast", "Problem Solver"]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCountersStarted(true); }, { threshold: 0.3 });
    if (countersRef.current) obs.observe(countersRef.current);
    return () => obs.disconnect();
  }, []);

  const copy = useCallback((text, label) => {
    navigator.clipboard.writeText(text).then(() => setToast(`${label} copied!`));
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const filteredProjects = activeFilter === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === activeFilter);

  const css = `
    :root {
      --bg: ${dark ? "#0a0f1e" : "#f4f6fb"};
      --bg2: ${dark ? "#111827" : "#ffffff"};
      --bg3: ${dark ? "#1a2236" : "#eef1f8"};
      --text: ${dark ? "#e8edf5" : "#1a1d2e"};
      --text2: ${dark ? "#8b93a8" : "#5a637a"};
      --border: ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
      --accent: #3b82f6;
      --accent2: #8b5cf6;
      --glow: ${dark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)"};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; overflow-x: hidden; }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
    @keyframes pulse { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.05); } }
    @keyframes spin { from { transform:rotate(0); } to { transform:rotate(360deg); } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes particleFloat {
      0% { transform: translateY(100vh) translateX(0); opacity:0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.3; }
      100% { transform: translateY(-100px) translateX(60px); opacity:0; }
    }
    .cursor-blink { animation: blink 1s infinite; }
    .float { animation: float 4s ease-in-out infinite; }
    .section { padding: 6rem 0; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
    .section-title {
      font-size: clamp(1.8rem,4vw,2.5rem); font-weight: 800; margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .section-sub { color: var(--text2); font-size: 1rem; margin-bottom: 3.5rem; max-width: 560px; }
    .glass {
      background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)"};
      border: 1px solid var(--border);
      backdrop-filter: blur(12px);
      border-radius: 16px;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.75rem 1.75rem; border-radius: 999px; font-weight: 600;
      font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border: none;
      text-decoration: none;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.4); }
    .btn-outline {
      background: transparent; color: var(--text);
      border: 1.5px solid var(--border);
    }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
    .tag {
      display: inline-block; padding: 0.25rem 0.75rem;
      border-radius: 999px; font-size: 0.75rem; font-weight: 600;
      background: ${dark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)"};
      color: var(--accent); border: 1px solid rgba(59,130,246,0.3);
    }
    .nav-link {
      color: var(--text2); font-size: 0.9rem; font-weight: 500;
      cursor: pointer; padding: 0.4rem 0.75rem; border-radius: 8px;
      transition: all 0.2s; background: none; border: none;
    }
    .nav-link:hover { color: var(--accent); background: var(--glow); }
    @media (max-width: 768px) {
      .section { padding: 4rem 0; }
      .hide-mobile { display: none !important; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      {toast && <Toast msg={toast} onHide={() => setToast(null)} />}

      {/* ── Particles bg ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 37 + 10) % 100}%`,
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(59,130,246,0.4)" : "rgba(139,92,246,0.4)",
            animation: `particleFloat ${8 + i * 1.5}s linear infinite`,
            animationDelay: `${i * 0.8}s`,
          }} />
        ))}
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrollY > 60
          ? (dark ? "rgba(10,15,30,0.95)" : "rgba(244,246,251,0.95)")
          : "transparent",
        backdropFilter: scrollY > 60 ? "blur(20px)" : "none",
        borderBottom: scrollY > 60 ? `1px solid var(--border)` : "none",
        transition: "all 0.3s",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BP<span style={{ WebkitTextFillColor: "var(--text)" }}>.</span>
          </span>
          <div className="hide-mobile" style={{ display: "flex", gap: "0.25rem" }}>
            {["about", "skills", "projects", "experience", "contact"].map(s => (
              <button key={s} className="nav-link" onClick={() => scrollTo(s)} style={{ textTransform: "capitalize" }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button onClick={() => setDark(d => !d)} style={{
              background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "999px",
              padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "1rem", color: "var(--text)"
            }}>{dark ? "☀️" : "🌙"}</button>
            <button className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}
              onClick={() => scrollTo("contact")}>Hire Me</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1, paddingTop: "64px" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "3rem", alignItems: "center" }}>
          <div style={{ animation: "fadeInUp 0.8s ease" }}>
            <div className="tag" style={{ marginBottom: "1.5rem" }}>👋 Available for Opportunities</div>
            <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem" }}>
              Hi, I'm <br />
              <span style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% 200%", animation: "gradient 4s ease infinite" }}>
                B Punitha
              </span>
            </h1>
            <div style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 600, color: "var(--text2)", marginBottom: "1.5rem", height: "2rem" }}>
              <span style={{ color: "var(--accent)" }}>{typed}</span>
              <span className="cursor-blink" style={{ color: "var(--accent)" }}>|</span>
            </div>
            <p style={{ fontSize: "1rem", color: "var(--text2)", lineHeight: 1.8, maxWidth: "520px", marginBottom: "2.5rem" }}>
              A motivated engineering graduate passionate about building efficient backend solutions through Python, modern technologies, and AI-powered applications.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <button className="btn btn-primary" onClick={() => scrollTo("projects")}>⚡ View Projects</button>
              <button className="btn btn-outline" onClick={() => scrollTo("contact")}>📬 Contact Me</button>
              <a className="btn btn-outline" href="./resume.pdf " target ="_blank" rel="noopener noreferrer" >📄 Resume</a>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                { icon: "⚡", label: "GitHub", href: "https://github.com/punithab026-dev" },
                { icon: "💼", label: "LinkedIn", href: "https://www.linkedin.com/in/punithab" },
                { icon: "📧", label: "Email", href: "mailto:Punithab026@gmail.com" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  color: "var(--text2)", fontSize: "0.85rem", textDecoration: "none",
                  padding: "0.5rem 1rem", borderRadius: "999px", border: "1px solid var(--border)",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Avatar */}
          <div className="hide-mobile float" style={{ position: "relative" }}>
            <div style={{
              width: "280px", height: "280px", borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              padding: "3px",
            }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: "var(--bg3)", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "0.5rem",
                fontSize: "5rem", position: "relative", overflow: "hidden"
              }}>
                <span>👩‍💻</span>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(59,130,246,0.1),rgba(139,92,246,0.1))" }} />
              </div>
            </div>
            {/* Floating badges */}
            {[
              { label: "Python 🐍", pos: { top: "5%", right: "-20%" } },
              { label: "AI & DS 🧠", pos: { bottom: "15%", right: "-22%" } },
              { label: "Java ☕", pos: { top: "30%", left: "-25%" } },
            ].map(b => (
              <div key={b.label} className="glass" style={{
                position: "absolute", ...b.pos, padding: "0.5rem 1rem",
                fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap",
                color: "var(--accent)", animation: `pulse 3s ease-in-out infinite`,
              }}>{b.label}</div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", animation: "float 2s ease-in-out infinite", cursor: "pointer", zIndex: 1 }} onClick={() => scrollTo("about")}>
          <div style={{ color: "var(--text2)", fontSize: "0.8rem", textAlign: "center", marginBottom: "0.4rem" }}>scroll</div>
          <div style={{ width: "24px", height: "40px", border: "2px solid var(--border)", borderRadius: "12px", margin: "0 auto", position: "relative" }}>
            <div style={{ width: "4px", height: "8px", background: "var(--accent)", borderRadius: "2px", position: "absolute", top: "6px", left: "50%", transform: "translateX(-50%)", animation: "float 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={countersRef} style={{ background: "var(--bg3)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 1 }}>
        <div className="container" style={{ padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "2rem", textAlign: "center" }}>
          {[
            { val: 8, label: "Projects Built", suffix: "+" },
            { val: 3, label: "Internships", suffix: "" },
            { val: 4, label: "Certifications", suffix: "" },
            { val: 8.2, label: "CGPA", suffix: "" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <CountUp target={s.val} started={countersStarted} suffix={s.suffix} />
              <div style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: "0.4rem" }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="section" style={{ position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">About Me</h2>
            <p className="section-sub">Know who's behind the code</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
            <Reveal delay={0.1}>
              <div className="glass" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--accent)" }}>Professional Summary</h3>
                <p style={{ color: "var(--text2)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                  An enthusiastic and self-driven <strong style={{ color: "var(--text)" }}>Artificial Intelligence and Data Science</strong> graduate with a strong interest in software engineering and backend development. Quick to learn new technologies and capable of handling challenges with a calm and analytical mindset.
                </p>
                <p style={{ color: "var(--text2)", lineHeight: 1.9, fontSize: "0.95rem", marginTop: "1rem" }}>
                  Passionate about gaining knowledge, improving technical expertise, and contributing effectively to organizational growth through dedication, problem-solving, and continuous learning.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.5rem" }}>
                  {["Fast Learner", "Problem Solver", "Team Player", "Backend Dev", "AI Enthusiast"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { year: "2022", event: "Started B.Tech in AI & Data Science at JIT" },
                { year: "2024", event: "First internship – Backend Dev at Ladybird Web Solutions" },
                { year: "2024", event: "Java Intern at CodTech IT Solutions; built real-world apps" },
                { year: "2025", event: "Python Intern at Skybrisk Technology; built Contact Book App" },
                { year: "2026", event: "Graduating with 8.2 CGPA – Ready to contribute!" },
              ].map((item, i) => (
                <Reveal key={item.year} delay={i * 0.08}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{
                      minWidth: "56px", textAlign: "center",
                      background: "linear-gradient(135deg,var(--accent),var(--accent2))",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      fontWeight: 800, fontSize: "0.85rem", paddingTop: "0.1rem"
                    }}>{item.year}</div>
                    <div style={{ flex: 1, borderLeft: "2px solid var(--border)", paddingLeft: "1rem", paddingBottom: "0.5rem" }}>
                      <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text2)" }}>{item.event}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section style={{ background: "var(--bg3)", padding: "6rem 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Education</h2>
            <p className="section-sub">Academic foundation</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass" style={{ padding: "2.5rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center" }}>
              <div style={{
                width: "80px", height: "80px", borderRadius: "16px",
                background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem"
              }}>🎓</div>
              <div>
                <div className="tag" style={{ marginBottom: "0.75rem" }}>2022 – 2026</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.4rem" }}>
                  B.Tech – Artificial Intelligence and Data Science
                </h3>
                <p style={{ color: "var(--text2)", marginBottom: "1rem" }}>
                  Jayalakshmi Institute of Technology, Thoppur, Dharmapuri
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>8.2</div>
                    <div style={{ color: "var(--text2)", fontSize: "0.8rem" }}>CGPA</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10b981" }}>2026</div>
                    <div style={{ color: "var(--text2)", fontSize: "0.8rem" }}>Grad Year</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section" style={{ position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Skills</h2>
            <p className="section-sub">Technologies and competencies I work with</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
            <div>
              <Reveal><h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Technical Skills</h3></Reveal>
              {SKILLS_TECH.map((s, i) => (
                <SkillBar key={s.name} skill={s} delay={i * 0.06} />
              ))}
            </div>
            <div>
              <Reveal><h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Soft Skills</h3></Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {SKILLS_SOFT.map((s, i) => (
                  <Reveal key={s} delay={i * 0.07}>
                    <div className="glass" style={{
                      padding: "1rem 1.25rem", textAlign: "center",
                      fontSize: "0.9rem", fontWeight: 600, cursor: "default",
                      transition: "all 0.2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.color = ""; }}>
                      {s}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ background: "var(--bg3)", padding: "6rem 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Projects</h2>
            <p className="section-sub">Things I've built and shipped</p>
          </Reveal>
          <Reveal>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {["All", "Python", "Java", "Web"].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  padding: "0.5rem 1.25rem", borderRadius: "999px", fontWeight: 600,
                  fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s",
                  background: activeFilter === f ? "linear-gradient(135deg,var(--accent),var(--accent2))" : "transparent",
                  color: activeFilter === f ? "#fff" : "var(--text2)",
                  border: activeFilter === f ? "none" : "1px solid var(--border)",
                }}>{f}</button>
              ))}
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {filteredProjects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNSHIPS ── */}
      <section id="experience" className="section" style={{ position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Experience</h2>
            <p className="section-sub">Real-world industry exposure</p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {INTERNSHIPS.map((item, i) => (
              <Reveal key={item.company} delay={i * 0.1}>
                <div className="glass" style={{ padding: "1.75rem 2rem", display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", alignItems: "center" }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "14px",
                    background: `linear-gradient(135deg,${["#3b82f6","#10b981","#8b5cf6"][i]},${["#8b5cf6","#3b82f6","#ec4899"][i]})`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem"
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{item.company}</h3>
                      <span className="tag">{item.duration}</span>
                    </div>
                    <div style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem" }}>{item.role}</div>
                    <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.7 }}>{item.work}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section style={{ background: "var(--bg3)", padding: "6rem 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Certifications</h2>
            <p className="section-sub">Validated knowledge and achievements</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1.25rem" }}>
            {CERTS.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.08}>
                <div className="glass" style={{ padding: "1.5rem", cursor: "default", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = ""; }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{c.icon}</div>
                  <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.35rem" }}>{c.name}</h4>
                  <p style={{ color: "var(--text2)", fontSize: "0.82rem" }}>{c.org}</p>
                  <div style={{ marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>✓ Certified</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRENGTHS ── */}
      <section className="section" style={{ position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Strengths</h2>
            <p className="section-sub">What sets me apart</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.25rem" }}>
            {STRENGTHS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="glass" style={{ padding: "1.5rem", textAlign: "center", transition: "all 0.2s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{s.icon}</div>
                  <h4 style={{ fontWeight: 700, marginBottom: "0.4rem", fontSize: "0.95rem" }}>{s.label}</h4>
                  <p style={{ color: "var(--text2)", fontSize: "0.82rem", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: "var(--bg3)", padding: "6rem 0", position: "relative", zIndex: 1 }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-sub">Let's build something great together</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { icon: "📧", label: "Email", val: "Punithab026@gmail.com", copy: true },
                { icon: "📱", label: "Phone", val: "6379676592", copy: true },
                { icon: "💼", label: "LinkedIn", val: "linkedin.com/in/punithab", href: "https://www.linkedin.com/in/punithab" },
                { icon: "⚡", label: "GitHub", val: "github.com/punithab026-dev", href: "https://github.com/punithab026-dev" },
              ].map(c => (
                <Reveal key={c.label} delay={0.05}>
                  <div className="glass" style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => c.copy ? copy(c.val, c.label) : window.open(c.href, "_blank")}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ""; }}>
                    <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, marginTop: "0.15rem" }}>{c.val}</div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text2)" }}>{c.copy ? "📋" : "↗"}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15}>
              <div className="glass" style={{ padding: "2rem" }}>
                <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>Send a Message</h3>
                <ContactForm onSend={() => setToast("Message sent! I'll get back to you soon 🚀")} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2.5rem 0", position: "relative", zIndex: 1 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontWeight: 800, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B Punitha</span>
            <span style={{ color: "var(--text2)", fontSize: "0.85rem", marginLeft: "0.75rem" }}>Software Engineer · AI & DS Graduate</span>
          </div>
          <p style={{ color: "var(--text2)", fontSize: "0.82rem" }}>© 2026 B Punitha. Crafted with ❤️ & ☕</p>
        </div>
      </footer>

      {/* Scroll to top */}
      {scrollY > 400 && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
          position: "fixed", bottom: "2rem", left: "2rem", zIndex: 999,
          width: "44px", height: "44px", borderRadius: "50%",
          background: "linear-gradient(135deg,var(--accent),var(--accent2))",
          border: "none", cursor: "pointer", color: "#fff", fontSize: "1.2rem",
          boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
          transition: "transform 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
          ↑
        </button>
      )}
    </>
  );
}

// ─── CountUp component ───────────────────────────────────────────────────────
function CountUp({ target, started, suffix }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const isDecimal = target % 1 !== 0;
    const steps = 40;
    const inc = target / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(isDecimal ? parseFloat(start.toFixed(1)) : Math.floor(start));
    }, 40);
    return () => clearInterval(t);
  }, [started, target]);
  return <div style={{ fontSize: "2.2rem", fontWeight: 900, background: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}{suffix}</div>;
}

// ─── SkillBar ────────────────────────────────────────────────────────────────
function SkillBar({ skill, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: "1.25rem", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateX(-20px)", transition: `all 0.6s ease ${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{skill.icon} {skill.name}</span>
        <span style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 700 }}>{skill.pct}%</span>
      </div>
      <div style={{ height: "6px", background: "var(--bg3)", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "999px",
          background: "linear-gradient(90deg,var(--accent),var(--accent2))",
          width: inView ? `${skill.pct}%` : "0%",
          transition: `width 1s ease ${delay + 0.2}s`
        }} />
      </div>
    </div>
  );
}

// ─── ProjectCard ─────────────────────────────────────────────────────────────
function ProjectCard({ p }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass" style={{
      padding: "1.5rem", cursor: "pointer", transition: "all 0.25s",
      borderTop: `3px solid ${p.color}`,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${p.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
      onClick={() => setExpanded(ex => !ex)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "2rem" }}>{p.icon}</span>
        <span style={{
          fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "999px",
          background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44`
        }}>{p.cat}</span>
      </div>
      <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>{p.title}</h3>
      <p style={{ color: "var(--text2)", fontSize: "0.85rem", lineHeight: 1.65 }}>{p.desc}</p>
      {expanded && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {p.tech.map(t => <span key={t} className="tag" style={{ fontSize: "0.72rem" }}>{t}</span>)}
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a href="https://github.com/punithab026-dev" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "0.45rem 1rem" }} onClick={e => e.stopPropagation()}>⚡ GitHub</a>
            <span className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "0.45rem 1rem", opacity: 0.5, cursor: "not-allowed" }}>🔗 Demo</span>
          </div>
        </div>
      )}
      <div style={{ textAlign: "right", marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text2)" }}>
        {expanded ? "▲ less" : "▼ more"}
      </div>
    </div>
  );
}

// ─── ContactForm ─────────────────────────────────────────────────────────────
function ContactForm({ onSend }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
    background: "var(--bg)", border: "1px solid var(--border)",
    color: "var(--text)", fontSize: "0.9rem", outline: "none",
    transition: "border-color 0.2s", marginBottom: "1rem",
    fontFamily: "inherit",
  };
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    onSend();
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div>
      <input style={inputStyle} placeholder="Your Name" value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        onFocus={e => { e.target.style.borderColor = "var(--accent)"; }}
        onBlur={e => { e.target.style.borderColor = "var(--border)"; }} />
      <input style={inputStyle} placeholder="Your Email" value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        onFocus={e => { e.target.style.borderColor = "var(--accent)"; }}
        onBlur={e => { e.target.style.borderColor = "var(--border)"; }} />
      <textarea style={{ ...inputStyle, height: "120px", resize: "vertical" }}
        placeholder="Your Message..." value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
        onFocus={e => { e.target.style.borderColor = "var(--accent)"; }}
        onBlur={e => { e.target.style.borderColor = "var(--border)"; }} />
      <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleSubmit}>
        🚀 Send Message
      </button>
    </div>
  );
}
