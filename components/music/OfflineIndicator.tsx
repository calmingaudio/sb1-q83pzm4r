import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff, HardDrive } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  downloadedCount: number;
  totalSize: string;
  isVisible: boolean;
}

export default function OfflineIndicator({ downloadedCount, totalSize, isVisible }: Props) {
  const { colors } = useTheme();

  if (!isVisible || downloadedCount === 0) return null;

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.success, colors.success + 'CC']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <HardDrive size={16} color="#ffffff" strokeWidth={2.5} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Offline Ready</Text>
            <Text style={styles.subtitle}>
              {downloadedCount} track{downloadedCount !== 1 ? 's' : ''} • {totalSize}
            </Text>
          </View>
          <View style={styles.offlineIcon}>
            <WifiOff size={14} color="rgba(255,255,255,0.8)" strokeWidth={2} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  offlineIcon: {
    marginLeft: 8,
  },
});