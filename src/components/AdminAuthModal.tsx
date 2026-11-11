import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === '9822') {
      setError(false);
      soundManager.playFanfare();
      onSuccess();
      setPin('');
    } else {
      setError(true);
      setPin('');
      soundManager.playIncrement();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-outfit font-extrabold text-white">
                Acesso Gestor (ADM)
              </h3>
              <p className="text-xs text-slate-400">
                Área de controle restrita
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Digite a Senha de Acesso:</span>
            </label>
            <input
              type="password"
              autoFocus
              maxLength={8}
              placeholder="Digite a senha..."
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-center font-mono text-xl tracking-widest text-emerald-400 placeholder:text-slate-600 focus:outline-none ${
                error
                  ? 'border-rose-500/80 ring-2 ring-rose-500/30'
                  : 'border-emerald-500/40 focus:border-emerald-400'
              }`}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center gap-2 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Senha incorreta! Acesso restrito ao Gestor.</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-black text-xs sm:text-sm hover:from-emerald-400 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Entrar no ADM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
