/**
 * PLATAFORMA PARK CMMS — Cliente Socket.io Singleton
 * Gestión de conexión bidireccional en tiempo real, reconexión automática y eventos.
 */

import { io } from 'socket.io-client';

let socket = null;
let currentStatus = 'disconnected'; // 'connected' | 'reconnecting' | 'disconnected'
const statusListeners = new Set();
const presenceListeners = new Set();

const getSocketUrl = () => {
  if (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.startsWith('file:')) {
    return window.location.origin;
  }
  return 'http://localhost:8000';
};

const notifyStatus = (status) => {
  currentStatus = status;
  statusListeners.forEach((cb) => {
    try {
      cb(status);
    } catch (e) {
      console.error('[Socket] Error in status listener:', e);
    }
  });
};

export const getConnectionStatus = () => currentStatus;

export const onConnectionChange = (callback) => {
  statusListeners.add(callback);
  callback(currentStatus);
  return () => statusListeners.delete(callback);
};

export const onPresenceUpdate = (callback) => {
  presenceListeners.add(callback);
  return () => presenceListeners.delete(callback);
};

export const initSocket = (user, token) => {
  if (socket && socket.connected) {
    // Si ya existe socket conectado, re-autenticar si cambió de usuario
    socket.emit('auth:handshake', { user, token });
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  notifyStatus('reconnecting');

  const serverUrl = getSocketUrl();
  console.log(`🔌 [Socket.io] Conectando a ${serverUrl}...`);

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    auth: {
      token: token || localStorage.getItem('cmms_auth_token') || '',
      user: user || null
    }
  });

  socket.on('connect', () => {
    console.log(`🟢 [Socket.io] Conectado exitosamente con ID: ${socket.id}`);
    notifyStatus('connected');

    // Enviar handshake de autenticación
    socket.emit('auth:handshake', {
      user,
      token: token || localStorage.getItem('cmms_auth_token') || ''
    });
  });

  socket.on('disconnect', (reason) => {
    console.warn(`🟡 [Socket.io] Desconectado (${reason}). Modo local activado.`);
    notifyStatus('reconnecting');
  });

  socket.on('connect_error', (error) => {
    console.warn(`⚠️ [Socket.io] Error de conexión (${error.message}). Reintentando...`);
    notifyStatus('reconnecting');
  });

  socket.on('presence:update', (data) => {
    presenceListeners.forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error('[Socket] Error in presence listener:', e);
      }
    });
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    notifyStatus('disconnected');
    console.log('🔴 [Socket.io] Socket desconectado manualmente.');
  }
};

export const emitSocket = (event, payload) => {
  if (socket && socket.connected) {
    socket.emit(event, payload);
    return true;
  }
  return false;
};

export const onSocket = (event, callback) => {
  if (!socket) return () => {};
  socket.on(event, callback);
  return () => {
    if (socket) socket.off(event, callback);
  };
};

export const joinOrderRoom = (orderId) => {
  if (!orderId) return;
  emitSocket('chat:join_room', { orderId });
};

export const leaveOrderRoom = (orderId) => {
  if (!orderId) return;
  emitSocket('chat:leave_room', { orderId });
};

export const emitTyping = (orderId, user, isTyping) => {
  if (!orderId) return;
  emitSocket('chat:typing', { orderId, user, isTyping });
};
