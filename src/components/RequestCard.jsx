import React from "react";
import { DEFAULT_PHOTO } from "../utils/constants";

const RequestCard = React.memo(({ request, onAccept, onReject, onSelect }) => {
  const user = request.fromUserId;
  if (!user) return null;

  const {
    firstName,
    lastName,
    age,
    gender,
    about,
    skills = [],
    photos = [],
  } = user;

  const photo = photos[0] || DEFAULT_PHOTO;

  return (
    <div
      onClick={() => onSelect(user)}
      className="bg-white cursor-pointer border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
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
        <h2 className="text-lg font-semibold text-gray-800">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-sm text-gray-500">
            {age} • {gender}
          </p>
        )}

        {skills.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {skills.slice(0, 3).join(" • ")}
          </p>
        )}

        {about && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{about}</p>
        )}

        <div className="flex gap-3 mt-auto pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(request._id);
            }}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Reject
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept(request._id);
            }}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
});

export default React.memo(RequestCard);
