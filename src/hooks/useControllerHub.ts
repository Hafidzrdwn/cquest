import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import { 
  PlayerId, 
  PeerMessage, 
  PlayerHandSyncPayload, 
  HapticFeedbackPayload,
  PlayCardPayload,
  EndTurnPayload
} from '../types/game';

interface UseControllerHubOptions {
  targetRoom?: string;
  desiredPlayer?: PlayerId;
  playerName?: string;
  onHandSync?: (payload: PlayerHandSyncPayload) => void;
  onHaptic?: (pattern: HapticFeedbackPayload['pattern']) => void;
}

export interface UseControllerHubReturn {
  roomCode: string;
  assignedPlayer: PlayerId;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  latestHandSync: PlayerHandSyncPayload | null;
  dispatchPlayCard: (cardId: string, targetId?: string) => boolean;
  dispatchEndTurn: () => boolean;
  reconnect: () => void;
  setAssignedPlayer: (player: PlayerId) => void;
}

/**
 * Triggers native haptic vibration safely with specific emotional patterns
 */
export function triggerHaptic(pattern: HapticFeedbackPayload['pattern'] | 'SWIPE') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    switch (pattern) {
      case 'SWIPE':
        navigator.vibrate(30);
        break;
      case 'SHIELD':
        navigator.vibrate([30, 40, 30]);
        break;
      case 'DAMAGE':
      case 'IMPACT':
        navigator.vibrate([60, 40, 90]);
        break;
      case 'COMBO':
        // Perfect Harmony combo vibration rhythm
        navigator.vibrate([35, 50, 45, 50, 100]);
        break;
      default:
        navigator.vibrate(40);
    }
  } catch {
    // Ignore devices that block vibration without user gesture
  }
}

export function useControllerHub({
  targetRoom = 'LOVE',
  desiredPlayer = 1,
  playerName = 'Player',
  onHandSync,
  onHaptic,
}: UseControllerHubOptions = {}): UseControllerHubReturn {
  const cleanRoomCode = (targetRoom || 'LOVE').toUpperCase().trim().slice(0, 6);
  const hostPeerId = `cquest-host-${cleanRoomCode}`;

  const [assignedPlayer, setAssignedPlayer] = useState<PlayerId>(desiredPlayer);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestHandSync, setLatestHandSync] = useState<PlayerHandSyncPayload | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHandSyncRef = useRef(onHandSync);
  const onHapticRef = useRef(onHaptic);

  useEffect(() => {
    onHandSyncRef.current = onHandSync;
    onHapticRef.current = onHaptic;
  }, [onHandSync, onHaptic]);

  // Keep assignedPlayer synced if desiredPlayer prop changes
  useEffect(() => {
    setAssignedPlayer(desiredPlayer);
  }, [desiredPlayer]);

  // Dispatch card play to Host
  const dispatchPlayCard = useCallback(
    (cardId: string, targetId?: string): boolean => {
      const conn = connectionRef.current;
      if (!conn || !conn.open) {
        console.warn('[ControllerHub] Cannot play card: not connected to host');
        return false;
      }

      const payload: PlayCardPayload = {
        type: 'PLAY_CARD',
        player: assignedPlayer,
        cardId,
        targetId,
        timestamp: Date.now(),
      };

      try {
        conn.send(payload);
        triggerHaptic('SWIPE');
        return true;
      } catch (err) {
        console.error('[ControllerHub] Failed to send PLAY_CARD:', err);
        return false;
      }
    },
    [assignedPlayer]
  );

  // Dispatch End Turn to Host
  const dispatchEndTurn = useCallback((): boolean => {
    const conn = connectionRef.current;
    if (!conn || !conn.open) {
      console.warn('[ControllerHub] Cannot end turn: not connected to host');
      return false;
    }

    const payload: EndTurnPayload = {
      type: 'END_TURN',
      player: assignedPlayer,
      timestamp: Date.now(),
    };

    try {
      conn.send(payload);
      triggerHaptic('SHIELD');
      return true;
    } catch (err) {
      console.error('[ControllerHub] Failed to send END_TURN:', err);
      return false;
    }
  }, [assignedPlayer]);

  // Connect to Host logic
  const connectToHost = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnecting(true);
    setError(null);

    // Clean up previous peer if existing
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    const clientPeerId = `cquest-ctrl-${cleanRoomCode}-${assignedPlayer}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      const peer = new Peer(clientPeerId, {
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
        console.log(`[ControllerHub] Connecting to host ${hostPeerId} as P${assignedPlayer}...`);
        
        const conn = peer.connect(hostPeerId, {
          reliable: true,
          metadata: {
            player: assignedPlayer,
            name: playerName,
          },
        });

        connectionRef.current = conn;

        conn.on('open', () => {
          console.log(`[ControllerHub] Connected to Host (${hostPeerId})!`);
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);

          // Handshake greeting
          conn.send({
            type: 'JOIN_LOBBY',
            player: assignedPlayer,
            playerName,
          });

          triggerHaptic('SHIELD');
        });

        conn.on('data', (rawData: unknown) => {
          if (!rawData || typeof rawData !== 'object') return;
          const message = rawData as PeerMessage;

          switch (message.type) {
            case 'SYNC_HAND':
              setLatestHandSync(message);
              if (message.player && message.player !== assignedPlayer) {
                setAssignedPlayer(message.player);
              }
              onHandSyncRef.current?.(message);
              break;

            case 'HAPTIC_TRIGGER':
              triggerHaptic(message.pattern);
              onHapticRef.current?.(message.pattern);
              break;

            case 'LOBBY_INFO':
              console.log('[ControllerHub] Lobby info received from host');
              break;

            default:
              break;
          }
        });

        conn.on('close', () => {
          console.warn('[ControllerHub] Host connection closed. Attempting reconnect in 2.5s...');
          setIsConnected(false);
          setIsConnecting(false);
          setError('Koneksi ke Host terputus. Mencoba menghubungkan kembali...');

          // Auto reconnect backoff
          reconnectTimeoutRef.current = setTimeout(() => {
            connectToHost();
          }, 2500);
        });

        conn.on('error', (connErr) => {
          console.warn('[ControllerHub] Connection error:', connErr);
          setError(`Gagal terhubung ke Host: ${connErr.message || 'Host tidak ditemukan'}`);
          setIsConnecting(false);
        });
      });

      peer.on('error', (peerErr) => {
        console.warn('[ControllerHub] Peer error:', peerErr);
        if (peerErr.type === 'peer-unavailable') {
          setError(`Host ruangan "${cleanRoomCode}" belum aktif. Pastikan layar laptop sudah dibuka.`);
        } else {
          setError(`Koneksi PeerJS error: ${peerErr.message}`);
        }
        setIsConnecting(false);
      });
    } catch (err) {
      console.error('[ControllerHub] Initialization exception:', err);
      setError('Gagal menginisialisasi controller WebRTC.');
      setIsConnecting(false);
    }
  }, [cleanRoomCode, hostPeerId, assignedPlayer, playerName]);

  // Initial connection & cleanup on unmount
  useEffect(() => {
    connectToHost();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [connectToHost]);

  return {
    roomCode: cleanRoomCode,
    assignedPlayer,
    isConnected,
    isConnecting,
    error,
    latestHandSync,
    dispatchPlayCard,
    dispatchEndTurn,
    reconnect: connectToHost,
    setAssignedPlayer,
  };
}
