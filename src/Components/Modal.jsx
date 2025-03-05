import { useState } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 dark:bg-zinc-200/15 backdrop-blur-xs "
    >
      <div className="modal px-6 py-3 rounded-lg shadow-lg w-5/6 xl:w-1/2 max-h-screen overflow-scroll bg-zinc-200 dark:bg-zinc-950">
        <div className="flex justify-end">
          <button className="text-3xl font-medium" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
