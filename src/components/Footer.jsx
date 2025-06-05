import { AVATAR, GITHUB, LINKEDIN, PORTFOLIO } from "../utils/constants";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Footer = () => {
  const handleAvatarClick = () => {
    window.open(PORTFOLIO, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-0 w-full flex bg-base-300 p-6 justify-between">
      <div>
        <span className="text-xl font-semibold">DevTinder</span>
      </div>
      <div className="flex space-x-4">
        <span className="font-semibold text-lg">Created by- Ayush Gupta</span>
        <div onClick={handleAvatarClick}>
          <img
            className="w-8 rounded-xl cursor-pointer"
            src={AVATAR}
            alt="avatar"
          />
        </div>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer">
          <FaGithub size={30} />
        </a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={30} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
