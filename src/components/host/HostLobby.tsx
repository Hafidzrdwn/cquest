import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ChevronRight, Play, Swords, Shield, Heart, Zap } from 'lucide-react';
import { EmpathyRuneSVG, CourageBladeSVG } from '../svg/DungeonArt';
import { cn } from '../../lib/utils';

interface HostLobbyProps {
  roomCode: string;
  p1Connected: boolean;
  p2Connected: boolean;
  onStartGame: () => void;
  onSimulateConnect?: (player: 1 | 2) => void;
}

export const HostLobby: React.FC<HostLobbyProps> = ({
  roomCode,
  p1Connected,
  p2Connected,
  onStartGame,
  onSimulateConnect,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const genericControllerUrl = `${baseUrl}/controller?room=${roomCode}`;
  const p1Url = `${baseUrl}/controller?room=${roomCode}&player=1`;
  const p2Url = `${baseUrl}/controller?room=${roomCode}&player=2`;

  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const bothReady = p1Connected && p2Connected;

  return (
    <div className="w-full flex-1 max-w-5xl mx-auto flex flex-col justify-between py-6 px-4 select-none">
      {/* 1. LOBBY HERO BANNER */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a25] border border-[#2b334a] text-xs font-mono text-amber-300 mb-2">
          <span>KODE RUANGAN:</span>
          <span className="font-bold tracking-widest text-amber-400 text-sm">{roomCode}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-100 tracking-tight">
          Ruang Tunggu Pasangan
        </h2>
        <p className="text-xs text-stone-400 font-mono mt-1 max-w-md mx-auto">
          Scan QR Code menggunakan kamera smartphone kalian untuk memegang kartu dan bergabung ke dalam labirin.
        </p>
      </div>

      {/* 2. QR CODE ONBOARDING & PLAYER SLOTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch my-auto">
        {/* PLAYER 1 SLOT: The Pillar of Empathy */}
        <div className={cn(
          "rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 shadow-xl",
          p1Connected 
            ? "bg-[#0b1317] border-teal-600/60 shadow-teal-950/40" 
            : "bg-[#0a0d12] border-stone-800/80 hover:border-teal-900/60"
        )}>
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#131b1f] border border-[#23353b] flex items-center justify-center text-teal-400 shadow-inner">
                  <EmpathyRuneSVG size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-stone-100">Player 1</h3>
                  <p className="text-[11px] font-mono text-teal-400 font-medium">The Pillar of Empathy</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono border flex items-center gap-1.5",
                p1Connected 
                  ? "bg-teal-950/80 border-teal-500/80 text-teal-300 font-bold" 
                  : "bg-stone-900 border-stone-700 text-amber-400/90 animate-pulse"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", p1Connected ? "bg-teal-400" : "bg-amber-400 animate-ping")} />
                <span>{p1Connected ? 'Connected & Ready' : 'Scanning...'}</span>
              </div>
            </div>

            {/* Specialization Details */}
            <div className="my-4 space-y-2 text-xs">
              <div className="text-[11px] font-mono text-stone-400">SPESIALISASI PERAN:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-[#10141a] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>Shielding</span>
                </div>
                <div className="p-2 rounded-lg bg-[#10141a] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Healing</span>
                </div>
                <div className="p-2 rounded-lg bg-[#10141a] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Support Buff</span>
                </div>
                <div className="p-2 rounded-lg bg-[#10141a] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Swords className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Clarify Strike</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
                Menjaga keselamatan tim, membersihkan debuff, dan mengaktifkan kombo Sympathy Link.
              </p>
            </div>
          </div>

          {/* Quick Connect Link / Fallback */}
          <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => copyToClipboard(p1Url, 'p1')}
              className="text-[10px] font-mono text-stone-400 hover:text-stone-200 flex items-center gap-1 transition cursor-pointer"
            >
              {copiedLink === 'p1' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink === 'p1' ? 'Tersalin' : 'Copy Slot 1'}</span>
            </button>
            <a
              href={p1Url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono text-teal-400 hover:underline flex items-center gap-0.5"
            >
              <span>Test Slot 1</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* CENTER ONBOARDING QR CODE (SHARED OR ROOM SCAN) */}
        <div className="rounded-2xl bg-[#0e1017] border border-[#242b3d] p-5 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="text-center w-full">
            <div className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase mb-1">
              Scan Kamera Smartphone
            </div>
            <p className="text-[11px] text-stone-400">
              Arahkan kamera HP ke sini untuk masuk
            </p>
          </div>

          {/* Stylized QR Box */}
          <div className="my-4 p-3 bg-white rounded-2xl shadow-xl border-2 border-amber-500/40 relative group">
            <QRCodeSVG value={genericControllerUrl} size={150} level="M" />
          </div>

          {/* Fallback & Copy Links */}
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={() => copyToClipboard(genericControllerUrl, 'room')}
              className="w-full py-2 px-3 rounded-xl bg-[#141824] hover:bg-[#1c2233] border border-[#2d364e] text-xs font-mono text-stone-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedLink === 'room' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink === 'room' ? 'Link Tersalin!' : 'Salin Tautan Room'}</span>
            </button>
          </div>
        </div>

        {/* PLAYER 2 SLOT: The Blade of Courage */}
        <div className={cn(
          "rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 shadow-xl",
          p2Connected 
            ? "bg-[#180e12] border-rose-600/60 shadow-rose-950/40" 
            : "bg-[#0a0d12] border-stone-800/80 hover:border-rose-900/60"
        )}>
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1a1317] border border-[#3b222b] flex items-center justify-center text-rose-400 shadow-inner">
                  <CourageBladeSVG size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-stone-100">Player 2</h3>
                  <p className="text-[11px] font-mono text-rose-400 font-medium">The Blade of Courage</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-mono border flex items-center gap-1.5",
                p2Connected 
                  ? "bg-rose-950/80 border-rose-500/80 text-rose-300 font-bold" 
                  : "bg-stone-900 border-stone-700 text-amber-400/90 animate-pulse"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", p2Connected ? "bg-rose-400" : "bg-amber-400 animate-ping")} />
                <span>{p2Connected ? 'Connected & Ready' : 'Scanning...'}</span>
              </div>
            </div>

            {/* Specialization Details */}
            <div className="my-4 space-y-2 text-xs">
              <div className="text-[11px] font-mono text-stone-400">SPESIALISASI PERAN:</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-[#140e11] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Swords className="w-3.5 h-3.5 text-rose-400" />
                  <span>Strikes</span>
                </div>
                <div className="p-2 rounded-lg bg-[#140e11] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Armor Break</span>
                </div>
                <div className="p-2 rounded-lg bg-[#140e11] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Bodyguard</span>
                </div>
                <div className="p-2 rounded-lg bg-[#140e11] border border-stone-800 flex items-center gap-1.5 text-stone-300">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  <span>Vulnerability</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-2 leading-relaxed">
                Mengeksekusi serangan berat, meremukkan perisai monster, dan menyelesaikan musuh.
              </p>
            </div>
          </div>

          {/* Quick Connect Link / Fallback */}
          <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => copyToClipboard(p2Url, 'p2')}
              className="text-[10px] font-mono text-stone-400 hover:text-stone-200 flex items-center gap-1 transition cursor-pointer"
            >
              {copiedLink === 'p2' ? <Check className="w-3 h-3 text-rose-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink === 'p2' ? 'Tersalin' : 'Copy Slot 2'}</span>
            </button>
            <a
              href={p2Url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono text-rose-400 hover:underline flex items-center gap-0.5"
            >
              <span>Test Slot 2</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. START CONDITION & LAUNCH ACTION */}
      <div className="mt-8 pt-5 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-stone-400 flex items-center gap-2">
          <span className={cn(
            "w-2.5 h-2.5 rounded-full",
            bothReady ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
          )} />
          <span>
            {bothReady 
              ? 'Kedua pemain sudah terhubung dan siap bertualang!' 
              : 'Menunggu kedua smartphone tersambung untuk memulai...'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Simulation Button for solo dev testing */}
          {!bothReady && onSimulateConnect && (
            <button
              onClick={() => {
                if (!p1Connected) onSimulateConnect(1);
                if (!p2Connected) onSimulateConnect(2);
              }}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-400 text-xs font-mono transition cursor-pointer"
            >
              Simulate Ready
            </button>
          )}

          <button
            onClick={onStartGame}
            className={cn(
              "px-6 py-3 rounded-xl font-bold font-mono text-xs flex items-center gap-2 shadow-2xl transition-all cursor-pointer active:scale-95",
              bothReady
                ? "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/25 ring-2 ring-amber-400/50 animate-pulse"
                : "bg-[#1b202c] hover:bg-[#252c3d] text-stone-200 border border-[#2f374a]"
            )}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Pertarungan Labirin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
