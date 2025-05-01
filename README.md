# Pokemon App

A simple React-based Pokemon app that fetches data from the PokeAPI. This app allows users to:

- Search Pokemon.
- View detailed Pokemon information.
- Mark Pokemon as favorites and view them on a separate page.

## Features

- **Home Page**:

  - Displays a list of 150 Pokemon cards.
  - Each card shows the Pokemon's name, ID, types, and an image.
  - Users can search for Pokemon by name.
  - Users can toggle Pokemon as favorites using a heart icon next to their name.
  - Links to detailed Pokemon information page.

- **Favorite Pokémon Page**:

  - Displays a list of Pokemon marked as favorites.
  - The list of favorites is persisted using the browser's `localStorage`.

- **Pokémon Details Page**:

  - Displays detailed information about a selected Pokemon, including:
    - Name, ID, types, height, weight, and abilities.
    - The page fetches data dynamically based on the Pokemon ID.

- **Responsive Design**:
  - The app is built with **Bootstrap 5** for responsive design and mobile-first layouts.
  - Navbar and cards adapt to different screen sizes.

## Technologies Used

- **React** - JavaScript library for building the user interface.
- **React Router** - For navigation between pages (`Home`, `Favorite Pokemon`, `Pokemon Details`).
- **Bootstrap 5** - For styling and responsive grid layout.
- **PokéAPI** - A public API to fetch Pokemon data.
- **localStorage** - To persist the list of favorite Pokemon.

## Setup & Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/pokemon-app.git
   cd pokemon-app
   ```
