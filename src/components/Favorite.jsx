import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const results = await Promise.all(
        favorites.map(async (id) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await res.json();
          return {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            types: data.types.map((t) => t.type.name),
          };
        })
      );
      setPokemonList(results);
    };

    if (favorites.length) fetchFavorites();
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No favorite Pokémon added yet.</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Your Favorite Pokémon</h2>
      <div className="row g-4">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
          >
            <div className="card w-100 text-center shadow-sm">
              <img
                src={pokemon.image}
                className="card-img-top p-3"
                alt={pokemon.name}
                style={{ height: "200px", objectFit: "contain" }}
              />
              <div className="card-body">
                <h5 className="card-title text-capitalize">{pokemon.name}</h5>
                <p>
                  {pokemon.types.map((type, idx) => (
                    <span
                      key={idx}
                      className="badge bg-secondary me-1 text-capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </p>
                <Link
                  to={`/pokemon/${pokemon.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-outline-secondary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Favorites;
