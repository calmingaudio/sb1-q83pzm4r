import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Download, Check, X, Loader } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/components/ThemeProvider';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';

interface Props {
  isDownloaded: boolean;
  isDownloading: boolean;
  progress?: number;
  onDownload: () => void;
  onDelete: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function DownloadButton({ 
  isDownloaded, 
  isDownloading, 
  progress = 0, 
  onDownload, 
  onDelete, 
  size = 'medium',
  disabled = false 
}: Props) {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isDownloading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    } else {
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isDownloading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const getSize = () => {
    switch (size) {
      case 'small':
        return { buttonSize: 32, iconSize: 16, fontSize: 10 };
      case 'large':
        return { buttonSize: 48, iconSize: 24, fontSize: 14 };
      default:
        return { buttonSize: 40, iconSize: 20, fontSize: 12 };
    }
  };

  const { buttonSize, iconSize, fontSize } = getSize();
  const styles = createStyles(colors, buttonSize);

  const handlePress = () => {
    if (disabled || isDownloading) return;
    
    if (isDownloaded) {
      onDelete();
    } else {
      onDownload();
    }
  };

  const renderContent = () => {
    if (isDownloading) {
      return (
        <View style={styles.downloadingContainer}>
          <Animated.View style={animatedStyle}>
            <Loader size={iconSize} color="#ffffff" strokeWidth={2.5} />
          </Animated.View>
          {size !== 'small' ? (
            <Text style={[styles.progressText, { fontSize }]}>
              {Math.round(progress)}%
            </Text>
          ) : null}
        </View>
      );
    }

    if (isDownloaded) {
      return (
        <View style={styles.downloadedContainer}>
          <Check size={iconSize} color="#ffffff" strokeWidth={2.5} />
          {size === 'large' ? (
            <X size={iconSize - 4} color="rgba(255,255,255,0.8)" strokeWidth={2} />
          ) : null}
        </View>
      );
    }

    return <Download size={iconSize} color="#ffffff" strokeWidth={2.5} />;
  };

  const getGradientColors = () => {
    if (isDownloading) {
      return ['#6366f1', '#8b5cf6'];
    }
    if (isDownloaded) {
      return ['#10b981', '#059669'];
    }
    return ['#06b6d4', '#0ea5e9'];
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled || isDownloading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderContent()}
      </LinearGradient>
      
      {/* Progress Ring */}
      {isDownloading ? (
        <View style={styles.progressRing}>
          <View 
            style={[
              styles.progressFill, 
              { 
                transform: [{ rotate: `${(progress / 100) * 360}deg` }],
                borderColor: colors.success 
              }
            ]} 
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const createStyles = (colors: any, buttonSize: number) => StyleSheet.create({
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    overflow: 'hidden',
    position: 'relative',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 2,
  },
  progressRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: (buttonSize + 4) / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: (buttonSize + 4) / 2,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: colors.success,
  },
});