import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ArticleCard } from '../ArticleCard';
import { Article } from '../../types';

jest.mock('../../utils/date', () => ({
  getRelativeTime: () => '2h',
}));

describe('ArticleCard Component', () => {
  const mockArticle: Article = {
    id: '1',
    displayTitle: 'React Native is Awesome',
    author: 'Jane Doe',
    createdAt: '2023-10-10T10:00:00Z',
    url: 'https://example.com',
    isDeleted: false,
  };

  const mockOnPress = jest.fn();
  const mockOnDelete = jest.fn();

  it('should render article details correctly', () => {
    const { getByText } = render(
      <ArticleCard
        article={mockArticle}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('React Native is Awesome')).toBeTruthy();
    expect(getByText(/Jane Doe/)).toBeTruthy();
    expect(getByText(/2h/)).toBeTruthy();
  });

  it('should call onPress with the correct article when tapped', () => {
    const { getByText } = render(
      <ArticleCard
        article={mockArticle}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('React Native is Awesome'));
   
    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledWith(mockArticle);
  });
});