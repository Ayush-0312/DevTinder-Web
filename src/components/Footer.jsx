import { GITHUB, LINKEDIN, PORTFOLIO } from "../utils/constants";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-7xl md:text-[200px] font-bold tracking-normal bg-gradient-to-b from-rose-500 to-pink-500 bg-clip-text text-transparent opacity-50 select-none">
          DevTinder
        </h1>
      </div>

      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      <div className="relative max-w-6xl mx-auto px-6 sm:py-16 flex flex-col items-center gap-3 text-gray-400">
        <p className="text-lg font-semibold text-gray-600 text-center max-w-md">
          Meet developers worth building with.
        </p>

        <p className="text-gray-500">
          Developed by:{" "}
          <span
            className="hover:underline cursor-pointer"
            onClick={() => window.open(PORTFOLIO, "_blank")}
          >
            Ayush
          </span>
        </p>
        <div className="flex items-center gap-6">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition"
          >
            <FaGithub size={20} />
          </a>

          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition"
          >
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
