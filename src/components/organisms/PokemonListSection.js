import PokemonCard from '../molecules/PokemonCard';
import SearchPokemonInput from '../atoms/SearchPokemonInput';
import FeedbackMessage from '../atoms/FeedbackMessage';

function PokemonListSection({
  loading,
  hasError,
  items,
  pagination,
  searchValue,
  onSearchChange,
  onRetry,
  onOpenPokemon,
  onPreviousPage,
  onNextPage,
}) {
  const startItem =
    pagination.enabled && pagination.totalCount
      ? (pagination.page - 1) * pagination.pageSize + 1
      : items.length > 0
      ? 1
      : 0;
  const endItem =
    pagination.enabled && pagination.totalCount
      ? Math.min(pagination.page * pagination.pageSize, pagination.totalCount)
      : items.length;

  return (
    <section className="pokemon-list-section">
      <h1>Pokemon List</h1>

      <SearchPokemonInput value={searchValue} onChange={onSearchChange} />

      {!loading && !hasError && (
        <p className="results-summary">
          {items.length > 0
            ? `${startItem}-${endItem} of ${pagination.totalCount ?? items.length} Pokemon`
            : 'No Pokemon to show'}
        </p>
      )}

      {loading && (
        <>
          <FeedbackMessage tone="neutral">Loading Pokemon...</FeedbackMessage>
          <div className="pokemon-grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <article key={`skeleton-${index}`} className="pokemon-card pokemon-card-skeleton">
                <div className="skeleton-line skeleton-line-title" />
                <div className="skeleton-line skeleton-line-button" />
              </article>
            ))}
          </div>
        </>
      )}

      {hasError && (
        <div className="error-block">
          <FeedbackMessage tone="error">Couldn't load Pokemon right now.</FeedbackMessage>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {!loading && !hasError && (
        <>
          <div className="pokemon-grid">
            {items.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
                onOpen={onOpenPokemon}
                prioritizeImage={pokemon === items[0]}
              />
            ))}
          </div>

          {items.length === 0 && (
            <FeedbackMessage tone="neutral">
              No Pokemon matched your search. Try a shorter name.
            </FeedbackMessage>
          )}

          {pagination.enabled && (
            <div className="pagination-controls">
              <button type="button" onClick={onPreviousPage} disabled={!pagination.hasPrevious}>
                Previous
              </button>
              <p>
                Page {pagination.page} / {pagination.totalPages}
              </p>
              <button type="button" onClick={onNextPage} disabled={!pagination.hasNext}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default PokemonListSection;
