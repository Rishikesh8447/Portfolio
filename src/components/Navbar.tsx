import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

export const smoother = {
  scrollTop(value?: number) {
    if (typeof value === "number") {
      window.scrollTo({ top: value });
    }
    return window.scrollY;
  },
  scrollTo(
    target: string | Element | null,
    smooth = true,
    _position?: string
  ) {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    element?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  },
  paused(_value?: boolean) {
    return false;
  },
};

const Navbar = () => {
  useEffect(() => {
    smoother.scrollTop(0);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          Rishikesh Patel
        </a>
        <a
          href="mailto:rishikeshpatel1199@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          rishikeshpatel1199@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
