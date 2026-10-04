import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Returns true when the device has internet access.
 * Uses NetInfo event subscription — instant detection, no polling.
 * Starts as `true` (optimistic) to avoid a flash of the offline banner
 * before the first NetInfo fetch completes.
 */
export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Fetch current state immediately on mount
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected ?? true);
    });

    // Subscribe to future changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });

    return unsubscribe;
  }, []);

  return isOnline;
}

export default useNetworkStatus;
