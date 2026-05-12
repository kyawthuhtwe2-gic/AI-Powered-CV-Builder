import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Sun,
  Moon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideDropdown = dropdownRef.current?.contains(target);
      const clickedOnButton = buttonRef.current?.contains(target);

      if (!clickedInsideDropdown && !clickedOnButton) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  // lock body scroll when dropdown is open
  useEffect(() => {
    if (showDropdown) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [showDropdown]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-w-0">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="AI Power CV Builder Logo"
              className="w-18 h-18 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI-Powered CV Builder
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Smart Resume Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <div className="relative">
              <button
                ref={(el) => (buttonRef.current = el)}
                onClick={() => {
                  if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    const dropdownWidth = 192; // w-48
                    let left = rect.right - dropdownWidth;
                    left = Math.max(8, left);
                    const top = rect.bottom + 8;
                    setDropdownPos({ top, left });
                  }
                  setShowDropdown(!showDropdown);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full bg-[#2563EB] dark:bg-blue-500 text-white flex items-center justify-center font-medium"
                  aria-hidden
                >
                    {(() => {
                      const u = user as any;
                      const initial = u?.avatar
                        ? String(u.avatar).charAt(0).toUpperCase()
                        : u?.name
                        ? String(u.name).charAt(0).toUpperCase()
                        : u?.email
                        ? String(u.email).charAt(0).toUpperCase()
                        : "?";
                      return initial;
                    })()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.email}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {showDropdown && dropdownPos && (
                <div
                  ref={dropdownRef}
                  style={{ top: dropdownPos.top, left: dropdownPos.left }}
                  className="fixed w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}