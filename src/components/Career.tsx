import "./styles/Career.css";

const experiences = [
  {
    role: "Software Development Engineer Intern",
    company: "Cansvolution Pvt. Ltd.",
    period: "2026",
    details:
      "Working onsite on scalable web application development, API integration, debugging, feature implementation, optimization, and Git-based collaboration.",
  },
  {
    role: "Web Development Intern",
    company: "Brainwave Matrix Solution",
    period: "2025",
    details:
      "Developed a responsive e-commerce website, improved UI consistency and performance, and designed reusable components for better maintainability.",
  },
  {
    role: "B.Tech Computer Science Engineering",
    company: "IPS Academy, IES Indore",
    period: "2022-26",
    details:
      "Pursuing Computer Science Engineering from RGPV with a CGPA of 8.05 / 10, with active practice in Data Structures and Algorithms.",
  },
];

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experiences.map((experience) => (
            <div className="career-info-box" key={experience.role}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{experience.role}</h4>
                  <h5>{experience.company}</h5>
                </div>
                <h3>{experience.period}</h3>
              </div>
              <p>{experience.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
