import { runtimeConfig } from '../../lib/config/runtime';
import { getStoredSessionToken } from '../context/AuthSessionContext';

/**
 * Enhanced API utility for the PakiSHIP mobile app.
 * Uses runtimeConfig to ensure it works on real devices/emulators.
 * Sends session token as Authorization header for React Native compatibility.
 */
export async function apiRequest(path: string, init: RequestInit = {}) {
  const isFormData = init.body instanceof FormData;
  
  const headers: Record<string, string> = {
    'Bypass-Tunnel-Reminder': 'any',
    ...(init.headers as Record<string, string> ?? {}),
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach session token for mobile — cookies are not reliably sent in React Native
  const token = getStoredSessionToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${runtimeConfig.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`, {
    credentials: 'include',
    headers,
    ...init,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}
