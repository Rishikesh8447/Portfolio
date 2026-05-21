import { MdArrowOutward, MdCopyright, MdDownload, MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/Contact.css";

const resumePath = "/resume/RishikeshPatelResume.pdf";

const Contact = () => {
  return (
    <footer className="contact-section section-container" id="contact">
      <div className="footer-glow footer-glow-one"></div>
      <div className="footer-glow footer-glow-two"></div>

      <div className="contact-container">
        <div className="footer-heading">
          <p>Resume & contact</p>
          <h3>Let&apos;s build something sharp.</h3>
        </div>

        <div className="resume-panel">
          <div className="resume-preview" aria-hidden="true">
            <div className="resume-paper">
              <div className="resume-paper-top">
                <span>Rishikesh Patel</span>
                <small>Resume</small>
              </div>
              <div className="resume-lines">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div className="resume-mini-grid">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div className="resume-content">
            <h4>Rishikesh Patel Resume</h4>
            <p className="resume-subtitle">
              Full Stack Developer | React Developer | Software Engineer
            </p>
            <div className="resume-actions">
              <a
                href={resumePath}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                View Resume <MdArrowOutward />
              </a>
              <a
                href={resumePath}
                download="RishikeshPatelResume.pdf"
                data-cursor="disable"
              >
                Download Resume <MdDownload />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <h5>
              Designed & Developed by <span>Rishikesh Patel</span>
            </h5>
            <p>
              <MdCopyright /> 2026
            </p>
          </div>

          <nav className="footer-links" aria-label="Footer links">
            <a
              href="https://github.com/Rishikesh8447"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
            >
              <FaGithub /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/rishikesh-patel-117438293"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
            >
              <FaLinkedinIn /> LinkedIn
            </a>
            <a
              href="mailto:rishikeshpatel1199@gmail.com"
              data-cursor="disable"
            >
              <MdEmail /> Email
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
