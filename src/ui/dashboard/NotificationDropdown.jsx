import { useState, useEffect, useRef } from "react";
import { BellIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const NotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  isDarkMode,
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if click is not on the bell button
        const bellButton = event.target.closest('[aria-label="Notifications"]');
        if (!bellButton) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const cardStyles = isDarkMode
    ? "border-slate-800 bg-slate-900/95 text-slate-100 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.95)]"
    : "border-slate-200 bg-white text-slate-900 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)]";

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
      case "completed":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type, isRead) => {
    if (isRead) {
      return isDarkMode
        ? "border-slate-700 bg-slate-800/50"
        : "border-slate-200 bg-slate-50";
    }

    switch (type?.toLowerCase()) {
      case "success":
      case "completed":
        return isDarkMode
          ? "border-emerald-800 bg-emerald-950/30"
          : "border-emerald-200 bg-emerald-50/60";
      case "warning":
        return isDarkMode
          ? "border-amber-800 bg-amber-950/30"
          : "border-amber-200 bg-amber-50/60";
      case "error":
        return isDarkMode
          ? "border-rose-800 bg-rose-950/30"
          : "border-rose-200 bg-rose-50/60";
      case "info":
      default:
        return isDarkMode
          ? "border-blue-800 bg-blue-950/30"
          : "border-blue-200 bg-blue-50/60";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-3xl border ${cardStyles} backdrop-blur-sm`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${
          isDarkMode ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
            isDarkMode
              ? "hover:bg-slate-800"
              : "hover:bg-slate-100"
          }`}
          aria-label="Close notifications"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <BellIcon
              className={`h-12 w-12 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}
            />
            <p
              className={`mt-3 text-sm font-semibold ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              No notifications yet
            </p>
            <p
              className={`mt-1 text-xs ${
                isDarkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {notifications.map((notification) => {
              const isRead = notification.read || notification.isRead;
              const notificationType = notification.type || notification.category || "info";
              const notificationColor = getNotificationColor(notificationType, isRead);

              return (
                <div
                  key={notification._id || notification.id}
                  className={`group relative border-l-4 px-4 py-3 transition hover:bg-opacity-80 ${notificationColor}`}
                  onClick={() => {
                    if (!isRead && onMarkAsRead) {
                      onMarkAsRead(notification._id || notification.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">
                      {getNotificationIcon(notificationType)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isRead
                              ? isDarkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                              : isDarkMode
                              ? "text-slate-100"
                              : "text-slate-900"
                          }`}
                        >
                          {notification.title || notification.subject || "Notification"}
                        </p>
                        {!isRead && (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>
                      {(notification.message || notification.body || notification.content) && 
                       (notification.message || notification.body || notification.content) !== (notification.title || notification.subject) && (
                        <p
                          className={`mt-1 text-xs leading-relaxed ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {notification.message || notification.body || notification.content}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`text-[10px] ${
                            isDarkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {formatTime(
                            notification.createdAt ||
                              notification.timestamp ||
                              notification.date
                          )}
                        </span>
                        {!isRead && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onMarkAsRead) {
                                onMarkAsRead(notification._id || notification.id);
                              }
                            }}
                            className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold transition ${
                              isDarkMode
                                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            <CheckIcon className="h-3 w-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && unreadCount > 0 && (
        <div
          className={`border-t px-4 py-3 ${
            isDarkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (onMarkAllAsRead) {
                onMarkAllAsRead();
              }
            }}
            className={`w-full rounded-xl px-3 py-2 text-xs font-semibold transition ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

