import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, PlayerId, PlayerState } from '../../types/game';
import { 
  EmpathyRuneSVG, 
  CourageBladeSVG, 
  EnergyOrbSVG, 
  IronShieldSVG 
} from '../svg/DungeonArt';
import { cn } from '../../lib/utils';

interface ControllerHandViewProps {
  playerState: PlayerState;
  playerId: PlayerId;
  teamHp?: number;
  maxTeamHp?: number;
  turnPhase?: string;
  isWaitingPartner?: boolean;
  onPlayCard: (card: Card) => void;
  onEndTurn: () => void;
}

export const ControllerHandView: React.FC<ControllerHandViewProps> = ({
  playerState,
  playerId,
  teamHp = 30,
  maxTeamHp = 30,
  turnPhase = 'PLAYER_TURN',
  isWaitingPartner = false,
  onPlayCard,
  onEndTurn,
}) => {
  const isEmpathy = playerId === 1;

  // Active Drag State for touch/mouse swipe
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [launchingCardId, setLaunchingCardId] = useState<string | null>(null);
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [insufficientEnergyWarn, setInsufficientEnergyWarn] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number } | null>(null);
  const isDraggingRef = useRef(false);

  // Clear dragging state on window blur or unmount
  useEffect(() => {
    const handleGlobalEnd = () => {
      if (isDraggingRef.current) {
        setDraggingCardId(null);
        setDragOffset({ x: 0, y: 0 });
        isDraggingRef.current = false;
        dragStartRef.current = null;
      }
    };
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, []);

  // Trigger shake and haptic when energy is insufficient
  const triggerInsufficientEnergy = useCallback((cardId: string) => {
    setShakingCardId(cardId);
    setInsufficientEnergyWarn(true);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(50);
      } catch {
        // Ignore devices with disabled vibration
      }
    }

    setTimeout(() => {
      setShakingCardId(null);
    }, 450);

    setTimeout(() => {
      setInsufficientEnergyWarn(false);
    }, 1800);
  }, []);

  // Launch and play card
  const executePlayCard = useCallback((card: Card) => {
    setLaunchingCardId(card.id);
    setSelectedCardId(null);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      onPlayCard(card);
      setLaunchingCardId(null);
      setDraggingCardId(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  }, [onPlayCard]);

  // Touch handlers
  const handleTouchStart = (card: Card, clientX: number, clientY: number) => {
    if (launchingCardId) return;
    dragStartRef.current = { startX: clientX, startY: clientY };
    isDraggingRef.current = true;
    setDraggingCardId(card.id);
    setSelectedCardId(card.id);
  };

  const handleTouchMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const deltaX = clientX - dragStartRef.current.startX;
    const deltaY = clientY - dragStartRef.current.startY;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = (card: Card) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    dragStartRef.current = null;

    // Swipe up threshold: dragged up more than 120px
    if (dragOffset.y < -120) {
      if (playerState.energy >= card.cost) {
        executePlayCard(card);
      } else {
        triggerInsufficientEnergy(card.id);
        setDragOffset({ x: 0, y: 0 });
        setDraggingCardId(null);
      }
    } else {
      // Snap back if released below threshold
      setDragOffset({ x: 0, y: 0 });
      setDraggingCardId(null);
    }
  };

  // Helper to get card type badge
  const getCardTypeBadge = (type: Card['type']) => {
    switch (type) {
      case 'ATTACK':
        return <span className="text-[9px] font-mono font-bold text-red-300 bg-red-950/70 border border-red-800/80 px-1.5 py-0.5 rounded">ATTACK</span>;
      case 'SHIELD':
        return <span className="text-[9px] font-mono font-bold text-teal-300 bg-teal-950/70 border border-teal-800/80 px-1.5 py-0.5 rounded">SHIELD</span>;
      case 'HEAL':
        return <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded">HEAL</span>;
      case 'BUFF':
      case 'SYMPATHY':
        return <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-1.5 py-0.5 rounded">SYMPATHY</span>;
    }
  };

  const handCount = playerState.hand.length;

  return (
    <div className="w-full flex-1 flex flex-col justify-between select-none relative overflow-hidden">
      {/* 1. TOP BAR: Player Role, Current HP & Team Shared Energy */}
      <div className={cn(
        "rounded-2xl border p-3.5 backdrop-blur-md transition-all shadow-lg",
        isEmpathy 
          ? "bg-[#0c1218]/90 border-teal-900/60 shadow-teal-950/30" 
          : "bg-[#140e12]/90 border-rose-950/80 shadow-rose-950/30"
      )}>
        {/* Role & Vitality Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-800/60">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border",
              isEmpathy ? "bg-[#142024] border-teal-700/60 text-teal-300" : "bg-[#241318] border-rose-800/60 text-rose-300"
            )}>
              {isEmpathy ? <EmpathyRuneSVG size={18} /> : <CourageBladeSVG size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full animate-ping",
                  isEmpathy ? "bg-teal-400" : "bg-rose-400"
                )} />
                <h3 className="text-xs font-bold font-heading tracking-wide text-stone-100">
                  {playerState.name}
                </h3>
              </div>
              <p className={cn("text-[10px] font-mono", isEmpathy ? "text-teal-400/80" : "text-rose-400/80")}>
                {isEmpathy ? "Pilar Empati • Support & Shield" : "Pedang Keberanian • Strike & Break"}
              </p>
            </div>
          </div>

          {/* Phase Badge */}
          <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10121a] border border-[#232736] text-stone-300">
            {turnPhase === 'PLAYER_TURN' ? 'GILIRANMU' : 'MONSTER'}
          </div>
        </div>

        {/* HP Bar & Shared Energy Counter [● ● ●] / 3 */}
        <div className="grid grid-cols-2 gap-3 mt-2.5">
          {/* Health Bar */}
          <div className="bg-[#090b10] border border-stone-800/80 rounded-xl p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mb-1">
              <span>HP TIM</span>
              <span className="text-stone-200 font-bold">{teamHp} / {maxTeamHp}</span>
            </div>
            <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
              <div 
                className="h-full bg-red-700 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (teamHp / maxTeamHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Shared Energy Counter [● ● ●] / 3 */}
          <div className="bg-[#090b10] border border-stone-800/80 rounded-xl p-2 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 mb-1">
              <span>SHARED ENERGY</span>
              <span className="text-amber-300 font-bold font-mono">
                {playerState.energy}/{playerState.maxEnergy}
              </span>
            </div>
            {/* Visual Orbs: [● ● ●] */}
            <div className="flex items-center gap-1.5 py-0.5">
              {Array.from({ length: playerState.maxEnergy }).map((_, i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <EnergyOrbSVG 
                    size={16} 
                    className={cn(
                      "transition-all duration-200",
                      i < playerState.energy 
                        ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" 
                        : "text-stone-800 fill-stone-900"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SWIPE-UP LAUNCH ZONE / HUD NOTICES */}
      <div className="my-auto py-3 flex flex-col items-center justify-center min-h-[56px] text-center pointer-events-none">
        {insufficientEnergyWarn ? (
          <div className="px-3.5 py-1.5 rounded-lg bg-red-950/90 border border-red-500/80 text-red-200 text-xs font-mono font-bold animate-bounce shadow-lg">
            ⚠️ Energi Jiwa tidak cukup untuk kartu ini!
          </div>
        ) : draggingCardId ? (
          <div className="flex flex-col items-center gap-1 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-xs">
              &uarr;
            </div>
            <span className="text-[11px] font-mono text-amber-300 font-semibold tracking-wide">
              {dragOffset.y < -120 ? 'Lepaskan untuk melempar ke laptop!' : 'Geser terus ke atas (> 120px)'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
            <span>&uarr;</span>
            <span>Tarik kartu ke atas untuk melemparkannya ke arena laptop</span>
          </div>
        )}
      </div>

      {/* 3. CENTER / BOTTOM: CARD FAN LAYOUT */}
      <div className="relative w-full pb-3 flex flex-col items-center">
        {/* Hand Cards Fan Stage */}
        <div className="relative w-full h-72 flex items-center justify-center">
          {playerState.hand.map((card, idx) => {
            const isDragging = draggingCardId === card.id;
            const isLaunching = launchingCardId === card.id;
            const isShaking = shakingCardId === card.id;
            const isSelected = selectedCardId === card.id;
            const canAfford = playerState.energy >= card.cost;

            // Curved fan angles & offsets
            const normalizedIndex = idx - (handCount - 1) / 2;
            const baseRotation = normalizedIndex * 7; // -14deg to +14deg
            const baseOffsetY = Math.abs(normalizedIndex) * 8; // arc curve
            const baseOffsetX = normalizedIndex * 36; // horizontal spread

            // Calculate active transformation
            let transformStyle = `translate3d(${baseOffsetX}px, ${baseOffsetY}px, 0) rotate(${baseRotation}deg)`;
            let zIndex = 10 + idx;

            if (isDragging) {
              transformStyle = `translate3d(${baseOffsetX + dragOffset.x}px, ${baseOffsetY + dragOffset.y}px, 0) rotate(${baseRotation + dragOffset.x * 0.05}deg) scale(1.08)`;
              zIndex = 50;
            } else if (isLaunching) {
              transformStyle = `translate3d(${baseOffsetX}px, -120vh, 0) scale(0.6) rotate(${baseRotation}deg)`;
              zIndex = 100;
            } else if (isSelected) {
              transformStyle = `translate3d(${baseOffsetX}px, ${baseOffsetY - 18}px, 0) rotate(0deg) scale(1.05)`;
              zIndex = 40;
            }

            return (
              <div
                key={card.id}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  handleTouchStart(card, touch.clientX, touch.clientY);
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  handleTouchMove(touch.clientX, touch.clientY);
                }}
                onTouchEnd={() => handleTouchEnd(card)}
                onMouseDown={(e) => handleTouchStart(card, e.clientX, e.clientY)}
                onMouseMove={(e) => handleTouchMove(e.clientX, e.clientY)}
                onMouseUp={() => handleTouchEnd(card)}
                className={cn(
                  "absolute w-44 h-64 rounded-2xl border p-3 flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-xl transition-transform duration-150 ease-out touch-none",
                  isDragging && "duration-0 shadow-2xl",
                  isLaunching && "transition-all duration-300 ease-in opacity-0",
                  isShaking && "animate-card-shake",
                  // Card frame theme
                  canAfford 
                    ? "bg-[#11131b] border-stone-700/80 hover:border-amber-500/60" 
                    : "bg-[#0e0f14] border-stone-800/80 opacity-60 grayscale-40",
                  isSelected && "border-amber-400 ring-2 ring-amber-500/40"
                )}
                style={{
                  transform: transformStyle,
                  zIndex,
                }}
              >
                {/* Card Top: Cost & Type */}
                <div className="flex items-center justify-between pointer-events-none">
                  {/* Energy Cost Rune */}
                  <div className="w-7 h-7 rounded-lg bg-[#191d2a] border border-[#2d354b] text-amber-300 font-mono font-bold text-xs flex items-center justify-center shadow-inner">
                    {card.cost}
                  </div>
                  {getCardTypeBadge(card.type)}
                </div>

                {/* Card Art & Name */}
                <div className="my-auto py-2 text-center pointer-events-none flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#181a24] border border-stone-800 flex items-center justify-center text-stone-200 mb-2 shadow-inner">
                    {card.type === 'ATTACK' && <CourageBladeSVG size={22} className="text-rose-400" />}
                    {card.type === 'SHIELD' && <IronShieldSVG size={22} className="text-teal-400" />}
                    {card.type === 'HEAL' && <EmpathyRuneSVG size={22} className="text-emerald-400" />}
                    {(card.type === 'BUFF' || card.type === 'SYMPATHY') && <EnergyOrbSVG size={22} className="text-amber-400" />}
                  </div>

                  <h4 className="font-bold text-xs font-heading text-stone-100 tracking-wide line-clamp-1">
                    {card.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 mt-1 leading-snug px-1 line-clamp-3">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer: Target & Value */}
                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono text-stone-400 pointer-events-none">
                  <span className="truncate max-w-[80px]">{card.targetType}</span>
                  <span className="font-bold text-amber-300">
                    {card.type === 'ATTACK' ? `${card.value} DMG` : card.type === 'SHIELD' ? `+${card.value} SHLD` : `+${card.value}`}
                  </span>
                </div>
              </div>
            );
          })}

          {handCount === 0 && (
            <div className="text-center py-10 px-6 rounded-2xl border border-dashed border-stone-800 text-stone-500 text-xs font-mono flex flex-col items-center gap-1.5">
              <span>Kartu di tanganmu sudah habis.</span>
              <span className="text-[11px] text-stone-600">Tekan End Turn untuk giliran berikutnya.</span>
            </div>
          )}
        </div>

        {/* 4. DEDICATED TACTILE END TURN BUTTON */}
        <div className="w-full mt-2 px-1">
          <button
            onClick={onEndTurn}
            disabled={isWaitingPartner}
            className={cn(
              "w-full py-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-98",
              isWaitingPartner
                ? "bg-[#181d2a] border-[#29334a] text-amber-300/80 cursor-wait animate-pulse"
                : "bg-[#161a25] hover:bg-[#202738] border-stone-700 text-stone-200 hover:text-white"
            )}
          >
            <IronShieldSVG size={16} className={isWaitingPartner ? "text-amber-400" : "text-stone-400"} />
            <span>
              {isWaitingPartner ? 'Menunggu Pasangan Selesai...' : 'Selesaikan Giliran (End Turn)'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
