/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { AnimatePresence } from "motion/react";
import ProfileModal from "./ProfileModal";
import toast from "react-hot-toast";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeRequest(_id));

      if (status === "accepted") {
        toast.success("Connection accepted");
      } else {
        toast.error("Request rejected");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err.message);
    }
  };

  const fetchRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests)
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-600">Loading...</div>
    );

  if (requests.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <h1 className="text-2xl font-semibold text-gray-600">
          No requests yet
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Connection Requests
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => {
          const user = request.fromUserId;

          const {
            _id,
            firstName,
            lastName,
            age,
            gender,
            about,
            skills = [],
            photos = [],
          } = user;

          const photo = photos?.[0] || DEFAULT_PHOTO;

          return (
            <div
              key={request._id}
              onClick={() => setSelectedUser(user)}
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

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reviewRequest("rejected", request._id);
                    }}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Reject
                  </button>

                  <button
                    onClick={(e) => {
                      (e.stopPropagation(),
                        reviewRequest("accepted", request._id));
                    }}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 transition"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <ProfileModal
            key={selectedUser._id}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Requests;
