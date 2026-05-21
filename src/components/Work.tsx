import { useEffect } from "react";
import { MdArrowOutward } from "react-icons/md";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Baat-Chit",
    subtitle: "Real-Time Chat Application",
    techStack: "React • Node.js • Express • MongoDB • Socket.io",
    description:
      "Built a real-time chat application with authentication, private messaging, live updates, and responsive modern UI.",
    image: "/images/baat-chit.png",
    liveDemo: "https://baat-chit-app.onrender.com/login",
    github: "https://github.com/Rishikesh8447",
  },
  {
    title: "Blogora",
    subtitle: "Full Stack Blogging Platform",
    techStack: "Node.js • Express.js • MongoDB Atlas • EJS • Bootstrap",
    description:
      "Developed a blogging platform with authentication, rich text editor, trending blogs, categories, search, pagination, and dark mode.",
    image: "/images/blogora.png",
    liveDemo: "https://blog-platform-2nir.onrender.com/",
    github: "https://github.com/Rishikesh8447",
  },
  {
    title: "PasteApp",
    subtitle: "Paste Sharing Application",
    techStack: "React • Tailwind CSS • TypeScript",
    description:
      "Created a modern paste-sharing application with CRUD functionality, state management, and responsive clean UI.",
    image: "/images/pasteapp.png",
    liveDemo: "https://paste-app-blond-pi.vercel.app/",
    github: "https://github.com/Rishikesh8447",
  },
];

const Work = () => {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        [".projects-eyebrow", ".projects-title", ".projects-subtitle"],
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".work-section",
            start: "top 72%",
          },
        }
      );

      gsap.fromTo(
        ".project-card",
        { autoAlpha: 0, y: 52, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.16,
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 78%",
          },
        }
      );
    });

    return () => context.revert();
  }, []);

  return (
    <section className="work-section" id="work">
      <div className="projects-glow projects-glow-one"></div>
      <div className="projects-glow projects-glow-two"></div>

      <div className="work-container section-container">
        <div className="projects-header">
          <p className="projects-eyebrow">Selected work</p>
          <h2 className="projects-title">
            PROJECTS I&apos;VE <span>BUILT</span>
          </h2>
          <p className="projects-subtitle">
            Full stack applications focused on performance, scalability,
            real-time communication, and modern user experiences.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.title}>
              <a
                className="project-image-wrap"
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
              >
                <img
                  src={project.image}
                  alt={`${project.title} project screenshot`}
                  loading="lazy"
                />
              </a>

              <div className="project-card-body">
                <div className="project-card-topline">
                  <span>0{index + 1}</span>
                  <span>{project.subtitle}</span>
                </div>

                <div>
                  <h3>{project.title}</h3>
                  <p className="project-tech">{project.techStack}</p>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-actions">
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                  >
                    Live Demo <MdArrowOutward />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                  >
                    GitHub <MdArrowOutward />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
