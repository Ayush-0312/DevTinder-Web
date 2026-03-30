/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
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

  const fetchChat = async () => {
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

      const formattedMessages = messages.map((msg) => ({
        senderId: msg.senderId._id,
        text: msg.text,
        time: msg.createdAt,
      }));

      setMessages(formattedMessages);

      if (formattedMessages.length > 0) {
        setCursor(formattedMessages[0]?.time);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchChat();
  }, [targetUserId, userId]);

  useEffect(() => {
    socketRef.current = createSocketConnection();

    socketRef.current.on("connect", () => {
      // console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("messageReceived", (msg) => {
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

    socketRef.current.on("userTyping", ({ userId: typingUserId }) => {
      if (String(typingUserId) === String(userId)) return;

      setIsTyping(true);
    });

    socketRef.current.on("userStoppedTyping", ({ userId: typingUserId }) => {
      if (String(typingUserId) === String(userId)) return;

      setIsTyping(false);
    });

    return () => socketRef.current.disconnect();
  }, []);

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

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!chatId || !socketRef.current) return;

    socketRef.current?.emit("sendMessage", {
      chatId,
      senderId: userId,
      text: newMessage,
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        text: newMessage,
        time: new Date(),
      },
    ]);

    setNewMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMore = async () => {
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

      setCursor(formatted[0]?.time);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);

    if (!chatId || !userId) return;

    socketRef.current.emit("typing", { chatId, userId });

    clearTimeout(typingRef.current);

    typingRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", { chatId, userId });
    }, 1000);
  };

  if (!chatId) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[75vh] flex flex-col rounded-xl overflow-hidden bg-white text-gray-600 shadow-lg">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
        <img
          src={targetUser?.photos?.[0] || DEFAULT_PHOTO}
          loading="lazy"
          decoding="async"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {targetUser
              ? `${targetUser.firstName} ${targetUser?.lastName}`
              : "Chat"}
          </span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 bg-gray-50">
        {hasMore && messages.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={fetchMore}
              className="text-sm px-4 py-1 rounded-full bg-gray-200 hover:bg-gray-100 transition"
            >
              Load older messages
            </button>
          </div>
        )}

        {loading && (
          <p className="text-center text-xs text-gray-400">Loading...</p>
        )}

        {messages.length === 0 && !loading && (
          <div className="flex flex-col justify-center items-center h-full text-gray-400 ">
            <p className="">No messages yet</p>
            <p className="mt-1">Start the conversation</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = String(msg.senderId) === String(userId);

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`px-2 py-2 rounded-2xl text-sm shadow break-words whitespace-pre-wrap ${
                    isMe
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      : "bg-white border"
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
          <p className="text-sm text-gray-400 px-2 pb-2">typing...</p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
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
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow hover:scale-105 transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default React.memo(Chat);
