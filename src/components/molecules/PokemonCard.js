const extractPokemonId = (url) => {
  if (!url) {
    return null;
  }

  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : null;
};

function PokemonCard({ name, url, onOpen, prioritizeImage = false }) {
  const pokemonId = extractPokemonId(url);
  const artworkUrl = pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    : null;
  const fallbackImageUrl = `https://img.pokemondb.net/sprites/home/normal/${name}.png`;
  const cardImageUrl = artworkUrl ?? fallbackImageUrl;

  return (
    <article className="pokemon-card">
      <div className="pokemon-card-image-wrap">
        <img
          src={cardImageUrl}
          alt={`${name} artwork`}
          loading={prioritizeImage ? 'eager' : 'lazy'}
          fetchPriority={prioritizeImage ? 'high' : undefined}
          decoding="async"
          width="180"
          height="180"
          className="pokemon-card-image"
        />
      </div>
      <h2>{name}</h2>
      <button
        type="button"
        onClick={() => onOpen(name)}
        aria-label={`View details for ${name}`}
      >
        View details
      </button>
    </article>
  );
}

export default PokemonCard;
