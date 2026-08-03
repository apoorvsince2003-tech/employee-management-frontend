import { useEffect, useState } from 'react';
import { leaveService } from '@/services';

// Lightweight hook that loads sidebar/notification badge counts once.
export function useBadgeCounts() {
  const [pendingLeaves, setPendingLeaves] = useState(0);

  useEffect(() => {
    let active = true;
    leaveService.pendingCount().then((c) => active && setPendingLeaves(c));
    return () => {
      active = false;
    };
  }, []);

  return { pendingLeaves };
}
