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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState("id");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [allTypes, setAllTypes] = useState([]);

  const toggleFavorite = (id, name) => {
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    alert(
      favorites.includes(id)
        ? `${name} has been removed from your favorites.`
        : `${name} has been added to your favorites!`
    );
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
      extractAllTypes(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      setLoading(false);
    }
  };

  const extractAllTypes = (pokemonList) => {
    const types = new Set();
    pokemonList.forEach((p) => p.types.forEach((t) => types.add(t)));
    setAllTypes(Array.from(types));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTypeFilter = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const filteredCards = cards
    .filter((card) => card.name.toLowerCase().includes(query))
    .filter(
      (card) =>
        selectedTypes.length === 0 ||
        selectedTypes.every((type) => card.types.includes(type))
    )
    .sort((a, b) => {
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCards = filteredCards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

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
      <nav className="navbar bg-light mb-4 p-3 rounded flex-wrap gap-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="form-control"
          style={{ maxWidth: "300px" }}
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />

        <select
          className="form-select"
          style={{ maxWidth: "150px" }}
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <select
          className="form-select"
          style={{ maxWidth: "150px" }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
        </select>
      </nav>

      <div className="mb-4">
        <strong>Filter by Type:</strong>
        <div className="d-flex flex-wrap gap-2 mt-2">
          {allTypes.map((type) => (
            <div key={type} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeFilter(type)}
                style={{ cursor: "pointer" }}
              />
              <label
                className="form-check-label text-capitalize"
                htmlFor={`type-${type}`}
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {currentCards.map((card) => (
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
                    onClick={() => toggleFavorite(card.id, card.name)}
                  >
                    {favorites.includes(card.id) ? (
                      <i className="fa-solid fa-heart"></i>
                    ) : (
                      <i className="fa-regular fa-heart"></i>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="mt-4 d-flex justify-content-center">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li
              key={number}
              className={`page-item ${number === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Home;
