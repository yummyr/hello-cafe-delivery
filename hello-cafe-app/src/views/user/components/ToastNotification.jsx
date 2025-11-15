import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const ToastNotification = ({ message, isVisible, onClose }) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isVisible) {
      setAnimationClass("animate-slide-in");
      const timer = setTimeout(() => {
        setAnimationClass("animate-slide-out");
        setTimeout(onClose, 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] ${animationClass}`}
    >
      <div className="flex items-center gap-2 flex-1">
        <Check className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:bg-green-600 rounded p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastNotification;