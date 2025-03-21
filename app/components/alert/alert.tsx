import React, { useState, useEffect } from "react";

interface AlertProps {
  message: string;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({ message, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 py-2 px-5 rounded-md
     text-dark-text text-sm2 bg-black/50 backdrop-blur-sm"
    >
      {message}
    </div>
  );
};

export default Alert;
