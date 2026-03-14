"use client";

/**
 * Contact Me modal: shows primary email and a form to send a message.
 * Sends to /api/contact; API emails owner and confirmation to visitor.
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PRIMARY_EMAIL = "bretttomita@gmail.com";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [fromName, setFromName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const reset = () => {
    setFromName("");
    setReplyTo("");
    setSubject("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fromName.trim();
    const trimmedReply = replyTo.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedReply || !trimmedSubject || !trimmedMessage) {
      toast.error("All fields are required.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmedReply)) {
      toast.error("Reply To must be a valid email address.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromName: trimmedName,
          replyTo: trimmedReply,
          subject: trimmedSubject,
          message: trimmedMessage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Failed to send message.");
        return;
      }
      toast.success("Message sent. You'll receive a confirmation email shortly.");
      reset();
      onClose();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Contact Me</DialogTitle>
          <DialogDescription>
            You can reach me at{" "}
            <a
              href={`mailto:${PRIMARY_EMAIL}`}
              className="font-medium text-foreground underline underline-offset-2"
            >
              {PRIMARY_EMAIL}
            </a>
            , or use the form below to send a message. I'll reply to the email you provide.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contact-from-name">From Name</Label>
            <Input
              id="contact-from-name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Your name"
              required
              disabled={sending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-reply-to">Reply To Email</Label>
            <Input
              id="contact-reply-to"
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={sending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-subject">Subject</Label>
            <Input
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              required
              disabled={sending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-message">Message Body</Label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              required
              disabled={sending}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button type="submit" disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
