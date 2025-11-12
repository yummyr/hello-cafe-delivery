import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  DollarSign,
  User,
  X,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

const OrderNotificationModal = ({
  isOpen,
  onClose,
  waitingOrders,
  onViewOrder,
  onConfirmOrder
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // display the modal after a short delay 
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatWaitingTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} mins`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} hours ${mins > 0 ? mins + ' mins' : ''}`;
    }
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatTime = (timeString) => {
    try {
      return new Date(timeString).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timeString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* background overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* visible modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className={`relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden transform transition-all duration-300 ${
            isVisible
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-95 opacity-0 translate-y-4'
          }`}
        >
          {/* header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    New order notification
                  </h2>
                  <p className="text-orange-100 text-sm">
                     {waitingOrders?.count || 0} orders waiting acceptance
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-orange-200 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {waitingOrders?.orders && waitingOrders.orders.length > 0 ? (
              <div className="space-y-4">
                {waitingOrders.orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-semibold text-gray-500">
                            Order Number: {order.number}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(order.orderTime)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{order.userName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-green-600">
                              {formatAmount(order.amount)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className={`h-4 w-4 ${
                              order.waitingMinutes > 30 ? 'text-red-500' : 'text-yellow-500'
                            }`} />
                            <span className={`text-sm font-medium ${
                              order.waitingMinutes > 30 ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              waiting time: {formatWaitingTime(order.waitingMinutes)}
                            </span>
                            {order.waitingMinutes > 30 && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                Urgent Order
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* buttons */}
                    <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => onViewOrder(order.id)}
                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
                      >
                        <span>View Order</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onConfirmOrder(order.id)}
                        className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept Order</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600 text-lg font-medium mb-1">
                  Awsome! 
                </p>
                <p className="text-gray-500 text-sm">
                  You have no waiting orders!
                </p>
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Navigate to orders page
                  window.location.href = '/admin/orders?searchStatus=2';
                }}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium"
              >
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNotificationModal;