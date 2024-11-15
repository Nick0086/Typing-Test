import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {  User, ChevronDown, Keyboard, ScanFace } from 'lucide-react';
const SideBarLinks = [
    {
        name: ' Typing Test',
        link: '/typing-test',
        icon: <Keyboard  size={16} />,
    },
    {
        name: 'Face Detection',
        icon: <ScanFace size={16} />,
        link: '/face-recognition'
    },
    {
        name: 'Roles&User',
        icon: <User size={16} />,
        subMenu: [
            { name: 'Roles', link: '/role' },
            { name: 'User', link: '/user' }
        ]
    },
];

export default function SideBar({ navColleps, collepsHandler }) {
    
    const clickref = useRef(null);
    const [subMenus, showSubMenus] = useState([]);

    const toggleHandler = (value) => {
        if (!subMenus.includes(value)) {
            showSubMenus([...subMenus, value]);
        } else {
            showSubMenus(subMenus.filter((item) => item !== value));
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (navColleps && clickref.current && clickref.current.contains(event.target)) {
                collepsHandler();
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [navColleps, collepsHandler]);

    return (
        <div>
            <div className={`tw-z-50 tw-duration-300 tw-ease-in-out tw-shadow-md ${navColleps ? "lg:tw-max-w-[60px] lg:tw-min-w-[60px] md:tw-max-w-[3/5] md:tw-min-w-[3/5]" : " -tw-translate-x-[105%] tw-max-w-[250px] tw-min-w-[250px] tw-overflow-x-hidden"} tw-max-h-screen tw-min-h-screen lg:tw-sticky tw-fixed tw-top-0 tw-bg-white md:tw-w-2/4 tw-w-10/12 lg:tw-translate-x-0`}>
                <div className="tw-py-4 tw-flex tw-gap-x-1 tw-items-center tw-font-bold tw-justify-center tw-duration-300 tw-ease-out tw-overflow-x-hidden tw-h-[70px]">
                    {/* <NavLink to={'/dashboard'} className="tw-size-[30px]" /> */}
                    <h2 className={`tw-text-2xl tw-text-center ${!navColleps ? "lg:tw-block " : "lg:tw-hidden"}`}>NK</h2>
                </div>
                <nav className="tw-mt-2">
                    {SideBarLinks.map((link) => (
                        <div key={link.name} className="tw-relative">
                            <NavLink to={link.link} onClick={() => toggleHandler(link.name)} className={({ isActive }) => `tw-text-sm tw-leading-7 tw-font-medium tw-text-[#60686f] tw-no-underline tw-h-12 tw-px-5 tw-flex tw-gap-x-[10px] tw-items-center md:tw-justify-start hover:tw-bg-gray-100 hover:tw-text-gray-800 hover:tw-no-underline ${isActive && link.link && 'tw-bg-[#F0F3FF]'}`}>
                                {link.icon ? typeof link.icon === "object" && link.icon : navColleps && <div className={`${navColleps ? "lg:tw-block " : "lg:tw-hidden"} tw-text-2xl  tw-hidden `}>{link.name.charAt(0)}</div>}
                                <span className={`tw-break-words ${navColleps ? "lg:tw-hidden " : "lg:tw-block"}`}>{link.name}</span>
                                {!navColleps && link.subMenu && typeof link.subMenu === "object" && (subMenus.includes(link.name) ? <ChevronDown className="tw-ms-auto tw-size-[10px]" /> : <ChevronDown className="tw-ms-auto tw-size-[10px]" />)}
                            </NavLink>
                            {link.subMenu && typeof link.subMenu === "object" && (
                                <ul className={`${subMenus.includes(link.name) ? "tw-max-h-full tw-block" : "tw-max-h-0 tw-overflow-hidden"} ${navColleps ? "lg:tw-shadow-md" : ""} ${navColleps && subMenus.includes(link.name) ? 'lg:tw-absolute  lg:tw-top-0 lg:tw-left-[100%] lg:tw-max-h-[50vh]' : "tw:tw-max-h-0 "} tw-ps-0 tw-mb-0`}>
                                    {link.subMenu.map((subLink) => (
                                        <li key={subLink.name} className="tw-list-none">
                                            <NavLink to={subLink.link} className={({ isActive }) => `tw-group tw-text-[13px] tw-leading-7 tw-text-[#60686f] hover:tw-text-gray-800 tw-duration-500 tw-no-underline hover:tw-no-underline  tw-h-[35px] tw-px-5 tw-relative   ${isActive && 'tw-bg-[#F0F3FF]'}  tw-flex tw-gap-x-[10px] tw-items-center ${navColleps && 'lg:tw-w-[200px] lg:tw-bg-white'}`}>
                                                <div className="tw-duration-500 group-hover:tw-translate-x-1 tw-ease-in-out"><ChevronDown /></div>
                                                {subLink.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
            <div ref={clickref} className={`tw-w-full tw-max-h-screen tw-min-h-screen tw-bg-black tw-fixed tw-z-[49] tw-opacity-0 tw-duration-300 lg:tw-hidden  tw-block  ${navColleps ? " tw-opacity-30 " : "tw-invisible"}`} />
        </div>
    );
}