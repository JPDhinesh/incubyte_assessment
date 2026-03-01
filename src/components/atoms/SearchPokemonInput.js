function SearchPokemonInput({ value, onChange }) {
  const hasValue = Boolean(value.trim());

  return (
    <label className="search-input-label" htmlFor="pokemon-search-input">
      Search Pokemon by name
      <div className="search-input-field">
        <span aria-hidden="true" className="search-input-icon">
          Search
        </span>
        <input
          id="pokemon-search-input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by Pokemon name..."
        />
        {hasValue && (
          <button
            type="button"
            className="search-input-clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
    </label>
  );
}

export default SearchPokemonInput;
