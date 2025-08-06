"use client";

import React, { useEffect } from "react";
import { Menu, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "./ui/button";
import DarkMode from "@/DarkMode";
import { useLogoutUserMutation } from "@/features/api/authApi";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <School size={28} className="text-indigo-600 dark:text-indigo-400" />
          <h1 className="font-bold text-xl tracking-wide text-gray-900 dark:text-white">
            E-Learning
          </h1>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user.photoUrl ||
                      "https://i.pinimg.com/236x/23/ac/1a/23ac1a907311c7f2bfe777f3d425beb2.jpg"
                    }
                    alt="user"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl">
                <DropdownMenuLabel className="text-sm font-semibold px-4 py-2 text-gray-800 dark:text-white">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <Link to="/my-learning" className="w-full">
                      My Learning
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <Link to="/profile" className="w-full">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-md mt-2 flex items-center justify-center cursor-pointer">
                      <Link to="/admin/dashboard" className="w-full text-center text-sm font-semibold">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3 dark:bg-[#0A0A0A]/5 dark:text-gray-100">
              <Button className='dark:border dark:border-gray-700'variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center gap-2 ">
          <DarkMode  />
          <MobileNavbar role={user?.role} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ role }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full" variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 pt-6 bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            E-Learning
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-4 text-lg">
          {user ? (
            <>
              <Link to="/my-learning" className="hover:underline" onClick={() => navigate("/my-learning")}>
                My Learning
              </Link>
              <Link to="/profile" className="hover:underline" onClick={() => navigate("/profile")}>
                Edit Profile
              </Link>
              <span
                onClick={handleLogout}
                className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer"
              >
                Log out
              </span>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </>
          )}
        </nav>

        {role === "instructor" && (
          <SheetFooter className="mt-auto">
            <SheetClose asChild>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white"
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
