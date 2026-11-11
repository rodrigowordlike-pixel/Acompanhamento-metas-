import React, { useState, useEffect } from 'react';
import { MonthCampaign, Seller, ViewMode, WeekNumber } from './types';
import { DEFAULT_MONTH_CAMPAIGN } from './data/initialData';
import { Navbar } from './components/Navbar';
import { PreviewScreen } from './components/PreviewScreen';
import { AdminScreen } from './components/AdminScreen';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { SellerModal } from './components/SellerModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { soundManager } from './utils/sound';

export default function App() {
  const [campaign, setCampaign] = useState<MonthCampaign>(() => {
    const saved = localStorage.getItem('meta_vendas_4weeks_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved campaign', e);
      }
    }
    return DEFAULT_MONTH_CAMPAIGN;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'admin_mode' | 'show_values' | null>(null);

  // Default showValues is false per explicit user instruction ("sem abrir os números apenas o % que cada um está no momento")
  const [showValues, setShowValues] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [sellerToEdit, setSellerToEdit] = useState<Seller | null>(null);

  useEffect(() => {
    localStorage.setItem('meta_vendas_4weeks_v3', JSON.stringify(campaign));
  }, [campaign]);

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Handle switching view mode with password 9822 for Admin
  const handleRequestViewMode = (mode: ViewMode) => {
    if (mode === 'admin' && !isAdminAuthenticated) {
      setPendingAction('admin_mode');
      setIsAdminAuthModalOpen(true);
      return;
    }
    setViewMode(mode);
  };

  // Handle requesting to reveal raw R$ values with password 9822
  const handleRequestShowValues = (shouldShow: boolean) => {
    if (!shouldShow) {
      setShowValues(false);
      return;
    }

    if (!isAdminAuthenticated) {
      setPendingAction('show_values');
      setIsAdminAuthModalOpen(true);
      return;
    }

    setShowValues(true);
  };

  // On correct password (9822) entry
  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);

    if (pendingAction === 'show_values') {
      setShowValues(true);
    } else if (pendingAction === 'admin_mode') {
      setViewMode('admin');
    }
    setPendingAction(null);
  };

  const handleSelectWeek = (week: WeekNumber) => {
    setCampaign((prev) => ({ ...prev, activeWeek: week }));
  };

  const handleQuickAddSales = (sellerId: string, week: WeekNumber, amount: number) => {
    setCampaign((prev) => {
      const updatedSellers = prev.sellers.map((s) => {
        if (s.id === sellerId) {
          const weekData = s.weeks[week];
          const updatedWeek = {
            ...weekData,
            current: weekData.current + amount,
          };
          return {
            ...s,
            weeks: {
              ...s.weeks,
              [week]: updatedWeek,
            },
          };
        }
        return s;
      });
      return { ...prev, sellers: updatedSellers };
    });
  };

  const handleUpdateSellerWeek = (
    sellerId: string,
    week: WeekNumber,
    target: number,
    current: number,
    phrase?: string
  ) => {
    setCampaign((prev) => {
      const updatedSellers = prev.sellers.map((s) => {
        if (s.id === sellerId) {
          const updatedWeek = {
            ...s.weeks[week],
            target,
            current,
            customPhrase: phrase !== undefined ? phrase : s.weeks[week].customPhrase,
          };
          return {
            ...s,
            weeks: {
              ...s.weeks,
              [week]: updatedWeek,
            },
          };
        }
        return s;
      });
      return { ...prev, sellers: updatedSellers };
    });
  };

  const handleSaveSeller = (sellerData: Seller) => {
    setCampaign((prev) => {
      const exists = prev.sellers.some((s) => s.id === sellerData.id);
      let updatedSellers: Seller[];
      if (exists) {
        updatedSellers = prev.sellers.map((s) => (s.id === sellerData.id ? sellerData : s));
      } else {
        updatedSellers = [...prev.sellers, sellerData];
      }
      return { ...prev, sellers: updatedSellers };
    });
  };

  const handleDeleteSeller = (sellerId: string) => {
    if (window.confirm('Tem certeza que deseja remover este vendedor da equipe?')) {
      setCampaign((prev) => ({
        ...prev,
        sellers: prev.sellers.filter((s) => s.id !== sellerId),
      }));
    }
  };

  const handleResetWeekSales = (week: WeekNumber) => {
    setCampaign((prev) => ({
      ...prev,
      sellers: prev.sellers.map((s) => ({
        ...s,
        weeks: {
          ...s.weeks,
          [week]: { ...s.weeks[week], current: 0 },
        },
      })),
    }));
  };

  const handleUpdateBannerPhrase = (bannerPhrase: string) => {
    setCampaign((prev) => ({ ...prev, bannerPhrase }));
  };

  const openEditModal = (seller?: Seller) => {
    setSellerToEdit(seller || null);
    setIsSellerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={handleRequestViewMode}
        showValues={showValues}
        onRequestShowValues={handleRequestShowValues}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {viewMode === 'preview' && (
          <PreviewScreen
            campaign={campaign}
            showValues={showValues}
            onSelectWeek={handleSelectWeek}
            onQuickAddSales={handleQuickAddSales}
            onOpenEditModal={openEditModal}
            onUpdateBannerPhrase={handleUpdateBannerPhrase}
          />
        )}

        {viewMode === 'admin' && isAdminAuthenticated && (
          <AdminScreen
            campaign={campaign}
            onUpdateSellerWeek={handleUpdateSellerWeek}
            onAddSeller={handleSaveSeller}
            onDeleteSeller={handleDeleteSeller}
            onResetWeekSales={handleResetWeekSales}
            onOpenEditModal={openEditModal}
          />
        )}
      </main>

      {/* Password Auth Modal (PIN: 9822) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => {
          setIsAdminAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* WhatsApp Share Broadcast Modal */}
      <WhatsAppShareModal
        campaign={campaign}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Add/Edit Seller Modal */}
      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        sellerToEdit={sellerToEdit}
        onSave={handleSaveSeller}
      />
    </div>
  );
}
