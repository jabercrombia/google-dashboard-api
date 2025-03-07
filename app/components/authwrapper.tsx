"use client";

import { useState, useEffect } from "react";
import PasswordModal from "../components/modalpassword";

type AuthWrapperProps = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return isAuthenticated ? <>{children}</> : <PasswordModal onAuthenticated={() => setIsAuthenticated(true)} />;
}
