// import React, { useState } from 'react';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import icon_dailyActivity_white from "../assets/menu/daily_activity_white.png";
// import img_member_white from "../assets/menu/clients_white.png";
import icon_report from "../assets/menu/report.png";
// import img_patient_review from "../assets/menu/patient_review.png";
// import img_contacts_white from "../assets/menu/contacts_white.png";
// import img_billing_history from "../assets/menu/billing_history.png";
import icon_dashboard_white from "../assets/menu/dashboard_white.png";
import icon_help from "../assets/menu/help.png";
// import img_quick_check from "../assets/menu/quick-check.png";
import icon_admin from "../assets/menu/menuIcon_admin.png";
import icon_alert from "../assets/menu/alerts_white.png";
// import img_memberReport from "../assets/menu/memberReport.png";

// const menuItems = [
//   { label: 'OVERVIEW', icon: img_memberReport, url: '/memberHealthList' },
//   {
//     label: 'ALERTS',
//     icon: img_alert,
//     subMenu: [
//       { label: 'Alerts', url: '/alert' },
//       { label: 'Resolution Notes', url: '/resolutionnotes' },
//       { label: 'Historical Alerts', url: '/HistoricalAlerts' },
//     ],
//   },
//   { label: 'DAILY ACTIVITY', icon: img_daily_activity_white, url: '/dailyactivity' },
//   { label: 'MEMBERS', icon: img_member_white, url: '/clientdashboard' },
//   { label: 'REPORTS', icon: img_report, url: '/Reports' },
//   { label: 'PATIENT REVIEW', icon: img_patient_review, url: '/billingPG' },
//   { label: 'CONTACTS', icon: img_contacts_white, url: '/contactdashboard' },
//   { label: 'BILLING HISTORY', icon: img_billing_history, url: '/billinghistory' },
//   { label: 'SYSTEM DASHBOARD', icon: img_dashboard_white, url: '/dashboard' },
//   { label: 'QUICK CHECK', icon: img_quick_check, url: '/quickCheck' },
//   { label: 'CONTACT US', icon: img_contacts_white, url: 'https://zemplee.com/contact', target: '_blank' },
//   { label: 'HELP', icon: img_help, url: '/help' },
//   { label: 'SYSTEM ADMIN', icon: img_admin, url: '/systemAdmin' },
//   { label: 'ADMIN', icon: img_admin, url: '/useradmin' },
// ];

import React, { useRef, useState } from "react";
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import img_memberReport from "../assets/menu/memberReport.png";
import icon_homeWhite from "../assets/menu/home_white.svg";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Home", icon: icon_homeWhite, url: "/home" },
  {
    label: "Alerts",
    icon: icon_alert,
    subMenu: [
      { label: "All Alerts", url: "" },
      { label: "Alert History", url: "" },
      {
        label: "Resolution Notes",
        url: "",
      },
    ],
  },
  {
    label: "Daily Activity",
    icon: icon_dailyActivity_white,
    subMenu: [
      { label: "Activity Chart", url: "" },
      { label: "Quick heck", url: "" },
    ],
  },
  {
    label: "RPM",
    icon: "",
    subMenu: [
      { label: "Monitoring Status", url: "" },
      { label: "Claims Documents", url: "" },
    ],
  },
  { label: "Reports", icon: icon_report, url: "" },
  {
    label: "Settings",
    icon: icon_admin,
    subMenu: [
      {
        label: "My Account",
        subMenu: [
          { label: "Profile", url: "/settings/myAccount/profile" },
          { label: "Notifications", url: "/settings/myAccount/notifications" },
        ],
      },
      {
        label: "Company",
        subMenu: [
          { label: "Company Profile", url: "/settings/company/profile" },
          {
            label: "Notifications Preferences",
            url: "/settings/company/notifications",
          },
        ],
      },
      { label: "Users", icon: "", url: "" },
      { label: "Members", icon: "", url: "" },
      { label: "Family Contacts", icon: "", url: "" },
    ],
  },
  { label: "System Dashboard", icon: icon_dashboard_white, url: "" },
  { label: "Help", icon: icon_help, url: "" },
];

const SideMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isSecondaryPanelHovered, setIsSecondaryPanelHovered] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseHover = (item: any) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(item.subMenu ? item.label : null);
  };

  const handleMouseLeavePrimary = () => {
    if (!isSecondaryPanelHovered) {
      closeTimer.current = setTimeout(() => setActiveMenu(null), 200);
    }
  };

  const handleItemClick = (path: string) => {
    setSelectedPath(path);
    // setActiveMenu(null);
  };

  const toggleSubMenu = (label: string) => {
    setExpandedSubMenu((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="flex bg-gray-800 h-screen text-white">
      {/* Main Sidebar */}
      <div className="flex flex-col w-24 h-full py-2">
        <nav className="flex flex-col gap-1 text-center">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`group flex flex-col py-2 text-center items-center cursor-pointer hover:bg-gray-700 ${
                selectedPath?.startsWith(item.label)
                  ? "bg-gray-700 border-l-[3px]"
                  : ""
              } ${activeMenu === item.label ? "bg-gray-700" : ""}`}
              onMouseEnter={() => handleMouseHover(item)}
              onMouseLeave={handleMouseLeavePrimary}
              onClick={() => handleItemClick(item.label)}
            >
              <img
                src={item.icon}
                alt={`${item.label} icon`}
                className="h-6 w-6"
              />
              <span className="px-2">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Secondary Panel (Level 2) */}
      {activeMenu && (
        <div
          className="absolute left-24 top-0 w-48 bg-gray-700 h-full overflow-y-auto z-10"
          onMouseEnter={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
            setIsSecondaryPanelHovered(true);
          }}
          onMouseLeave={() => {
            setIsSecondaryPanelHovered(false);
            closeTimer.current = setTimeout(() => setActiveMenu(null), 200);
          }}
        >
          <div>
            {menuItems
              .find((item) => item.label === activeMenu)
              ?.subMenu?.map((subItem, subIndex) => (
                <div key={subIndex} className="">
                  <div
                    onClick={() => toggleSubMenu(subItem.label)}
                    className={`flex items-center gap-4 py-2 pl-3  cursor-pointer `}
                  >
                    {subItem.subMenu && (
                      <ChevronRightIcon
                        className={`h-4 w-4 transform ${
                          expandedSubMenu[subItem.label] ? "rotate-90" : ""
                        }`}
                      />
                    )}

                    {subItem.subMenu ? (
                      <span className=""> {subItem.label}</span>
                    ) : (
                      <span
                        className={`block px-4 py-2 ml-4 w-full hover:bg-gray-900 rounded-md ${
                          selectedPath === `${activeMenu}/${subItem.label}}`
                            ? "bg-gray-800"
                            : ""
                        }`}
                        onClick={() =>
                          handleItemClick(`${activeMenu}/${subItem.label}}`)
                        }
                      >
                        {subItem.label}
                      </span>
                    )}
                  </div>

                  {/* Level 3 Menu */}
                  {expandedSubMenu[subItem.label] && subItem.subMenu && (
                    <div className="pl-4">
                      {subItem.subMenu.map((childItem, childIndex) => (
                        <div
                          key={childIndex}
                          className={`block px-4 py-2 ml-6 hover:bg-gray-900 rounded-md ${
                            selectedPath ===
                            `${activeMenu}/${subItem.label}/${childItem.label}`
                              ? "bg-gray-800"
                              : ""
                          }`}
                          onClick={() =>
                            handleItemClick(
                              `${activeMenu}/${subItem.label}/${childItem.label}`
                            )
                          }
                        >
                          {childItem.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
