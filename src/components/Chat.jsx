import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants";

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chat = () => {
  const { targetUserId } = useParams();

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingRef = useRef(null);

  const fetchChat = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const { chatId, participants, messages } = res.data;

      setChatId(chatId);

      const otherUser = participants.find(
        (p) => String(p._id) !== String(userId),
      );

      setTargetUser(otherUser);

      const formatted = messages.map((msg) => ({
        senderId: msg.senderId._id,
        text: msg.text,
        time: msg.createdAt,
      }));

      setMessages(formatted);

      if (formatted.length > 0 && formatted[0]?.time) {
        setCursor(new Date(formatted[0]?.time).toISOString());
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [targetUserId, userId]);

  useEffect(() => {
    if (!userId) return;
    fetchChat();
  }, [fetchChat, userId]);

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("messageReceived", (msg) => {
      if (String(msg.senderId) === String(userId)) return;

      setMessages((prev) => [
        ...prev,
        {
          senderId: msg.senderId,
          text: msg.text,
          time: msg.createdAt,
        },
      ]);
    });

    socket.on("userTyping", ({ userId: typingUserId }) => {
      if (String(typingUserId) === String(userId)) return;

      setIsTyping(true);
    });

    socket.on("userStoppedTyping", ({ userId: typingUserId }) => {
      if (String(typingUserId) === String(userId)) return;

      setIsTyping(false);
    });

    return () => socket.disconnect();
  }, [userId]);

  useEffect(() => {
    if (!chatId) return;
    if (!socketRef.current) return;

    const socket = socketRef.current;

    if (socket.connected) {
      socket.emit("joinChat", { chatId });
    } else {
      socket.once("connect", () => {
        socket.emit("joinChat", { chatId });
      });
    }
  }, [chatId]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;
    if (!chatId || !socketRef.current) return;

    socketRef.current?.emit("sendMessage", {
      chatId,
      senderId: userId,
      text: newMessage.trim(),
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        text: newMessage.trim(),
        time: new Date(),
      },
    ]);

    setNewMessage("");
  }, [newMessage, chatId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/chat/${targetUserId}?cursor=${cursor}&limit=20`,
        { withCredentials: true },
      );

      const newMessages = res.data.messages;

      if (newMessages.length === 0) {
        setHasMore(false);
        return;
      }

      const formatted = newMessages.map((msg) => ({
        senderId: msg.senderId._id,
        text: msg.text,
        time: msg.createdAt,
      }));

      setMessages((prev) => [...formatted, ...prev]);
      setCursor(new Date(formatted[0]?.time).toISOString());
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, targetUserId]);

  const handleTyping = useCallback(
    (value) => {
      setNewMessage(value);

      if (!chatId || !userId) return;

      socketRef.current.emit("typing", { chatId, userId });

      clearTimeout(typingRef.current);

      typingRef.current = setTimeout(() => {
        socketRef.current.emit("stopTyping", { chatId, userId });
      }, 1000);
    },
    [chatId, userId],
  );

  useEffect(() => {
    return () => clearTimeout(typingRef.current);
  }, []);

  if (!chatId) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[75vh] flex flex-col rounded-xl overflow-hidden bg-gray-50 dark:bg-black/25 backdrop-blur-xl text-gray-600 dark:text-gray-400 shadow-lg dark:shadow-black/40 transition-colors duration-300">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/30">
        <img
          src={targetUser?.photos?.[0] || DEFAULT_PHOTO}
          loading="lazy"
          decoding="async"
          className="w-10 h-10 rounded-full object-cover"
        />

        <span className="font-medium text-gray-800 dark:text-gray-200">
          {targetUser
            ? `${targetUser.firstName} ${targetUser?.lastName}`
            : "Chat"}
        </span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 bg-gray-50 dark:bg-transparent">
        {hasMore && messages.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={fetchMore}
              className="text-sm px-4 py-1 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-400 transition"
            >
              Load older messages
            </button>
          </div>
        )}

        {loading && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-600">
            Loading...
          </p>
        )}

        {messages.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <p className="">No messages yet</p>
            <p className="mt-1">Start the conversation</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = String(msg.senderId) === String(userId);

          return (
            <div
              key={msg?.time + msg?.senderId}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`px-2 py-2 rounded-2xl text-sm shadow break-words whitespace-pre-wrap transition-all duration-300 ${
                    isMe
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-800 dark:to-rose-800 text-white"
                      : "bg-gray-50 dark:bg-black/50 dark:text-gray-200 border border-gray-200 dark:border-white/10"
                  }`}
                >
                  <p>
                    {msg.text}{" "}
                    <span className="text-[10px] opacity-60">
                      {formatTime(msg.time)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <p className="text-sm text-gray-400 dark:text-gray-500 px-2 pb-2">
            typing...
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/30">
        <input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 dark:from-pink-700 dark:to-rose-700 text-white shadow hover:scale-105 transition-transform duration-200"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default React.memo(Chat);
