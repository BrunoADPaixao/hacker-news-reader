import React, { useEffect, useCallback, useLayoutEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  RefreshControl,
  SafeAreaView,
  Alert,
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

import { colors } from '../theme/colors';
import { useArticleStore } from '../store/useArticleStore';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';
import { configureBackgroundFetch } from '../services/BackgroundTask';

type RootStackParamList = {
  Home: undefined;
  ArticleWebView: { url: string; title: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const { 
    articles, 
    isLoading, 
    error, 
    fetchArticles, 
    deleteArticle,
    setNotificationPreferences
  } = useArticleStore();

  useEffect(() => {
    fetchArticles();
    
    configureBackgroundFetch();

    const requestPermission = async () => {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permission denied');
      }
    };
    
    requestPermission();
  }, []);

  const handleSettingsPress = () => {
    Alert.alert(
      "Notification Preferences",
      "Select the topics you want to be notified about:",
      [
        { 
          text: "Mobile (All)", 
          onPress: () => {
            setNotificationPreferences(['mobile']);
            Alert.alert("Success", "You will be notified about all mobile news.");
          }
        },
        { 
          text: "Android Only", 
          onPress: () => {
            setNotificationPreferences(['android']);
            Alert.alert("Success", "You will be notified about Android news only.");
          }
        },
        { 
          text: "iOS Only", 
          onPress: () => {
            setNotificationPreferences(['ios']);
            Alert.alert("Success", "You will be notified about iOS news only.");
          }
        },
        { 
          text: "Disable Notifications", // Requisito: "Option to disable notifications entirely" 
          style: "destructive",
          onPress: () => {
            setNotificationPreferences([]); 
            Alert.alert("Disabled", "Background notifications are turned off.");
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSettingsPress} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Settings</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onRefresh = useCallback(() => {
    fetchArticles(true);
  }, [fetchArticles]);

  const handlePress = (article: Article) => {
    navigation.navigate('ArticleWebView', {
      url: article.url,
      title: article.displayTitle,
    });
  };

  const renderItem = ({ item }: { item: Article }) => (
    <ArticleCard
      article={item}
      onPress={handlePress}
      onDelete={deleteArticle}
    />
  );

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Fetching stories...</Text>
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>
          {error ? 'Could not update data.\nCheck your connection.' : 'No articles found.'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={articles.length === 0 ? styles.listEmpty : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={['#0000ff']}
            tintColor="#0000ff"
          />
        }
        ListEmptyComponent={renderEmptyComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10, 
  },
  listEmpty: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerButtonText: {
    color: '#007AFF', 
    fontSize: 16,
    fontWeight: '600',
  }
});