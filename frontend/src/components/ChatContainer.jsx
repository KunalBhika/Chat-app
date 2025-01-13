import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./Skeletons/MessageSkeleton.jsx";

const ChatContainer = () => {
  const { selectedUser, isMessagesLoading, messages, getMessages } =
    useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  const formatTime = (messageSendTime) => {
    const clockPart = messageSendTime.split("T")[1];
    const timePart = clockPart.split(".")[0];
    return timePart.slice(0,5);
  };

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="chat bubble"
                  src={
                    (message.senderId === authUser._id
                      ? authUser.profilePic
                      : selectedUser.profilePic) || "/avatar.png"
                  }
                />
              </div>  
            </div>
            <div className="chat-header">
              {message.senderId === authUser._id
                ? authUser.fullName
                : selectedUser.fullName}
              <time className="text-xs opacity-50"> {formatTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className="text-white">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
