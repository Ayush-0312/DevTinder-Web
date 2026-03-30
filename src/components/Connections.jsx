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
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );

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
