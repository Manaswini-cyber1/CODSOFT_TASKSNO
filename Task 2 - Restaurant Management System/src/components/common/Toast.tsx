import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center space-x-3 px-5 py-3.5 bg-slate-900/95 border border-amber-500/40 text-white rounded-2xl shadow-2xl shadow-amber-500/20 backdrop-blur-md">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold">{toastMessage}</span>
      </div>
    </div>
  );
};
