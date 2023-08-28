import React, { useState } from "react";

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";

import { IconContext } from "react-icons";
import { Mail } from "@mui/icons-material";

// ROUTING

import { Link } from "react-router-dom";

// DATA FILE
import { SidebarData } from "../data/SidebarData";
// STYLES
import "./Navbar.css";
import { Badge } from "@mui/material";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#000000" }}>
        {/* All the icons now are white */}
        <div className="navbarr">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
          <h4 className="nav-title poppinsBold">
            the H World (ADMIN)
          </h4>
          <div style={{paddingRight: "15px"}} >
          <Badge badgeContent={4} color="primary">
            <Mail color="action" />
          </Badge>
          </div>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
