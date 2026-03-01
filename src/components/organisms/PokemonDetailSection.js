import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackMessage from '../atoms/FeedbackMessage';
import { getPokemonProfile } from '../../api/pokemonService';

function PokemonDetailSection({ pokemonName }) {
  const [state, setState] = useState({
    loading: true,
    hasError: false,
    profile: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const loadPokemonProfile = async () => {
      setState({
        loading: true,
        hasError: false,
        profile: null,
      });

      try {
        const profile = await getPokemonProfile(pokemonName);
        if (isCancelled) {
          return;
        }

        setState({
          loading: false,
          hasError: false,
          profile,
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState({
          loading: false,
          hasError: true,
          profile: null,
        });
      }
    };

    loadPokemonProfile();

    return () => {
      isCancelled = true;
    };
  }, [pokemonName]);

  const pokemonImageUrl =
    state.profile?.sprites?.other?.['official-artwork']?.front_default ??
    state.profile?.sprites?.front_default;

  useEffect(() => {
    if (!pokemonImageUrl) {
      return undefined;
    }

    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = pokemonImageUrl;
    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
  }, [pokemonImageUrl]);

  if (state.loading) {
    return (
      <section className="pokemon-detail-section">
        <Link to="/" className="back-link">
          Back to list
        </Link>
        <FeedbackMessage tone="neutral">Loading Pokemon details...</FeedbackMessage>
      </section>
    );
  }

  if (state.hasError) {
    return (
      <section className="pokemon-detail-section">
        <Link to="/" className="back-link">
          Back to list
        </Link>
        <FeedbackMessage tone="error">Couldn't load this Pokemon.</FeedbackMessage>
      </section>
    );
  }

  const { profile } = state;
  const pokemonTypes = profile.types ?? [];
  const pokemonAbilities = profile.abilities ?? [];
  const pokemonStats = profile.stats ?? [];

  return (
    <section className="pokemon-detail-section">
      <Link to="/" className="back-link">
        Back to list
      </Link>

      <div className="pokemon-detail-layout">
        <div className="pokemon-detail-visual">
          <h1>{profile.name}</h1>
          {pokemonImageUrl && (
            <img
              src={pokemonImageUrl}
              alt={`${profile.name} artwork`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="320"
              height="320"
            />
          )}
        </div>

        <div className="pokemon-detail-info">
          <div className="pokemon-meta-grid">
            <div>
              <p className="meta-label">Height</p>
              <p className="meta-value">{profile.height}</p>
            </div>
            <div>
              <p className="meta-label">Weight</p>
              <p className="meta-value">{profile.weight}</p>
            </div>
            <div>
              <p className="meta-label">Base Experience</p>
              <p className="meta-value">{profile.base_experience ?? 'N/A'}</p>
            </div>
          </div>

          <h2>Types</h2>
          <ul className="chip-list">
            {pokemonTypes.map((entry) => (
              <li key={entry.type.name}>{entry.type.name}</li>
            ))}
          </ul>

          <h2>Abilities</h2>
          <ul className="chip-list">
            {pokemonAbilities.map((entry) => (
              <li key={entry.ability.name}>{entry.ability.name}</li>
            ))}
          </ul>

          <h2>Base Stats</h2>
          <ul className="stats-list">
            {pokemonStats.map((entry) => (
              <li key={entry.stat.name}>
                <span>{entry.stat.name}</span>
                <div className="stat-track" aria-hidden="true">
                  <div
                    className="stat-fill"
                    style={{ width: `${Math.min(100, Math.round((entry.base_stat / 180) * 100))}%` }}
                  />
                </div>
                <strong>{entry.base_stat}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PokemonDetailSection;
