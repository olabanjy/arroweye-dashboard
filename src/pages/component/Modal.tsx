import React, { FC } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-[500px]",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full ${maxWidth} p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
        >
          <IoCloseSharp size={24} />
        </button>

        {title && (
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
