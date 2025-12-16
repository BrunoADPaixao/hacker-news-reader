import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Article } from '../types';
import { getRelativeTime } from '../utils/date';
import { colors } from '../theme/colors'; 

interface ArticleCardProps {
  article: Article;
  onPress: (article: Article) => void;
  onDelete: (articleId: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onPress, 
  onDelete 
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.deleteActionContainer}>
        <RectButton
          style={styles.deleteButton}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete(article.id);
          }}
        >
         
          <Animated.Text style={[styles.deleteButtonText, { transform: [{ scale }] }]}>
            Trash
          </Animated.Text>
        </RectButton>
      </View>
    );
  };

  return (
    <View style={styles.cardWrapper}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        containerStyle={styles.swipeContainer} 
      >
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => onPress(article)}
          style={styles.container}
        >
          <View style={styles.accentBar} />
          
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.metaText}>
                {article.author}
              </Text>
              <Text style={styles.timeText}>
                {getRelativeTime(article.createdAt)}
              </Text>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {article.displayTitle}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: 'transparent', 
  },
  swipeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  container: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    height: 100, 
    alignItems: 'center',
  },
  accentBar: {
    width: 4,
    height: '60%',
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginLeft: 16,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700', 
    color: colors.textPrimary,
    lineHeight: 22,
    letterSpacing: -0.3, 
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary, 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteActionContainer: {
    width: 80,
    height: '100%',
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});