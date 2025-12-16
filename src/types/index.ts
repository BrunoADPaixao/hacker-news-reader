export interface AlgoliaHit {
  objectID: string;
  title: string | null;
  story_title: string | null;
  author: string;
  created_at: string;
  story_url: string | null;
  url: string | null;
  _tags: string[];
}

export interface Article {
  id: string;
  displayTitle: string;
  author: string;
  createdAt: string;
  url: string;
  isDeleted: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  ArticleWebView: { url: string; title: string };
};
