import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, searchPokemonByName } from '../api/pokemonService';
import PokemonListSection from '../components/organisms/PokemonListSection';

function PokemonCatalogPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [listState, setListState] = useState({
    loading: true,
    hasError: false,
    items: [],
    pagination: {
      enabled: false,
      page: 1,
      pageSize: 20,
      totalCount: null,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false,
    },
  });

  const loadPokemonList = async (page = listState.pagination.page) => {
    setListState((previous) => ({
      ...previous,
      loading: true,
      hasError: false,
    }));

    try {
      const payload = await getPokemonList({ page, pageSize: 20 });
      setListState({
        loading: false,
        hasError: false,
        items: payload.items,
        pagination: payload.pagination,
      });
    } catch (error) {
      setListState({
        loading: false,
        hasError: true,
        items: [],
        pagination: {
          enabled: false,
          page: 1,
          pageSize: 20,
          totalCount: null,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    }
  };

  useEffect(() => {
    loadPokemonList();
  }, []);

  const searchPokemon = async (query) => {
    setListState((previous) => ({
      ...previous,
      loading: true,
      hasError: false,
    }));

    try {
      const results = await searchPokemonByName(query);

      setListState({
        loading: false,
        hasError: false,
        items: results,
        pagination: {
          enabled: false,
          page: 1,
          pageSize: 20,
          totalCount: null,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    } catch (error) {
      setListState((previous) => ({
        ...previous,
        loading: false,
        hasError: true,
        items: [],
      }));
    }
  };

  const handleSearchChange = (nextValue) => {
    setSearchValue(nextValue);
    const trimmed = nextValue.trim();

    if (!trimmed) {
      loadPokemonList();
      return;
    }

    searchPokemon(trimmed);
  };

  const handleRetry = () => {
    const trimmed = searchValue.trim();

    if (trimmed) {
      searchPokemon(trimmed);
      return;
    }

    loadPokemonList();
  };

  const openPokemon = (pokemonName) => {
    navigate(`/pokemon/${pokemonName}`);
  };

  const goPreviousPage = () => {
    if (!listState.pagination.hasPrevious) {
      return;
    }

    loadPokemonList(listState.pagination.page - 1);
  };

  const goNextPage = () => {
    if (!listState.pagination.hasNext) {
      return;
    }

    loadPokemonList(listState.pagination.page + 1);
  };

  return (
    <PokemonListSection
      loading={listState.loading}
      hasError={listState.hasError}
      items={listState.items}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      onRetry={handleRetry}
      onOpenPokemon={openPokemon}
      pagination={listState.pagination}
      onPreviousPage={goPreviousPage}
      onNextPage={goNextPage}
    />
  );
}

export default PokemonCatalogPage;
