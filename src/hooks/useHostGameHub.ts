import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { 
  PlayerId, 
  BattlePhase, 
  PlayerState, 
  PlayCardPayload, 
  EndTurnPayload, 
  PeerMessage, 
  PlayerHandSyncPayload,
  HapticFeedbackPayload
} from '../types/game';

interface UseHostGameHubOptions {
  roomId: string;
  onPlayCard?: (payload: PlayCardPayload) => void;
  onEndTurn?: (payload: EndTurnPayload) => void;
  onPlayerConnected?: (player: PlayerId) => void;
  onPlayerDisconnected?: (player: PlayerId) => void;
}

export interface UseHostGameHubReturn {
  roomCode: string;
  hostPeerId: string;
  isReady: boolean;
  error: string | null;
  p1Connected: boolean;
  p2Connected: boolean;
  syncPlayerHands: (
    players: Record<PlayerId, PlayerState>, 
    phase: BattlePhase, 
    synergyScore: number
  ) => void;
  notifyTurnChange: (
    phase: BattlePhase, 
    turnCount: number,
    players: Record<PlayerId, PlayerState>,
    synergyScore: number
  ) => void;
  sendHapticFeedback: (
    player: PlayerId | 'BOTH', 
    pattern: HapticFeedbackPayload['pattern']
  ) => void;
  broadcastMessage: (message: PeerMessage) => void;
}

export function useHostGameHub({
  roomId,
  onPlayCard,
  onEndTurn,
  onPlayerConnected,
  onPlayerDisconnected,
}: UseHostGameHubOptions): UseHostGameHubReturn {
  const cleanRoomCode = (roomId || 'LOVE').toUpperCase().trim().slice(0, 6);
  const hostPeerId = `cquest-host-${cleanRoomCode}`;

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [p1Connected, setP1Connected] = useState(false);
  const [p2Connected, setP2Connected] = useState(false);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<{ [key in PlayerId]?: DataConnection }>({});
  
  // Callback refs to avoid stale closures
  const onPlayCardRef = useRef(onPlayCard);
  const onEndTurnRef = useRef(onEndTurn);
  const onPlayerConnectedRef = useRef(onPlayerConnected);
  const onPlayerDisconnectedRef = useRef(onPlayerDisconnected);

  useEffect(() => {
    onPlayCardRef.current = onPlayCard;
    onEndTurnRef.current = onEndTurn;
    onPlayerConnectedRef.current = onPlayerConnected;
    onPlayerDisconnectedRef.current = onPlayerDisconnected;
  }, [onPlayCard, onEndTurn, onPlayerConnected, onPlayerDisconnected]);

  // Broadcast to all active controllers
  const broadcastMessage = useCallback((message: PeerMessage) => {
    Object.values(connectionsRef.current).forEach((conn) => {
      if (conn && conn.open) {
        try {
          conn.send(message);
        } catch (err) {
          console.warn('[HostHub] Failed to send message:', err);
        }
      }
    });
  }, []);

  // Send Haptic Feedback
  const sendHapticFeedback = useCallback(
    (player: PlayerId | 'BOTH', pattern: HapticFeedbackPayload['pattern']) => {
      const payload: HapticFeedbackPayload = {
        type: 'HAPTIC_TRIGGER',
        pattern,
      };

      if (player === 'BOTH') {
        broadcastMessage(payload);
      } else {
        const conn = connectionsRef.current[player];
        if (conn && conn.open) {
          try {
            conn.send(payload);
          } catch (err) {
            console.warn(`[HostHub] Failed to send haptic to P${player}:`, err);
          }
        }
      }
    },
    [broadcastMessage]
  );

  // Sync Hands of both players
  const syncPlayerHands = useCallback(
    (players: Record<PlayerId, PlayerState>, phase: BattlePhase, synergyScore: number) => {
      const teamTotalHp = (players[1]?.currentHp || 0) + (players[2]?.currentHp || 0);
      const teamMaxHp = (players[1]?.maxHp || 0) + (players[2]?.maxHp || 0);

      ([1, 2] as PlayerId[]).forEach((playerId) => {
        const conn = connectionsRef.current[playerId];
        const playerState = players[playerId];
        if (!conn || !conn.open || !playerState) return;

        const payload: PlayerHandSyncPayload = {
          type: 'SYNC_HAND',
          player: playerId,
          energy: playerState.energy,
          maxEnergy: playerState.maxEnergy,
          hand: playerState.hand.map((card) => ({
            id: card.id,
            title: card.name,
            cost: card.cost,
            type: card.type,
            description: card.description,
            icon: card.icon || 'Sparkles',
            value: card.value,
            targetType: card.targetType,
          })),
          teamHp: teamTotalHp,
          maxTeamHp: teamMaxHp,
          turnPhase: phase,
          synergyScore,
        };

        try {
          conn.send(payload);
        } catch (err) {
          console.warn(`[HostHub] Sync error for P${playerId}:`, err);
        }
      });
    },
    []
  );

  // Notify turn change
  const notifyTurnChange = useCallback(
    (
      phase: BattlePhase,
      _turnCount: number,
      players: Record<PlayerId, PlayerState>,
      synergyScore: number
    ) => {
      syncPlayerHands(players, phase, synergyScore);
    },
    [syncPlayerHands]
  );

  // Initialize PeerJS Host Engine
  useEffect(() => {
    let isMounted = true;
    let peer: Peer | null = null;

    try {
      peer = new Peer(hostPeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peerRef.current = peer;

      peer.on('open', () => {
        if (!isMounted) return;
        setIsReady(true);
        setError(null);
        console.log(`[HostHub] Host active on room: ${cleanRoomCode} (ID: ${hostPeerId})`);
      });

      peer.on('error', (err) => {
        if (!isMounted) return;
        console.error('[HostHub] Peer error:', err);
        if (err.type === 'unavailable-id') {
          setError(`Kode ruangan "${cleanRoomCode}" sedang aktif di sesi lain. Coba ganti kode ruangan.`);
        } else {
          setError(`Koneksi PeerJS bermasalah: ${err.message}`);
        }
      });

      peer.on('connection', (conn) => {
        // Determine player slot from connection metadata or assign first open
        let assignedSlot: PlayerId = 1;
        const requestedSlot = conn.metadata?.player;

        if (requestedSlot === 2) {
          assignedSlot = 2;
        } else if (requestedSlot === 1) {
          assignedSlot = 1;
        } else {
          // Auto assign open slot
          assignedSlot = !connectionsRef.current[1] ? 1 : 2;
        }

        conn.on('open', () => {
          if (!isMounted) return;
          console.log(`[HostHub] Player ${assignedSlot} connected!`);
          connectionsRef.current[assignedSlot] = conn;

          if (assignedSlot === 1) setP1Connected(true);
          if (assignedSlot === 2) setP2Connected(true);

          // Inform controller of its assigned slot
          conn.send({
            type: 'LOBBY_INFO',
            hostPeerId,
            player1Joined: assignedSlot === 1 || !!connectionsRef.current[1],
            player2Joined: assignedSlot === 2 || !!connectionsRef.current[2],
            gameReady: true,
          });

          onPlayerConnectedRef.current?.(assignedSlot);
        });

        conn.on('data', (rawData: unknown) => {
          if (!isMounted || !rawData || typeof rawData !== 'object') return;
          const message = rawData as PeerMessage;

          switch (message.type) {
            case 'PLAY_CARD':
              console.log(`[HostHub] Card played by P${message.player}: ${message.cardId}`);
              onPlayCardRef.current?.(message);
              break;

            case 'END_TURN':
              console.log(`[HostHub] End Turn dispatched by P${message.player}`);
              onEndTurnRef.current?.(message);
              break;

            case 'JOIN_LOBBY':
              console.log(`[HostHub] P${message.player} joined as ${message.playerName}`);
              break;

            default:
              break;
          }
        });

        conn.on('close', () => {
          if (!isMounted) return;
          console.log(`[HostHub] Player ${assignedSlot} disconnected.`);
          delete connectionsRef.current[assignedSlot];

          if (assignedSlot === 1) setP1Connected(false);
          if (assignedSlot === 2) setP2Connected(false);

          onPlayerDisconnectedRef.current?.(assignedSlot);
        });

        conn.on('error', (connErr) => {
          console.warn(`[HostHub] Connection error with P${assignedSlot}:`, connErr);
        });
      });
    } catch (err) {
      if (isMounted) {
        setError('Gagal menginisialisasi WebRTC Peer host.');
      }
    }

    return () => {
      isMounted = false;
      Object.values(connectionsRef.current).forEach((c) => c?.close());
      connectionsRef.current = {};
      if (peer) {
        peer.destroy();
      }
      peerRef.current = null;
    };
  }, [hostPeerId, cleanRoomCode]);

  return {
    roomCode: cleanRoomCode,
    hostPeerId,
    isReady,
    error,
    p1Connected,
    p2Connected,
    syncPlayerHands,
    notifyTurnChange,
    sendHapticFeedback,
    broadcastMessage,
  };
}
