
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { 
  NavigationContainer, 
  createNavigationContainerRef 
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import notifee, { EventType } from '@notifee/react-native';

import { colors } from './src/theme/colors';
import { HomeScreen } from './src/screens/HomeScreen';
import { ArticleWebView } from './src/screens/ArticleWebView';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const App = () => {

  // Notification listeners setup
  useEffect(() => {
    
    // A. Notification handling when app is in foreground/background
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        const { url, title } = detail.notification.data || {};
        
        if (url && navigationRef.isReady()) {
          navigationRef.navigate('ArticleWebView', { 
            url: url as string, 
            title: (title as string) || 'Article' 
          });
        }
      }
    });

    // B. Handle notification that OPENED the app (Quit state)
    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification) {
        const { url, title } = initialNotification.notification.data || {};
        
        if (url) {
          // Small delay to ensure navigation container is mounted
          setTimeout(() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate('ArticleWebView', { 
                url: url as string, 
                title: (title as string) || 'Article' 
              });
            }
          }, 500);
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          
          <Stack.Navigator
            initialRouteName="Home"
           screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.textPrimary,
            headerTitleStyle: {
              fontWeight: '800', 
              fontSize: 20,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background }, 
          }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'HN Reader' }} 
            />

            <Stack.Screen 
              name="ArticleWebView" 
              component={ArticleWebView} 
            />
            
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;