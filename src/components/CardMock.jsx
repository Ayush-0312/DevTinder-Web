// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const CardMock = ({ user, active }) => {
  const { name, role, skills, photo } = user;

  return (
    <motion.div
      animate={{
        scale: active ? 1 : 0.92,
        opacity: active ? 1 : 0.4,
        y: active ? 0 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="relative w-[300px] h-[420px] rounded-2xl overflow-hidden bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 transition-colors duration-300"
    >
      {/* IMAGE */}
      <img
        src={photo}
        alt={name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* CONTENT */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h2 className="text-lg font-semibold">{name}</h2>

        <p className="text-sm text-gray-300">{role}</p>

        <p className="text-xs mt-1 text-gray-300 opacity-80">
          {skills.join(" • ")}
        </p>
      </div>
    </motion.div>
  );
};

export default CardMock;
