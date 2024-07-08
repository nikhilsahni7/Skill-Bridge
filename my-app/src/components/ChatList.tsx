// app/components/ChatList.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronLeft } from "lucide-react";
import Chat from "./Chat";
import ChatModal from "./ChatModal";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
}

export default function ChatList() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    if (session?.user?.id) {
      fetchConversations();
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [session?.user?.id]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobileView) {
      setIsModalOpen(true);
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-4rem)] bg-background">
      <Card
        className={`w-full sm:w-1/3 ${
          isMobileView && selectedConversation ? "hidden sm:flex" : "flex"
        } flex-col`}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full">
            {conversations.map(
              (conversation) =>
                conversation.participantId !== session?.user?.id && (
                  <div
                    key={conversation.id}
                    className="flex items-center p-4 hover:bg-secondary cursor-pointer transition-colors duration-200"
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback>
                        {conversation.participantName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold truncate">
                        {conversation.participantName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                )
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className={`flex-grow ${isMobileView ? "hidden" : "flex flex-col"}`}>
        {selectedConversation ? (
          <>
            <div className="bg-secondary p-4 flex items-center">
              <Button
                variant="ghost"
                className="sm:hidden mr-2"
                onClick={handleBackToList}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10 mr-3 code-font">
                <AvatarFallback>
                  {selectedConversation.participantName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">
                {selectedConversation.participantName}
              </span>
            </div>
            <Chat
              receiverId={selectedConversation.participantId}
              receiverName={selectedConversation.participantName}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
      {isMobileView && selectedConversation && (
        <ChatModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          receiverId={selectedConversation.participantId}
          receiverName={selectedConversation.participantName}
        />
      )}
    </div>
  );
}
