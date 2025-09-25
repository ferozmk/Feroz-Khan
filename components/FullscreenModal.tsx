import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, mediaUrl, mediaType }) => {
  // Memoize the modal root element lookup to avoid repeated DOM queries.
  const modalRoot = useMemo(() => document.getElementById('modal-root'), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Ensure the modal root exists before attempting to render the portal.
  if (!modalRoot) {
    if (isOpen) {
      console.error("FullscreenModal: The '#modal-root' element was not found in the DOM.");
    }
    return null;
  }
  
  if (!isOpen || !mediaUrl || !mediaType) {
    return null;
  }
  
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen media view"
    >
      <button 
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
        onClick={onClose}
        aria-label="Close fullscreen view"
      >
        &times;
      </button>
      <div 
        className="max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking on the media
      >
        {mediaType === 'image' && (
          <img src={mediaUrl} alt="Fullscreen view" className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg" />
        )}
        {mediaType === 'video' && (
          <video src={mediaUrl} controls autoPlay className="max-w-[95vw] max-h-[95vh] rounded-lg" />
        )}
      </div>
    </div>
  );
  
  // Render the modal content into the '#modal-root' div using a portal.
  // This isolates it from parent component styling and stacking contexts.
  return createPortal(modalContent, modalRoot);
};

export default FullscreenModal;