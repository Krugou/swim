'use client';

import { Bell, BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from '@/lib/notification-service';

export function NotificationToggle() {
  const tNotifications = useTranslations('notifications');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (isNotificationSupported()) {
      setPermission(getNotificationPermission());
      setIsEnabled(getNotificationPermission() === 'granted');
    }
  }, []);

  const handleToggle = async () => {
    if (!isNotificationSupported()) {
      alert(tNotifications('notSupported'));
      return;
    }

    setIsLoading(true);

    try {
      if (isEnabled) {
        // Disable notifications
        await unsubscribeFromPushNotifications();
        setIsEnabled(false);
      } else {
        // Request permission and enable
        const newPermission = await requestNotificationPermission();
        setPermission(newPermission);

        if (newPermission === 'granted') {
          await subscribeToPushNotifications();
          setIsEnabled(true);
        } else {
          alert(tNotifications('permissionDenied'));
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert(tNotifications('error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isNotificationSupported()) {
    return null;
  }

  const getClassName = () => {
    if (isEnabled) {
      return 'bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400';
    }
    if (permission === 'denied') return 'opacity-50 cursor-not-allowed';
    return 'hover:bg-accent';
  };

  const getTitle = () => {
    if (permission === 'denied') return tNotifications('permissionDenied');
    return isEnabled ? tNotifications('disable') : tNotifications('enable');
  };

  // Don't render until hydrated to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || permission === 'denied'}
      className={`p-2 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring ${getClassName()}`}
      aria-label={isEnabled ? tNotifications('disable') : tNotifications('enable')}
      title={getTitle()}
    >
      {isEnabled ? (
        <Bell className={`h-4 w-4 sm:h-5 sm:w-5 ${isLoading ? 'animate-pulse' : ''}`} />
      ) : (
        <BellOff className={`h-4 w-4 sm:h-5 sm:w-5 ${isLoading ? 'animate-pulse' : ''}`} />
      )}
    </button>
  );
}
