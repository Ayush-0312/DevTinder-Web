/* eslint-disable no-unused-vars */
import { useState } from "react";
import { DEFAULT_PHOTO } from "../utils/constants";
import { motion } from "motion/react";

const ProfileModal = ({ user, onClose }) => {
  const [index, setIndex] = useState(0);

  if (!user) return null;

  const {
    firstName,
    lastName,
    age,
    gender,
    about,
    skills = [],
    github,
    linkedIn,
    portfolio,
    photos = [],
  } = user;

  const safePhotos = photos.length ? photos : [DEFAULT_PHOTO];
  const photo = safePhotos[index];

  const nextPhoto = () => {
    setIndex((prev) => (prev + 1) % safePhotos.length);
  };

  const prevPhoto = () => {
    setIndex((prev) => (prev === 0 ? safePhotos.length - 1 : prev - 1));
  };

  return (
    <motion.div
      onClick={onclose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 text-white bg-black/40 w-8 h-8 rounded-full"
        >
          ✕
        </button>

        {/* Image Container */}
        <div className="relative">
          <img
            src={photo}
            alt={firstName}
            loading="lazy"
            className="w-full h-96 object-cover"
          />

          {/* Click zones */}
          {safePhotos.length > 1 && (
            <div className="absolute inset-0 flex cursor-pointer">
              <button className="w-1/2" onClick={prevPhoto} />
              <button className="w-1/2" onClick={nextPhoto} />
            </div>
          )}

          {/* Progress Bars */}
          {safePhotos.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {safePhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1 flex-1 rounded-full transition ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-1 overscroll-y-auto">
          <h2 className="text-xl font-semibold text-gray-700">
            {firstName} {lastName}
          </h2>

          {age && gender && (
            <p className="text-sm text-gray-500">
              {age} • {gender}
            </p>
          )}

          {skills.length > 0 && (
            <p className="text-sm text-gray-500">{skills.join(" • ")}</p>
          )}

          {about && (
            <p className="text-sm text-gray-700 leading-relaxed">{about}</p>
          )}

          <div className="flex gap-4 text-sm pt-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                GitHub
              </a>
            )}

            {linkedIn && (
              <a
                href={linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                LinkedIn
              </a>
            )}

            {portfolio && (
              <a
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;
