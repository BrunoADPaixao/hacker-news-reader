import BackgroundFetch from 'react-native-background-fetch';
import notifee, { AndroidImportance } from '@notifee/react-native';
import axios from 'axios';
import { useArticleStore } from '../store/useArticleStore';

// Função auxiliar para checar novidades
const checkForNewArticles = async () => {
  const state = useArticleStore.getState();
  const { lastNotifiedId, notificationKeywords } = state;

  // Constrói a query baseada na preferencia do user [cite: 24]
  const query =
    notificationKeywords.length > 0 ? notificationKeywords[0] : 'mobile';

  try {
    const response = await axios.get(
      `https://hn.algolia.com/api/v1/search_by_date?query=${query}&hitsPerPage=1`,
    );

    const latestHit = response.data.hits[0];

    if (!latestHit) return;

    if (latestHit.objectID !== lastNotifiedId) {
      const channelId = await notifee.createChannel({
        id: 'news_alert',
        name: 'New Articles',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: 'New Article Found!',
        body:
          latestHit.story_title ||
          latestHit.title ||
          'Check out the latest news.',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
        data: {
          url: latestHit.story_url || latestHit.url,
          title: latestHit.story_title || latestHit.title,
        },
      });
      state.updateLastNotifiedId(latestHit.objectID);
    }
  } catch (error) {
    console.error('[BackgroundFetch] Failed to fetch:', error);
  }
};

export const configureBackgroundFetch = async () => {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },
    async taskId => {
      console.log('[BackgroundFetch] Task started:', taskId);

      await checkForNewArticles();
      BackgroundFetch.finish(taskId);
    },
    error => {
      console.error('[BackgroundFetch] Configure error:', error);
    },
  );
};
