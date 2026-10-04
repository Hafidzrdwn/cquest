import React, { useState } from 'react';
import { BookOpen, RefreshCw, Send } from 'lucide-react';
import { PlayerId, Card, PlayerState } from '../types/game';
import { INITIAL_PLAYER_1, INITIAL_PLAYER_2 } from '../data/initialGameData';
import { 
  EmpathyRuneSVG, 
  CourageBladeSVG, 
  EnergyOrbSVG, 
  IronShieldSVG 
} from '../components/svg/DungeonArt';
import { GlossaryModal } from '../components/GlossaryModal';
import { useControllerHub } from '../hooks/useControllerHub';
import { cn } from '../lib/utils';

export const ControllerView: React.FC = () => {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const roomParam = (searchParams.get('room') || 'LOVE').toUpperCase().slice(0, 6);
  const paramPlayer = searchParams.get('player');
  const initialPlayerId: PlayerId = paramPlayer === '2' ? 2 : 1;

  const [activePlayerId, setActivePlayerId] = useState<PlayerId>(initialPlayerId);
  const [playerState, setPlayerState] = useState<PlayerState>(
    activePlayerId === 1 ? INITIAL_PLAYER_1 : INITIAL_PLAYER_2
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [lastPlayedCardName, setLastPlayedCardName] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  // WebRTC Controller Hub Hook
  const hub = useControllerHub({
    targetRoom: roomParam,
    desiredPlayer: activePlayerId,
    playerName: activePlayerId === 1 ? 'Empathy' : 'Courage',
    onHandSync: (syncPayload) => {
      setPlayerState((prev) => ({
        ...prev,
        energy: syncPayload.energy,
        maxEnergy: syncPayload.maxEnergy,
        hand: syncPayload.hand.map((h) => ({
          id: h.id,
          name: h.title,
          cost: h.cost,
          type: h.type,
          description: h.description,
          icon: h.icon,
          value: h.value,
          targetType: h.targetType,
          roleOwner: activePlayerId === 1 ? 'EMPATHY' : 'COURAGE',
        })),
      }));
    },
  });

  const handleSelectRole = (id: PlayerId) => {
    setActivePlayerId(id);
    hub.setAssignedPlayer(id);
    setPlayerState(id === 1 ? INITIAL_PLAYER_1 : INITIAL_PLAYER_2);
    setSelectedCardId(null);
  };

  const handlePlayCard = (card: Card) => {
    if (playerState.energy < card.cost) {
      alert('Energy jiwamu belum cukup untuk memainkan kartu ini!');
      return;
    }

    // Dispatch via WebRTC DataChannel to Host Arena
    const sent = hub.dispatchPlayCard(card.id, 'enemy');

    // Optimistically update local hand & energy
    setPlayerState((prev) => ({
      ...prev,
      energy: Math.max(0, prev.energy - card.cost),
      hand: prev.hand.filter((c) => c.id !== card.id),
      discardPile: [...prev.discardPile, card],
    }));

    setLastPlayedCardName(card.name);
    setSelectedCardId(null);

    setTimeout(() => {
      setLastPlayedCardName(null);
    }, 2500);

    if (!sent && !hub.isConnected) {
      console.warn('Card played locally (offline mode / waiting host)');
    }
  };

  const handleEndTurn = () => {
    hub.dispatchEndTurn();

    // Optimistic replenish
    setPlayerState((prev) => ({
      ...prev,
      energy: prev.maxEnergy,
      hand: activePlayerId === 1 ? INITIAL_PLAYER_1.hand : INITIAL_PLAYER_2.hand,
    }));
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
      {/* Top Header: Role Selector & Connectivity Bar */}
      <header className="flex flex-col gap-2.5 pt-1">
        {/* Connection Status Pill */}
        <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#11131a] border border-[#1e2330]">
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              hub.isConnected ? "bg-emerald-400" : hub.isConnecting ? "bg-amber-400 animate-ping" : "bg-red-500"
            )} />
            <span className="text-stone-300">
              {hub.isConnected
                ? `Tersambung ke Room "${hub.roomCode}"`
                : hub.isConnecting
                ? `Menghubungkan ke Host (${hub.roomCode})...`
                : 'Terputus dari Host'}
            </span>
          </div>

          {!hub.isConnected && (
            <button
              onClick={hub.reconnect}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sambung Ulang</span>
            </button>
          )}
        </div>

        {/* Role Toggle Tab & Glossary Button */}
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 flex-1 rounded-lg bg-[#11131a] p-1 border border-[#1e2330] text-xs font-mono">
            <button
              onClick={() => handleSelectRole(1)}
              className={cn(
                "py-1.5 rounded flex items-center justify-center gap-1.5 transition cursor-pointer",
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
                "py-1.5 rounded flex items-center justify-center gap-1.5 transition cursor-pointer",
                !isEmpathy 
                  ? "bg-[#23171c] text-amber-400 border border-[#3b222b]" 
                  : "text-stone-400 hover:text-stone-300"
              )}
            >
              <CourageBladeSVG size={14} />
              <span>P2: Courage</span>
            </button>
          </div>

          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="h-9 px-2.5 rounded-lg bg-[#11131a] hover:bg-[#1a1f2c] border border-[#1e2330] text-amber-400 text-xs font-mono flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            title="Buka Glosarium & Panduan"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[11px]">Buku</span>
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
            {hub.isConnected
              ? 'Sentuh kartu di bawah untuk memilih, lalu lempar ke laptop!'
              : 'Menghubungkan ke layar laptop... Kamu tetap bisa mencoba kartu secara lokal.'}
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
                        "px-3.5 py-1 rounded text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5",
                        canAfford
                          ? "bg-amber-600 hover:bg-amber-500 text-stone-950 active:scale-95 shadow"
                          : "bg-[#181a24] text-stone-400 border border-[#252a38] cursor-not-allowed"
                      )}
                    >
                      <Send className="w-3 h-3" />
                      <span>Play Card ({card.cost} Energy)</span>
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
          onClick={handleEndTurn}
          className="w-full mt-1 py-2.5 rounded-lg bg-[#141722] hover:bg-[#1a1f2e] border border-[#242b3d] text-stone-300 font-mono text-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
        >
          <IronShieldSVG size={14} className="text-stone-400" />
          <span>End Turn (Selesaikan Giliran)</span>
        </button>
      </div>

      {/* Modal Glosarium & Panduan Labirin */}
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
};
