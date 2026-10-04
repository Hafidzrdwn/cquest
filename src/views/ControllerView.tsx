import React, { useState } from 'react';
import { PlayerId, Card, PlayerState } from '../types/game';
import { INITIAL_PLAYER_1, INITIAL_PLAYER_2 } from '../data/initialGameData';
import { 
  EmpathyRuneSVG, 
  CourageBladeSVG, 
  EnergyOrbSVG, 
  IronShieldSVG 
} from '../components/svg/DungeonArt';
import { cn } from '../lib/utils';

export const ControllerView: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const paramPlayer = searchParams.get('player');
  const initialPlayerId: PlayerId = paramPlayer === '2' ? 2 : 1;

  const [activePlayerId, setActivePlayerId] = useState<PlayerId>(initialPlayerId);
  const [playerState, setPlayerState] = useState<PlayerState>(
    activePlayerId === 1 ? INITIAL_PLAYER_1 : INITIAL_PLAYER_2
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [lastPlayedCardName, setLastPlayedCardName] = useState<string | null>(null);

  const handleSelectRole = (id: PlayerId) => {
    setActivePlayerId(id);
    setPlayerState(id === 1 ? INITIAL_PLAYER_1 : INITIAL_PLAYER_2);
    setSelectedCardId(null);
  };

  const handlePlayCard = (card: Card) => {
    if (playerState.energy < card.cost) {
      alert('Energy jiwamu belum cukup untuk memainkan kartu ini!');
      return;
    }

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
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
    }, 2200);
  };

  const isEmpathy = activePlayerId === 1;

  const getCardTypeBadge = (type: Card['type']) => {
    switch (type) {
      case 'ATTACK':
        return <span className="text-[10px] font-mono text-red-300 bg-red-950/40 border border-red-900/60 px-1.5 py-0.5 rounded">ATTACK</span>;
      case 'SHIELD':
        return <span className="text-[10px] font-mono text-teal-300 bg-teal-950/40 border border-teal-900/60 px-1.5 py-0.5 rounded">SHIELD</span>;
      case 'HEAL':
        return <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded">HEAL</span>;
      case 'BUFF':
      case 'SYMPATHY':
        return <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-900/60 px-1.5 py-0.5 rounded">SYMPATHY</span>;
    }
  };

  const getTargetDescription = (target: Card['targetType']) => {
    switch (target) {
      case 'TEAM':
        return 'Target: Team (Kita Berdua)';
      case 'ENEMY':
        return 'Target: Monster';
      case 'ALLY':
        return 'Target: Partner';
      case 'SELF':
        return 'Target: Self';
      case 'ALL_ENEMIES':
        return 'Target: All Enemies';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0b0e] text-stone-200 flex flex-col justify-between p-4 max-w-md mx-auto select-none font-sans">
      {/* Top Header: Role Selector & Vitality */}
      <header className="flex flex-col gap-2.5 pt-1">
        {/* Role Toggle Tab (Mudah untuk testing/tukar role) */}
        <div className="grid grid-cols-2 rounded-lg bg-[#11131a] p-1 border border-[#1e2330] text-xs font-mono">
          <button
            onClick={() => handleSelectRole(1)}
            className={cn(
              "py-1.5 rounded flex items-center justify-center gap-1.5 transition",
              isEmpathy 
                ? "bg-[#162125] text-teal-300 border border-[#23353b]" 
                : "text-stone-400 hover:text-stone-300"
            )}
          >
            <EmpathyRuneSVG size={14} />
            <span>P1: Empathy</span>
          </button>
          <button
            onClick={() => handleSelectRole(2)}
            className={cn(
              "py-1.5 rounded flex items-center justify-center gap-1.5 transition",
              !isEmpathy 
                ? "bg-[#23171c] text-amber-400 border border-[#3b222b]" 
                : "text-stone-400 hover:text-stone-300"
            )}
          >
            <CourageBladeSVG size={14} />
            <span>P2: Courage</span>
          </button>
        </div>

        {/* Player Status Tablet */}
        <div className={cn(
          "rounded-xl border p-3.5 flex items-center justify-between transition-colors",
          isEmpathy ? "bg-[#0d1216] border-[#1c2930]" : "bg-[#140f12] border-[#2d1e24]"
        )}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-stone-100 font-heading">
                {playerState.name}
              </h2>
            </div>
            <p className={cn("text-[11px] font-mono mt-0.5", isEmpathy ? "text-teal-400/80" : "text-amber-500/80")}>
              {isEmpathy ? "Support, Shield & Heal" : "Offense, Strike & Armor Break"}
            </p>
          </div>

          {/* Energy Soul Orbs */}
          <div className="flex items-center gap-2 bg-[#090a0e] border border-[#1e2230] px-2.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1">
              {Array.from({ length: playerState.maxEnergy }).map((_, i) => (
                <EnergyOrbSVG 
                  key={i} 
                  size={14} 
                  className={i < playerState.energy ? "text-amber-400 fill-amber-400" : "text-stone-700"} 
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {playerState.energy}/{playerState.maxEnergy}
            </span>
          </div>
        </div>
      </header>

      {/* Center Zone: Notice of Dispatched Card */}
      <div className="my-auto py-3 text-center min-h-[44px] flex items-center justify-center">
        {lastPlayedCardName ? (
          <div className="inline-flex items-center gap-2 bg-[#141824] border border-[#2b334a] px-3.5 py-1.5 rounded-lg text-xs font-mono text-stone-200 shadow">
            <span className="text-amber-400">&#10003;</span>
            <span>Cast to Arena: {lastPlayedCardName}!</span>
          </div>
        ) : (
          <span className="text-[11px] font-mono text-stone-400">
            Sentuh kartu di bawah untuk memilih, lalu lempar ke laptop!
          </span>
        )}
      </div>

      {/* Bottom Zone: Hand Cards & End Turn */}
      <div className="flex flex-col gap-2.5 pb-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-1 border-b border-[#181b26] pb-1.5">
          <span>HAND ({playerState.hand.length})</span>
          <span>DECK: {playerState.drawPile.length} &bull; DISCARD: {playerState.discardPile.length}</span>
        </div>

        {/* Hand of Cards */}
        <div className="flex flex-col gap-2 max-h-[52vh] overflow-y-auto pr-0.5">
          {playerState.hand.map((card) => {
            const isSelected = selectedCardId === card.id;
            const canAfford = playerState.energy >= card.cost;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedCardId(isSelected ? null : card.id)}
                className={cn(
                  "relative rounded-xl border p-3 transition-all cursor-pointer flex flex-col justify-between",
                  isSelected
                    ? "bg-[#151824] border-amber-500/70 shadow-md -translate-y-0.5"
                    : "bg-[#0e1017] border-[#1e2230] hover:border-[#2e354a]",
                  !canAfford && "opacity-40"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-stone-100 tracking-wide truncate">
                        {card.name}
                      </h4>
                      {getCardTypeBadge(card.type)}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Energy Cost Coin */}
                  <div className="w-6 h-6 rounded-md bg-[#161924] border border-[#2b3145] text-amber-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                    {card.cost}
                  </div>
                </div>

                {/* Selected Card Action CTA */}
                {isSelected && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#1e2434] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">{getTargetDescription(card.targetType)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayCard(card);
                      }}
                      disabled={!canAfford}
                      className={cn(
                        "px-3.5 py-1 rounded text-xs font-mono font-semibold transition",
                        canAfford
                          ? "bg-amber-600 hover:bg-amber-500 text-stone-950 active:scale-95 shadow"
                          : "bg-[#181a24] text-stone-400 border border-[#252a38] cursor-not-allowed"
                      )}
                    >
                      Play Card ({card.cost} Energy)
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {playerState.hand.length === 0 && (
            <div className="text-center py-6 rounded-lg border border-dashed border-[#1e2230] text-stone-400 text-xs font-mono">
              Kartu di tanganmu sudah habis. Tunggu giliran berikutnya ya!
            </div>
          )}
        </div>

        {/* End Turn Button */}
        <button
          onClick={() => {
            setPlayerState(prev => ({
              ...prev,
              energy: prev.maxEnergy,
              hand: (activePlayerId === 1 ? INITIAL_PLAYER_1.hand : INITIAL_PLAYER_2.hand),
            }));
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate(30);
            }
          }}
          className="w-full mt-1 py-2.5 rounded-lg bg-[#141722] hover:bg-[#1a1f2e] border border-[#242b3d] text-stone-300 font-mono text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
        >
          <IronShieldSVG size={14} className="text-stone-400" />
          <span>End Turn (Selesaikan Giliran)</span>
        </button>
      </div>
    </div>
  );
};
