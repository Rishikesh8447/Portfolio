import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              RISHIKESH
              <br />
              <span>PATEL</span>
            </h1>
            <p>
              Full Stack Developer focused on building scalable, performant,
              and modern web applications.
            </p>
          </div>
          <div className="landing-info">
            <div className="landing-role-title" aria-label="Full Stack Developer, React Developer, Software Engineer">
              <span>Full Stack Developer</span>
              <span>React Developer</span>
              <span>Software Engineer</span>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
