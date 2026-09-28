import React from 'react';
import { Icon } from './Icon.jsx';

export const ToastContainer = ({ toasts, onDismiss, onToastClick }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isChat = toast.type === 'chat';
        const isWO = toast.type === 'workOrder';
        const isInventory = toast.type === 'inventory';
        const isSuccess = toast.type === 'success';

        let borderColor = 'border-slate-200';
        let badgeBg = 'bg-slate-100 text-slate-700';
        let iconName = 'bell';

        if (isChat) {
          borderColor = 'border-blue-300';
          badgeBg = 'bg-blue-100 text-[#0A3963]';
          iconName = 'comments';
        } else if (isWO) {
          borderColor = 'border-emerald-300';
          badgeBg = 'bg-emerald-100 text-emerald-800';
          iconName = 'workOrders';
        } else if (isInventory) {
          borderColor = 'border-amber-300';
          badgeBg = 'bg-amber-100 text-amber-800';
          iconName = 'inventory';
        } else if (isSuccess) {
          borderColor = 'border-lime-300';
          badgeBg = 'bg-lime-100 text-lime-800';
          iconName = 'check';
        }

        return (
          <div
            key={toast.id}
            onClick={() => onToastClick && onToastClick(toast)}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md border ${borderColor} rounded-2xl p-3.5 shadow-2xl flex items-start gap-3 transition-all hover:scale-[1.02] cursor-pointer animate-in slide-in-from-bottom-3 duration-200`}
            role="alert"
          >
            <div className={`p-2 rounded-xl shrink-0 ${badgeBg}`}>
              <Icon name={iconName} className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold text-[#0A3963] truncate">
                  {toast.title}
                </p>
                <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                  {toast.time || 'Ahora'}
                </span>
              </div>

              <p className="text-[11px] text-slate-700 font-medium mt-0.5 leading-snug">
                {toast.message}
              </p>

              {toast.actionLabel && (
                <p className="text-[10px] text-[#8CC63F] font-bold mt-1 uppercase tracking-wider">
                  {toast.actionLabel} &rarr;
                </p>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(toast.id);
              }}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors shrink-0"
              title="Cerrar notificación"
            >
              <Icon name="close" className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
