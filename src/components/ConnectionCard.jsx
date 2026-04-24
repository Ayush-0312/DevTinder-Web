import React from "react";
import { Link } from "react-router-dom";
import { DEFAULT_PHOTO } from "../utils/constants";

const ConnectionCard = React.memo(({ connection, onSelect }) => {
  if (!connection) return null;

  const {
    _id,
    firstName,
    lastName,
    age,
    gender,
    about,
    skills = [],
    photos = [],
  } = connection;

  const photo = photos[0] || DEFAULT_PHOTO;

  return (
    <div
      onClick={() => onSelect(connection)}
      className="group bg-gray-50 dark:bg-white/5 backdrop-blur-xl cursor-pointer border border-gray-200 dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl dark:shadow-black/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
    >
      <img
        src={photo}
        alt={firstName}
        loading="lazy"
        decoding="async"
        onError={(e) => (e.target.src = DEFAULT_PHOTO)}
        className="h-56 w-full object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {age} • {gender}
          </p>
        )}

        {skills.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            {skills.slice(0, 3).join(" • ")}
          </p>
        )}

        {about && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {about}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Link to={`/chat/${_id}`} onClick={(e) => e.stopPropagation()}>
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-800 dark:to-rose-800 text-gray-50 text-sm hover:animate-pulse transition-all duration-300">
              Chat
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default React.memo(ConnectionCard);
