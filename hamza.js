<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Animal Encyclopedia App</title>
  <style>
    :root {
      --bg-color: #f4f7f5;
      --card-bg: #ffffff;
      --text-main: #222222;
      --text-muted: #555555;
      --primary: #2d6a4f;
      --primary-dark: #1b4332;
      --border: #e0e0e0;
      --shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }

    body.dark-mode {
      --bg-color: #121815;
      --card-bg: #1e2823;
      --text-main: #f0f4f2;
      --text-muted: #b0beb7;
      --primary: #52b788;
      --primary-dark: #40916c;
      --border: #2f3e37;
      --shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      padding: 24px;
      transition: background-color 0.3s, color 0.3s;
    }

    /* Header & Controls */
    header {
      max-width: 1200px;
      margin: 0 auto 30px auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    h1 { color: var(--primary); font-size: 2rem; }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    input[type="text"] {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--card-bg);
      color: var(--text-main);
      font-size: 1rem;
      min-width: 240px;
    }

    button {
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      background: var(--card-bg);
      color: var(--text-main);
      border: 1px solid var(--border);
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    button:hover { border-color: var(--primary); }
    button.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }

    /* Card Grid */
    #card-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .animal-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 24px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s;
    }

    .animal-card:hover { transform: translateY(-4px); }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .badge {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 20px;
      background: rgba(82, 183, 136, 0.15);
      color: var(--primary);
      font-weight: 700;
    }

    .fav-btn {
      background: none;
      border: none;
      font-size: 1.4rem;
      padding: 0;
      cursor: pointer;
    }

    .animal-card h2 {
      font-size: 1.4rem;
      margin-bottom: 8px;
      color: var(--primary);
    }

    .animal-card p {
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .animal-card ul {
      padding-left: 18px;
      margin-bottom: 20px;
      color: var(--text-main);
    }

    .animal-card li { margin-bottom: 6px; font-size: 0.95rem; }

    .card-actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }

    .btn-primary {
      flex: 1;
      text-align: center;
      text-decoration: none;
      background: var(--primary);
      color: #ffffff;
      padding: 10px;
      border-radius: 8px;
      font-weight: 600;
      border: none;
    }

    .btn-primary:hover { background: var(--primary-dark); }

    /* Modal (Detail-Ansicht) */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
      z-index: 1000;
    }

    .modal-overlay.open { display: flex; }

    .modal-box {
      background: var(--card-bg);
      padding: 30px;
      border-radius: 16px;
      max-width: 550px;
      width: 100%;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      position: relative;
    }

    .close-modal {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 1.2rem;
      background: none;
      border: none;
      color: var(--text-main);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 20px 0;
      padding: 16px;
      background: var(--bg-color);
      border-radius: 10px;
    }
  </style>
</head>
<body>

  <header>
    <div class="top-bar">
      <h1>🐾 Animal Kingdom Explorer</h1>
      <button id="theme-toggle">🌙 Dark Mode</button>
    </div>

    <div class="controls">
      <input type="text" id="search-input" placeholder="Search animals or traits..." />
      <button class="filter-btn active" data-category="All">All</button>
      <button class="filter-btn" data-category="General">General</button>
      <button class="filter-btn" data-category="Mammal">Mammals</button>
      <button class="filter-btn" data-category="Marine">Marine</button>
      <button class="filter-btn" data-category="Bird">Birds</button>
      <button id="fav-filter-btn">⭐ Favorites (<span id="fav-count">0</span>)</button>
    </div>
  </header>

  <!-- Hier fügt JavaScript alle Cards ein -->
  <main id="card-container"></main>

  <!-- Detail-Modal -->
  <div class="modal-overlay" id="detail-modal">
    <div class="modal-box">
      <button class="close-modal" id="close-modal-btn">✖</button>
      <span class="badge" id="modal-category">Category</span>
      <h2 id="modal-title" style="margin: 10px 0; color: var(--primary);">Title</h2>
      <p id="modal-desc" style="line-height: 1.6;"></p>
      <div class="stats-grid" id="modal-stats"></div>
      <a id="modal-wiki" href="#" target="_blank" class="btn-primary" style="display:block;">
        Open Wikipedia Article &rarr;
      </a>
    </div>
  </div>

  <script>
    // ==========================================
    // 1. DATENBANK (Beliebig erweiterbar!)
    // ==========================================
    const animalDatabase = [
      {
        id: "general-animals",
        title: "What are animals?",
        category: "General",
        summary: "Biologically speaking, an animal is a multicellular living organism that feeds on other organisms. The scientific study of animals is called zoology.",
        traits: [
          "Multicellularity: No rigid cell walls like plants.",
          "Nutrition: Heterotrophic (consumes organic matter).",
          "Movement & Senses: Active locomotion & nervous system.",
          "Humans: Classified as mammals in the animal kingdom."
        ],
        details: "Animals belong to the kingdom Animalia. Over 1.5 million living animal species have been described—of which around 1 million are insects—but it has been estimated there are over 7 million animal species in total.",
        stats: { Kingdom: "Animalia", Species: "~7 Million", Nutrition: "Heterotrophic", CellWall: "None" },
        wiki: "https://wikipedia.org"
      },
      {
        id: "blue-whale",
        title: "Blue Whale",
        category: "Marine",
        summary: "The blue whale is a marine mammal and the largest animal known to have ever existed on Earth.",
        traits: [
          "Length: Up to 30 meters (98 feet).",
          "Weight: Up to 199 metric tons.",
          "Diet: Almost exclusively tiny krill.",
          "Heart: Roughly the size of a small golf cart."
        ],
        details: "Despite their massive size, blue whales feed almost exclusively on krill, straining huge volumes of ocean water through their baleen plates. Their calls are among the loudest sounds made by any animal.",
        stats: { Habitat: "Oceans", Lifespan: "80–90 years", Diet: "Carnivore (Krill)", Status: "Endangered" },
        wiki: "https://wikipedia.org"
      },
      {
        id: "peregrine-falcon",
        title: "Peregrine Falcon",
        category: "Bird",
        summary: "A cosmopolitan bird of prey renowned for its incredible speed during its high-speed hunting dive.",
        traits: [
          "Top Speed: Over 320 km/h (200 mph) in a dive.",
          "Vision: Can spot prey from over 3 km away.",
          "Habitat: Found on every continent except Antarctica.",
          "Adaptations: Bony tubercles in nostrils guide airflow."
        ],
        details: "The peregrine falcon is the fastest member of the animal kingdom. When diving (stooping), air pressure would normally damage its lungs, so specialized nostril structures act as baffles to let it breathe.",
        stats: { TopSpeed: "389 km/h", Wingspan: "74–120 cm", Diet: "Medium birds", Status: "Least Concern" },
        wiki: "https://wikipedia.org"
      },
      {
        id: "african-elephant",
        title: "African Bush Elephant",
        category: "Mammal",
        summary: "The largest living terrestrial animal, known for its intelligence, strong social bonds, and versatile trunk.",
        traits: [
          "Trunk: Contains over 40,000 muscles.",
          "Memory: Exceptional spatial and social memory.",
          "Ears: Shaped like Africa and used to radiate heat.",
          "Social Structure: Matriarchal family herds."
        ],
