import React, { useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { PlayerId, Card, PlayerState } from '../types/game';
import { INITIAL_PLAYER_1, INITIAL_PLAYER_2 } from '../data/initialGameData';
import { 
  EmpathyRuneSVG, 
  CourageBladeSVG 
} from '../components/svg/DungeonArt';
import { GlossaryModal } from '../components/GlossaryModal';
import { ControllerHandView } from '../components/controller/ControllerHandView';
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
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isWaitingPartner, setIsWaitingPartner] = useState<boolean>(false);
  const [lastLaunchedNotice, setLastLaunchedNotice] = useState<string | null>(null);

  // WebRTC Controller Hub Hook
  const hub = useControllerHub({
    targetRoom: roomParam,
    desiredPlayer: activePlayerId,
    playerName: activePlayerId === 1 ? 'Empathy Pillar' : 'Courage Blade',
    onHandSync: (syncPayload) => {
      setIsWaitingPartner(false);
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
    setIsWaitingPartner(false);
  };

  const handlePlayCard = (card: Card) => {
    // Send via WebRTC DataChannel to Host Arena
    hub.dispatchPlayCard(card.id, 'enemy');

    // Optimistically update local hand & energy
    setPlayerState((prev) => ({
      ...prev,
      energy: Math.max(0, prev.energy - card.cost),
      hand: prev.hand.filter((c) => c.id !== card.id),
      discardPile: [...prev.discardPile, card],
    }));

    setLastLaunchedNotice(`Melempar ${card.name} ke laptop!`);
    setTimeout(() => {
      setLastLaunchedNotice(null), 2500;
    }, 2500);
  };

  const handleEndTurn = () => {
    hub.dispatchEndTurn();
    setIsWaitingPartner(true);

    // Optimistic replenish if disconnected/testing
    if (!hub.isConnected) {
      setTimeout(() => {
        setIsWaitingPartner(false);
        setPlayerState((prev) => ({
          ...prev,
          energy: prev.maxEnergy,
          hand: activePlayerId === 1 ? INITIAL_PLAYER_1.hand : INITIAL_PLAYER_2.hand,
        }));
      }, 1000);
    }
  };

  const isEmpathy = activePlayerId === 1;

  return (
    <div className="min-h-screen w-full bg-[#0a0b0e] text-stone-200 flex flex-col justify-between p-3.5 max-w-md mx-auto select-none font-sans overflow-hidden">
      {/* Top Header: Role Selector & Connectivity Bar */}
      <header className="flex flex-col gap-2 pt-1 z-20">
        {/* Connection Status Bar */}
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
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
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
      </header>

      {/* Floating Card Launch Feedback Notice */}
      {lastLaunchedNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/80 text-amber-200 text-xs font-mono font-bold animate-bounce shadow-xl">
          🚀 {lastLaunchedNotice}
        </div>
      )}

      {/* Interactive Mobile Card Interface with Curved Card Fan & Swipe Gestures */}
      <ControllerHandView
        playerState={playerState}
        playerId={activePlayerId}
        teamHp={hub.latestHandSync?.teamHp ?? 30}
        maxTeamHp={hub.latestHandSync?.maxTeamHp ?? 30}
        turnPhase={hub.latestHandSync?.turnPhase ?? 'PLAYER_TURN'}
        isWaitingPartner={isWaitingPartner}
        onPlayCard={handlePlayCard}
        onEndTurn={handleEndTurn}
      />

      {/* Modal Glosarium & Panduan Labirin */}
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
};
