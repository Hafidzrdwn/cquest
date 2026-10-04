import React, { useState } from 'react';
import { 
  Heart, 
  Zap, 
  Sparkles, 
  Shield, 
  Flame, 
  Send, 
  ArrowUpCircle, 
  CheckCircle2, 
  Swords,
  Wind
} from 'lucide-react';
import { PlayerId, Card, PlayerState } from '../types/game';
import { INITIAL_PLAYER_1, INITIAL_PLAYER_2 } from '../data/initialGameData';
import { cn } from '../lib/utils';

export const ControllerView: React.FC = () => {
  // Extract ?player=1 or 2 from query string or default to 1
  const searchParams = new URLSearchParams(window.location.search);
  const paramPlayer = searchParams.get('player');
  const initialPlayerId: PlayerId = paramPlayer === '2' ? 2 : 1;

  const [activePlayerId, setActivePlayerId] = useState<PlayerId>(initialPlayerId);
  const [playerState, setPlayerState] = useState<PlayerState>(
    activePlayerId === 1 ? INITIAL_PLAYER_1 : INITIAL_PLAYER_2
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [lastPlayedCardName, setLastPlayedCardName] = useState<string | null>(null);

  // Switch role handler for testing both players on one device
  const handleSelectRole = (id: PlayerId) => {
    setActivePlayerId(id);
    setPlayerState(id === 1 ? INITIAL_PLAYER_1 : INITIAL_PLAYER_2);
    setSelectedCardId(null);
  };

  const handlePlayCard = (card: Card) => {
    if (playerState.energy < card.cost) {
      alert('Energy tidak cukup!');
      return;
    }

    // Trigger haptic vibration if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(60);
    }

    setPlayerState((prev) => ({
      ...prev,
      energy: prev.energy - card.cost,
      hand: prev.hand.filter((c) => c.id !== card.id),
      discardPile: [...prev.discardPile, card],
    }));

    setLastPlayedCardName(card.name);
    setSelectedCardId(null);

    setTimeout(() => {
      setLastPlayedCardName(null);
    }, 2500);
  };

  const isEmpathy = activePlayerId === 1;

  const getCardIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Ear':
        return <Shield className="w-5 h-5 text-cyan-400" />;
      case 'HeartHandshake':
        return <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-300" />;
      case 'MessageSquareWarning':
        return <Swords className="w-5 h-5 text-rose-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getCardBorderColor = (type: Card['type']) => {
    switch (type) {
      case 'ATTACK':
        return 'border-rose-500/50 hover:border-rose-400 shadow-rose-950/40';
      case 'SHIELD':
        return 'border-cyan-500/50 hover:border-cyan-400 shadow-cyan-950/40';
      case 'HEAL':
        return 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/40';
      case 'BUFF':
      case 'SYMPATHY':
        return 'border-violet-500/50 hover:border-violet-400 shadow-violet-950/40';
      default:
        return 'border-slate-700 shadow-slate-900/40';
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto select-none">
      {/* Top Header: Player Role & Energy */}
      <header className="flex flex-col gap-3 pt-2">
        {/* Quick Role Toggle Bar for easy dev/testing */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => handleSelectRole(1)}
            className={cn(
              "flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition",
              isEmpathy ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>P1: Empathy</span>
          </button>
          <button
            onClick={() => handleSelectRole(2)}
            className={cn(
              "flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition",
              !isEmpathy ? "bg-rose-600 text-white shadow-md shadow-rose-600/30" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>P2: Courage</span>
          </button>
        </div>

        {/* Current Player Status Card */}
        <div className={cn(
          "rounded-2xl border p-4 flex items-center justify-between backdrop-blur-md transition-colors",
          isEmpathy ? "bg-cyan-950/30 border-cyan-800/50" : "bg-rose-950/30 border-rose-800/50"
        )}>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full animate-ping",
                isEmpathy ? "bg-cyan-400" : "bg-rose-400"
              )} />
              <h2 className="text-base font-black tracking-wide text-slate-100">
                {playerState.name}
              </h2>
            </div>
            <p className={cn("text-xs font-medium mt-0.5", isEmpathy ? "text-cyan-400" : "text-rose-400")}>
              {isEmpathy ? "Support & Combo Amplification" : "Offense & Armor Breaker"}
            </p>
          </div>

          {/* Energy Crystals */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-inner">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-sm font-black text-amber-300">
              {playerState.energy}
              <span className="text-xs text-slate-400 font-normal">/{playerState.maxEnergy}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Center Zone: Played card notification / prompt */}
      <div className="my-auto py-4 text-center">
        {lastPlayedCardName ? (
          <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/50 px-4 py-2 rounded-2xl text-xs font-bold text-indigo-200 shadow-xl animate-bounce">
            <ArrowUpCircle className="w-4 h-4 text-indigo-400" />
            <span>Dilemparkan ke Desktop: {lastPlayedCardName}!</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <span>Pilih kartu lalu sentuh untuk mengirim ke desktop</span>
          </p>
        )}
      </div>

      {/* Bottom Zone: Hand of Cards & Action Bar */}
      <div className="flex flex-col gap-3 pb-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>TANGAN PEMAIN ({playerState.hand.length})</span>
          <span className="text-slate-400 font-mono text-[11px]">DEK: {playerState.drawPile.length} | DISCARD: {playerState.discardPile.length}</span>
        </div>

        {/* Hand Cards List */}
        <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {playerState.hand.map((card) => {
            const isSelected = selectedCardId === card.id;
            const canAfford = playerState.energy >= card.cost;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedCardId(isSelected ? null : card.id)}
                className={cn(
                  "relative rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between cursor-pointer",
                  getCardBorderColor(card.type),
                  isSelected 
                    ? "bg-slate-900 ring-2 ring-indigo-400 -translate-y-0.5 shadow-lg" 
                    : "bg-slate-900/80 hover:bg-slate-900",
                  !canAfford && "opacity-50 grayscale-40"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-inner">
                      {getCardIcon(card.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        {card.name}
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {card.type}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{card.description}</p>
                    </div>
                  </div>

                  {/* Cost Badge */}
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-xs flex items-center justify-center shadow-inner shrink-0 ml-2">
                    {card.cost}
                  </div>
                </div>

                {/* Selected Action CTA */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Target: {card.targetType}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayCard(card);
                      }}
                      disabled={!canAfford}
                      className={cn(
                        "px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition",
                        canAfford 
                          ? "bg-linear-to-r from-rose-500 to-indigo-600 text-white hover:opacity-90 active:scale-95" 
                          : "bg-slate-800 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Mainkan ({card.cost} Energy)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {playerState.hand.length === 0 && (
            <div className="text-center py-8 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
              Kartu di tangan habis. Tunggu giliran berikutnya!
            </div>
          )}
        </div>

        {/* End Turn Button */}
        <button
          onClick={() => {
            // Restore energy and draw starter hand for next turn preview
            setPlayerState(prev => ({
              ...prev,
              energy: prev.maxEnergy,
              hand: (activePlayerId === 1 ? INITIAL_PLAYER_1.hand : INITIAL_PLAYER_2.hand),
            }));
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate(30);
            }
          }}
          className="w-full mt-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Akhiri Giliran (End Turn)</span>
        </button>
      </div>
    </div>
  );
};
