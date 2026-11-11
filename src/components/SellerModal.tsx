import React, { useState, useEffect } from 'react';
import { Seller, WeekNumber } from '../types';
import { X, UserPlus, Save } from 'lucide-react';

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerToEdit?: Seller | null;
  onSave: (seller: Seller) => void;
}

const AVATAR_COLORS = [
  'from-emerald-500 to-teal-700',
  'from-green-500 to-emerald-700',
  'from-emerald-400 to-lime-600',
  'from-teal-500 to-emerald-800',
  'from-green-600 to-teal-800',
  'from-lime-500 to-emerald-600',
  'from-cyan-500 to-emerald-600',
];

export const SellerModal: React.FC<SellerModalProps> = ({
  isOpen,
  onClose,
  sellerToEdit,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  const [t1, setT1] = useState(50000);
  const [t2, setT2] = useState(55000);
  const [t3, setT3] = useState(60000);
  const [t4, setT4] = useState(65000);

  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(0);
  const [c3, setC3] = useState(0);
  const [c4, setC4] = useState(0);

  useEffect(() => {
    if (sellerToEdit && sellerToEdit.id) {
      setName(sellerToEdit.name);
      setAvatarColor(sellerToEdit.avatarColor || AVATAR_COLORS[0]);
      setT1(sellerToEdit.weeks[1]?.target || 50000);
      setT2(sellerToEdit.weeks[2]?.target || 55000);
      setT3(sellerToEdit.weeks[3]?.target || 60000);
      setT4(sellerToEdit.weeks[4]?.target || 65000);

      setC1(sellerToEdit.weeks[1]?.current || 0);
      setC2(sellerToEdit.weeks[2]?.current || 0);
      setC3(sellerToEdit.weeks[3]?.current || 0);
      setC4(sellerToEdit.weeks[4]?.current || 0);
    } else {
      setName('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
      setT1(50000); setT2(55000); setT3(60000); setT4(65000);
      setC1(0); setC2(0); setC3(0); setC4(0);
    }
  }, [sellerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: sellerToEdit?.id || 'seller-' + Date.now(),
      name: name.trim(),
      avatarColor,
      weeks: {
        1: { target: Number(t1), current: Number(c1), prizeAmount: 100, customPhrase: sellerToEdit?.weeks[1]?.customPhrase },
        2: { target: Number(t2), current: Number(c2), prizeAmount: 200, customPhrase: sellerToEdit?.weeks[2]?.customPhrase },
        3: { target: Number(t3), current: Number(c3), prizeAmount: 300, customPhrase: sellerToEdit?.weeks[3]?.customPhrase },
        4: { target: Number(t4), current: Number(c4), prizeAmount: 400, customPhrase: sellerToEdit?.weeks[4]?.customPhrase },
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-outfit font-extrabold text-white">
              {sellerToEdit?.id ? 'Editar Vendedor & Metas' : 'Cadastrar Novo Vendedor'}
            </h3>
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
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nome do Vendedor
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Fabrício"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/60 space-y-3">
            <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
              Metas das 4 Semanas (R$)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">Semana 1 (Prêmio R$100)</label>
                <input
                  type="number"
                  value={t1}
                  onChange={(e) => setT1(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">Semana 2 (Prêmio R$200)</label>
                <input
                  type="number"
                  value={t2}
                  onChange={(e) => setT2(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">Semana 3 (Prêmio R$300)</label>
                <input
                  type="number"
                  value={t3}
                  onChange={(e) => setT3(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">Semana 4 (Prêmio R$400)</label>
                <input
                  type="number"
                  value={t4}
                  onChange={(e) => setT4(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Estilo de Cor do Avatar
            </label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} transition-all ${
                    avatarColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs sm:text-sm hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Salvar Vendedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
