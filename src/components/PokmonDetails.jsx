import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PokemonDetails = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evolutionChain, setEvolutionChain] = useState([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();

        const extractEvolutions = (chain) => {
          const evo = [];
          let current = chain;
          while (current) {
            evo.push(current.species.name);
            current = current.evolves_to[0];
          }
          return evo;
        };

        setPokemon({
          name: data.name,
          id: data.id,
          types: data.types.map((t) => t.type.name),
          image: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          abilities: data.abilities.map((a) => a.ability.name),
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          moves: data.moves.slice(0, 5).map((m) => m.move.name),
        });

        setEvolutionChain(extractEvolutions(evolutionData.chain));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header text-center bg-primary text-white">
              <h2 className="text-capitalize mb-0">
                {pokemon.name} (#{pokemon.id})
              </h2>
            </div>
            <div className="card-body text-center">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="img-fluid mb-3"
                style={{ height: "200px", objectFit: "contain" }}
              />

              <p>
                <strong>Types:</strong>
                <br />
                {pokemon.types.map((t, idx) => (
                  <span
                    key={idx}
                    className="badge bg-secondary me-2 text-capitalize"
                  >
                    {t}
                  </span>
                ))}
              </p>

              <p>
                <strong>Height:</strong> {pokemon.height}
              </p>
              <p>
                <strong>Weight:</strong> {pokemon.weight}
              </p>

              <p>
                <strong>Abilities:</strong>
                <br />
                {pokemon.abilities.map((a, idx) => (
                  <span
                    key={idx}
                    className="badge bg-info me-2 text-capitalize"
                  >
                    {a}
                  </span>
                ))}
              </p>

              <p className="mt-3">
                <strong>Base Stats:</strong>
              </p>
              <ul className="list-group mb-3">
                {pokemon.stats.map((stat, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between text-capitalize"
                  >
                    <span>{stat.name}</span>
                    <span>{stat.value}</span>
                  </li>
                ))}
              </ul>

              <p>
                <strong>Top Moves:</strong>
              </p>
              <div>
                {pokemon.moves.map((move, idx) => (
                  <span
                    key={idx}
                    className="badge bg-warning text-dark me-2 text-capitalize"
                  >
                    {move}
                  </span>
                ))}
              </div>

              <p className="mt-3">
                <strong>Evolution Chain:</strong>
              </p>
              <div>
                {evolutionChain.map((name, idx) => (
                  <span
                    key={idx}
                    className="badge bg-success me-2 text-capitalize"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="card-footer text-center">
              <Link to="/" className="btn btn-outline-primary">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
