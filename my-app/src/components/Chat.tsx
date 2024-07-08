// app/components/Chat.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import { useTheme } from "next-themes";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface ChatProps {
  receiverId: string;
  receiverName: string;
}

export default function Chat({ receiverId, receiverName }: ChatProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>();
  const { theme } = useTheme();

  useEffect(() => {
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
    );
    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
      socketRef.current.emit("join", session?.user?.id);
    });
    socketRef.current.on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [session?.user?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?userId=${receiverId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId,
          content: inputMessage,
        }),
      });
      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage("");
        socketRef.current.emit("sendMessage", newMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with {receiverName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === session?.user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === session?.user?.id
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </Card>
  );
}
