import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#4ade80';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
      default:
        return '#3b82f6';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <View style={[
      styles.container,
      { borderLeftColor: getNotificationColor(notification.type) },
      !notification.read && styles.unreadContainer
    ]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon
            name={getNotificationIcon(notification.type)}
            size={20}
            color={getNotificationColor(notification.type)}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.message} numberOfLines={3}>
            {notification.message}
          </Text>
          <Text style={styles.time}>
            {formatTime(notification.createdAt)}
          </Text>
        </View>

        <View style={styles.actions}>
          {!notification.read && (
            <TouchableOpacity
              onPress={() => onMarkAsRead(notification._id)}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="check" size={18} color="#6b7280" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => onDelete(notification._id)}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {!notification.read && (
        <View style={styles.unreadIndicator} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    position: 'relative',
  },
  unreadContainer: {
    backgroundColor: '#f8fafc',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
});

export default NotificationItem;