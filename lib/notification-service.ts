'use client';

export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const NOTIFICATION_PERMISSION_KEY = 'notification-permission-requested';

export const isNotificationSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
};

export const hasRequestedPermission = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === 'true';
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  if (!isNotificationSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // You would need to generate a VAPID key for production
      // For now, this is a placeholder
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrXj-j9v4KJ9b8KjXJx5rJxKjJxJx',
      ) as BufferSource,
    });

    // Send subscription to your backend server here
    // console.log('Push subscription:', subscription);

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });
    });
  } else {
    new Notification(title, {
      icon: '/icon-192x192.png',
      ...options,
    });
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if hall is available and notify
export const checkAndNotifyAvailability = (
  hallName: string,
  isAvailable: boolean,
  wasPreviouslyUnavailable: boolean,
): void => {
  if (isAvailable && wasPreviouslyUnavailable && Notification.permission === 'granted') {
    showNotification(`${hallName} is now available!`, {
      body: 'A swimming spot just opened up. Book now!',
      tag: `hall-${hallName}`,
    });
  }
};
