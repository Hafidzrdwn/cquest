import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ChevronRight } from 'lucide-react';
import { BattleState } from '../types/game';
import { INITIAL_BATTLE_STATE } from '../data/initialGameData';
import { 
  OverthinkingPhantomSVG, 
  EmpathyRuneSVG, 
  CourageBladeSVG, 
  IronShieldSVG,
  CoupleQuestLogoSVG
} from '../components/svg/DungeonArt';
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

  // Terjemahan fase permainan yang ramah dan alami
  const getPhaseLabel = (phase: BattleState['phase']) => {
    switch (phase) {
      case 'LOBBY':
        return 'Ruang Bersiap Pasangan';
      case 'PLAYER_TURN':
        return 'Giliran Pasangan Beraksi';
      case 'RESOLUTION':
        return 'Efek Kombo & Dampak';
      case 'ENEMY_TURN':
        return 'Monster Membalas Serangan';
      case 'VICTORY':
        return 'Menang Bersama!';
      case 'DEFEAT':
        return 'Tetap Semangat & Coba Lagi';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0b0e] text-stone-200 flex flex-col justify-between selection:bg-amber-900 selection:text-amber-100">
      {/* Latar Belakang Suasana Labirin Gelap yang Teduh */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#13151f] via-[#0a0b0e] to-[#050608]" />

      {/* Bagian Atas: Lambang Permainan & Bar Kekompakan */}
      <header className="border-b border-[#1c1f2b] bg-[#0d0f15]/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#161822] border border-[#282d3d] flex items-center justify-center">
            <CoupleQuestLogoSVG size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-stone-100 uppercase">
              Couple Quest
            </h1>
            <p className="text-[11px] text-stone-400 font-mono tracking-tight">Petualangan Hati di Labirin Emosi</p>
          </div>
        </div>

        {/* Status Giliran & Kekompakan Pasangan */}
        <div className="flex items-center gap-5">
          {/* Status Tahap Permainan */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#13151e] border border-[#222736] text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-stone-400 font-mono text-[11px]">STATUS:</span>
            <span className="text-stone-200 font-semibold tracking-wide">{getPhaseLabel(battleState.phase)}</span>
          </div>

          {/* Bar Kekompakan Hati */}
          <div className="flex items-center gap-3 bg-[#13151e] border border-[#222736] rounded-md px-3.5 py-1.5">
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400 gap-4">
                <span>KEKOMPAKAN HATI</span>
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
        </div>
      </header>

      {/* Arena Utama: Altar Pertarungan Monster */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-6 flex flex-col justify-between gap-6">
        {/* Informasi Tahap Labirin */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono border-b border-[#181b26] pb-3">
          <div>LANTAI LABIRIN {battleState.stageLevel} &bull; PUTARAN KE-{battleState.turnCount}</div>
          <div className="text-[11px] text-stone-400">Layar Utama Pertarungan</div>
        </div>

        {/* Altar Monster Tengah */}
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full max-w-lg bg-[#0e1017] border border-[#1e2230] rounded-xl p-6 flex flex-col items-center shadow-xl">
            {/* Papan Rencana Aksi Monster */}
            <div className="absolute -top-3.5 px-3 py-1 bg-[#181b25] border border-[#2f354a] rounded-md text-[11px] font-mono text-amber-200 flex items-center gap-2 shadow">
              <span className="text-amber-400 font-bold">&#9876;</span>
              <span>{currentEnemy.intent.description}</span>
            </div>

            {/* Ilustrasi Monster SVG Otentik */}
            <div className="my-2 p-2">
              <OverthinkingPhantomSVG size={140} />
            </div>

            {/* Nama & Perisai Monster */}
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-base font-semibold text-stone-100 tracking-wide">{currentEnemy.name}</h2>
              {currentEnemy.shield > 0 && (
                <div className="flex items-center gap-1 text-xs text-sky-300 bg-sky-950/40 border border-sky-800/60 px-2 py-0.5 rounded">
                  <IronShieldSVG size={12} className="text-sky-400" />
                  <span>{currentEnemy.shield} Perisai</span>
                </div>
              )}
            </div>

            {/* Bar Darah Monster */}
            <div className="w-full max-w-xs mt-3">
              <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
                <span>DARAH MONSTER</span>
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

        {/* Meja Sambungan HP Kedua Pemain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          {/* Pemain 1: Si Penenang Hati */}
          <div className="bg-[#0d1115] border border-[#1b2529] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#162125]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#131b1f] border border-[#23353b] flex items-center justify-center text-teal-400">
                    <EmpathyRuneSVG size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-stone-200 tracking-wide">Pemain 1: Si Penenang Hati</h3>
                    <p className="text-[10px] text-teal-400/80 font-mono">Pelindung, Penyembuh & Penyejuk Hati</p>
                  </div>
                </div>

                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border",
                  battleState.players[1].isConnected
                    ? "bg-teal-950/30 border-teal-800/60 text-teal-300"
                    : "bg-[#11131a] border-[#222736] text-stone-400"
                )}>
                  {battleState.players[1].isConnected ? 'HP Sudah Terhubung!' : 'Menunggu HP Pasangan'}
                </span>
              </div>

              {/* Ringkasan Daya Pemain 1 */}
              <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
                <div className="bg-[#090c0f] border border-[#161e22] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">DARAH</span>
                  <span className="text-stone-200 font-bold">{battleState.players[1].currentHp}/{battleState.players[1].maxHp}</span>
                </div>
                <div className="bg-[#090c0f] border border-[#161e22] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">ENERGI JIWA</span>
                  <span className="text-teal-300 font-bold">{battleState.players[1].energy}/{battleState.players[1].maxEnergy}</span>
                </div>
              </div>
            </div>

            {/* Bagian Scan QR Code */}
            <div className="mt-3 pt-3 border-t border-[#162125] flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow shrink-0">
                <QRCodeSVG value={p1ControllerUrl} size={64} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-300 font-medium">Arahkan kamera HP ke sini untuk mengambil kartu tanganmu</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    onClick={() => copyToClipboard(p1ControllerUrl, 'p1')}
                    className="text-[10px] font-mono bg-[#131b1f] hover:bg-[#1b262c] text-stone-300 px-2 py-1 rounded border border-[#23353b] flex items-center gap-1 transition"
                  >
                    {copiedLink === 'p1' ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'p1' ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                  <a
                    href="/controller?player=1"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-teal-400/90 hover:underline flex items-center gap-0.5"
                  >
                    <span>Coba di Tab Ini</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Pemain 2: Si Pemberani */}
          <div className="bg-[#120f12] border border-[#2a1d22] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#23171c]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#1a1317] border border-[#3b222b] flex items-center justify-center text-amber-500">
                    <CourageBladeSVG size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-stone-200 tracking-wide">Pemain 2: Si Pemberani</h3>
                    <p className="text-[10px] text-amber-500/80 font-mono">Penyerang Utama & Pendobrak Keraguan</p>
                  </div>
                </div>

                <span className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded border",
                  battleState.players[2].isConnected
                    ? "bg-amber-950/30 border-amber-800/60 text-amber-300"
                    : "bg-[#11131a] border-[#222736] text-stone-400"
                )}>
                  {battleState.players[2].isConnected ? 'HP Sudah Terhubung!' : 'Menunggu HP Pasangan'}
                </span>
              </div>

              {/* Ringkasan Daya Pemain 2 */}
              <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
                <div className="bg-[#0d0a0c] border border-[#201419] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">DARAH</span>
                  <span className="text-stone-200 font-bold">{battleState.players[2].currentHp}/{battleState.players[2].maxHp}</span>
                </div>
                <div className="bg-[#0d0a0c] border border-[#201419] rounded p-2 flex justify-between">
                  <span className="text-stone-400 text-[11px]">ENERGI JIWA</span>
                  <span className="text-amber-400 font-bold">{battleState.players[2].energy}/{battleState.players[2].maxEnergy}</span>
                </div>
              </div>
            </div>

            {/* Bagian Scan QR Code */}
            <div className="mt-3 pt-3 border-t border-[#23171c] flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow shrink-0">
                <QRCodeSVG value={p2ControllerUrl} size={64} level="M" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-stone-300 font-medium">Arahkan kamera HP ke sini untuk mengambil kartu tanganmu</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    onClick={() => copyToClipboard(p2ControllerUrl, 'p2')}
                    className="text-[10px] font-mono bg-[#1c1318] hover:bg-[#271b22] text-stone-300 px-2 py-1 rounded border border-[#3b222b] flex items-center gap-1 transition"
                  >
                    {copiedLink === 'p2' ? <Check className="w-3 h-3 text-amber-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink === 'p2' ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                  <a
                    href="/controller?player=2"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-amber-400/90 hover:underline flex items-center gap-0.5"
                  >
                    <span>Coba di Tab Ini</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bagian Bawah: Bantuan & Tombol Uji Giliran */}
      <footer className="border-t border-[#181a24] bg-[#090a0e] px-6 py-3 flex items-center justify-between text-xs text-stone-400 font-mono">
        <div>Buka 2 browser di HP kalian masing-masing untuk mulai bermain kartu bersama pasangan.</div>

        <button
          onClick={() => setBattleState(prev => ({ ...prev, phase: prev.phase === 'LOBBY' ? 'PLAYER_TURN' : 'LOBBY' }))}
          className="bg-[#1b202c] hover:bg-[#252c3d] text-stone-200 border border-[#2f374a] text-xs px-3.5 py-1.5 rounded transition"
        >
          {battleState.phase === 'LOBBY' ? 'Mulai Pertarungan' : 'Kembali Bersantai'}
        </button>
      </footer>
    </div>
  );
};
