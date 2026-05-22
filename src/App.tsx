import { motion, type Transition, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import {
  FiArrowUpRight,
  FiCode,
  FiCpu,
  FiDatabase,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiLayers,
  FiMail,
  FiRadio,
  FiServer,
  FiZap,
} from "react-icons/fi";
import "./App.css";

const TechStack = lazy(() => import("./components/TechStack"));

type Project = {
  title: string;
  category: string;
  description: string;
  image: string;
  live: string;
  github: string;
  stack: string[];
  accent: string;
};

const projects: Project[] = [
  {
    title: "Baat-Chit",
    category: "Real-time messaging",
    description:
      "A production-minded chat app with authentication, live private conversations, responsive flows, and Socket.io powered updates.",
    image: "/images/baat-chit.png",
    live: "https://baat-chit-app.onrender.com/login",
    github: "https://github.com/Rishikesh8447",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    accent: "from-cyan-300 to-violet-300",
  },
  {
    title: "Blogora",
    category: "Publishing platform",
    description:
      "A full stack blogging experience with authentication, categories, search, pagination, trending posts, and dark mode polish.",
    image: "/images/blogora.png",
    live: "https://blog-platform-2nir.onrender.com/",
    github: "https://github.com/Rishikesh8447",
    stack: ["Node.js", "Express", "MongoDB Atlas", "EJS"],
    accent: "from-emerald-300 to-sky-300",
  },
  {
    title: "PasteApp",
    category: "Developer utility",
    description:
      "A fast paste-sharing tool with CRUD workflows, TypeScript structure, clean state handling, and a compact responsive interface.",
    image: "/images/pasteapp.png",
    live: "https://paste-app-blond-pi.vercel.app/",
    github: "https://github.com/Rishikesh8447",
    stack: ["React", "TypeScript", "Tailwind CSS"],
    accent: "from-fuchsia-300 to-amber-200",
  },
];

const services = [
  {
    icon: FiLayers,
    title: "Frontend systems",
    copy: "React interfaces with thoughtful component structure, precise UI states, and accessible interaction patterns.",
  },
  {
    icon: FiServer,
    title: "Backend engineering",
    copy: "Express APIs, authentication flows, database modeling, and maintainable server-side feature work.",
  },
  {
    icon: FiRadio,
    title: "Realtime products",
    copy: "Socket-driven experiences for chat, presence, live updates, and collaborative application behavior.",
  },
  {
    icon: FiDatabase,
    title: "Data foundations",
    copy: "MongoDB schemas, query design, API contracts, and practical reliability for full stack applications.",
  },
];

const timeline = [
  {
    time: "2026",
    title: "Software Development Engineer Intern",
    company: "Cansvolution Pvt. Ltd.",
    copy: "Working onsite across scalable web applications, API integration, debugging, optimization, and Git-based collaboration.",
  },
  {
    time: "2025",
    title: "Web Development Intern",
    company: "Brainwave Matrix Solution",
    copy: "Built responsive ecommerce UI, improved visual consistency, and shaped reusable frontend components.",
  },
  {
    time: "2022-2026",
    title: "B.Tech Computer Science Engineering",
    company: "IPS Academy, IES Indore",
    copy: "Studying computer science with active work in full stack development, TypeScript, and data structures.",
  },
];

const navItems = ["Profile", "Work", "Stack", "Journey", "Contact"];

function useCursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 80, damping: 24, mass: 0.3 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return { smoothX, smoothY };
}

const revealTransition: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: revealTransition,
};

const App = () => {
  const { scrollYProgress } = useScroll();
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -110]);
  const { smoothX, smoothY } = useCursorGlow();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050509] text-stone-100 selection:bg-violet-300 selection:text-zinc-950">
      <motion.div className="progress-line" style={{ scaleX: lineScale }} />
      <motion.div className="cursor-aura" style={{ x: smoothX, y: smoothY }} />

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-7">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-zinc-950/58 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <a href="#profile" className="flex items-center gap-3" aria-label="Rishikesh Patel home">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-zinc-950">
              RP
            </span>
            <span className="hidden text-sm font-medium text-white/82 sm:block">Rishikesh Patel</span>
          </a>
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-chip">
                {item}
              </a>
            ))}
          </div>
          <a className="magnetic-link" href="/resume/RishikeshPatelResume.pdf" target="_blank" rel="noreferrer">
            Resume <FiArrowUpRight />
          </a>
        </nav>
      </header>

      <section id="profile" className="hero-section">
        <div className="orbital-grid" />
        <motion.div style={{ y: heroY }} className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 pb-20 pt-32 md:grid-cols-[minmax(0,1.02fr)_minmax(380px,0.82fr)] md:px-8">
          <div className="hero-copy">
            <motion.p {...reveal} className="eyebrow">
              Full Stack Developer / React / TypeScript / Node.js
            </motion.p>
            <motion.h1 {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="hero-title">
              Full Stack Developer building scalable and modern web applications.
            </motion.h1>
            <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.16 }} className="hero-summary">
              I specialize in React, TypeScript, Node.js, and modern web technologies to build responsive interfaces, scalable backend systems, and real-world digital products.
            </motion.p>
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.2 }} className="hero-stats" aria-label="Developer highlights">
              <span>Realtime apps</span>
              <span>API integration</span>
              <span>MongoDB systems</span>
            </motion.div>
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.28 }} className="mt-9 flex flex-wrap gap-3">
              <a href="#work" className="primary-action">
                View selected work <FiArrowUpRight />
              </a>
              <a href="mailto:rishikeshpatel.dev@gmail.com" className="secondary-action">
                Start a conversation <FiMail />
              </a>
            </motion.div>
          </div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.18 }} className="identity-panel">
            <div className="developer-visual" aria-label="Animated developer terminal visualization">
              <div className="visual-orbit visual-orbit-one" />
              <div className="visual-orbit visual-orbit-two" />
              <div className="terminal-card">
                <div className="terminal-topbar">
                  <div className="window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>rishikesh.dev</span>
                  <FiCpu />
                </div>
                <div className="terminal-body">
                  <p><span className="code-muted">const</span> developer = &#123;</p>
                  <p className="code-indent">name: <span>"Rishikesh Patel"</span>,</p>
                  <p className="code-indent">role: <span>"Full Stack Developer"</span>,</p>
                  <p className="code-indent">stack: [<span>"React"</span>, <span>"TypeScript"</span>, <span>"Node"</span>],</p>
                  <p className="code-indent">focus: <span>"scalable web products"</span></p>
                  <p>&#125;;</p>
                </div>
                <div className="terminal-status">
                  <span><FiCode /> Production-ready UI</span>
                  <span>99ms mindset</span>
                </div>
              </div>
              <span className="floating-chip chip-react">React</span>
              <span className="floating-chip chip-node">Node.js</span>
              <span className="floating-chip chip-db">MongoDB</span>
              <span className="floating-chip chip-ts">TypeScript</span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {["Frontend architecture", "Backend APIs", "Realtime features", "Clean deployment"].map((item) => (
                <span key={item} className="metric-tile">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-200/70">Engineering focus</p>
              <p className="mt-3 text-lg font-semibold text-white">
                Building dependable application flows across interface, API, database, and realtime layers.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="section-shell" aria-label="Developer capabilities">
        <motion.div {...reveal} className="section-heading">
          <p className="eyebrow">Engineering profile</p>
          <h2>Calm interfaces backed by practical systems thinking.</h2>
        </motion.div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
                className="service-card"
                key={service.title}
              >
                <Icon className="text-2xl text-violet-200" />
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="work" className="section-shell">
        <motion.div {...reveal} className="section-heading">
          <p className="eyebrow">Selected builds</p>
          <h2>Project showcases with distinct product rhythms.</h2>
        </motion.div>
        <div className="project-lane">
          {projects.map((project, index) => (
            <motion.article
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.08 }}
              className="project-showcase"
              key={project.title}
            >
              <div className="project-preview">
                <div className={`preview-wash bg-gradient-to-br ${project.accent}`} />
                <img src={project.image} alt={`${project.title} interface preview`} loading="lazy" />
              </div>
              <div className="project-copy">
                <span className="project-index">0{index + 1} / {project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="badge-row">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <a href={project.live} target="_blank" rel="noreferrer">
                    Live <FiArrowUpRight />
                  </a>
                  <a href={project.github} target="_blank" rel="noreferrer">
                    GitHub <FiGithub />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <div id="stack" className="mx-auto max-w-7xl px-4 md:px-8">
        <Suspense
          fallback={
            <section className="techstack grid place-items-center">
              <p className="eyebrow">Preparing stack scene</p>
            </section>
          }
        >
          <TechStack />
        </Suspense>
      </div>

      <section id="journey" className="section-shell">
        <motion.div {...reveal} className="section-heading">
          <p className="eyebrow">Journey</p>
          <h2>A concise path through internships, product work, and computer science.</h2>
        </motion.div>
        <div className="timeline-board">
          {timeline.map((item, index) => (
            <motion.article
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.08 }}
              className="timeline-item"
              key={`${item.time}-${item.title}`}
            >
              <span>{item.time}</span>
              <div>
                <h3>{item.title}</h3>
                <p className="company">{item.company}</p>
                <p>{item.copy}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <motion.div {...reveal} className="contact-card">
          <div className="contact-orb" aria-hidden="true" />
          <p className="eyebrow">Contact</p>
          <FiZap className="contact-spark" />
          <h2>Open to frontend, React, and full stack opportunities.</h2>
          <p className="contact-message">
            Open to frontend, React, and full stack development opportunities. Feel free to connect or reach out for collaborations and professional opportunities.
          </p>

          <div className="contact-meta" aria-label="Contact details">
            <a href="mailto:rishikeshpatel1199@gmail.com" className="contact-meta-item">
              <FiMail />
              <span>rishikeshpatel1199@gmail.com</span>
            </a>
            <span className="contact-meta-item">
              <FiMapPin />
              <span>Indore, Madhya Pradesh, India</span>
            </span>
          </div>

          <div className="contact-actions">
            <a href="mailto:rishikeshpatel1199@gmail.com" className="primary-action contact-cta">
              Get In Touch <FiMail />
            </a>
            <a
              href="https://linkedin.com/in/rishikesh-patel-117438293"
              target="_blank"
              rel="noopener noreferrer"
              className="social-action"
              aria-label="Open Rishikesh Patel LinkedIn profile"
            >
              <FiLinkedin /> LinkedIn
            </a>
            <a
              href="https://github.com/Rishikesh8447"
              target="_blank"
              rel="noopener noreferrer"
              className="social-action"
              aria-label="Open Rishikesh Patel GitHub profile"
            >
              <FiGithub /> GitHub
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default App;
