import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import axios from 'axios';
import { Article, AlgoliaHit } from '../types';

// initialize mmkv
const storage = createMMKV();

// Wrapper for Zustand to use MMKV
const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

interface ArticleState {
  articles: Article[];
  deletedIds: string[]; // deleted IDs blacklist
  isLoading: boolean;
  error: string | null;

  fetchArticles: (isRefresh?: boolean) => Promise<void>;
  deleteArticle: (id: string) => void;
  restoreArticle: (id: string) => void;

  lastNotifiedId: string | null;
  notificationKeywords: string[];
  setNotificationPreferences: (keywords: string[]) => void;
  updateLastNotifiedId: (id: string) => void;
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      articles: [],
      deletedIds: [],
      isLoading: false,
      error: null,

      fetchArticles: async (isRefresh = false) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.get(
            'https://hn.algolia.com/api/v1/search_by_date?query=mobile',
          );

          const hits = response.data.hits as AlgoliaHit[];
          const currentDeletedIds = get().deletedIds;

          const cleanArticles: Article[] = hits
            .map(hit => ({
              id: hit.objectID,
              displayTitle: hit.story_title || hit.title || 'Untitled',
              author: hit.author,
              createdAt: hit.created_at,
              url: hit.story_url || hit.url || 'https://news.ycombinator.com',
              isDeleted: false,
            }))
            .filter(art => !currentDeletedIds.includes(art.id));

          set({ articles: cleanArticles, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: 'Offline mode: Showing cached data' });
        }
      },

      deleteArticle: id => {
        set(state => ({
          articles: state.articles.filter(a => a.id !== id),
          deletedIds: [...state.deletedIds, id],
        }));
      },

      restoreArticle: id => {},

      lastNotifiedId: null,
      notificationKeywords: ['mobile'],
      setNotificationPreferences: keywords => {
        set({ notificationKeywords: keywords });
      },

      updateLastNotifiedId: id => {
        set({ lastNotifiedId: id });
      },
    }),
    {
      name: 'article-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: state => ({
        articles: state.articles,
        deletedIds: state.deletedIds,
        lastNotifiedId: state.lastNotifiedId,
        notificationKeywords: state.notificationKeywords,
      }),
    },
  ),
);
