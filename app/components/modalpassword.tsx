// components/PasswordModal.tsx

import React, { useState } from 'react';

type PasswordModalProps = {
  onPasswordSubmit: (password: string) => void; // This function is passed as a prop
};

const PasswordModal: React.FC<PasswordModalProps> = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Simulating password check
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
    <div>
      <h2>Enter Password</h2>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PasswordModal;
