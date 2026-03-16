/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

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
      <div className="flex justify-center mt-20 text-gray-500">Loading...</div>
    );

  if (feed.length === 0)
    return (
      <div className="flex justify-center mt-20 text-gray-600 text-2xl">
        No new developers found
      </div>
    );

  return (
    feed && (
      <div className="flex justify-center">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
