import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff, User, Shield } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Props {
  isOnline: boolean;
  lastSyncDate: Date | null;
  isOfflineMode?: boolean;
  isAuthenticated?: boolean;
}

export default function OfflineIndicator({ 
  isOnline, 
  lastSyncDate, 
  isOfflineMode = false,
  isAuthenticated = false 
}: Props) {
  if (isOnline && !isOfflineMode) return null;

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline Mode';
    if (isOfflineMode) return 'Cached Mode';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} color={Colors.light.textSecondary} />;
    if (isOfflineMode) return <Shield size={16} color={Colors.light.textSecondary} />;
    return <Wifi size={16} color={Colors.light.textSecondary} />;
  };

  return (
    <View style={styles.container}>
      {getStatusIcon()}
      <Text style={styles.text}>{getStatusText()}</Text>
      {isAuthenticated && (
        <User size={14} color={Colors.light.textSecondary} style={styles.userIcon} />
      )}
      <Text style={styles.syncText}>Last sync: {formatLastSync(lastSyncDate)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 8,
  },
  userIcon: {
    marginLeft: 8,
  },
  syncText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 'auto',
  },
});