import axios from "axios";
import { useCallback, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { AnimatePresence } from "motion/react";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = useCallback(async () => {
    if (feed) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res?.data || []));
    } catch (err) {
      console.log(err.message);
    }
  }, [feed, dispatch]);

  useEffect(() => {
    if (!feed) getFeed();
  }, [feed, getFeed]);

  if (!feed)
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-600 dark:text-gray-400">
        Finding developers for you...
      </div>
    );

  if (feed.length === 0)
    return (
      <div className="flex flex-col justify-center items-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
          No new developers found
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-4">
          Check back later or explore connections.
        </p>
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      <div className="flex justify-center pt-16 sm:pt-0">
        <UserCard key={feed[0]._id} user={feed[0]} />
      </div>
    </AnimatePresence>
  );
};

export default Feed;
