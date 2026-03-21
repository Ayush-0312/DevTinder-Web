/* eslint-disable no-unused-vars */
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [swipe, setSwipe] = useState(null);

  if (!user) return null;

  const {
    _id,
    firstName,
    lastName,
    gender,
    age,
    about,
    skills = [],
    github,
    linkedIn,
    portfolio,
    photos = [],
  } = user;

  const safePhotos = photos.length ? photos : [DEFAULT_PHOTO];

  const photo = safePhotos[index] ?? safePhotos[0];

  const nextPhoto = () => {
    setIndex((prev) => (prev + 1) % safePhotos.length);
  };

  const prevPhoto = () => {
    setIndex((prev) => (prev === 0 ? safePhotos.length - 1 : prev - 1));
  };

  const handleSendRequest = async (status, userId) => {
    setSwipe(status);

    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );

      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
      }, 50);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <motion.div
      key={_id}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: swipe === "interested" ? 400 : swipe === "ignored" ? -400 : 0,
        rotate: swipe === "interested" ? 15 : swipe === "ignored" ? -15 : 0,
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="relative w-full max-w-sm h-[520px] rounded-2xl overflow-hidden shadow-xl bg-white"
    >
      {/* Profile Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={photo}
          src={photo}
          alt={firstName}
          onError={(e) => (e.target.src = DEFAULT_PHOTO)}
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 flex cursor-pointer">
        <div className="w-1/2 h-full" onClick={prevPhoto}></div>
        <div className="w-1/2 h-full" onClick={nextPhoto}></div>
      </div>

      {/* Photo Indicators */}
      {safePhotos.length > 1 && (
        <div className="absolute top-3 left-3 right-3 flex gap-1">
          {safePhotos.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-150 ${
                i === index ? "bg-white scale-x-100" : "bg-white/40 scale-x-90"
              }`}
            />
          ))}
        </div>
      )}

      {/* Gradient */}
      {swipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className={`absolute inset-0 z-10 ${
            swipe === "interested"
              ? "bg-gradient-to-r from-green-400/70 to-green-600/70"
              : "bg-gradient-to-l from-red-400/70 to-red-600/70"
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

      {/* Profile Info */}
      <div className="absolute bottom-24 left-5 right-5 text-white space-y-1">
        <h2 className="text-2xl font-semibold">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-sm opacity-90">
            {age} • {gender}
          </p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <p className="text-sm opacity-90">{skills.slice(0, 3).join(" • ")}</p>
        )}

        {/* About */}
        {about && <p className="text-sm opacity-90 line-clamp-2">{about}</p>}

        {/* Links */}
        <div className="flex gap-4 text-sm mt-1">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline opacity-90 hover:opacity-100"
            >
              GitHub
            </a>
          )}

          {linkedIn && (
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="underline opacity-90 hover:opacity-100"
            >
              LinkedIn
            </a>
          )}

          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="underline opacity-90 hover:opacity-100"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
        <button
          onClick={() => handleSendRequest("ignored", _id)}
          className="px-6 py-2 rounded-full border border-white text-white backdrop-blur-md hover:bg-white hover:text-black transition"
        >
          Ignore
        </button>

        <button
          onClick={() => handleSendRequest("interested", _id)}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 transition"
        >
          Interested
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(UserCard);
