import { fireEvent, screen } from '@testing-library/react';
import { bulbasaurProfile, pokemonListSample } from '../../../test-utils/pokemonFixtures';
import { jsonResponse } from '../../../test-utils/mockFetch';
import { renderAppWithRouter } from '../../../test-utils/renderWithRouter';

describe('Pokemon details', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('opens details when a card is clicked', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/pokemon?')) {
        return jsonResponse({ results: [pokemonListSample[0]] });
      }

      if (url.includes('/pokemon/bulbasaur')) {
        return jsonResponse(bulbasaurProfile);
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    fireEvent.click(await screen.findByRole('button', { name: /view details for bulbasaur/i }));

    expect(await screen.findByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument();
    const artworkImage = screen.getByRole('img', { name: /bulbasaur artwork/i });
    expect(artworkImage).toHaveAttribute(
      'src',
      bulbasaurProfile.sprites.other['official-artwork'].front_default
    );
    expect(artworkImage).toHaveAttribute('loading', 'eager');
    expect(artworkImage).toHaveAttribute('fetchpriority', 'high');
    expect(artworkImage).toHaveAttribute('decoding', 'async');
    expect(screen.getByText(/^height$/i)).toBeInTheDocument();
    expect(screen.getByText(/^weight$/i)).toBeInTheDocument();
    expect(screen.getByText(/^7$/i)).toBeInTheDocument();
    expect(screen.getByText(/^69$/i)).toBeInTheDocument();
    expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
  });

  test('uses front sprite when official artwork is missing', async () => {
    const profileWithoutOfficialArtwork = {
      ...bulbasaurProfile,
      sprites: {
        front_default: bulbasaurProfile.sprites.front_default,
        other: {
          'official-artwork': {
            front_default: null,
          },
        },
      },
    };

    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/pokemon?')) {
        return jsonResponse({ results: [pokemonListSample[0]] });
      }

      if (url.includes('/pokemon/bulbasaur')) {
        return jsonResponse(profileWithoutOfficialArtwork);
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    fireEvent.click(await screen.findByRole('button', { name: /view details for bulbasaur/i }));

    expect(await screen.findByRole('heading', { name: /bulbasaur/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /bulbasaur artwork/i })).toHaveAttribute(
      'src',
      bulbasaurProfile.sprites.front_default
    );
  });

  test('shows error text when details fail to load', async () => {
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('/pokemon?')) {
        return jsonResponse({ results: [pokemonListSample[0]] });
      }

      if (url.includes('/pokemon/bulbasaur')) {
        return Promise.reject(new Error('Detail request failed'));
      }

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderAppWithRouter();

    fireEvent.click(await screen.findByRole('button', { name: /view details for bulbasaur/i }));

    expect(await screen.findByText(/couldn't load this pokemon/i)).toBeInTheDocument();
  });
});
