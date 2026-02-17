import { useIdleTimer } from 'react-idle-timer';
import { useAuth } from '../contexts/AuthContext';

export function useIdleLogout(timeoutMs = 120_000) {
  const { signOut, currentUser } = useAuth();

  useIdleTimer({
    timeout: timeoutMs,
    onIdle: () => {
      if (currentUser) signOut();
    },
    disabled: !currentUser,
  });
}
