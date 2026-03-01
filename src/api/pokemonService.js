const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 20;
const MAX_POKEMON_FOR_SEARCH = 2000;

let pokemonCatalogCache = null;

const readJson = async (response) => {
  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json();
};

const hasApiPagination = (payload) =>
  typeof payload.count === 'number' || payload.next !== undefined || payload.previous !== undefined;

export const getPokemonList = async ({ page = 1, pageSize = PAGE_SIZE } = {}) => {
  const offset = (page - 1) * pageSize;
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon?limit=${pageSize}&offset=${offset}`);
  const payload = await readJson(response);
  const totalCount = typeof payload.count === 'number' ? payload.count : null;
  const totalPages = totalCount ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  return {
    items: payload.results ?? [],
    pagination: {
      enabled: hasApiPagination(payload),
      page,
      pageSize,
      totalCount,
      totalPages,
      hasPrevious: Boolean(payload.previous),
      hasNext: Boolean(payload.next),
    },
  };
};

const getPokemonCatalog = async () => {
  if (pokemonCatalogCache) {
    return pokemonCatalogCache;
  }

  const response = await fetch(`${POKE_API_BASE_URL}/pokemon?limit=${MAX_POKEMON_FOR_SEARCH}&offset=0`);
  const payload = await readJson(response);
  pokemonCatalogCache = payload.results ?? [];
  return pokemonCatalogCache;
};

export const searchPokemonByName = async (query) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const catalog = await getPokemonCatalog();
  return catalog.filter((pokemon) => pokemon.name.includes(normalizedQuery));
};

export const getPokemonProfile = async (pokemonName) => {
  const response = await fetch(`${POKE_API_BASE_URL}/pokemon/${pokemonName}`);
  return readJson(response);
};
