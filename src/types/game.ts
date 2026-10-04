/**
 * Couple Quest: Emotional Roguelite
 * Core TypeScript Data Contracts & State Machine Definitions
 * Reference: docs/PRD.md
 */

// Player Identifiers
export type PlayerId = 1 | 2;

export type PlayerRole = 'EMPATHY' | 'COURAGE';

// Card System Definitions
export type CardType = 'ATTACK' | 'SHIELD' | 'HEAL' | 'BUFF' | 'SYMPATHY';

export type CardTargetType = 'ENEMY' | 'SELF' | 'ALLY' | 'TEAM' | 'ALL_ENEMIES';

export interface Card {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  value: number;
  description: string;
  targetType: CardTargetType;
  icon?: string;
  roleOwner?: PlayerRole;
  rarity?: 'STARTER' | 'COMMON' | 'RARE' | 'SYNERGY';
}

// Status Effects (Buffs & Debuffs: Overthink, Burnout, Warmth, Vulnerable, etc.)
export interface StatusEffect {
  id: string;
  name: string;
  type: 'BUFF' | 'DEBUFF';
  duration: number; // in turns
  stacks?: number;
  value?: number;
  description: string;
}

// Player State Model
export interface PlayerState {
  id: PlayerId;
  role: PlayerRole;
  name: string;
  currentHp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  isConnected?: boolean;
  peerId?: string;
  statusEffects?: StatusEffect[];
}

// Enemy Intent System
export type EnemyIntentType = 'ATTACK' | 'DEFEND' | 'DEBUFF' | 'SPECIAL';

export interface EnemyIntent {
  type: EnemyIntentType;
  value: number;
  icon: string;
  description?: string;
}

// Enemy State Model
export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  shield: number;
  intent: EnemyIntent;
  statusEffects?: StatusEffect[];
}

// Battle State Machine Phases
export type BattlePhase =
  | 'LOBBY'
  | 'PLAYER_TURN'
  | 'RESOLUTION'
  | 'ENEMY_TURN'
  | 'VICTORY'
  | 'DEFEAT';

// Played card tracking for Sympathy Link combo detection
export interface PlayedCardEvent {
  playerId: PlayerId;
  card: Card;
  targetId?: string;
  timestamp: number;
  isComboTrigger?: boolean;
}

export interface ComboEvent {
  name: string;
  description: string;
  bonusMultiplier: number;
  timestamp: number;
}

// Comprehensive Battle State
export interface BattleState {
  phase: BattlePhase;
  turnCount: number;
  teamSynergyScore: number; // 0 - 100%
  players: Record<PlayerId, PlayerState>;
  enemies: Enemy[];
  activeEnemyId?: string;
  playedCardsThisTurn: PlayedCardEvent[];
  lastCombo?: ComboEvent | null;
  stageLevel: number;
}

// ==========================================
// WebRTC P2P Data Wire Protocols
// ==========================================

export interface PlayerHandSyncPayload {
  type: 'SYNC_HAND';
  player: PlayerId;
  energy: number;
  maxEnergy: number;
  hand: Array<{
    id: string;
    title: string;
    cost: number;
    type: CardType;
    description: string;
    icon: string;
    value: number;
    targetType: CardTargetType;
  }>;
  teamHp: number;
  maxTeamHp: number;
  turnPhase: 'PLAYER_TURN' | 'ENEMY_TURN' | 'LOBBY' | 'RESOLUTION' | 'VICTORY' | 'DEFEAT';
  synergyScore: number;
}

export interface PlayCardPayload {
  type: 'PLAY_CARD';
  player: PlayerId;
  cardId: string;
  targetId?: string;
  timestamp: number;
}

export interface EndTurnPayload {
  type: 'END_TURN';
  player: PlayerId;
  timestamp: number;
}

export interface JoinLobbyPayload {
  type: 'JOIN_LOBBY';
  player: PlayerId;
  playerName: string;
}

export interface HostLobbyInfoPayload {
  type: 'LOBBY_INFO';
  hostPeerId: string;
  player1Joined: boolean;
  player2Joined: boolean;
  gameReady: boolean;
}

export interface HapticFeedbackPayload {
  type: 'HAPTIC_TRIGGER';
  pattern: 'IMPACT' | 'COMBO' | 'SHIELD' | 'DAMAGE';
}

// Discriminated Union for all PeerJS WebRTC messages
export type PeerMessage =
  | PlayerHandSyncPayload
  | PlayCardPayload
  | EndTurnPayload
  | JoinLobbyPayload
  | HostLobbyInfoPayload
  | HapticFeedbackPayload;
