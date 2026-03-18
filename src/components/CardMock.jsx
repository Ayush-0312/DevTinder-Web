import { motion } from "motion/react";

const CardMock = ({ user, active }) => {
  const { name, role, skills, photo } = user;

  return (
    <motion.div
      animate={{
        scale: active ? 1 : 0.92,
        opacity: active ? 1 : 0.5,
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className="relative w-[300px] h-[420px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl"
    >
      {/* IMAGE */}
      <img
        src={photo}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* CONTENT */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h2 className="text-lg font-semibold">{name}</h2>

        <p className="text-sm text-gray-300">{role}</p>

        <p className="text-xs mt-1 opacity-80">{skills.join(" • ")}</p>
      </div>
    </motion.div>
  );
};

export default CardMock;
