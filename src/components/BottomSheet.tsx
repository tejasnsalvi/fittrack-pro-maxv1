/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent body scrolling when the sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            id="bottom-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sliding Bottom Sheet */}
          <motion.div
            id="bottom-sheet-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#1A1D24] border-t border-white/5 rounded-t-[32px] shadow-2xl z-50 p-6 pb-8 flex flex-col max-h-[85vh] overflow-y-auto"
          >
            {/* Grabber indicator bar */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />

            {/* Header */}
            <div className="flex justify-between items-center mb-6" id="bottom-sheet-header">
              <h2 className="text-xl font-bold text-white" id="bottom-sheet-title">{title}</h2>
              <button
                id="bottom-sheet-close-btn"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#0F1117] hover:bg-white/5 flex items-center justify-center text-[#A1A1AA] hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1" id="bottom-sheet-body">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
