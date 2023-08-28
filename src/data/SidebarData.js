import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [{
        title: "Orders",
        path: "/",
        icon: < AiIcons.AiFillHome / > ,
        cName: "nav-text"
    },
    {
        title: "Support/Help",
        path: "/support",
        icon: < IoIcons.IoMdHelpCircle / > ,
        cName: "nav-text"
    }
];