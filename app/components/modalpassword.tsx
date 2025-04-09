import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
type PasswordModalProps = {
  onPasswordSubmit: (password: string) => void;
};

const PasswordModal: React.FC<PasswordModalProps> = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpen] = useState(true);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const storedPassword = process.env.NEXT_PUBLIC_PASSWORD;
      if (password === storedPassword) {
        onPasswordSubmit(password);
      } else {
        setError('Incorrect password, please try again.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('An error occurred');
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
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      {error && <p className="text-red-500">{error}</p>}
      <p>This app is password protected beacause of API calls have a cost. If you would like to see the dashboard please reach out to me at <Link href="mailto:jabercrombia@gmail.com">jabercrombia@gmail.com</Link></p>
      <p> All analytics data is based off of <Link href="https://www.jabercrombia.com" target='_blank'>www.jabercrombia.com</Link> </p>
      <Button onClick={handleSubmit} className="mt-2 w-full">Submit</Button>
    </DialogContent>
  </Dialog>
  );
};

export default PasswordModal;
