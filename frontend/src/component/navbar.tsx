import logo from "../assets/probo.avif";
import profile from "../assets/profile.avif";
import { GoHome } from "react-icons/go";
import {
  IoBagRemoveOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

export const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const modalRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
    } else {
      setShowLogout(!showLogout);
    }
  };

  const handleLogin = () => {
    const credentials = {
      email: "user@example.com",
      password: "password123",
    };

    fetch("https://your-backend-url.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login successful", data);
        localStorage.setItem("token", data.token);
        setShowLoginModal(false);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error logging in", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLogout(false);
  };

  const handleAddMoney = () => {
    setWalletBalance(walletBalance + 100); // Add dummy money
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowLoginModal(false);
        setShowWalletDialog(false);
        setShowLogout(false);
      }
    };

    if (showLoginModal || showWalletDialog || showLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginModal, showWalletDialog, showLogout]);

  return (
    <>
      <div className="p-6 sticky top-0 z-10 bg-[#F5F5F5] pb-0">
        <div className="border-b border-b-[#E3E3E3] flex justify-between">
          <div className="">
            <img className="" width={100} height={10} src={logo} alt="logo" />
          </div>
          <div className="w-fit gap-10 flex px-4 -mt-4 items-center">
            <span className="cursor-pointer hidden md:block">
              <GoHome size={25} />
            </span>
            <span className="cursor-pointer hidden md:block">
              <IoBagRemoveOutline size={25} />
            </span>
            <button
              className="border-[1px] p-3 h-10 w-28 rounded flex items-center justify-around cursor-pointer"
              onClick={() => setShowWalletDialog(true)}
            >
              <span>
                <IoWalletOutline />
              </span>
              <span className="font-bold text-sm -mt-[1px]">₹{walletBalance}</span>
            </button>
            <span className="mt-2 h-12 flex cursor-pointer relative">
              <img
                className="mb-4 ml-2 w-10 h-10 rounded-[50%] object-fill"
                src={profile}
                alt="profile"
                onClick={handleProfileClick}
              />
              <span
                onMouseEnter={() => setShowLogout(!showLogout)}
                className="mt-2 ml-2 cursor-pointer"
              >
                <MdKeyboardArrowDown size={25} />
              </span>
              {showLogout && (
                <div className="absolute right-0 mt-12 bg-white border rounded shadow-lg z-20">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef} className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4 text-[#262626]">Login</h2>
            <div className="mb-4">
              <label className="block text-[#262626] font-medium">Email</label>
              <input
                type="text"
                value="user@example.com"
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-[#E3E3E3] text-[#262626] cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#262626] font-medium">Password</label>
              <input
                type="password"
                value="password123"
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-[#E3E3E3] text-[#262626] cursor-not-allowed"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-[#262626] text-white py-2 rounded-lg hover:bg-[#1f1f1f] transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}
      {showWalletDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={modalRef} className="bg-[#F5F5F5] p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4 text-[#262626]">Wallet</h2>
            <div className="mb-4">
              <label className="block text-[#262626] font-medium">Current Balance</label>
              <div className="w-full px-4 py-2 border rounded-lg bg-[#E3E3E3] text-[#262626]">
                ₹{walletBalance}
              </div>
            </div>
            <button
              onClick={handleAddMoney}
              className="w-full bg-[#262626] text-white py-2 rounded-lg hover:bg-[#1f1f1f] transition duration-300"
            >
              Add ₹100
            </button>
          </div>
        </div>
      )}
    </>
  );
};