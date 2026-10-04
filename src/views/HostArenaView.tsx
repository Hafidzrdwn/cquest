import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ChevronRight, BookOpen, Wifi } from 'lucide-react';
import { BattleState, PlayCardPayload, EndTurnPayload } from '../types/game';
import { INITIAL_BATTLE_STATE, PLAYER_1_STARTER_DECK, PLAYER_2_STARTER_DECK } from '../data/initialGameData';
import { 
  OverthinkingPhantomSVG, 
  EmpathyRuneSVG, 
  CourageBladeSVG, 
  IronShieldSVG,
  CoupleQuestLogoSVG
} from '../components/svg/DungeonArt';
import { GlossaryModal } from '../components/GlossaryModal';
import { useHostGameHub } from '../hooks/useHostGameHub';
import { cn } from '../lib/utils';

export const HostArenaView: React.FC = () => {
  // Extract ?room=CODE from URL or default to "LOVE"
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialRoom = (searchParams.get('room') || 'LOVE').toUpperCase().slice(0, 6);

  const [roomCode] = useState<string>(initialRoom);
  const [battleState, setBattleState] = useState<BattleState>(INITIAL_BATTLE_STATE);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [lastEventNotice, setLastEventNotice] = useState<string | null>(null);
  const [comboBanner, setComboBanner] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const p1ControllerUrl = `${baseUrl}/controller?room=${roomCode}&player=1`;
  const p2ControllerUrl = `${baseUrl}/controller?room=${roomCode}&player=2`;

  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const battleStateRef = useRef(battleState);
  useEffect(() => {
    battleStateRef.current = battleState;
  }, [battleState]);

  // Handler when a mobile controller plays a card
  const handleRemotePlayCard = useCallback((payload: PlayCardPayload) => {
    const current = battleStateRef.current;
    const player = current.players[payload.player];
    if (!player) return;

    // Find card from hand
    const card = player.hand.find((c) => c.id === payload.cardId);
    if (!card || player.energy < card.cost) return;

    // Check Sympathy Link combo (P1 played SYMPATHY/BUFF and now P2 plays ATTACK)
    const lastPlayed = current.playedCardsThisTurn[current.playedCardsThisTurn.length - 1];
    const isCombo =
      lastPlayed &&
      lastPlayed.playerId === 1 &&
      (lastPlayed.card.type === 'SYMPATHY' || lastPlayed.card.type === 'BUFF') &&
      payload.player === 2 &&
      card.type === 'ATTACK';

    const multiplier = isCombo ? 1.5 : 1.0;
    const calculatedValue = Math.round(card.value * multiplier);

    // Apply effects
    let updatedEnemies = [...current.enemies];
    let updatedSynergy = current.teamSynergyScore;
    let effectNotice = '';

    if (card.type === 'ATTACK') {
      const targetEnemy = { ...updatedEnemies[0] };
      const damage = calculatedValue;
      if (targetEnemy.shield >= damage) {
        targetEnemy.shield -= damage;
      } else {
        const remainingDmg = damage - targetEnemy.shield;
        targetEnemy.shield = 0;
        targetEnemy.currentHp = Math.max(0, targetEnemy.currentHp - remainingDmg);
      }
      updatedEnemies[0] = targetEnemy;
      effectNotice = `P${payload.player} memainkan ${card.name} (${damage} DMG)!`;
      updatedSynergy = Math.min(100, updatedSynergy + (isCombo ? 15 : 4));
    } else if (card.type === 'SHIELD') {
      effectNotice = `P${payload.player} memasang ${card.name} (+${card.value} Shield)!`;
      updatedSynergy = Math.min(100, updatedSynergy + 3);
    } else if (card.type === 'HEAL') {
      effectNotice = `P${payload.player} memulihkan tim (+${card.value} HP)!`;
      updatedSynergy = Math.min(100, updatedSynergy + 5);
    } else {
      effectNotice = `P${payload.player} memicu ${card.name}!`;
      updatedSynergy = Math.min(100, updatedSynergy + 6);
    }

    if (isCombo) {
      setComboBanner('PERFECT HARMONY COMBO! +50% BONUS!');
      setTimeout(() => setComboBanner(null), 3000);
    }

    // Update Player State (deduct energy & move card to discard)
    const updatedPlayer = {
      ...player,
      energy: Math.max(0, player.energy - card.cost),
      hand: player.hand.filter((c) => c.id !== card.id),
      discardPile: [...player.discardPile, card],
    };

    const nextState: BattleState = {
      ...current,
      teamSynergyScore: updatedSynergy,
      enemies: updatedEnemies,
      players: {
        ...current.players,
        [payload.player]: updatedPlayer,
      },
      playedCardsThisTurn: [
        ...current.playedCardsThisTurn,
        {
          playerId: payload.player,
          card,
          timestamp: payload.timestamp,
          isComboTrigger: isCombo,
        },
      ],
    };

    setBattleState(nextState);
    setLastEventNotice(effectNotice);
    setTimeout(() => setLastEventNotice(null), 3500);

    // Sync back immediately
    hostHub.syncPlayerHands(nextState.players, nextState.phase, nextState.teamSynergyScore);
    hostHub.sendHapticFeedback(payload.player, isCombo ? 'COMBO' : 'IMPACT');
  }, []);

  // Handler when a controller ends turn
  const handleRemoteEndTurn = useCallback((payload: EndTurnPayload) => {
    const current = battleStateRef.current;
    console.log(`[HostArena] End turn requested by P${payload.player}`);

    // Replenish energy & draw cards for new round
    const nextPlayers = {
      1: {
        ...current.players[1],
        energy: current.players[1].maxEnergy,
        hand: PLAYER_1_STARTER_DECK.slice(0, 4),
      },
      2: {
        ...current.players[2],
        energy: current.players[2].maxEnergy,
        hand: PLAYER_2_STARTER_DECK.slice(0, 4),
      },
    };

    const nextState: BattleState = {
      ...current,
      turnCount: current.turnCount + 1,
      playedCardsThisTurn: [],
      players: nextPlayers,
    };

    setBattleState(nextState);
    setLastEventNotice(`Putaran ${nextState.turnCount} dimulai! Energy terisi kembali.`);
    setTimeout(() => setLastEventNotice(null), 3000);

    hostHub.syncPlayerHands(nextPlayers, nextState.phase, nextState.teamSynergyScore);
    hostHub.sendHapticFeedback('BOTH', 'SHIELD');
  }, []);

  // WebRTC Host Game Hub Hook
  const hostHub = useHostGameHub({
    roomId: roomCode,
    onPlayCard: handleRemotePlayCard,
    onEndTurn: handleRemoteEndTurn,
    onPlayerConnected: (player) => {
      setBattleState((prev) => ({
        ...prev,
        players: {
          ...prev.players,
          [player]: {
            ...prev.players[player],
            isConnected: true,
          },
        },
      }));
      setLastEventNotice(`Player ${player} terhubung ke arena!`);
      setTimeout(() => setLastEventNotice(null), 3000);
    },
    onPlayerDisconnected: (player) => {
      setBattleState((prev) => ({
        ...prev,
        players: {
          ...prev.players,
          [player]: {
            ...prev.players[player],
            isConnected: false,
          },
        },
      }));
    },
  });

  // Sync hand whenever players connect or ready
  useEffect(() => {
    if (hostHub.isReady && (hostHub.p1Connected || hostHub.p2Connected)) {
      hostHub.syncPlayerHands(battleState.players, battleState.phase, battleState.teamSynergyScore);
    }
  }, [hostHub.isReady, hostHub.p1Connected, hostHub.p2Connected]);

  const currentEnemy = battleState.enemies[0];

  const getPhaseDisplay = (phase: BattleState['phase']) => {
    switch (phase) {
      case 'LOBBY':
        return 'LOBBY (Ruang Santai)';
      case 'PLAYER_TURN':
        return 'PLAYER TURN (Giliran Pasangan)';
      case 'RESOLUTION':
        return 'COMBO RESOLUTION';
      case 'ENEMY_TURN':
        return 'ENEMY TURN (Monster Serang)';
      case 'VICTORY':
        return 'VICTORY! (Menang Bersama)';
      case 'DEFEAT':
        return 'DEFEAT (Coba Lagi Bareng)';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0b0e] text-stone-200 flex flex-col justify-between selection:bg-amber-900 selection:text-amber-100">
      {/* Background Dungeon Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13151f] via-[#0a0b0e] to-[#050608]" />

      {/* Header: Game Title & Couple Synergy */}
      <header className="border-b border-[#1c1f2b] bg-[#0d0f15]/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#161822] border border-[#282d3d] flex items-center justify-center">
            <CoupleQuestLogoSVG size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-stone-100 uppercase">
                Couple Quest
              </h1>
              <span className="px-2 py-0.5 rounded bg-[#181d2a] border border-[#2a3348] text-[10px] font-mono text-amber-400 font-bold">
                ROOM: {hostHub.roomCode}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono tracking-tight">The Heart Dungeon &bull; Co-op Roguelite</p>
          </div>
        </div>

        {/* Turn Phase & Couple Synergy Score */}
        <div className="flex items-center gap-4">
          {/* Phase Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#13151e] border border-[#222736] text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-stone-400 font-mono text-[11px]">PHASE:</span>
            <span className="text-stone-200 font-semibold tracking-wide font-mono text-[11px]">{getPhaseDisplay(battleState.phase)}</span>
          </div>

          {/* Couple Synergy Meter */}
          <div className="flex items-center gap-3 bg-[#13151e] border border-[#222736] rounded-md px-3.5 py-1.5">
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 gap-4">
                <span>COUPLE SYNERGY</span>
                <span className="text-amber-300 font-bold">{battleState.teamSynergyScore}%</span>
              </div>
              <div className="w-32 h-1.5 bg-[#090a0e] rounded-full overflow-hidden mt-1 border border-[#1b1e2a]">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${battleState.teamSynergyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tombol Glosarium / Panduan Labirin */}
          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161a26] hover:bg-[#202738] border border-[#262f44] text-xs text-amber-300 font-mono transition cursor-pointer"
            title="Buka Buku Panduan & Glosarium"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Panduan Labirin</span>
          </button>
        </div>
      </header>

      {/* Main Chamber: Monster Encounter & Stage Altar */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 flex flex-col justify-between gap-6">
        {/* Stage & Turn Indicator */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono border-b border-[#181b26] pb-3">
          <div>DUNGEON STAGE {battleState.stageLevel} &bull; TURN {battleState.turnCount}</div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              hostHub.isReady ? "bg-emerald-400" : "bg-amber-400 animate-ping"
            )} />
            <span>{hostHub.isReady ? `WebRTC Ready (${hostHub.hostPeerId})` : 'Inisialisasi WebRTC...'}</span>
          </div>
        </div>

        {/* Dynamic Combo Banner */}
        {comboBanner && (
          <div className="w-full max-w-md mx-auto py-2 px-4 rounded-xl bg-gradient-to-r from-amber-600/40 via-rose-600/40 to-teal-600/40 border border-amber-400/80 text-center text-amber-200 text-xs font-bold font-mono tracking-wider animate-bounce shadow-xl">
            ✨ {comboBanner} ✨
          </div>
        )}

        {/* Live Card Play Notice */}
        {lastEventNotice && !comboBanner && (
          <div className="w-full max-w-md mx-auto py-1.5 px-4 rounded-lg bg-[#141824] border border-[#2b354d] text-center text-stone-200 text-xs font-mono shadow">
            {lastEventNotice}
          </div>
        )}

        {/* Center Stage: Monster Altar */}
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-lg bg-[#0e1017] border border-[#1e2230] rounded-xl p-6 flex flex-col items-center shadow-xl">
            {/* Enemy Intent Banner */}
            <div className="absolute -top-3.5 px-3 py-1 bg-[#181b25] border border-[#2f354a] rounded-md text-[11px] font-mono text-amber-200 flex items-center gap-2 shadow">
              <span className="text-amber-400 font-bold">&#9876;</span>
              <span>{currentEnemy.intent.description}</span>
            </div>

            {/* Monster Artwork SVG */}
            <div className="my-2 p-2">
              <OverthinkingPhantomSVG size={140} />
            </div>

            {/* Monster Name & Shield */}
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-base font-semibold text-stone-100 tracking-wide font-heading">{currentEnemy.name}</h2>
              {currentEnemy.shield > 0 && (
                <div className="flex items-center gap-1 text-xs text-sky-300 bg-sky-950/40 border border-sky-800/60 px-2 py-0.5 rounded font-mono">
                  <IronShieldSVG size={12} className="text-sky-400" />
                  <span>{currentEnemy.shield} Shield</span>
                </div>
              )}
            </div>

            {/* Monster Health Bar */}
            <div className="w-full max-w-xs mt-3">
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                <span>HP</span>
                <span>{currentEnemy.currentHp} / {currentEnemy.maxHp}</span>
              </div>
              <div className="w-full h-2.5 bg-[#08090d] rounded-sm overflow-hidden p-[1px] border border-[#202534]">
                <div 
                  className="h-full bg-red-700 rounded-xs transition-all duration-300"
                  style={{ width: `${(currentEnemy.currentHp / currentEnemy.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dual Player Pedestals: Player 1 & Player 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          {/* Player 1: Empathy Pillar */}
          <div className="bg-[#0d1115] border border-[#1b2529] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#162125]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#131b1f] border border-[#23353b] flex items-center justify-center text-teal-400">
                    <EmpathyRuneSVG size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-stone-200 tracking-wide">Player 1: Empathy Pillar</h3>
                    <p className="text-[10px] text-teal-400/80 font-mono">Support, Shield & Heal</p>
                  </div>
                </div>

                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1",
                  hostHub.p1Connected
                    ? "bg-teal-950/40 border-teal-800/80 text-teal-300"
                    : "bg-[#11131a] border-[#222736] text-stone-400"
                )}>
                  <Wifi className="w-3 h-3" />
                  {hostHub.p1Connected ? 'HP Terhubung!' : 'Menunggu Controller'}
                </span>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
                <div className="bg-[#090c0f] border border-[#161e22] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">HP</span>
                  <span className="text-stone-200 font-bold">{battleState.players[1].currentHp}/{battleState.players[1].maxHp}</span>
                </div>
                <div className="bg-[#090c0f] border border-[#161e22] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">ENERGY</span>
                  <span className="text-teal-300 font-bold">{battleState.players[1].energy}/{battleState.players[1].maxEnergy}</span>
                </div>
              </div>
            </div>

            {/* QR Connection Box */}
            <div className="mt-3 pt-3 border-t border-[#162125] flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow shrink-0">
                <QRCodeSVG value={p1ControllerUrl} size={64} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-300 font-medium">Scan QR ini dengan kamera HP Player 1</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    onClick={() => copyToClipboard(p1ControllerUrl, 'p1')}
                    className="text-[10px] font-mono bg-[#131b1f] hover:bg-[#1b262c] text-stone-300 px-2 py-1 rounded border border-[#23353b] flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedLink === 'p1' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'p1' ? 'Tersalin!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={`/controller?room=${roomCode}&player=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-teal-400/90 hover:underline flex items-center gap-0.5"
                  >
                    <span>Buka Tab</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Player 2: Courage Blade */}
          <div className="bg-[#120f12] border border-[#2a1d22] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#23171c]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#1a1317] border border-[#3b222b] flex items-center justify-center text-amber-500">
                    <CourageBladeSVG size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-stone-200 tracking-wide">Player 2: Courage Blade</h3>
                    <p className="text-[10px] text-amber-500/80 font-mono">Offense, Strike & Armor Break</p>
                  </div>
                </div>

                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1",
                  hostHub.p2Connected
                    ? "bg-amber-950/40 border-amber-800/80 text-amber-300"
                    : "bg-[#11131a] border-[#222736] text-stone-400"
                )}>
                  <Wifi className="w-3 h-3" />
                  {hostHub.p2Connected ? 'HP Terhubung!' : 'Menunggu Controller'}
                </span>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
                <div className="bg-[#0d0a0c] border border-[#201419] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">HP</span>
                  <span className="text-stone-200 font-bold">{battleState.players[2].currentHp}/{battleState.players[2].maxHp}</span>
                </div>
                <div className="bg-[#0d0a0c] border border-[#201419] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">ENERGY</span>
                  <span className="text-amber-400 font-bold">{battleState.players[2].energy}/{battleState.players[2].maxEnergy}</span>
                </div>
              </div>
            </div>

            {/* QR Connection Box */}
            <div className="mt-3 pt-3 border-t border-[#23171c] flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow shrink-0">
                <QRCodeSVG value={p2ControllerUrl} size={64} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-300 font-medium">Scan QR ini dengan kamera HP Player 2</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    onClick={() => copyToClipboard(p2ControllerUrl, 'p2')}
                    className="text-[10px] font-mono bg-[#1c1318] hover:bg-[#271b22] text-stone-300 px-2 py-1 rounded border border-[#3b222b] flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedLink === 'p2' ? <Check className="w-3 h-3 text-amber-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'p2' ? 'Tersalin!' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={`/controller?room=${roomCode}&player=2`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-amber-400/90 hover:underline flex items-center gap-0.5"
                  >
                    <span>Buka Tab</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="border-t border-[#181a24] bg-[#090a0e] px-6 py-3 flex items-center justify-between text-xs text-stone-400 font-mono">
        <div>Buka 2 browser di HP kalian masing-masing untuk bermain bersama pasangan.</div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const nextPhase = battleState.phase === 'LOBBY' ? 'PLAYER_TURN' : 'LOBBY';
              setBattleState((prev) => ({ ...prev, phase: nextPhase }));
              hostHub.syncPlayerHands(battleState.players, nextPhase, battleState.teamSynergyScore);
            }}
            className="bg-[#1b202c] hover:bg-[#252c3d] text-stone-200 border border-[#2f374a] text-xs px-3.5 py-1.5 rounded transition font-mono cursor-pointer"
          >
            {battleState.phase === 'LOBBY' ? 'Mulai Turn Pertarungan' : 'Kembali ke Lobby'}
          </button>
        </div>
      </footer>

      {/* Modal Glosarium & Panduan Labirin */}
      <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
};
