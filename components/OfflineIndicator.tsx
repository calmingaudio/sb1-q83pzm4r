import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Props {
  isOnline: boolean;
  lastSyncDate: Date | null;
}

export default function OfflineIndicator({ isOnline, lastSyncDate }: Props) {
  if (isOnline) return null;

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <WifiOff size={16} color={Colors.light.textSecondary} />
      <Text style={styles.text}>Offline Mode</Text>
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
  syncText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 'auto',
  },
});