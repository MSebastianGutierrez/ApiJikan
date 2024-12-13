document.addEventListener("DOMContentLoaded", () => {
  insertCarouselImages();
  loadSections();
});

let cachedData = {};

async function getAnime({ genre, type, season, order, page = 1 }) {
  const cacheKey = `${genre}-${type}-${season}-${order}-${page}`;
  if (cachedData[cacheKey]) {
    return cachedData[cacheKey];
  }

  try {
    let url = `https://api.jikan.moe/v4/anime?page=${page}&limit=4`;
    if (genre) url += `&genres=${genre}`;
    if (type) url += `&type=${type}`;
    if (season) url = `https://api.jikan.moe/v4/seasons/${season}`;
    if (order) url += `&order_by=${order}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener los animes: ${response.status}`);
    }

    const data = await response.json();
    cachedData[cacheKey] = data.data;
    return data.data;
  } catch (error) {
    console.error("Error al obtener los animes:", error);
    return [];
  }
}

async function getPopularAnime() {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const data = await response.json();
    return data.data.slice(0, 5); // Devuelve los primeros 10 animes populares
  } catch (error) {
    console.error("Error al obtener animes populares:", error);
    return [];
  }
}

function setupCarousel() {
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const carouselInner = document.getElementById("carousel-images");
  const items = carouselInner.getElementsByClassName("carousel-item");
  const totalItems = items.length;

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalItems;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  });

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  });
}

async function insertCarouselImages() {
  const carouselContainer = document.getElementById("carousel-images");
  if (!carouselContainer) {
    console.error("No se encontró el contenedor del carrusel");
    return;
  }

  const animes = await getPopularAnime();
  if (animes.length > 0) {
    carouselContainer.innerHTML = ""; // Limpia el carrusel antes de agregar contenido
    animes.forEach((anime, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;
      carouselItem.innerHTML = `
        <img src="${anime.images.jpg.large_image_url}" class="d-block w-100" alt="${anime.title}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${anime.title}</h5>
          <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + "..." : "Sin descripción"}</p>
        </div>
      `;
      carouselContainer.appendChild(carouselItem);
    });
  }
}

async function loadSections() {
  const apiDataElement = document.getElementById("api-data-anime");
  const releasesContainer = document.getElementById("releases-container");

  // Estrenos (temporada actual)
  const releases = await getAnime({ season: "now" });
  addSection("Estrenos", releases.slice(0, 8), releasesContainer); // Limitar a 8 elementos

  // Acción
  const actionAnimes = await getAnime({ genre: 1 });
  addSection("Acción", actionAnimes, apiDataElement);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Películas
  const movies = await getAnime({ type: "movie" });
  addSection("Películas", movies, apiDataElement);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Clásicos (ordenados por popularidad)
  const classics = await getAnime({ order: "popularity" });
  addSection("Clásicos", classics, apiDataElement);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

function addSection(title, animes, container) {
  if (!animes || animes.length === 0) return;

  const section = document.createElement("div");
  section.classList.add("anime-section");
  section.innerHTML = `
    <h2>${title}</h2>
    <div class="row">
      ${animes.map(anime => `
        <div class="col-md-3">
          <div class="card product-card">
            <img src="${anime.images.jpg.large_image_url}" class="card-img-top" alt="${anime.title}">
            <div class="overlay">
              <div class="overlay-content">
                <h5 class="overlay-title">${anime.title}</h5>
                <p class="overlay-genre">Género: ${anime.genres.map(genre => genre.name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.appendChild(section);
}

