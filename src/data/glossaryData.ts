export interface GlossaryItem {
  id: string;
  term: string;
  category: 'MECHANIC' | 'CHARACTER' | 'CARD' | 'MONSTER';
  subtitle?: string;
  tag?: string;
  description: string;
  tacticalTip?: string;
}

export const GLOSSARY_CATEGORIES = [
  { id: 'ALL', label: 'Semua Topik' },
  { id: 'MECHANIC', label: 'Istilah & Mekanik' },
  { id: 'CHARACTER', label: 'Karakter & Role' },
  { id: 'CARD', label: 'Daftar Kartu' },
  { id: 'MONSTER', label: 'Monster Labirin' },
] as const;

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  // ==========================================
  // ISTILAH & MEKANIK GAME
  // ==========================================
  {
    id: 'sympathy-link',
    term: 'Sympathy Link (Duo Combo)',
    category: 'MECHANIC',
    tag: 'Kombo Utama',
    subtitle: 'Sinergi Harmoni Dua Hati',
    description:
      'Mekanisme kombo sakti! Terpicu saat Player 1 (Empathy) memainkan kartu bertipe SYMPATHY atau BUFF, lalu disusul oleh Player 2 (Courage) yang memainkan kartu ATTACK pada giliran yang sama.',
    tacticalTip:
      'Memberikan bonus pengali +50% efektivitas serangan/perisai, diskon 1 Energy pada aksi kedua, serta menaikkan Couple Synergy Score sebesar +15%!',
  },
  {
    id: 'couple-synergy',
    term: 'Couple Synergy Score (CSR)',
    category: 'MECHANIC',
    tag: 'Tingkat Kekompakan',
    subtitle: 'Metrik Penilaian Hubungan',
    description:
      'Tingkat keselarasan dan kerja sama kalian berdua (0% - 100%). Algoritma melacak seberapa sering kalian berdiskusi, saling melindungi, dan melancarkan kombo bersama alih-alih bermain egois.',
    tacticalTip:
      'CSR tinggi akan memicu kartu ringkasan visual unik di akhir permainan (misal: "Harmonic Soulmates" atau "Power Couple Tanpa Ragu") yang siap dibagikan ke media sosial.',
  },
  {
    id: 'energy',
    term: 'Energy (Energi Jiwa)',
    category: 'MECHANIC',
    tag: 'Sumber Daya',
    subtitle: 'Bahan Bakar Aksi per Giliran',
    description:
      'Setiap pemain memiliki 3 Energy di awal giliran. Setiap kartu memiliki biaya (Cost) 1 atau 2 Energy. Energy akan terisi kembali penuh saat kalian mengakhiri giliran (End Turn).',
    tacticalTip:
      'Jangan habiskan Energy sembarangan! Simpan atau sesuaikan Energy untuk memicu kombo Sympathy Link.',
  },
  {
    id: 'shield',
    term: 'Shield (Perisai Pelindung)',
    category: 'MECHANIC',
    tag: 'Pertahanan',
    subtitle: 'Peredam Luka Tim',
    description:
      'Shield menyerap damage monster sebelum menyentuh HP kalian. Membantu menjaga HP tetap aman saat monster bersiap melancarkan serangan dahsyat.',
    tacticalTip:
      'Selalu cek intensi monster di layar desktop! Jika monster akan menyerang 10 DMG, pasang minimal 10 Shield bersama-sama.',
  },
  {
    id: 'intent-system',
    term: 'Enemy Intent (Niat Monster)',
    category: 'MECHANIC',
    tag: 'Informasi Tempur',
    subtitle: 'Rencana Serangan Musuh',
    description:
      'Layar desktop selalu menampilkan apa yang akan dilakukan monster pada giliran berikutnya—apakah menyerang (Attack), bertahan (Defend), atau memberi status buruk (Debuff).',
    tacticalTip:
      'Gunakan informasi ini untuk berdiskusi: siapa yang harus pasang badan (Shield) dan siapa yang harus melancarkan serangan penuh (Attack).',
  },
  {
    id: 'vulnerable',
    term: 'Vulnerable (Status Rentan)',
    category: 'MECHANIC',
    tag: 'Status Efek',
    subtitle: 'Pelemah Ketahanan Musuh',
    description:
      'Status yang membuat monster atau pemain menerima ekstra +50% damage dari semua serangan selama 1 giliran.',
    tacticalTip:
      'Berikan status Vulnerable terlebih dahulu sebelum mengeksekusi kartu serangan berat seperti Courageous Leap untuk hasil damage maksimal!',
  },
  {
    id: 'turn-phases',
    term: 'Turn Phases (Fase Giliran)',
    category: 'MECHANIC',
    tag: 'Alur Permainan',
    subtitle: 'Tahapan dalam Pertarungan',
    description:
      'Pertarungan berlangsung dalam 4 fase: 1. Lobby (Persiapan & Pairing HP), 2. Player Turn (Giliran kalian menyusun dan melempar kartu), 3. Resolution (Eksekusi kartu & kombo), 4. Enemy Turn (Monster melancarkan serangannya).',
    tacticalTip:
      'Kalian berdua bisa bermain kartu secara fleksibel di fase Player Turn sebelum menekan tombol End Turn.',
  },

  // ==========================================
  // KARAKTER & ROLE
  // ==========================================
  {
    id: 'empathy-pillar',
    term: 'Player 1: Empathy Pillar',
    category: 'CHARACTER',
    tag: 'Pilar Empati (Biru / Sage)',
    subtitle: 'Spesialis Support, Shield, Heal & Buff',
    description:
      'Sosok penenang dalam hubungan. Berperan menjaga keselamatan tim, memulihkan HP yang terkuras, membersihkan status debuff keraguan, dan memicu pemicu kombo cinta.',
    tacticalTip:
      'Kartu andalan: "Active Listening" (Shield kuat), "Warm Hug" (Heal + Shield), dan "Calm Down" (Pembersih debuff sekaligus aktivator Sympathy Link).',
  },
  {
    id: 'courage-blade',
    term: 'Player 2: Courage Blade',
    category: 'CHARACTER',
    tag: 'Pedang Keberanian (Merah / Amber)',
    subtitle: 'Spesialis Offense, Strike & Armor Break',
    description:
      'Sosok pemberani pengambil inisiatif. Berperan menghancurkan perisai musuh, membuka celah kelemahan monster, dan mengeksekusi serangan dahsyat penentu kemenangan.',
    tacticalTip:
      'Kartu andalan: "Direct Talk" (Serangan cepat), "Protective Stance" (Bantu pasang badan), dan "Courageous Leap" (Serangan 14 DMG penghancur monster).',
  },

  // ==========================================
  // DAFTAR KARTU
  // ==========================================
  {
    id: 'card-active-listening',
    term: 'Active Listening',
    category: 'CARD',
    tag: 'SHIELD • Cost: 1 Energy',
    subtitle: 'Kartu Khusus Player 1 (Empathy)',
    description:
      'Mendengarkan tanpa menyela atau menghakimi. Memberikan 6 Shield langsung untuk tim.',
    tacticalTip:
      'Kartu wajib dimainkan setiap kali monster menyiapkan serangan berbahaya.',
  },
  {
    id: 'card-warm-hug',
    term: 'Warm Hug',
    category: 'CARD',
    tag: 'HEAL & SHIELD • Cost: 2 Energy',
    subtitle: 'Kartu Khusus Player 1 (Empathy)',
    description:
      'Pelukan hangat penenang jiwa. Memulihkan 4 HP darah tim sekaligus memberikan 3 Shield tambahan.',
    tacticalTip:
      'Penyelamat darurat ketika HP tim mulai kritis akibat serangan monster bertubi-tubi.',
  },
  {
    id: 'card-calm-down',
    term: 'Calm Down',
    category: 'CARD',
    tag: 'BUFF / SYMPATHY • Cost: 1 Energy',
    subtitle: 'Kartu Khusus Player 1 (Empathy)',
    description:
      'Tarik napas sejenak bersama. Menghapus 1 debuff tim dan membuka sinergi Sympathy Link.',
    tacticalTip:
      'Mainkan kartu ini sebelum Player 2 menyerang agar serangan Player 2 mendapat bonus damage +50%!',
  },
  {
    id: 'card-empathy-strike',
    term: 'Empathy Strike',
    category: 'CARD',
    tag: 'ATTACK • Cost: 1 Energy',
    subtitle: 'Kartu Khusus Player 1 (Empathy)',
    description:
      'Teguran lembut penuh kasih yang menyadarkan. Menghasilkan 5 DMG langsung ke monster.',
    tacticalTip:
      'Gunakan saat pertahanan tim sudah aman dan ingin membantu menipiskan sisa darah musuh.',
  },
  {
    id: 'card-direct-talk',
    term: 'Direct Talk',
    category: 'CARD',
    tag: 'ATTACK • Cost: 1 Energy',
    subtitle: 'Kartu Khusus Player 2 (Courage)',
    description:
      'Menyampaikan isi hati secara terbuka dan tulus tanpa kode-kodean. Menghasilkan 8 DMG telak.',
    tacticalTip:
      'Kartu serangan paling konsisten dan hemat energi untuk mengikis darah monster.',
  },
  {
    id: 'card-protective-stance',
    term: 'Protective Stance',
    category: 'CARD',
    tag: 'SHIELD • Cost: 1 Energy',
    subtitle: 'Kartu Khusus Player 2 (Courage)',
    description:
      'Pasang badan demi pasangan. Memberikan 4 Shield untuk melindungi tim.',
    tacticalTip:
      'Bagus digunakan saat Player 1 kekurangan energy untuk memasang perisai yang cukup.',
  },
  {
    id: 'card-courageous-leap',
    term: 'Courageous Leap',
    category: 'CARD',
    tag: 'ATTACK • Cost: 2 Energy',
    subtitle: 'Kartu Khusus Player 2 (Courage)',
    description:
      'Mengambil inisiatif tanpa ragu-ragu. Melompat ke arah musuh dan menghasilkan 14 DMG dahsyat.',
    tacticalTip:
      'Kombinasikan dengan status Vulnerable atau Sympathy Link untuk menghasilkan lebih dari 21+ DMG!',
  },
  {
    id: 'card-vulnerability-strike',
    term: 'Vulnerability Strike',
    category: 'CARD',
    tag: 'ATTACK • Cost: 1 Energy',
    subtitle: 'Kartu Khusus Player 2 (Courage)',
    description:
      'Membuka kerapuhan monster. Menghasilkan 5 DMG serta memberikan status Vulnerable (+50% DMG tambahan pada giliran ini).',
    tacticalTip:
      'Selalu lempar kartu ini paling awal di putaran serangan kalian!',
  },

  // ==========================================
  // MONSTER LABIRIN
  // ==========================================
  {
    id: 'monster-overthinking',
    term: 'The Overthinking Phantom (Lantai 1)',
    category: 'MONSTER',
    tag: 'HP: 60 • Roh Keraguan',
    subtitle: 'Manifestasi Pikiran Kusut di Tengah Malam',
    description:
      'Sosok hantu berkerudung yang terbelenggu oleh rantai asumsi dan keraguan. Selalu memikirkan hal-hal buruk yang belum tentu terjadi ("Kira-kira dia marah kenapa ya?").',
    tacticalTip:
      'Monster ini gemar melancarkan Serangan Keraguan (10 DMG). Jangan biarkan perisai kalian kosong!',
  },
  {
    id: 'monster-terserah',
    term: 'The "Terserah" Slime (Lantai 2)',
    category: 'MONSTER',
    tag: 'HP: 90 • Slime Kebingungan',
    subtitle: 'Musuh Bebuyutan Saat Memilih Makan Malam',
    description:
      'Gumpalan slime yang sulit ditebak dan tidak pernah memberi jawaban pasti. Mampu mengacak beban pikiran dan menyebarkan status kebingungan pada kartu tangan kalian.',
    tacticalTip:
      'Komunikasi aktif adalah kuncinya. Koordinasikan kartu yang biayanya teracak agar tidak membuang energy sia-sia.',
  },
  {
    id: 'monster-silent-treatment',
    term: 'The Silent Treatment Golem (Lantai 3)',
    category: 'MONSTER',
    tag: 'HP: 140 • Golem Bisu Dingin',
    subtitle: 'Tembok Batu Pembatas Rasa',
    description:
      'Monster raksasa yang terbuat dari keheningan dingin dan aksi saling mendiamkan. Dilindungi oleh perisai batu tebal setebal 40 Shield yang sangat alot.',
    tacticalTip:
      'Tembok batunya hanya bisa ditembus secara efisien jika kedua pemain mengeksekusi kombo Sympathy Link pada giliran yang sama!',
  },
];
