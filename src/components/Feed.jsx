/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { AnimatePresence } from "motion/react";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res?.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed)
    return (
      <div className="flex justify-center mt-20 text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );

  if (feed.length === 0)
    return (
      <div className="flex justify-center mt-20 text-gray-600 text-2xl font-semibold">
        No new developers found
      </div>
    );

  return (
    feed && (
      <AnimatePresence mode="wait">
        <div className="flex justify-center pt-16 sm:pt-0">
          <UserCard key={feed[0]._id} user={feed[0]} />
        </div>
      </AnimatePresence>
    )
  );
};

export default Feed;
