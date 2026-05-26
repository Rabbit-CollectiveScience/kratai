'use client';

import { useEffect } from 'react';
import MermaidDiagram from './MermaidDiagram';

interface SequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  methodName: string;
  sequenceDiagram: string;
}

export default function SequenceModal({ isOpen, onClose, methodName, sequenceDiagram }: SequenceModalProps) {
  console.log('SequenceModal render:', { isOpen, methodName });
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sequence Diagram
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Execution flow for: <code className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded text-blue-600 dark:text-blue-400 font-mono">{methodName}</code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Diagram Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)] bg-slate-50 dark:bg-slate-900">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <MermaidDiagram chart={sequenceDiagram} className="flex justify-center" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              💡 Click any method in the class diagram to see its sequence flow
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
