import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlignJustify, Bell, Search, User, LogOut, ClipboardCheck } from 'lucide-react';
import { Input } from "./input";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar } from "./avatar";

export default function Header({ collepsHandler }) {
    let user_info = JSON.parse(window.localStorage.getItem("user_info"));
    const navigate = useNavigate();

    const handleLogout = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user_info');
        navigate('/');
    };

    return (
        <div className="tw-flex tw-justify-between tw-items-center tw-sticky tw-top-0 lg:tw-z-50 md:tw-z-30 tw-z-30 tw-bg-white tw-py-2 tw-px-4 tw-shadow-md">
            <div className="tw-flex tw-justify-between tw-items-center tw-gap-x-4">
                <button className="tw-border-none tw-bg-inherit tw-py-2 tw-px-3 focus:tw-outline-none" onClick={collepsHandler}>
                    <AlignJustify color="black" />
                </button>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
                <div className="tw-flex tw-items-center">
                    <p className="tw-font-bold tw-text-[#191d21] tw-text-base tw-leading-7">{user_info?.FIRST_NAME}</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="tw-border tw-size-10 tw-p-2 tw-cursor-pointer tw-rounded-md" asChild>
                            <User size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset='2' className="tw-px-0 tw-py-2 tw-w-[160px] -tw-translate-x-2">
                            <DropdownMenuCheckboxItem className='tw-flex tw-gap-x-1 tw-items-center tw-text-[13px] tw-leading-3  !tw-px-5 tw-py-[10px] hover:tw-text-indigo-500 tw-duration-200'>
                                <User /> Profile
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem className='tw-flex tw-gap-x-1 tw-items-center tw-text-[13px] tw-leading-3 !tw-px-5 tw-py-[10px] hover:tw-text-indigo-500 tw-duration-200'>
                                <ClipboardCheck />Tasks
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem onClick={handleLogout} className='tw-flex tw-cursor-pointer tw-gap-x-1 tw-items-center tw-text-[13px] tw-leading-3 !tw-px-5 tw-py-[10px] hover:tw-text-red-500 tw-duration-200'>
                                <LogOut />Logout
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}