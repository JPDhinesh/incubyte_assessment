import { screen } from '@testing-library/react';
import { jsonResponse } from '../../../test-utils/mockFetch';
import { pokemonListSample } from '../../../test-utils/pokemonFixtures';
import { renderAppWithRouter } from '../../../test-utils/renderWithRouter';

describe('Pokemon card', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows name, image, and details button', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/pokemon?')) {
        return jsonResponse({ results: pokemonListSample });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    expect(await screen.findByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /bulbasaur artwork/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view details for bulbasaur/i })).toBeInTheDocument();
  });
});
