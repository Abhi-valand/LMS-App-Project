import { ChartNoAxesColumn, SquareLibrary, Menu, X } from "lucide-react";
import React, { useState } from "react";
import {  Outlet } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedPage from "@/components/ui/AnimatedPage";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const closeSidebar = () => setOpen(false);

  return (
    <AnimatedPage>
    <div className="flex transition-colors duration-300 dark:bg-[#0A0A0A] ">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 bg-white dark:bg-black/30 p-5 sticky top-0 h-screen transition-colors duration-300">
        <div className="space-y-4 mt-20">
          <NavLinks onClick={closeSidebar} />
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="lg:hidden fixed top-20 left-4 z-50 bg-white dark:bg-black border dark:border-gray-700 transition-colors duration-300"
            variant="ghost"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[250px] bg-white dark:bg-black/30 pt-20 transition-colors duration-300"
        >
          <NavLinks onClick={closeSidebar} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-24 mt-8 lg:mt-0 bg-[#f9fafb] dark:bg-black/30 min-h-screen transition-colors duration-300">
      <AnimatedPage>
        <Outlet />
      </AnimatedPage>
      </div>
    </div>
    </AnimatedPage>
  );
};


const NavLinks = ({ onClick }) => {
  return (
    <AnimatedPage>

    <div className="space-y-4 text-gray-800 dark:text-white transition-colors duration-300">
      <NavLink
        to="dashboard"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-md transition-colors duration-300 border-l-4 ${
            isActive
            ? "border-blue-500 bg-gray-100 dark:bg-gray-800 font-semibold"
            : "border-transparent"
          }`
        }
        onClick={onClick}
        >
        <ChartNoAxesColumn size={22} />
        <h1>Dashboard</h1>
      </NavLink>

      <NavLink
        to="course"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-md transition-colors duration-300 border-l-4 ${
            isActive
            ? "border-blue-500 bg-gray-100 dark:bg-gray-800 font-semibold"
            : "border-transparent"
          }`
        }
        onClick={onClick}
        >
        <SquareLibrary size={22} />
        <h1>Courses</h1>
      </NavLink>
    </div>
        </AnimatedPage>
  );
};

export default Sidebar;
