import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import ProfileModal from "./ProfileModal";
import { AnimatePresence } from "motion/react";
import ConnectionCard from "./ConnectionCard";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data || []));
    } catch (err) {
      console.log(err.message);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleSelect = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  if (!connections)
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-600 dark:text-gray-400">
        Loading Connections...
      </div>
    );

  if (connections?.length === 0)
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          No connections yet
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-4">
          Start connecting with developers to see them here.
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-bold  text-gray-800 dark:text-gray-200 mb-8">
        Connections
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection) => (
          <ConnectionCard
            key={connection._id}
            connection={connection}
            onSelect={handleSelect}
          />
        ))}
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
