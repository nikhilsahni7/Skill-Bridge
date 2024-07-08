// app/components/ChatModal.tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Chat from "@/components/Chat";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  receiverId,
  receiverName,
}: ChatModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 bg-secondary">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Chat with {receiverName}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <Chat receiverId={receiverId} receiverName={receiverName} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
