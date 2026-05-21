import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/WhatIDo.css";

gsap.registerPlugin(ScrollTrigger);

const buildCards = [
  {
    title: "FRONTEND",
    subtitle: "React • TypeScript • Tailwind CSS",
    description:
      "Building responsive, scalable, and modern interfaces using React, TypeScript, Tailwind CSS, and reusable component architecture.",
  },
  {
    title: "BACKEND",
    subtitle: "Node.js • Express.js • MongoDB",
    description:
      "Designing REST APIs, authentication systems, MongoDB integrations, and scalable backend logic using Node.js and Express.js.",
  },
];

const WhatIDo = () => {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        [".build-kicker", ".build-title", ".build-copy"],
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".whatIDO",
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".build-card",
        { autoAlpha: 0, y: 44, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: ".build-grid",
            start: "top 78%",
          },
        }
      );
    });

    return () => context.revert();
  }, []);

  return (
    <section className="whatIDO" id="what-build">
      <div className="build-glow build-glow-one"></div>
      <div className="build-glow build-glow-two"></div>
      <div className="build-model-glow"></div>

      <div className="build-content">
        <div className="build-heading">
          <p className="build-kicker">
            Full Stack Developer focused on building scalable, performant, and
            modern web applications.
          </p>
          <h2 className="build-title title">
            WHAT I <span>DO</span>
          </h2>
          <p className="build-copy para">
            I turn product ideas into polished web experiences with reliable
            frontend architecture, practical backend systems, and interfaces
            that feel fast, clear, and useful.
          </p>
        </div>

        <div className="build-grid">
          {buildCards.map((card, index) => (
            <article className="build-card" key={card.title}>
              <div className="build-card-index">0{index + 1}</div>
              <div>
                <h3>{card.title}</h3>
                <p className="build-card-subtitle">{card.subtitle}</p>
              </div>
              <p className="build-card-description">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
