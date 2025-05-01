import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=150"
      );
      const data = await response.json();
      const promises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const details = await res.json();
        return {
          id: details.id,
          name: details.name,
          types: details.types.map((t) => t.type.name),
          image: details.sprites.front_default,
        };
      });

      const results = await Promise.all(promises);
      setCards(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <nav className="navbar bg-light mb-4 p-3 rounded d-flex justify-content-between align-items-center">
        <input
          type="text"
          name="search"
          className="form-control me-3"
          placeholder="Search Pokémon..."
          id="search-field"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          style={{ maxWidth: "300px" }}
        />
      </nav>

      <div className="row g-4">
        {cards
          .filter((card) => card.name.toLowerCase().includes(query))
          .map((card) => (
            <div
              key={card.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
            >
              <div className="card w-100 shadow-sm text-center">
                <img
                  src={card.image}
                  className="card-img-top p-3"
                  alt={card.name}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-capitalize">{card.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    ID: #{card.id}
                  </h6>
                  <p className="card-text">
                    {card.types.map((type, idx) => (
                      <span
                        key={idx}
                        className="badge bg-secondary me-1 text-capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </p>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Link
                      to={`/pokemon/${card.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Details
                    </Link>

                    <button
                      className={`btn btn-sm ${
                        favorites.includes(card.id)
                          ? "btn-danger"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => toggleFavorite(card.id)}
                    >
                      {favorites.includes(card.id) ? "Unfavorite" : "Favorite"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
