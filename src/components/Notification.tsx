import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationProps {
  message: string | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce font-bakbak">
      <Bell size={18} />
      <span>{message}</span>
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;
