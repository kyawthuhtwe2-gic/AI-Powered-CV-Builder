import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Sparkles,
  Eye,
  Image,
  Download,
  Sun,
  Moon,
  LogIn ,
} from "lucide-react";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const { login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleGoogle = () => login("google");

  return (
    <div className="min-h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-150px] right-[-120px] w-[350px] h-[350px] bg-indigo-500/20 blur-3xl rounded-full" />
      </div>

      {/* Navbar */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-11 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center hover:scale-105 transition-all shadow-sm"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Login */}
            <button
              onClick={handleGoogle}
              disabled={isLoading}
              className="flex items-center gap-1 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "Loading..." : "Sign in"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Create CVs faster with AI
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Create stunning, ATS-optimized resumes with our AI-powered platform — choose from multiple templates, get AI writing assistance, and export to PDF instantly.
            </p>
          </div>
          {/* Features */}
          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-28">
            <FeatureCard
              icon={<Sparkles className="w-7 h-7" />}
              title="AI Optimization"
              description="Smart suggestions to improve resume quality."
            />

            <FeatureCard
              icon={<Eye className="w-7 h-7" />}
              title="Live Preview"
              description="Instantly preview your CV changes in real time."
            />

            <FeatureCard
              icon={<Image className="w-7 h-7" />}
              title="Profile Upload"
              description="Upload professional profile photos with ease."
            />

            <FeatureCard
              icon={<Download className="w-7 h-7" />}
              title="PDF Export"
              description="Export high-quality CV PDFs with perfect formatting."
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-3xl p-7 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}