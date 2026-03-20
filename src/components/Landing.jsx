import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import CardMock from "./CardMock";
import Footer from "./Footer";

const users = [
  {
    name: "Ananya",
    role: "Frontend Engineer",
    skills: ["Next.js", "UI", "AI"],
    photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    name: "Rahul",
    role: "Backend Engineer",
    skills: ["Node", "System Design"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    name: "Ayush",
    role: "Full Stack Developer",
    skills: ["React", "MongoDB"],
    photo: "https://images.unsplash.com/photo-1502767089025-6572583495b4",
  },
];

const Landing = () => {
  const [active, setActive] = useState(1);

  return (
    <div className="min-h-screen text-rose-500 flex flex-col">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight"
        >
          Meet developers
          <br />
          <span className="text-gray-500">worth building with.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-400 max-w-lg mx-auto"
        >
          No noise. No endless scrolling. Just real developers building real
          things.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:shadow-md transition"
          >
            Start exploring
          </Link>
        </motion.div>
      </section>

      {/* CARD STACK */}
      <section className="mt-24 flex justify-center items-center overflow-clip lg:overflow-visible relative h-[500px]">
        {users.map((user, i) => {
          const offset = i - active;

          return (
            <motion.div
              key={i}
              onClick={() => setActive(i)}
              animate={{
                x: offset * 220,
                rotate: offset * 8,
                zIndex: i === active ? 10 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
              className="absolute cursor-pointer"
            >
              <CardMock user={user} active={i === active} />
            </motion.div>
          );
        })}
      </section>

      {/* SUBTEXT */}
      <section className="mt-20 text-center px-6">
        <p className="text-gray-500 text-2xl font-semibold">
          Built for real connections
        </p>
      </section>

      {/* CTA */}
      <section className="mt-16 mb-20 text-center">
        <Link
          to="/login"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:shadow-md transition"
        >
          Join DevTinder
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
