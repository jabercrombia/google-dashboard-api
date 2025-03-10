import React, { useState } from 'react';
import Link from 'next/link';
type PasswordModalProps = {
  onPasswordSubmit: (password: string) => void;
};

const PasswordModal: React.FC<PasswordModalProps> = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <div className="flex h-screen items-center justify-center">
        <div className='mx-auto'>
          <h2>Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
          />
          <button className='btn btn-blue' onClick={handleSubmit}>Submit</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>This app is password protected beacause of API calls have a cost. If you would like to see the dashboard please reach out to me at <Link href="mailto:jabercrombia@gmail.com">jabercrombia@gmail.com</Link></p>
      </div>
  </div>
  
  );
};

export default PasswordModal;
