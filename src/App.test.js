import { screen } from '@testing-library/react';
import { renderAppWithRouter } from './test-utils/renderWithRouter';
import { jsonResponse } from './test-utils/mockFetch';
import { pokemonListSample } from './test-utils/pokemonFixtures';

describe('App routing', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows loading text while page loads', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/pokemon?')) {
        return jsonResponse({
          count: 2,
          next: null,
          previous: null,
          results: pokemonListSample,
        });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter('/');

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
    expect(await screen.findByRole('heading', { name: /pokemon/i })).toBeInTheDocument();
  });
});
