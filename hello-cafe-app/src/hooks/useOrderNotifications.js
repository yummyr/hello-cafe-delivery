import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';

const useOrderNotifications = () => {
  const [waitingOrders, setWaitingOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lastNotificationCount = useRef(0);
  const pollIntervalRef = useRef(null);
  const NOTIFICATION_CHECK_INTERVAL = 30000; // check waiting orders every 30 seconds
  const AUDIO_NOTIFICATION_ENABLED = true;

  // check waiting orders
  const checkWaitingOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/admin/orders/waiting-acceptance');
      console.log('🔔 waiting order response:', response.data);

      if (response.data.code === 1 && response.data.data) {
        const data = response.data.data;
        setWaitingOrders(data);

        // display notification if there are new orders
        const currentCount = data.count || 0;
        const previousCount = lastNotificationCount.current;

        // if there are new orders and they are greater than or equal to the previous count or the previous count is 0 (unknown)
        if (currentCount > 0 && (currentCount > previousCount || previousCount === 0)) {
          console.log('🔔 new orders found, display notification');
          setIsModalOpen(true);

          // play notification sound
          if (AUDIO_NOTIFICATION_ENABLED && currentCount > previousCount) {
            playNotificationSound();
          }
        }

        lastNotificationCount.current = currentCount;
      } else {
        console.warn('⚠️ Failed to check waiting orders:', response.data.msg);
        setError(response.data.msg || 'Failed to check waiting orders');
      }
    } catch (error) {
      console.error('❌ Error checking waiting orders:', error);
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      // new Audio('/notification.mp3').play();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // set frequency
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('🔇 Unable to play notification sound:', error);
    }
  };

  // Start polling
  const startPolling = useCallback(() => {
    console.log('🔄 Start polling for orders');

    // Check waiting orders immediately
    checkWaitingOrders();

    // Set interval to check waiting orders
    pollIntervalRef.current = setInterval(checkWaitingOrders, NOTIFICATION_CHECK_INTERVAL);
  }, [checkWaitingOrders]);

  // Stop polling
  const stopPolling = useCallback(() => {
    console.log('⏹️ Stop polling');

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    console.log('🔄 Manually check orders');
    checkWaitingOrders();
  }, [checkWaitingOrders]);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Open modal manually
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // View order details
  const viewOrder = useCallback((orderId) => {
    console.log('👀 Check order details:', orderId);
    setIsModalOpen(false);
    // Navigate to order details
    window.location.href = `/admin/orders/details/${orderId}`;
  }, []);

  // Confirm order
  const confirmOrder = useCallback(async (orderId) => {
    try {
      console.log('✅ Confirming order:', orderId);

      const response = await api.put('/admin/orders/confirm', {
        id: orderId
      });

      if (response.data.code === 1) {
        console.log('✅ Order confirmed successfully');
        setIsModalOpen(false);

        // Refresh waiting orders
        setTimeout(() => {
          checkWaitingOrders();
        }, 1000);

        // Order confirmed successfully notification
        alert('Order confirmed successfully');
      } else {
        throw new Error(response.data.msg || 'Failed to confirm order');
      }
    } catch (error) {
      console.error('❌ Failed to confirm order:', error);
      alert('Failed to confirm order: ' + (error.response?.data?.msg || error.message));
    }
  }, [checkWaitingOrders]);

  // Automatic polling of waiting orders
  useEffect(() => {
    startPolling();

    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  // Handle visibility change to start or stop polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop polling when page is not visible
        stopPolling();
      } else {
        // Restart polling when page becomes visible
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startPolling, stopPolling]);

  return {
    waitingOrders,
    isLoading,
    error,
    isModalOpen,
    checkWaitingOrders,
    refresh,
    closeModal,
    openModal,
    viewOrder,
    confirmOrder,
    startPolling,
    stopPolling
  };
};

export default useOrderNotifications;