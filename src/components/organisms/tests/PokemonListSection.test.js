import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createDeferredPromise, jsonResponse } from '../../../test-utils/mockFetch';
import { pokemonListSample } from '../../../test-utils/pokemonFixtures';
import { renderAppWithRouter } from '../../../test-utils/renderWithRouter';

describe('Pokemon list', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows loading first, then cards', async () => {
    const pendingListResponse = createDeferredPromise();
    jest.spyOn(global, 'fetch').mockImplementation(() => pendingListResponse.promise);

    renderAppWithRouter();

    expect(await screen.findByText(/loading pokemon/i)).toBeInTheDocument();

    pendingListResponse.resolve({
      ok: true,
      json: async () => ({
        results: pokemonListSample,
      }),
    });

    expect(await screen.findByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /pikachu/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  test('search works beyond the current page', async () => {
    const firstPage = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/ivysaur' },
    ];
    const universalCatalog = [
      ...firstPage,
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
    ];

    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('limit=20&offset=0')) {
        return jsonResponse({
          count: 41,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: firstPage,
        });
      }

      if (url.includes('limit=2000') && url.includes('offset=0')) {
        return jsonResponse({
          count: 41,
          next: null,
          previous: null,
          results: universalCatalog,
        });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    expect(await screen.findByRole('heading', { name: /^bulbasaur$/i })).toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox', { name: /search pokemon by name/i }), 'pik');

    expect(await screen.findByRole('heading', { name: /^pikachu$/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^bulbasaur$/i })).not.toBeInTheDocument();
  });

  test('hides pagination during search and brings it back on clear', async () => {
    const firstPage = Array.from({ length: 20 }, (_, index) => ({
      name: `pokemon-${index + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/pokemon-${index + 1}`,
    }));
    const universalCatalog = [
      ...firstPage,
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
    ];

    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('limit=20') && url.includes('offset=0')) {
        return jsonResponse({
          count: 41,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: firstPage,
        });
      }

      if (url.includes('limit=2000') && url.includes('offset=0')) {
        return jsonResponse({
          count: 41,
          next: null,
          previous: null,
          results: universalCatalog,
        });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    expect(await screen.findByText(/page 1\s*\/\s*3/i)).toBeInTheDocument();

    const searchInput = screen.getByRole('textbox', { name: /search pokemon by name/i });
    await userEvent.type(searchInput, 'pik');

    expect(await screen.findByRole('heading', { name: /^pikachu$/i })).toBeInTheDocument();
    expect(screen.queryByText(/page 1\s*\/\s*3/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();

    await userEvent.clear(searchInput);

    expect(await screen.findByText(/page 1\s*\/\s*3/i)).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('limit=20&offset=0'));
  });

  test('shows retry button when list load fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('No internet'));

    renderAppWithRouter();

    expect(await screen.findByText(/couldn't load pokemon right now/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  test('shows 20 cards and pagination for paginated responses', async () => {
    const firstPage = Array.from({ length: 20 }, (_, index) => ({
      name: `pokemon-${index + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/pokemon-${index + 1}`,
    }));

    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('limit=20') && url.includes('offset=0')) {
        return jsonResponse({
          count: 41,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: firstPage,
        });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    expect(await screen.findByRole('heading', { name: /^pokemon-1$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByText(/page 1\s*\/\s*3/i)).toBeInTheDocument();
    const [firstCardImage, secondCardImage] = screen.getAllByRole('img', { name: /artwork/i });
    expect(firstCardImage).toHaveAttribute('loading', 'eager');
    expect(firstCardImage).toHaveAttribute('fetchpriority', 'high');
    expect(secondCardImage).toHaveAttribute('loading', 'lazy');
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('limit=20'));
  });

  test('loads next page when next is clicked', async () => {
    const firstPage = Array.from({ length: 20 }, (_, index) => ({
      name: `pokemon-${index + 1}`,
      url: `https://pokeapi.co/api/v2/pokemon/pokemon-${index + 1}`,
    }));

    const secondPage = Array.from({ length: 20 }, (_, index) => ({
      name: `pokemon-${index + 21}`,
      url: `https://pokeapi.co/api/v2/pokemon/pokemon-${index + 21}`,
    }));

    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('limit=20') && url.includes('offset=0')) {
        return jsonResponse({
          count: 41,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
          previous: null,
          results: firstPage,
        });
      }

      if (url.includes('limit=20') && url.includes('offset=20')) {
        return jsonResponse({
          count: 41,
          next: 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20',
          previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
          results: secondPage,
        });
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    expect(await screen.findByRole('heading', { name: /^pokemon-1$/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByRole('heading', { name: /^pokemon-21$/i })).toBeInTheDocument();
    expect(screen.getByText(/page 2\s*\/\s*3/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
  });
});
