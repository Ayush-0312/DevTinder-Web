/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { AnimatePresence } from "motion/react";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections?.length === 0)
    return (
      <div className="flex justify-center items-center py-20">
        <h1 className="text-2xl font-semibold text-gray-600">
          No connections yet
        </h1>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Connections</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection) => {
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

          const photo = photos?.[0] || DEFAULT_PHOTO;

          return (
            <div
              key={_id}
              onClick={() => setSelectedUser(connection)}
              className="bg-white cursor-pointer border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
            >
              {/* Image */}
              <img
                src={photo}
                alt={firstName}
                loading="lazy"
                className="h-56 w-full object-cover"
              />

              {/* Content */}
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
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {about}
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <Link to={`/chat/${_id}`}>
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm hover:opacity-90 transition">
                      Chat
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <ProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Connections;
