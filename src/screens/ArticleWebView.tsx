import React, { useLayoutEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ArticleWebView: { url: string; title: string };
};

type ArticleWebViewRouteProp = RouteProp<RootStackParamList, 'ArticleWebView'>;

export const ArticleWebView = () => {
  const route = useRoute<ArticleWebViewRouteProp>();
  const navigation = useNavigation();
  const { url, title } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || 'Article',
      headerBackTitle: 'Back', 
    });
  }, [navigation, title]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});