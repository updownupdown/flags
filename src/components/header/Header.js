import React from "react";
import { NavLink } from "react-router-dom";

const Header = (props) => {
  return (
    <div className="header">
      <span className="logo">World Flags Quiz</span>
      {/* {path === "/study" && ( */}
      <NavLink activeClassName="active" to="/" exact>
        Take Quiz
      </NavLink>
      {/* )} */}
      {/* {path === "/" && ( */}
      <NavLink activeClassName="active" to="/study">
        Study Flags
      </NavLink>
      {/* )} */}
      <a
        className="about"
        href="https://github.com/updownupdown/flags"
        target="_blank"
        rel="noopener noreferrer"
      >
        About
      </a>
    </div>
  );
};

export default Header;
