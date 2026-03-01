import { screen } from '@testing-library/react';
import { jsonResponse } from '../../../test-utils/mockFetch';
import { pokemonListSample } from '../../../test-utils/pokemonFixtures';
import { renderAppWithRouter } from '../../../test-utils/renderWithRouter';

describe('Pokemon search input', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows a search box with clear label', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/pokemon?')) {
        return jsonResponse({ results: pokemonListSample });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    expect(await screen.findByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /search pokemon by name/i })).toBeInTheDocument();
  });
});
