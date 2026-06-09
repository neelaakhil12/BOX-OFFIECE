// BOX OFFICE - Core Application Script

// State Management
const appState = {
  watchlist: JSON.parse(localStorage.getItem('bo_watchlist')) || [],
  favorites: JSON.parse(localStorage.getItem('bo_favorites')) || [],
  compareList: JSON.parse(localStorage.getItem('bo_compare')) || [],
  activeFilters: {
    query: '',
    genre: '',
    language: '',
    year: '',
    minRating: 0
  },
  genresList: []
};

// Utilities for state saving
function saveState(key, data) {
  localStorage.setItem(`bo_${key}`, JSON.stringify(data));
}

// Global Notification Toast
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-lg z-50 text-white font-semibold transition-all duration-300 transform translate-y-10 opacity-0 flex items-center space-x-2 shadow-2xl ${
    type === 'success' ? 'bg-[#FF6B00]' : type === 'info' ? 'bg-blue-600' : 'bg-red-600'
  }`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Document Ready & Router Initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Load API keys from backend first
  if (window.BoxOfficeAPI && window.BoxOfficeAPI.initKeys) {
    try {
      await window.BoxOfficeAPI.initKeys();
    } catch (e) {
      console.error("Error initializing API keys", e);
    }
  }

  // Load initial settings/genres
  try {
    appState.genresList = window.mockData.genres;
  } catch (e) {
    console.error("Failed loading genres", e);
  }

  initNavigation();
  initGlobalSearch();
  initComparisonUI();
  initAPIModal();
  updateAPIStatusBadge();

  // Register routing events
  window.addEventListener('hashchange', router);
  
  // Initial route resolve
  router();
});

// Hash-based Router
async function router() {
  const hash = window.location.hash || '#home';
  const mainContent = document.getElementById('main-content');
  
  // Clean active view states
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active');
  });

  // Highlight navigation links
  updateActiveNavLink(hash);

  // Parse path and query params (e.g. #movie-details?id=1011985)
  const [route, queryString] = hash.split('?');
  const params = {};
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, val] = param.split('=');
      params[key] = decodeURIComponent(val);
    });
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Main views toggle container
  const homeView = document.getElementById('view-home');
  const moviesView = document.getElementById('view-movies');
  const detailsView = document.getElementById('view-movie-details');
  const boxOfficeView = document.getElementById('view-box-office');
  const ottView = document.getElementById('view-ott');
  const aboutView = document.getElementById('view-about');

  // Trigger page-specific logic
  switch (route) {
    case '#home':
      homeView.classList.add('active');
      await setupHomePage();
      break;
    case '#movies':
      moviesView.classList.add('active');
      setupMoviesPage();
      break;
    case '#movie-details':
      detailsView.classList.add('active');
      if (params.id) {
        await setupMovieDetailsPage(params.id);
      } else {
        window.location.hash = '#movies';
      }
      break;
    case '#box-office':
      boxOfficeView.classList.add('active');
      setupBoxOfficePage();
      break;
    case '#ott':
      ottView.classList.add('active');
      setupOTTPage();
      break;
    case '#about':
      aboutView.classList.add('active');
      setupAboutPage();
      break;
    default:
      homeView.classList.add('active');
      await setupHomePage();
  }

  // Re-initialize AOS
  if (window.AOS) {
    window.AOS.refresh();
  }
}

// Navigation Styling Helper
function updateActiveNavLink(hash) {
  const baseHash = hash.split('?')[0];
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHash = link.getAttribute('href');
    if (linkHash === baseHash) {
      link.classList.add('text-[#FF6B00]');
      link.classList.remove('text-white');
    } else {
      link.classList.remove('text-[#FF6B00]');
      link.classList.add('text-white');
    }
  });

  // Mobile menu links highlight
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    const linkHash = link.getAttribute('href');
    if (linkHash === baseHash) {
      link.classList.add('bg-[#FF6B00]/10', 'text-[#FF6B00]', 'border-l-4', 'border-[#FF6B00]');
      link.classList.remove('text-white');
    } else {
      link.classList.remove('bg-[#FF6B00]/10', 'text-[#FF6B00]', 'border-l-4', 'border-[#FF6B00]');
      link.classList.add('text-white');
    }
  });
}

function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (mobileMenu.classList.contains('hidden')) {
          icon.setAttribute('data-lucide', 'menu');
        } else {
          icon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
      }
    });

    // Close menu when clicking links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // Sticky Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('shadow-xl', 'bg-[#0F0F0F]/95', 'border-b', 'border-[#FF6B00]/25');
    } else {
      header.classList.remove('shadow-xl', 'bg-[#0F0F0F]/95', 'border-b', 'border-[#FF6B00]/25');
    }
  });
}

// Global Suggestion Search Logic
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  const suggestionsBox = document.getElementById('search-suggestions');
  const searchForm = document.getElementById('global-search-form');

  if (!searchInput || !suggestionsBox) return;

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 2) {
      suggestionsBox.classList.add('hidden');
      return;
    }

    debounceTimer = setTimeout(async () => {
      const results = await window.BoxOfficeAPI.search(query);
      renderSearchSuggestions(results.slice(0, 5));
    }, 300);
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.add('hidden');
    }
  });

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      suggestionsBox.classList.add('hidden');
      appState.activeFilters.query = query;
      window.location.hash = `#movies`;
      
      // If we are already on #movies, re-render immediately
      if (window.location.hash.startsWith('#movies')) {
        setupMoviesPage();
      }
    }
  });
}

function renderSearchSuggestions(results) {
  const suggestionsBox = document.getElementById('search-suggestions');
  if (results.length === 0) {
    suggestionsBox.innerHTML = `<div class="p-3 text-sm text-gray-400">No movies found.</div>`;
    suggestionsBox.classList.remove('hidden');
    return;
  }

  suggestionsBox.innerHTML = results.map(movie => {
    const poster = window.BoxOfficeAPI.getImageUrl(movie.poster_path, 'w92');
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";
    return `
      <a href="#movie-details?id=${movie.id}" class="search-suggestion-item flex items-center p-2 hover:bg-[#1A1A1A] transition duration-200 border-b border-white/5 last:border-0">
        <img src="${poster}" class="w-8 h-12 rounded object-cover mr-3 bg-neutral-800" alt="${movie.title}">
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-white truncate">${movie.title}</h4>
          <span class="text-xs text-gray-400">${releaseYear} • Rating: ${rating}</span>
        </div>
      </a>
    `;
  }).join('');
  suggestionsBox.classList.remove('hidden');
}

// Update API Mode Badges (Header + Mobile) — Stubbed out as UI components are removed
function updateAPIStatusBadge() {}

// API Setting Modal logic — Stubbed out as modal is configured directly in code
function initAPIModal() {}

// ----------------------------------------------------
// PAGE RENDERERS
// ----------------------------------------------------

// HOME PAGE
async function setupHomePage() {
  // Skeleton loader preview state
  const trendingContainer = document.getElementById('trending-carousel-wrapper');
  trendingContainer.innerHTML = Array(4).fill(0).map(() => `
    <div class="swiper-slide p-2">
      <div class="skeleton w-full aspect-[2/3] rounded-xl mb-3 h-72"></div>
      <div class="skeleton h-5 w-3/4 rounded mb-2"></div>
      <div class="skeleton h-4 w-1/2 rounded"></div>
    </div>
  `).join('');

  // Fetch trending movies
  const trending = await window.BoxOfficeAPI.getTrending();
  const nowPlaying = await window.BoxOfficeAPI.getNowPlaying();
  const topRated = await window.BoxOfficeAPI.getTopRated();
  const upcoming = await window.BoxOfficeAPI.getUpcoming();
  const actors = await window.BoxOfficeAPI.getPopularActors();

  // 1. Render Hero Slider
  const heroWrapper = document.getElementById('hero-swiper-wrapper');
  if (heroWrapper) {
    const heroMovies = trending.slice(0, 5);
    heroWrapper.innerHTML = heroMovies.map(movie => {
      const backdrop = window.BoxOfficeAPI.getImageUrl(movie.backdrop_path, 'original');
      const poster = window.BoxOfficeAPI.getImageUrl(movie.poster_path, 'w500');
      const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
      const year = movie.release_date ? movie.release_date.split("-")[0] : "";
      
      // Get genres text
      const genreNames = movie.genres.map(gid => {
        const g = appState.genresList.find(x => x.id === gid);
        return g ? g.name : '';
      }).filter(n => n !== '').slice(0, 2).join(' • ');

      return `
        <div class="swiper-slide relative min-h-[85vh] flex items-center bg-cover bg-center" style="background-image: linear-gradient(to right, rgba(15, 15, 15, 0.95) 20%, rgba(15, 15, 15, 0.5) 60%, rgba(15, 15, 15, 0.95) 100%), url('${backdrop}');">
          <div class="max-w-7xl mx-auto px-4 md:px-8 w-full grid md:grid-cols-12 gap-8 items-center pt-20 pb-12">
            <div class="md:col-span-8 space-y-6 text-left" data-aos="fade-up">
              <div class="flex items-center space-x-3 text-xs md:text-sm font-semibold tracking-wider text-[#FF6B00]">
                <span>TRENDING NOW</span>
                <span class="text-white/30">•</span>
                <span>${genreNames}</span>
                <span class="text-white/30">•</span>
                <span>${year}</span>
              </div>
              <h1 class="text-4xl md:text-6xl font-black text-white leading-tight font-heading">${movie.title}</h1>
              <p class="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed line-clamp-3">${movie.overview}</p>
              
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  <i data-lucide="star" class="w-4 h-4 fill-[#FFA726] text-[#FFA726]"></i>
                  <span class="font-bold text-[#FFA726] text-sm">${rating}</span>
                </div>
                <span class="text-gray-400 text-xs md:text-sm">${movie.vote_count ? `${movie.vote_count.toLocaleString()} votes` : ''}</span>
              </div>

              <div class="flex flex-wrap gap-4 pt-2">
                <a href="#movie-details?id=${movie.id}" class="bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-8 py-3 rounded-lg font-bold transition flex items-center space-x-2 shadow-lg hover:shadow-[#FF6B00]/40">
                  <i data-lucide="info" class="w-4 h-4"></i>
                  <span>View Details</span>
                </a>
                ${movie.trailer_url ? `
                  <button onclick="playTrailer('${movie.trailer_url}')" class="bg-transparent hover:bg-white/10 border border-white/50 text-white px-8 py-3 rounded-lg font-bold transition flex items-center space-x-2">
                    <i data-lucide="play" class="w-4 h-4"></i>
                    <span>Watch Trailer</span>
                  </button>
                ` : ''}
              </div>
            </div>
            <div class="hidden md:block md:col-span-4" data-aos="zoom-in" data-aos-delay="200">
              <img src="${poster}" class="w-72 rounded-2xl shadow-2xl border border-white/10 mx-auto transform hover:rotate-2 transition duration-500" alt="${movie.title}">
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Initialize Hero Swiper
    new Swiper('.hero-swiper', {
      loop: true,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: '.hero-pagination', clickable: true },
      navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' }
    });
  }

  // 2. Render Trending Movies Slider
  if (trendingContainer) {
    trendingContainer.innerHTML = trending.map(movie => renderMovieCard(movie, 'swiper-slide')).join('');
    
    // Initialize Trending Swiper
    new Swiper('.trending-swiper', {
      slidesPerView: 1.5,
      spaceBetween: 16,
      navigation: { nextEl: '.trending-next', prevEl: '.trending-prev' },
      breakpoints: {
        480: { slidesPerView: 2.2 },
        768: { slidesPerView: 3.5 },
        1024: { slidesPerView: 4.5 },
        1280: { slidesPerView: 5.5 }
      }
    });
  }

  // 3. Render Now Playing & Top Rated Grids
  const nowPlayingGrid = document.getElementById('now-playing-grid');
  if (nowPlayingGrid) {
    nowPlayingGrid.innerHTML = nowPlaying.slice(0, 8).map(movie => renderMovieCard(movie, 'aspect-[2/3]')).join('');
  }

  const topRatedGrid = document.getElementById('top-rated-grid');
  if (topRatedGrid) {
    topRatedGrid.innerHTML = topRated.slice(0, 8).map(movie => renderMovieCard(movie, 'aspect-[2/3]')).join('');
  }

  // 4. Render Upcoming Movies with Countdown timer
  const upcomingGrid = document.getElementById('upcoming-grid');
  if (upcomingGrid) {
    upcomingGrid.innerHTML = upcoming.slice(0, 4).map(movie => {
      const poster = window.BoxOfficeAPI.getImageUrl(movie.poster_path, 'w500');
      const releaseDateText = new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
      const daysLeft = Math.ceil((new Date(movie.release_date) - new Date()) / (1000 * 60 * 60 * 24));
      const isReleased = daysLeft <= 0;

      return `
        <div class="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden flex flex-col md:flex-row group" data-aos="fade-up">
          <div class="relative w-full md:w-48 overflow-hidden aspect-[2/3] md:aspect-auto">
            <img src="${poster}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${movie.title}">
            <div class="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent md:hidden"></div>
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div class="space-y-3">
              <span class="text-xs px-2.5 py-1 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-bold">UPCOMING RELEASE</span>
              <h3 class="text-xl font-bold font-heading text-white line-clamp-1 hover:text-[#FF6B00] transition"><a href="#movie-details?id=${movie.id}">${movie.title}</a></h3>
              <p class="text-sm text-gray-400 line-clamp-3">${movie.overview}</p>
            </div>
            
            <div class="mt-4 pt-4 border-t border-white/5">
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-gray-400">Release Date</span>
                <span class="font-semibold text-white">${releaseDateText}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400">Countdown</span>
                <span class="font-bold text-[#FF8C42]">${isReleased ? 'Released!' : `${daysLeft} Days to go`}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 5. Render Popular Actors
  const actorsGrid = document.getElementById('actors-grid');
  if (actorsGrid) {
    actorsGrid.innerHTML = actors.slice(0, 5).map(actor => {
      return `
        <div class="bg-[#1A1A1A]/80 border border-white/5 p-4 rounded-xl text-center group hover:border-[#FF6B00]/30 transition duration-300" data-aos="zoom-in">
          <div class="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/10 group-hover:border-[#FF6B00] transition duration-300">
            <img src="${actor.profile_path}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="${actor.name}">
          </div>
          <h4 class="font-bold text-white group-hover:text-[#FF6B00] transition">${actor.name}</h4>
          <p class="text-xs text-gray-400 mt-1 line-clamp-1">${actor.known_for}</p>
        </div>
      `;
    }).join('');
  }

  // 6. Box Office Stats quick counters animation
  animateCounter('stat-worldwide', 7887961986, '$');
  animateCounter('stat-domestic', 3388792019, '$');
  animateCounter('stat-international', 4499169967, '$');

  // 7. Render OTT Updates
  const ottContainer = document.getElementById('ott-grid-home');
  if (ottContainer) {
    // Collect some entries
    const items = [];
    window.mockData.ottReleases.forEach(platform => {
      platform.movies.forEach(m => {
        items.push({ ...m, platform: platform.platform, logo: platform.logo });
      });
    });

    ottContainer.innerHTML = items.slice(0, 4).map(item => `
      <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 flex items-center space-x-4 hover:border-[#FF6B00]/25 transition duration-300" data-aos="fade-up">
        <img src="${item.poster}" data-ott-title="${item.title}" class="w-12 h-16 rounded object-cover" alt="${item.title}">
        <div class="flex-1 min-w-0">
          <h4 class="text-white font-bold text-sm truncate">${item.title}</h4>
          <span class="text-xs text-gray-400 flex items-center space-x-1 mt-1">
            <span class="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 text-[10px] font-semibold">${item.platform}</span>
            <span>•</span>
            <span>Streaming ${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </span>
        </div>
      </div>
    `).join('');

    // Asynchronously fetch live posters from TMDB if in live mode
    if (!window.BoxOfficeAPI.isMockMode()) {
      items.slice(0, 4).forEach(async (item) => {
        try {
          const results = await window.BoxOfficeAPI.search(item.title);
          if (results && results.length > 0 && results[0].poster_path) {
            const realPoster = window.BoxOfficeAPI.getImageUrl(results[0].poster_path);
            const imgEl = ottContainer.querySelector(`img[data-ott-title="${item.title.replace(/"/g, '\\"')}"]`);
            if (imgEl) imgEl.src = realPoster;
          }
        } catch (e) {
          console.warn(`Failed to fetch live poster for ${item.title}:`, e);
        }
      });
    }
  }

  // News card rendering has been removed

  lucide.createIcons();
}

// Helper to render movie card HTML
function renderMovieCard(movie, extraClass = '') {
  const poster = window.BoxOfficeAPI.getImageUrl(movie.poster_path, 'w500');
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";
  const isFav = appState.favorites.includes(movie.id);
  const isWatchlist = appState.watchlist.includes(movie.id);

  return `
    <div class="glow-card border border-white/5 bg-[#1A1A1A] rounded-xl overflow-hidden flex flex-col justify-between ${extraClass} group relative" data-aos="fade-up">
      <div class="poster-container aspect-[2/3] relative w-full bg-neutral-900">
        <img src="${poster}" class="poster-img w-full h-full object-cover" alt="${movie.title}">
        
        <!-- Hover actions overlay -->
        <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-4 z-10">
          <div class="flex justify-between items-center">
            <!-- Favorites / Watchlist quick toggles -->
            <button onclick="toggleFavorite(${movie.id}, event)" class="p-2 rounded-full bg-black/60 border border-white/10 hover:bg-[#FF6B00] transition duration-200" title="Add to Favorites">
              <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-white text-white' : 'text-white'}"></i>
            </button>
            <button onclick="toggleWatchlist(${movie.id}, event)" class="p-2 rounded-full bg-black/60 border border-white/10 hover:bg-[#FF6B00] transition duration-200" title="Add to Watchlist">
              <i data-lucide="bookmark" class="w-4 h-4 ${isWatchlist ? 'fill-white text-white' : 'text-white'}"></i>
            </button>
          </div>

          <div class="space-y-3">
            <button onclick="toggleCompare(${movie.id}, event)" class="w-full py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition flex items-center justify-center space-x-1">
              <i data-lucide="columns" class="w-3 h-3"></i>
              <span>Compare</span>
            </button>
            <a href="#movie-details?id=${movie.id}" class="block w-full py-2 rounded bg-[#FF6B00] hover:bg-[#FF8C42] text-xs font-bold text-white text-center shadow-lg transition">View Details</a>
          </div>
        </div>

        <!-- Rating indicator on poster corner -->
        <div class="absolute top-3 left-3 bg-[#1A1A1A]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center space-x-1 z-20">
          <i data-lucide="star" class="w-3.5 h-3.5 fill-[#FFA726] text-[#FFA726]"></i>
          <span class="text-xs font-bold text-white">${rating}</span>
        </div>
      </div>

      <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
        <h4 class="font-bold text-white group-hover:text-[#FF6B00] transition line-clamp-1"><a href="#movie-details?id=${movie.id}">${movie.title}</a></h4>
        <div class="flex justify-between items-center text-xs text-gray-400">
          <span>${releaseYear}</span>
          <span>${movie.runtime ? `${movie.runtime} min` : ''}</span>
        </div>
      </div>
    </div>
  `;
}

// MOVIES DIRECTORY PAGE
async function setupMoviesPage() {
  const container = document.getElementById('movies-grid-container');
  const genresFilter = document.getElementById('filter-genre');
  const languageFilter = document.getElementById('filter-language');
  const yearFilter = document.getElementById('filter-year');
  const ratingFilter = document.getElementById('filter-rating');
  const ratingValue = document.getElementById('rating-val-display');
  const searchInput = document.getElementById('movie-search-input');

  // Load genres dynamically
  if (genresFilter && genresFilter.children.length <= 1) {
    const genreOptions = appState.genresList.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    genresFilter.innerHTML = `<option value="">All Genres</option>` + genreOptions;
  }

  // Load years options
  if (yearFilter && yearFilter.children.length <= 1) {
    const currentYear = new Date().getFullYear();
    let years = '';
    for (let y = currentYear; y >= 2000; y--) {
      years += `<option value="${y}">${y}</option>`;
    }
    yearFilter.innerHTML = `<option value="">All Years</option>` + years;
  }

  // Sync route query if it came from header search
  if (appState.activeFilters.query && searchInput) {
    searchInput.value = appState.activeFilters.query;
  }

  // Initial listing
  await applyMovieFilters();

  // Wire up filter event listeners
  const filterInputs = [genresFilter, languageFilter, yearFilter, ratingFilter];
  filterInputs.forEach(input => {
    if (input) {
      input.addEventListener('change', async (e) => {
        if (e.target.id === 'filter-rating') {
          ratingValue.textContent = `${e.target.value}+`;
        }
        await applyMovieFilters();
      });
    }
  });

  if (ratingFilter) {
    ratingFilter.addEventListener('input', (e) => {
      ratingValue.textContent = `${e.target.value}+`;
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      appState.activeFilters.query = e.target.value;
      await applyMovieFilters();
    });
  }
}

async function applyMovieFilters() {
  const container = document.getElementById('movies-grid-container');
  if (!container) return;

  container.innerHTML = `<div class="col-span-full py-20 flex justify-center"><div class="skeleton w-16 h-16 rounded-full border-t-2 border-[#FF6B00]"></div></div>`;

  const query = (document.getElementById('movie-search-input')?.value || appState.activeFilters.query).trim();
  const genre = document.getElementById('filter-genre')?.value || '';
  const language = document.getElementById('filter-language')?.value || '';
  const year = document.getElementById('filter-year')?.value || '';
  const rating = parseFloat(document.getElementById('filter-rating')?.value || '0');

  let list = [];
  
  // If query is specified, search. Otherwise get full directory.
  if (query) {
    list = await window.BoxOfficeAPI.search(query);
  } else if (language) {
    // Query movies specifically from that language using API discover
    list = await window.BoxOfficeAPI.getMoviesByLanguage(language);
  } else {
    // Get trending and now playing combined for listing
    const trending = await window.BoxOfficeAPI.getTrending();
    const nowPlaying = await window.BoxOfficeAPI.getNowPlaying();
    const topRated = await window.BoxOfficeAPI.getTopRated();
    
    // De-duplicate
    const map = new Map();
    [...trending, ...nowPlaying, ...topRated].forEach(m => map.set(m.id, m));
    list = Array.from(map.values());
  }

  // Process filters locally
  let filtered = list.filter(movie => {
    // Genre
    if (genre && !movie.genres.includes(parseInt(genre, 10))) return false;
    // Language
    if (language && movie.original_language !== language) return false;
    // Year
    if (year && movie.release_date && !movie.release_date.startsWith(year)) return false;
    // Rating
    if (rating && movie.vote_average < rating) return false;

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20">
        <i data-lucide="alert-triangle" class="w-12 h-12 text-[#FF6B00] mx-auto mb-4"></i>
        <h3 class="text-xl font-bold text-white font-heading">No Movies Found</h3>
        <p class="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(movie => renderMovieCard(movie, 'aspect-[2/3]')).join('');
  lucide.createIcons();
}

// MOVIE DETAILS PAGE
async function setupMovieDetailsPage(id) {
  const details = await window.BoxOfficeAPI.getDetails(id);
  if (!details) return;

  const headerDetails = document.getElementById('details-hero-section');
  const overviewDetails = document.getElementById('details-overview-grid');
  const trailerSection = document.getElementById('details-trailer-section');
  const castGrid = document.getElementById('details-cast-grid');
  const reviewsSection = document.getElementById('details-reviews-section');
  const similarSection = document.getElementById('details-similar-section');

  // 1. Render Hero Backdrop
  const ratingPercent = Math.round(details.vote_average * 10);
  const ratingOffset = 251.2 - (251.2 * ratingPercent) / 100;
  const isFav = appState.favorites.includes(details.id);
  const isWatchlist = appState.watchlist.includes(details.id);
  
  const formattedBudget = details.budget ? `$${details.budget.toLocaleString()}` : 'N/A';
  const formattedRevenue = details.revenue ? `$${details.revenue.toLocaleString()}` : 'N/A';

  headerDetails.innerHTML = `
    <!-- Backdrop Background -->
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: linear-gradient(to bottom, rgba(15, 15, 15, 0.4) 10%, rgba(15, 15, 15, 0.95) 90%), url('${details.backdrop_path}');"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent"></div>

    <div class="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-12 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
      <!-- Poster -->
      <div class="col-span-12 md:col-span-4" data-aos="fade-right">
        <img src="${details.poster_path}" class="w-full max-w-xs md:max-w-sm rounded-2xl shadow-2xl border border-white/10 mx-auto" alt="${details.title}">
      </div>

      <!-- Info -->
      <div class="col-span-12 md:col-span-8 space-y-6 text-left" data-aos="fade-left">
        <div class="space-y-2">
          <h1 class="text-4xl md:text-5xl font-black font-heading leading-tight">${details.title}</h1>
          ${details.tagline ? `<p class="text-lg md:text-xl text-[#FF8C42] italic font-medium">${details.tagline}</p>` : ''}
        </div>

        <div class="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 font-semibold">
          <span class="bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] px-2.5 py-1 rounded">${details.release_date}</span>
          <span>•</span>
          <span>${details.runtime} mins</span>
          <span>•</span>
          <span>${details.original_language.toUpperCase()}</span>
          <span class="text-white/20">|</span>
          <div class="flex items-center space-x-1.5">
            <i data-lucide="trophy" class="w-4 h-4 text-[#FFA726]"></i>
            <span class="text-xs text-gray-400 max-w-[200px] truncate" title="${details.omdb.Awards}">${details.omdb.Awards}</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-6 pt-2">
          <!-- Circular Score TMDB -->
          <div class="flex items-center space-x-3">
            <div class="radial-progress-circle w-16 h-16">
              <svg width="60" height="60">
                <circle class="bg" cx="30" cy="30" r="24"></circle>
                <circle class="bar" cx="30" cy="30" r="24" stroke="#FF6B00" stroke-dashoffset="${ratingOffset}"></circle>
              </svg>
              <div class="absolute text-sm font-black text-white">${ratingPercent}%</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 uppercase font-bold tracking-wider">TMDB Score</div>
              <div class="text-xs text-white">${details.vote_count} User Ratings</div>
            </div>
          </div>

          <!-- Other Ratings -->
          <div class="grid grid-cols-3 gap-4 border-l border-white/10 pl-6 text-center">
            <div>
              <div class="text-xs text-gray-400 font-semibold mb-1">IMDb</div>
              <div class="flex items-center justify-center space-x-1">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-[#FFA726] text-[#FFA726]"></i>
                <span class="text-sm font-bold text-white">${details.omdb.imdbRating}</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-400 font-semibold mb-1">Rotten Tomatoes</div>
              <div class="text-sm font-bold text-white">${details.omdb.RottenTomatoes}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 font-semibold mb-1">Metacritic</div>
              <div class="text-sm font-bold text-white">${details.omdb.Metascore}/100</div>
            </div>
          </div>
        </div>

        <div class="space-y-3 pt-2">
          <h3 class="text-lg font-bold font-heading">Overview</h3>
          <p class="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">${details.overview}</p>
        </div>

        <div class="flex flex-wrap gap-4 pt-4 border-t border-white/5">
          <button onclick="toggleFavorite(${details.id}, event)" class="px-5 py-2.5 rounded-lg border ${isFav ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'border-white/20 hover:border-[#FF6B00] text-white'} font-semibold text-sm transition flex items-center space-x-2">
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-white text-white' : ''}"></i>
            <span>${isFav ? 'Favorited' : 'Add to Favorites'}</span>
          </button>
          <button onclick="toggleWatchlist(${details.id}, event)" class="px-5 py-2.5 rounded-lg border ${isWatchlist ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'border-white/20 hover:border-[#FF6B00] text-white'} font-semibold text-sm transition flex items-center space-x-2">
            <i data-lucide="bookmark" class="w-4 h-4 ${isWatchlist ? 'fill-white text-white' : ''}"></i>
            <span>${isWatchlist ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>
          <button onclick="toggleCompare(${details.id}, event)" class="px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/5 text-white font-semibold text-sm transition flex items-center space-x-2">
            <i data-lucide="columns" class="w-4 h-4"></i>
            <span>Compare Movie</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // 2. Render Financial details and Production companies
  overviewDetails.innerHTML = `
    <div class="bg-[#1A1A1A] p-6 rounded-xl border border-white/5 space-y-4" data-aos="fade-up">
      <h3 class="text-xl font-bold font-heading border-b border-white/5 pb-2">Technical & Finance</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400 block">Budget</span>
          <span class="text-white font-semibold">${formattedBudget}</span>
        </div>
        <div>
          <span class="text-gray-400 block">Revenue</span>
          <span class="text-white font-semibold">${formattedRevenue}</span>
        </div>
        <div>
          <span class="text-gray-400 block">Box Office Status</span>
          <span class="font-bold ${details.revenue > details.budget * 2.5 ? 'text-green-500' : 'text-[#FFA726]'}">
            ${details.revenue > details.budget * 2.5 ? 'Blockbuster' : details.revenue > details.budget ? 'Profitable' : 'flop/underperforming'}
          </span>
        </div>
        <div>
          <span class="text-gray-400 block">Production Studio</span>
          <span class="text-white truncate block" title="${details.production_companies.map(c => c.name).join(', ')}">
            ${details.production_companies[0] ? details.production_companies[0].name : 'N/A'}
          </span>
        </div>
      </div>
    </div>

    <div class="bg-[#1A1A1A] p-6 rounded-xl border border-white/5 space-y-4" data-aos="fade-up">
      <h3 class="text-xl font-bold font-heading border-b border-white/5 pb-2">Key Crew Members</h3>
      <div class="space-y-3">
        ${details.credits.crew.map(member => `
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-400">${member.job}</span>
            <span class="text-white font-semibold text-right">${member.name}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // 3. Render Cast
  castGrid.innerHTML = details.credits.cast.map(c => `
    <div class="bg-[#1F1F1F] rounded-lg overflow-hidden border border-white/5 text-center p-3 group hover:border-[#FF6B00]/30 transition" data-aos="zoom-in">
      <div class="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border border-white/10 group-hover:border-[#FF6B00] transition">
        <img src="${c.profile_path}" class="w-full h-full object-cover group-hover:scale-105 transition" alt="${c.name}">
      </div>
      <h4 class="text-sm font-bold text-white truncate">${c.name}</h4>
      <p class="text-xs text-gray-400 truncate">${c.character}</p>
    </div>
  `).join('');

  // 4. Render Trailer Video Embed
  if (details.trailer_url) {
    trailerSection.classList.remove('hidden');
    trailerSection.querySelector('.aspect-video').innerHTML = `
      <iframe class="w-full h-full rounded-xl shadow-2xl border border-white/5" src="${details.trailer_url}" title="${details.title} Official Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `;
  } else {
    trailerSection.classList.add('hidden');
  }

  // 5. Render Reviews
  if (details.reviews && details.reviews.length > 0) {
    reviewsSection.classList.remove('hidden');
    reviewsSection.querySelector('.reviews-wrapper').innerHTML = details.reviews.map(rev => `
      <div class="bg-[#1A1A1A] p-5 rounded-xl border border-white/5 space-y-3" data-aos="fade-up">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center border border-[#FF6B00]/30 text-xs font-bold text-[#FF6B00]">
              ${rev.author[0].toUpperCase()}
            </div>
            <div>
              <h4 class="text-sm font-bold text-white">${rev.author}</h4>
              <span class="text-xs text-gray-500">${rev.date}</span>
            </div>
          </div>
          <div class="flex items-center space-x-1 text-[#FFA726] bg-[#FFA726]/10 px-2 py-0.5 rounded border border-[#FFA726]/20">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-[#FFA726]"></i>
            <span class="text-xs font-bold">${rev.rating}/10</span>
          </div>
        </div>
        <p class="text-sm text-gray-300 leading-relaxed">${rev.content}</p>
      </div>
    `).join('');
  } else {
    reviewsSection.classList.add('hidden');
  }

  // 6. Render Similar Movies (mock similar logic or TMDB responses)
  let similarList = [];
  if (details.similar && details.similar.length > 0) {
    similarList = details.similar.slice(0, 4);
  } else {
    // Local fallback: same genres
    similarList = window.mockData.movies.filter(m => 
      m.id !== details.id && m.genres.some(g => details.genres.includes(g))
    ).slice(0, 4);
  }

  similarSection.innerHTML = similarList.map(movie => renderMovieCard(movie, 'aspect-[2/3]')).join('');

  lucide.createIcons();
}

// BOX OFFICE FINANCIAL PAGE
function setupBoxOfficePage() {
  // Stats Counters
  animateCounter('bo-stat-worldwide', 7887961986, '$');
  animateCounter('bo-stat-domestic', 3388792019, '$');
  animateCounter('bo-stat-international', 4499169967, '$');

  // Chart Rendering (SVG based)
  renderWorldwideSVGChart();
  renderWeeklySVGChart();

  // Grid of details
  const domesticGrid = document.getElementById('bo-domestic-table');
  if (domesticGrid) {
    const list = window.mockData.boxOfficeReports.domesticChart;
    domesticGrid.innerHTML = list.map((item, idx) => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition text-sm">
        <td class="py-3 px-4 font-bold text-[#FF8C42]">${idx+1}</td>
        <td class="py-3 px-4 text-white font-semibold">${item.title}</td>
        <td class="py-3 px-4 text-right text-gray-300 font-bold">$${item.revenue.toLocaleString()}</td>
      </tr>
    `).join('');
  }

  const openingGrid = document.getElementById('bo-opening-table');
  if (openingGrid) {
    const list = window.mockData.boxOfficeReports.openingWeekendChart;
    openingGrid.innerHTML = list.map((item, idx) => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition text-sm">
        <td class="py-3 px-4 font-bold text-[#FF8C42]">${idx+1}</td>
        <td class="py-3 px-4 text-white font-semibold">${item.title}</td>
        <td class="py-3 px-4 text-right text-gray-300 font-bold">$${item.opening.toLocaleString()}</td>
      </tr>
    `).join('');
  }
}

// Generate Beautiful SVG charts dynamically
function renderWorldwideSVGChart() {
  const chartContainer = document.getElementById('svg-chart-worldwide');
  if (!chartContainer) return;

  const data = window.mockData.boxOfficeReports.worldwideChart;
  
  // Design dimensions
  const width = 800;
  const height = 400;
  const paddingLeft = 180;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 50;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const barHeight = Math.floor(chartHeight / data.length) - 8;

  let svgElements = '';

  data.forEach((movie, idx) => {
    const y = paddingTop + idx * (barHeight + 8);
    const barWidth = Math.floor((movie.revenue / maxRevenue) * chartWidth);
    const formattedRev = `$${(movie.revenue / 1000000000).toFixed(2)}B`;

    // Horizontal bars
    svgElements += `
      <!-- Bar Entry -->
      <g class="group" cursor="pointer" onclick="window.location.hash='#movie-details?id=${movie.rank == 1 ? 76600 : movie.rank == 2 ? 346698 : movie.rank == 3 ? 155 : movie.rank == 4 ? 872585 : movie.rank == 5 ? 414906 : movie.rank == 6 ? 1011985 : movie.rank == 7 ? 157336 : 569094}'">
        <!-- Label -->
        <text x="${paddingLeft - 15}" y="${y + barHeight/2 + 5}" fill="#BDBDBD" font-size="11" font-weight="600" text-anchor="end" font-family="Outfit, sans-serif">
          ${movie.title.length > 22 ? movie.title.substring(0, 20) + '...' : movie.title}
        </text>
        
        <!-- Background pill bar -->
        <rect x="${paddingLeft}" y="${y}" width="${chartWidth}" height="${barHeight}" fill="#222" rx="4" opacity="0.3"></rect>
        
        <!-- Active bar -->
        <rect x="${paddingLeft}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#orange-grad)" rx="4" class="transition-all duration-1000 ease-out hover:opacity-85">
          <animate attributeName="width" from="0" to="${barWidth}" dur="0.8s" fill="freeze" />
        </rect>
        
        <!-- Value indicator -->
        <text x="${paddingLeft + barWidth + 10}" y="${y + barHeight/2 + 5}" fill="#FFFFFF" font-size="11" font-weight="bold" font-family="Outfit, sans-serif">
          ${formattedRev}
        </text>
      </g>
    `;
  });

  chartContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto">
      <defs>
        <linearGradient id="orange-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FF6B00" />
          <stop offset="100%" stop-color="#FFA726" />
        </linearGradient>
      </defs>
      <!-- Grid line -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" stroke="#333" stroke-width="1.5"></line>
      ${svgElements}
    </svg>
  `;
}

function renderWeeklySVGChart() {
  const chartContainer = document.getElementById('svg-chart-weekly');
  if (!chartContainer) return;

  const data = window.mockData.boxOfficeReports.weeklyCollections;
  
  const width = 800;
  const height = 400;
  const paddingLeft = 60;
  const paddingRight = 120;
  const paddingTop = 40;
  const paddingBottom = 50;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxAmt = 280; // Max $M in chart
  const stepX = chartWidth / (data.length - 1);

  // Trace lines for 3 keys: Barbie, Oppenheimer, Dune: Part Two
  const lines = {
    'Barbie': { color: '#FF6B00', points: [] },
    'Oppenheimer': { color: '#FFA726', points: [] },
    'Dune: Part Two': { color: '#FF8C42', points: [] }
  };

  data.forEach((w, idx) => {
    const x = paddingLeft + idx * stepX;
    
    // Map points
    const yBarbie = height - paddingBottom - (w['Barbie'] / maxAmt) * chartHeight;
    const yOpp = height - paddingBottom - (w['Oppenheimer'] / maxAmt) * chartHeight;
    const yDune = height - paddingBottom - (w['Dune: Part Two'] / maxAmt) * chartHeight;

    lines['Barbie'].points.push(`${x},${yBarbie}`);
    lines['Oppenheimer'].points.push(`${x},${yOpp}`);
    lines['Dune: Part Two'].points.push(`${x},${yDune}`);
  });

  let polylineSVG = '';
  let dotSVG = '';
  Object.keys(lines).forEach(key => {
    const stroke = lines[key].color;
    const pointsStr = lines[key].points.join(' ');
    polylineSVG += `<polyline fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" points="${pointsStr}" class="transition-all duration-300"></polyline>`;

    // Add glowing dots
    lines[key].points.forEach((p, idx) => {
      const [x, y] = p.split(',');
      const amt = data[idx][key];
      dotSVG += `
        <circle cx="${x}" cy="${y}" r="5" fill="${stroke}" class="hover:r-7 transition cursor-pointer">
          <title>${key} (${data[idx].week}): $${amt}M</title>
        </circle>
      `;
    });
  });

  // Render grids and weeks label
  let gridsSVG = '';
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (i / 4) * chartHeight;
    const val = maxAmt - (i / 4) * maxAmt;
    gridsSVG += `
      <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" stroke="#222" stroke-width="1"></line>
      <text x="${paddingLeft - 10}" y="${y + 4}" fill="#BDBDBD" font-size="10" text-anchor="end" font-family="Outfit">$${val}M</text>
    `;
  }

  // Weeks axis
  let weeksAxis = '';
  data.forEach((w, idx) => {
    const x = paddingLeft + idx * stepX;
    weeksAxis += `<text x="${x}" y="${height - paddingBottom + 20}" fill="#BDBDBD" font-size="11" font-weight="600" text-anchor="middle" font-family="Outfit">${w.week}</text>`;
  });

  chartContainer.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto">
      <!-- Grid -->
      ${gridsSVG}
      <!-- Polylines -->
      ${polylineSVG}
      <!-- Dots -->
      ${dotSVG}
      <!-- X-axis Labels -->
      ${weeksAxis}
      
      <!-- Legends -->
      <g transform="translate(${width - paddingRight + 20}, ${paddingTop})">
        <circle cx="0" cy="10" r="6" fill="#FF6B00"></circle>
        <text x="15" y="14" fill="#FFF" font-size="11" font-weight="600" font-family="Outfit">Barbie</text>
        
        <circle cx="0" cy="35" r="6" fill="#FFA726"></circle>
        <text x="15" y="39" fill="#FFF" font-size="11" font-weight="600" font-family="Outfit">Oppenheimer</text>
        
        <circle cx="0" cy="60" r="6" fill="#FF8C42"></circle>
        <text x="15" y="64" fill="#FFF" font-size="11" font-weight="600" font-family="Outfit">Dune 2</text>
      </g>
    </svg>
  `;
}

// NEWS PAGE
function setupNewsPage() {
  const container = document.getElementById('news-articles-grid');
  if (!container) return;

  // Initial render of all articles
  renderArticles(window.mockData.news);

  // Wire up category selector tags
  document.querySelectorAll('.news-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.news-tag').forEach(t => t.classList.remove('bg-[#FF6B00]', 'text-white'));
      tag.classList.add('bg-[#FF6B00]', 'text-white');

      const cat = tag.getAttribute('data-category');
      if (cat === 'all') {
        renderArticles(window.mockData.news);
      } else {
        const filtered = window.mockData.news.filter(a => a.category.toLowerCase().includes(cat.toLowerCase()));
        renderArticles(filtered);
      }
    });
  });
}

function renderArticles(list) {
  const container = document.getElementById('news-articles-grid');
  container.innerHTML = list.map(article => `
    <div class="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden group hover:border-[#FF6B00]/30 transition flex flex-col md:flex-row" data-aos="fade-up">
      <div class="relative overflow-hidden w-full md:w-80 aspect-video md:aspect-auto">
        <img src="${article.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${article.headline}">
        <span class="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider text-white bg-[#FF6B00] px-2.5 py-1 rounded shadow-md">${article.category}</span>
      </div>
      <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <span class="text-xs text-gray-500">${article.date} • ${article.source}</span>
          <h3 class="text-xl font-bold text-white font-heading leading-snug group-hover:text-[#FF6B00] transition">${article.headline}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">${article.content}</p>
        </div>
        <div class="pt-2">
          <button onclick="readFullNews(${article.id})" class="text-sm font-semibold text-[#FF8C42] hover:text-[#FF6B00] transition flex items-center space-x-1">
            <span>Read Full Article</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function readFullNews(id) {
  const article = window.mockData.news.find(a => a.id === id);
  if (!article) return;
  // Use custom modal, or a quick browser prompt. Let's create an elegant alert modal
  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4";
  modal.innerHTML = `
    <div class="bg-[#1A1A1A] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative" data-aos="zoom-in">
      <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white transition">
        <i data-lucide="x" class="w-6 h-6"></i>
      </button>
      <div class="space-y-2">
        <span class="text-xs px-2 py-0.5 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] font-bold">${article.category}</span>
        <h2 class="text-2xl font-black font-heading text-white pt-2">${article.headline}</h2>
        <span class="text-xs text-gray-500 block">${article.date} • Source: ${article.source}</span>
      </div>
      <img src="${article.image}" class="w-full rounded-xl aspect-video object-cover" alt="">
      <p class="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">${article.content}</p>
    </div>
  `;
  document.body.appendChild(modal);
  lucide.createIcons();
}
window.readFullNews = readFullNews;

// OTT STREAMING RELEASES PAGE
function setupOTTPage() {
  const container = document.getElementById('ott-platforms-grid');
  if (!container) return;

  container.innerHTML = window.mockData.ottReleases.map(platform => {
    const listHtml = platform.movies.map(movie => `
      <div class="bg-[#1E1E1E] p-3 rounded-lg border border-white/5 flex items-center space-x-3 hover:border-white/10 transition">
        <img src="${movie.poster}" data-ott-title="${movie.title}" class="w-10 h-14 rounded object-cover" alt="">
        <div class="min-w-0 flex-1">
          <h4 class="text-white text-sm font-bold truncate">${movie.title}</h4>
          <span class="text-xs text-[#FF8C42] block mt-1">Streaming: ${movie.date}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 space-y-4" data-aos="fade-up">
        <div class="flex items-center space-x-3 border-b border-white/5 pb-4">
          <!-- Mini logo or text logo -->
          <div class="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span>
            <span>${platform.platform}</span>
          </div>
        </div>
        <div class="space-y-3">
          ${listHtml}
        </div>
      </div>
    `;
  }).join('');

  // If Live Mode, dynamically fetch real posters from TMDB
  if (!window.BoxOfficeAPI.isMockMode()) {
    window.mockData.ottReleases.forEach(platform => {
      platform.movies.forEach(async (movie) => {
        try {
          const results = await window.BoxOfficeAPI.search(movie.title);
          if (results && results.length > 0 && results[0].poster_path) {
            const realPoster = window.BoxOfficeAPI.getImageUrl(results[0].poster_path);
            const imgEl = container.querySelector(`img[data-ott-title="${movie.title.replace(/"/g, '\\"')}"]`);
            if (imgEl) imgEl.src = realPoster;
          }
        } catch (e) {
          console.warn(`Failed to fetch live poster for ${movie.title}:`, e);
        }
      });
    });
  }
}

// ABOUT PAGE
function setupAboutPage() {
  // Simple form/scroll triggers handled by AOS
}

// Contact page features have been removed

// ----------------------------------------------------
// DYNAMIC COMPONENT ACTIONS (WATCHLIST, COMPARE, ETC)
// ----------------------------------------------------

// Trailer global trigger
function playTrailer(url) {
  const modal = document.getElementById('trailer-video-modal');
  const frame = document.getElementById('trailer-iframe');
  if (modal && frame) {
    frame.src = url;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}
window.playTrailer = playTrailer;

function closeTrailer() {
  const modal = document.getElementById('trailer-video-modal');
  const frame = document.getElementById('trailer-iframe');
  if (modal && frame) {
    frame.src = '';
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}
window.closeTrailer = closeTrailer;

// Watchlist Toggle
function toggleWatchlist(movieId, event) {
  if (event) event.stopPropagation();
  const index = appState.watchlist.indexOf(movieId);
  if (index === -1) {
    appState.watchlist.push(movieId);
    showToast("Added to your Watchlist!", "success");
  } else {
    appState.watchlist.splice(index, 1);
    showToast("Removed from your Watchlist.", "info");
  }
  saveState('watchlist', appState.watchlist);
  
  // Re-render current page if active
  if (window.location.hash.startsWith('#movies')) {
    applyMovieFilters();
  } else if (window.location.hash.startsWith('#movie-details')) {
    const id = window.location.hash.split('?id=')[1];
    setupMovieDetailsPage(id);
  } else if (window.location.hash === '#home') {
    setupHomePage();
  }
}
window.toggleWatchlist = toggleWatchlist;

// Favorite Toggle
function toggleFavorite(movieId, event) {
  if (event) event.stopPropagation();
  const index = appState.favorites.indexOf(movieId);
  if (index === -1) {
    appState.favorites.push(movieId);
    showToast("Added to your Favorites!", "success");
  } else {
    appState.favorites.splice(index, 1);
    showToast("Removed from your Favorites.", "info");
  }
  saveState('favorites', appState.favorites);
  
  // Re-render
  if (window.location.hash.startsWith('#movies')) {
    applyMovieFilters();
  } else if (window.location.hash.startsWith('#movie-details')) {
    const id = window.location.hash.split('?id=')[1];
    setupMovieDetailsPage(id);
  } else if (window.location.hash === '#home') {
    setupHomePage();
  }
}
window.toggleFavorite = toggleFavorite;

// ----------------------------------------------------
// COMPARISON MODULE
// ----------------------------------------------------
function initComparisonUI() {
  const panel = document.getElementById('comparison-sidebar');
  const closeBtn = document.getElementById('close-compare-sidebar');
  const resetBtn = document.getElementById('reset-comparison');

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      panel.classList.add('translate-x-full');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      appState.compareList = [];
      saveState('compare', appState.compareList);
      updateCompareUI();
    });
  }

  updateCompareUI();
}

async function toggleCompare(movieId, event) {
  if (event) event.stopPropagation();
  const panel = document.getElementById('comparison-sidebar');
  
  const idx = appState.compareList.indexOf(movieId);
  if (idx !== -1) {
    // Remove
    appState.compareList.splice(idx, 1);
    showToast("Movie removed from comparison list.", "info");
  } else {
    if (appState.compareList.length >= 3) {
      showToast("You can compare a maximum of 3 movies.", "error");
      return;
    }
    appState.compareList.push(movieId);
    showToast("Movie added to comparison list!", "success");
  }
  
  saveState('compare', appState.compareList);
  updateCompareUI();

  // Slide panel open
  if (panel && appState.compareList.length > 0) {
    panel.classList.remove('translate-x-full');
  }
}
window.toggleCompare = toggleCompare;

async function updateCompareUI() {
  const grid = document.getElementById('comparison-movies-grid');
  const badge = document.getElementById('compare-count-badge');
  if (!grid || !badge) return;

  badge.textContent = appState.compareList.length;

  if (appState.compareList.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-8 text-center text-gray-400 text-sm">Add movies from listing to compare.</div>`;
    return;
  }

  // Fetch full details for compared items
  const detailsList = await Promise.all(
    appState.compareList.map(id => window.BoxOfficeAPI.getDetails(id))
  );

  grid.innerHTML = detailsList.map(movie => {
    const poster = window.BoxOfficeAPI.getImageUrl(movie.poster_path, 'w500');
    return `
      <div class="bg-[#1F1F1F] p-4 rounded-xl border border-white/5 space-y-4 text-xs">
        <div class="relative">
          <img src="${poster}" class="w-full aspect-[2/3] object-cover rounded-lg mb-2" alt="">
          <button onclick="toggleCompare(${movie.id}, event)" class="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white hover:bg-red-700 transition">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
        <h4 class="font-bold text-sm text-white line-clamp-1">${movie.title}</h4>
        
        <div class="space-y-2 pt-2 border-t border-white/5">
          <div>
            <span class="text-gray-400 block font-semibold">IMDb Score</span>
            <span class="text-white font-bold">${movie.omdb.imdbRating}</span>
          </div>
          <div>
            <span class="text-gray-400 block font-semibold">Worldwide Box Office</span>
            <span class="text-[#FF6B00] font-bold">$${movie.revenue ? movie.revenue.toLocaleString() : 'N/A'}</span>
          </div>
          <div>
            <span class="text-gray-400 block font-semibold">Budget</span>
            <span class="text-white font-semibold">$${movie.budget ? movie.budget.toLocaleString() : 'N/A'}</span>
          </div>
          <div>
            <span class="text-gray-400 block font-semibold">Runtime</span>
            <span class="text-white font-semibold">${movie.runtime} min</span>
          </div>
          <div>
            <span class="text-gray-400 block font-semibold">Release Date</span>
            <span class="text-white font-semibold">${movie.release_date}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ----------------------------------------------------
// UI AUXILIARY HELPERS
// ----------------------------------------------------

// Animated Counter utility
function animateCounter(elementId, targetValue, prefix = '') {
  const el = document.getElementById(elementId);
  if (!el) return;

  let start = 0;
  const duration = 1200; // ms
  const stepTime = 15;
  const steps = duration / stepTime;
  const increment = targetValue / steps;

  // Clear previous timers if any
  if (el.dataset.timerId) {
    clearInterval(parseInt(el.dataset.timerId, 10));
  }

  const timer = setInterval(() => {
    start += increment;
    if (start >= targetValue) {
      clearInterval(timer);
      el.textContent = prefix + targetValue.toLocaleString();
    } else {
      el.textContent = prefix + Math.floor(start).toLocaleString();
    }
  }, stepTime);

  el.dataset.timerId = timer;
}

// Switch Now Playing movies by language category
async function switchNowPlayingLang(lang, buttonEl) {
  // Highlight active tab
  document.querySelectorAll('.now-playing-tab').forEach(btn => {
    btn.classList.remove('bg-[#FF6B00]', 'text-white');
    btn.classList.add('text-gray-400', 'hover:text-white');
  });
  if (buttonEl) {
    buttonEl.classList.remove('text-gray-400', 'hover:text-white');
    buttonEl.classList.add('bg-[#FF6B00]', 'text-white');
  }

  const grid = document.getElementById('now-playing-grid');
  if (!grid) return;

  // Show loading skeleton shimmer
  grid.innerHTML = Array(4).fill(0).map(() => `
    <div class="p-2 aspect-[2/3]">
      <div class="skeleton w-full h-full rounded-xl min-h-[300px]"></div>
    </div>
  `).join('');

  try {
    // Fetch movies by language
    const movies = await window.BoxOfficeAPI.getNowPlaying(lang);
    
    if (!movies || movies.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-20 bg-[#1A1A1A]/50 border border-white/5 rounded-xl">
          <i data-lucide="alert-triangle" class="w-12 h-12 text-[#FF6B00] mx-auto mb-4"></i>
          <p class="text-base font-bold text-white">No Movies Found</p>
          <p class="text-xs text-gray-400 mt-1">No now-playing movies are registered for this language.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Render cards
    grid.innerHTML = movies.slice(0, 8).map(movie => renderMovieCard(movie, 'aspect-[2/3]')).join('');
    if (window.lucide) lucide.createIcons();
    if (window.AOS) window.AOS.refresh();
  } catch (err) {
    console.error("Failed switching now playing lang:", err);
    grid.innerHTML = `<div class="col-span-full py-8 text-center text-red-500">Failed to load content.</div>`;
  }
}
window.switchNowPlayingLang = switchNowPlayingLang;
