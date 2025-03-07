"use client";

import { useState } from "react";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PasswordModalProps = {
  onAuthenticated: () => void;
};

export default function PasswordModal({ onAuthenticated }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); // Clear previous errors
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("authenticated", "true");
        onAuthenticated();
        setIsOpen(false);
      } else {
        setError("Incorrect password!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
        </DialogHeader>
        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <p>This app is password protected beacause of API calls have a cost. If you would like to see the dashboard please reach out to me at <Link href="mailto:jabercrombia@gmail.com">jabercrombia@gmail.com</Link> </p>
        <Button onClick={handleSubmit} className="mt-2 w-full">Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
