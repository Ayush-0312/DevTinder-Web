import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { AnimatePresence } from "motion/react";
import ProfileModal from "./ProfileModal";
import toast from "react-hot-toast";
import RequestCard from "./RequestCard";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);

  const reviewRequest = useCallback(
    async (status, _id) => {
      try {
        await axios.post(
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
    },
    [dispatch],
  );

  const fetchRequest = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data || []));
    } catch (err) {
      console.log(err.message);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleAccept = useCallback(
    (id) => {
      reviewRequest("accepted", id);
    },
    [reviewRequest],
  );

  const handleReject = useCallback(
    (id) => {
      reviewRequest("rejected", id);
    },
    [reviewRequest],
  );

  const handleSelect = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  if (!requests)
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-600 dark:text-gray-400">
        Loading Requests...
      </div>
    );

  if (requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          No requests yet
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          When someone sends you a request, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
        Connection Requests
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <RequestCard
            key={request._id}
            request={request}
            onAccept={handleAccept}
            onReject={handleReject}
            onSelect={handleSelect}
          />
        ))}
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
