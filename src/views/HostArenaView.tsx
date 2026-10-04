import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Heart, 
  Shield, 
  Zap, 
  Swords, 
  Smartphone, 
  Sparkles, 
  Flame, 
  Wifi, 
  Copy, 
  Check, 
  Play, 
  Info,
  ChevronRight
} from 'lucide-react';
import { BattleState } from '../types/game';
import { INITIAL_BATTLE_STATE } from '../data/initialGameData';
import { cn } from '../lib/utils';

export const HostArenaView: React.FC = () => {
  const [battleState, setBattleState] = useState<BattleState>(INITIAL_BATTLE_STATE);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const p1ControllerUrl = `${baseUrl}/controller?player=1`;
  const p2ControllerUrl = `${baseUrl}/controller?player=2`;

  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const currentEnemy = battleState.enemies[0];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[24px_24px] opacity-25" />
      </div>

      {/* Top Navigation Bar & Couple Synergy Meter */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-rose-500 to-indigo-500 p-0.5 shadow-lg shadow-rose-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-cyan-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
              COUPLE QUEST
            </h1>
            <p className="text-xs font-medium text-slate-400">Emotional Roguelite • Host Battle Arena</p>
          </div>
        </div>

        {/* Turn Phase & Synergy Meter */}
        <div className="flex items-center gap-6">
          {/* Phase Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">Phase:</span>
            <span className="text-emerald-400 uppercase tracking-wider">{battleState.phase}</span>
          </div>

          {/* Couple Synergy Score (CSR) */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>COUPLE SYNERGY</span>
                <span className="text-amber-400">{battleState.teamSynergyScore}%</span>
              </div>
              <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-linear-to-r from-amber-500 via-rose-500 to-cyan-400 rounded-full transition-all duration-500" 
                  style={{ width: `${battleState.teamSynergyScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Battlefield Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col justify-center gap-8">
        {/* Stage & Turn Indicator */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-2">
            <span>Dungeon Stage {battleState.stageLevel}</span>
            <span>•</span>
            <span className="text-indigo-400">Turn {battleState.turnCount}</span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Serverless WebRTC Host Node (Desktop SSOT)</span>
          </div>
        </div>

        {/* Center Arena: Monster Encounter */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          {/* Monster Card */}
          <div className="relative group w-full bg-linear-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col items-center">
            {/* Ambient Monster Aura */}
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 rounded-2xl blur-xl group-hover:opacity-100 opacity-60 transition duration-700 pointer-events-none" />

            {/* Monster Intent Floating Banner */}
            <div className="absolute -top-4 px-4 py-1.5 bg-rose-950/90 border border-rose-500/40 rounded-full text-xs font-bold text-rose-200 flex items-center gap-2 shadow-lg animate-bounce">
              <Swords className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentEnemy.intent.description}</span>
            </div>

            {/* Monster Avatar Graphic */}
            <div className="w-32 h-32 my-4 rounded-full bg-linear-to-br from-indigo-900/60 to-purple-950/80 border-2 border-indigo-500/30 flex items-center justify-center shadow-inner relative animate-float">
              <div className="text-5xl">👻</div>
              {currentEnemy.shield > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-400 shadow">
                  <Shield className="w-3 h-3" />
                  <span>{currentEnemy.shield}</span>
                </div>
              )}
            </div>

            {/* Monster Name & Health Bar */}
            <h2 className="text-xl font-bold tracking-tight text-slate-100">{currentEnemy.name}</h2>
            <div className="w-full max-w-md mt-3">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                <span>HP</span>
                <span>{currentEnemy.currentHp} / {currentEnemy.maxHp}</span>
              </div>
              <div className="w-full h-3.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div 
                  className="h-full bg-linear-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-300"
                  style={{ width: `${(currentEnemy.currentHp / currentEnemy.maxHp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Co-Op Controller Connection / Handshake Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Player 1 Card (The Pillar of Empathy) */}
          <div className="relative rounded-2xl bg-linear-to-b from-cyan-950/40 to-slate-950/60 border border-cyan-800/40 p-5 backdrop-blur-sm flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <Heart className="w-4 h-4 fill-cyan-400/20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-cyan-200">Player 1: Empathy Pillar</h3>
                    <p className="text-xs text-cyan-400/80">Support, Shield, Heal & Buffs</p>
                  </div>
                </div>

                <span className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                  battleState.players[1].isConnected 
                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-900 border-slate-700 text-slate-400"
                )}>
                  <Wifi className="w-3 h-3" />
                  {battleState.players[1].isConnected ? 'Connected' : 'Waiting Controller'}
                </span>
              </div>

              {/* Status Stats */}
              <div className="grid grid-cols-2 gap-3 my-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">HP</div>
                    <div className="text-sm font-bold">{battleState.players[1].currentHp} / {battleState.players[1].maxHp}</div>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Energy</div>
                    <div className="text-sm font-bold">{battleState.players[1].energy} / {battleState.players[1].maxEnergy}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code & Join Section */}
            <div className="mt-2 pt-3 border-t border-cyan-900/40 flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                <QRCodeSVG value={p1ControllerUrl} size={74} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 font-medium">Scan dengan smartphone Player 1</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => copyToClipboard(p1ControllerUrl, 'p1')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    {copiedLink === 'p1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'p1' ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <a 
                    href="/controller?player=1" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Test Tab</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Player 2 Card (The Blade of Courage) */}
          <div className="relative rounded-2xl bg-linear-to-b from-rose-950/40 to-slate-950/60 border border-rose-800/40 p-5 backdrop-blur-sm flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-rose-200">Player 2: Courage Blade</h3>
                    <p className="text-xs text-rose-400/80">Offense, Strike & Vulnerability</p>
                  </div>
                </div>

                <span className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                  battleState.players[2].isConnected 
                    ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-900 border-slate-700 text-slate-400"
                )}>
                  <Wifi className="w-3 h-3" />
                  {battleState.players[2].isConnected ? 'Connected' : 'Waiting Controller'}
                </span>
              </div>

              {/* Status Stats */}
              <div className="grid grid-cols-2 gap-3 my-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">HP</div>
                    <div className="text-sm font-bold">{battleState.players[2].currentHp} / {battleState.players[2].maxHp}</div>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Energy</div>
                    <div className="text-sm font-bold">{battleState.players[2].energy} / {battleState.players[2].maxEnergy}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code & Join Section */}
            <div className="mt-2 pt-3 border-t border-rose-900/40 flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
                <QRCodeSVG value={p2ControllerUrl} size={74} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 font-medium">Scan dengan smartphone Player 2</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => copyToClipboard(p2ControllerUrl, 'p2')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    {copiedLink === 'p2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'p2' ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <a 
                    href="/controller?player=2" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>Test Tab</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-500" />
          <span>Buka 2 browser smartphone untuk berpartisipasi sebagai pengendali kartu.</span>
        </div>

        <button 
          onClick={() => setBattleState(prev => ({ ...prev, phase: prev.phase === 'LOBBY' ? 'PLAYER_TURN' : 'LOBBY' }))}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{battleState.phase === 'LOBBY' ? 'Simulate Start Turn' : 'Toggle Lobby Mode'}</span>
        </button>
      </footer>
    </div>
  );
};
