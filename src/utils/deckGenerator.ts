import { Card, PlayerRole } from '../types/game';

/**
 * Generator for Starter Decks (10 cards each)
 * Formulated for Couple Quest: Emotional Roguelite
 */

export function generateStarterDeck(role: PlayerRole): Card[] {
  if (role === 'EMPATHY') {
    return [
      // 3x Active Listening
      {
        id: 'p1_listen_1',
        name: 'Active Listening',
        cost: 1,
        type: 'SHIELD',
        value: 6,
        description: 'Mendengarkan tanpa menyela atau menghakimi. Memberikan 6 Shield untuk tim.',
        targetType: 'TEAM',
        icon: 'Ear',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      {
        id: 'p1_listen_2',
        name: 'Active Listening',
        cost: 1,
        type: 'SHIELD',
        value: 6,
        description: 'Mendengarkan tanpa menyela atau menghakimi. Memberikan 6 Shield untuk tim.',
        targetType: 'TEAM',
        icon: 'Ear',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      {
        id: 'p1_listen_3',
        name: 'Active Listening',
        cost: 1,
        type: 'SHIELD',
        value: 6,
        description: 'Mendengarkan tanpa menyela atau menghakimi. Memberikan 6 Shield untuk tim.',
        targetType: 'TEAM',
        icon: 'Ear',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      // 2x Warm Hug
      {
        id: 'p1_hug_1',
        name: 'Warm Hug',
        cost: 2,
        type: 'HEAL',
        value: 4,
        description: 'Pelukan hangat penenang jiwa. Memulihkan 4 HP dan memberi 2 Shield tambahan.',
        targetType: 'TEAM',
        icon: 'HeartHandshake',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      {
        id: 'p1_hug_2',
        name: 'Warm Hug',
        cost: 2,
        type: 'HEAL',
        value: 4,
        description: 'Pelukan hangat penenang jiwa. Memulihkan 4 HP dan memberi 2 Shield tambahan.',
        targetType: 'TEAM',
        icon: 'HeartHandshake',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      // 2x Calm Down
      {
        id: 'p1_calm_1',
        name: 'Calm Down',
        cost: 1,
        type: 'BUFF',
        value: 1,
        description: 'Tarik napas sejenak bersama. Menghapus debuff tim dan membuka sinergi Sympathy Link.',
        targetType: 'TEAM',
        icon: 'Wind',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      {
        id: 'p1_calm_2',
        name: 'Calm Down',
        cost: 1,
        type: 'BUFF',
        value: 1,
        description: 'Tarik napas sejenak bersama. Menghapus debuff tim dan membuka sinergi Sympathy Link.',
        targetType: 'TEAM',
        icon: 'Wind',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      // 3x Empathy Strike
      {
        id: 'p1_strike_1',
        name: 'Empathy Strike',
        cost: 1,
        type: 'ATTACK',
        value: 5,
        description: 'Teguran lembut penuh kasih yang menyadarkan. Menghasilkan 5 DMG ke monster.',
        targetType: 'ENEMY',
        icon: 'Sparkles',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      {
        id: 'p1_strike_2',
        name: 'Empathy Strike',
        cost: 1,
        type: 'ATTACK',
        value: 5,
        description: 'Teguran lembut penuh kasih yang menyadarkan. Menghasilkan 5 DMG ke monster.',
        targetType: 'ENEMY',
        icon: 'Sparkles',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
      {
        id: 'p1_strike_3',
        name: 'Empathy Strike',
        cost: 1,
        type: 'ATTACK',
        value: 5,
        description: 'Teguran lembut penuh kasih yang menyadarkan. Menghasilkan 5 DMG ke monster.',
        targetType: 'ENEMY',
        icon: 'Sparkles',
        roleOwner: 'EMPATHY',
        rarity: 'STARTER',
      },
    ];
  }

  // COURAGE DECK (10 CARDS)
  return [
    // 3x Direct Talk
    {
      id: 'p2_talk_1',
      name: 'Direct Talk',
      cost: 1,
      type: 'ATTACK',
      value: 8,
      description: 'Menyampaikan isi hati secara terbuka dan tulus. Menghasilkan 8 DMG telak.',
      targetType: 'ENEMY',
      icon: 'MessageSquareWarning',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    {
      id: 'p2_talk_2',
      name: 'Direct Talk',
      cost: 1,
      type: 'ATTACK',
      value: 8,
      description: 'Menyampaikan isi hati secara terbuka dan tulus. Menghasilkan 8 DMG telak.',
      targetType: 'ENEMY',
      icon: 'MessageSquareWarning',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    {
      id: 'p2_talk_3',
      name: 'Direct Talk',
      cost: 1,
      type: 'ATTACK',
      value: 8,
      description: 'Menyampaikan isi hati secara terbuka dan tulus. Menghasilkan 8 DMG telak.',
      targetType: 'ENEMY',
      icon: 'MessageSquareWarning',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    // 3x Protective Stance
    {
      id: 'p2_guard_1',
      name: 'Protective Stance',
      cost: 1,
      type: 'SHIELD',
      value: 5,
      description: 'Pasang badan demi pasangan. Memberikan 5 Shield untuk tim.',
      targetType: 'TEAM',
      icon: 'Shield',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    {
      id: 'p2_guard_2',
      name: 'Protective Stance',
      cost: 1,
      type: 'SHIELD',
      value: 5,
      description: 'Pasang badan demi pasangan. Memberikan 5 Shield untuk tim.',
      targetType: 'TEAM',
      icon: 'Shield',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    {
      id: 'p2_guard_3',
      name: 'Protective Stance',
      cost: 1,
      type: 'SHIELD',
      value: 5,
      description: 'Pasang badan demi pasangan. Memberikan 5 Shield untuk tim.',
      targetType: 'TEAM',
      icon: 'Shield',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    // 2x Courageous Leap
    {
      id: 'p2_leap_1',
      name: 'Courageous Leap',
      cost: 2,
      type: 'ATTACK',
      value: 12,
      description: 'Mengambil inisiatif tanpa ragu-ragu. Menghasilkan 12 DMG dahsyat ke monster.',
      targetType: 'ENEMY',
      icon: 'Flame',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    {
      id: 'p2_leap_2',
      name: 'Courageous Leap',
      cost: 2,
      type: 'ATTACK',
      value: 12,
      description: 'Mengambil inisiatif tanpa ragu-ragu. Menghasilkan 12 DMG dahsyat ke monster.',
      targetType: 'ENEMY',
      icon: 'Flame',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    // 2x Vulnerability Strike
    {
      id: 'p2_vuln_1',
      name: 'Vulnerability Strike',
      cost: 1,
      type: 'ATTACK',
      value: 5,
      description: 'Membuka kerapuhan monster. Memberi 5 DMG + status Vulnerable (+50% DMG tambahan).',
      targetType: 'ENEMY',
      icon: 'Zap',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
    {
      id: 'p2_vuln_2',
      name: 'Vulnerability Strike',
      cost: 1,
      type: 'ATTACK',
      value: 5,
      description: 'Membuka kerapuhan monster. Memberi 5 DMG + status Vulnerable (+50% DMG tambahan).',
      targetType: 'ENEMY',
      icon: 'Zap',
      roleOwner: 'COURAGE',
      rarity: 'STARTER',
    },
  ];
}

/**
 * Fisher-Yates array shuffle for deck drawing
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Split deck into hand and remaining draw pile
 */
export function drawInitialHand(deck: Card[], handSize = 4): { hand: Card[]; drawPile: Card[] } {
  const shuffled = shuffleDeck(deck);
  return {
    hand: shuffled.slice(0, handSize),
    drawPile: shuffled.slice(handSize),
  };
}
