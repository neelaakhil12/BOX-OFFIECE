// CINIPHILES - Core Application Script

let showtimeCoords = { lat: '17.3850', lng: '78.4867', label: 'Hyderabad' };

// State Management
const appState = {
  watchlist: JSON.parse(localStorage.getItem('bo_watchlist')) || [],
  favorites: JSON.parse(localStorage.getItem('bo_favorites')) || [],
  compareList: JSON.parse(localStorage.getItem('bo_compare')) || [],
  activeFilters: {
    query: '',
    genre: '',
    language: 'te',
    year: '',
    minRating: 0
  },
  genresList: [],
  snapshotDayOffset: 0,
  activeBreakdownTab: 'state',
  currentMovieDetails: null
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

  // 6. Box Office Stats quick counters animation (computed dynamically from trending movies)
  let totalWorldwide = 0;
  let totalDomestic = 0;
  let totalInternational = 0;

  trending.forEach(m => {
    if (m.liveBoxOffice) {
      totalWorldwide += m.liveBoxOffice.totalGross || 0;
      // Split domestic/international share
      totalDomestic += Math.round((m.liveBoxOffice.totalGross || 0) * 0.65);
      totalInternational += Math.round((m.liveBoxOffice.totalGross || 0) * 0.35);
    }
  });

  if (totalWorldwide < 50000000) {
    totalWorldwide = 7887961986;
    totalDomestic = 3388792019;
    totalInternational = 4499169967;
  }

  animateCounter('stat-worldwide', totalWorldwide, '$');
  animateCounter('stat-domestic', totalDomestic, '$');
  animateCounter('stat-international', totalInternational, '$');

  // 7. Render OTT Updates
  const ottContainer = document.getElementById('ott-grid-home');
  if (ottContainer) {
    ottContainer.innerHTML = `
      <div class="col-span-full py-10 text-center">
        <div class="skeleton w-8 h-8 rounded-full border-t-2 border-[#FF6B00] animate-spin mx-auto mb-2"></div>
        <span class="text-xs text-gray-400">Loading live OTT schedules...</span>
      </div>
    `;

    // Fetch live watch provider releases from TMDB
    const liveOttPlatforms = await window.BoxOfficeAPI.getOTTReleases();
    const items = [];
    liveOttPlatforms.forEach(platform => {
      platform.movies.forEach(m => {
        items.push({ ...m, platform: platform.platform, logo: platform.logo });
      });
    });

    const today = new Date();
    today.setHours(0,0,0,0);

    if (items.length === 0) {
      ottContainer.innerHTML = `<div class="col-span-full text-center text-gray-400 text-sm py-8">No live OTT releases found.</div>`;
    } else {
      ottContainer.innerHTML = items.slice(0, 4).map(item => {
        const releaseDate = new Date(item.date);
        releaseDate.setHours(0,0,0,0);
        const isReleased = releaseDate <= today;
        let statusText = "";
        if (isReleased) {
          statusText = `<span class="text-green-400 font-semibold">Streaming Now</span>`;
        } else {
          const diffDays = Math.ceil(Math.abs(releaseDate - today) / (1000 * 60 * 60 * 24));
          statusText = `<span class="text-[#FF8C42] font-semibold">Upcoming (${diffDays}d left)</span>`;
        }

        return `
          <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 flex items-center space-x-4 hover:border-[#FF6B00]/25 transition duration-300" data-aos="fade-up">
            <img src="${item.poster}" data-ott-title="${item.title}" class="w-12 h-16 rounded object-cover" alt="${item.title}">
            <div class="flex-1 min-w-0">
              <h4 class="text-white font-bold text-sm truncate">${item.title}</h4>
              <div class="flex items-center space-x-1.5 mt-1.5 flex-wrap">
                <span class="px-1.5 py-0.5 rounded bg-white/5 text-gray-300 text-[9px] font-bold uppercase">${item.platform}</span>
                <span class="text-gray-500 text-xs">•</span>
                <span class="text-xs">${statusText}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
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

  appState.currentMovieDetails = details;

  const headerDetails = document.getElementById('details-hero-section');
  const overviewDetails = document.getElementById('details-overview-grid');
  const trailerSection = document.getElementById('details-trailer-section');
  const castGrid = document.getElementById('details-cast-grid');
  const reviewsSection = document.getElementById('details-reviews-section');
  const similarSection = document.getElementById('details-similar-section');

  // Set day elapsed text
  const daysElapsed = document.getElementById('details-days-elapsed');
  if (daysElapsed) {
    const today = new Date();
    daysElapsed.textContent = `Live data as of: ${today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  // Set stats counters
  const statsCounters = document.getElementById('details-stats-counters');
  if (statsCounters) {
    const bo = details.liveBoxOffice;
    const formatRupee = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    statsCounters.innerHTML = `
      <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 space-y-1">
        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">TOTAL GROSS</span>
        <span class="text-xl font-black text-green-400 block">${formatRupee(bo.totalGross)}</span>
      </div>
      <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 space-y-1">
        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">TICKETS SOLD</span>
        <span class="text-xl font-black text-white block">${bo.ticketsSold.toLocaleString()}</span>
      </div>
      <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 space-y-1">
        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">SHOWS</span>
        <span class="text-xl font-black text-white block">${bo.shows.toLocaleString()}</span>
      </div>
      <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 space-y-1">
        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">CITIES</span>
        <span class="text-xl font-black text-white block">${bo.cities.toLocaleString()}</span>
      </div>
      <div class="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 space-y-1">
        <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">% OCCUPANCY</span>
        <span class="text-xl font-black text-[#FFA726] block">${bo.occupancy}%</span>
      </div>
    `;
  }

  // Populate table with state wise breakdown by default
  switchBreakdownTab('state');

  // 1. Render Hero Backdrop
  const ratingPercent = Math.round(details.vote_average * 10);
  const ratingOffset = 251.2 - (251.2 * ratingPercent) / 100;
  const isFav = appState.favorites.includes(details.id);
  const isWatchlist = appState.watchlist.includes(details.id);
  
  const formattedBudget = details.budget ? `₹${(details.budget / 10000000).toFixed(1)} Cr` : 'N/A';
  const formattedRevenue = details.revenue ? `₹${(details.revenue / 10000000).toFixed(1)} Cr` : 'N/A';

  headerDetails.innerHTML = `
    <!-- Backdrop Background -->
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: linear-gradient(to bottom, rgba(15, 15, 15, 0.4) 10%, rgba(15, 15, 15, 0.95) 90%), url('${details.backdrop_path}');"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent"></div>

    <div class="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-12 grid md:grid-cols-12 gap-8 md:gap-12 items-center">
      <!-- Poster -->
      <div class="col-span-12 md:col-span-4" data-aos="fade-right">
        <img src="${details.poster_path}" class="w-full max-w-xs md:max-w-sm rounded-2xl shadow-2xl border border-white/10 mx-auto bg-neutral-900" alt="${details.title}">
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
          <span>TELUGU</span>
          <span class="text-white/20">|</span>
          <div class="flex items-center space-x-1.5">
            <i data-lucide="trophy" class="w-4 h-4 text-[#FFA726]"></i>
            <span class="text-xs text-gray-400 max-w-[200px] truncate" title="${details.omdb ? details.omdb.Awards : ''}">${details.omdb ? details.omdb.Awards : 'N/A'}</span>
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
                <span class="text-sm font-bold text-white">${details.omdb ? details.omdb.imdbRating : 'N/A'}</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-400 font-semibold mb-1">Rotten Tomatoes</div>
              <div class="text-sm font-bold text-white">${details.omdb ? details.omdb.RottenTomatoes : 'N/A'}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 font-semibold mb-1">Metacritic</div>
              <div class="text-sm font-bold text-white">${details.omdb ? details.omdb.Metascore : 'N/A'}/100</div>
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
          <span class="text-gray-400 block">Estimated Revenue</span>
          <span class="text-white font-semibold">${formattedRevenue}</span>
        </div>
        <div>
          <span class="text-gray-400 block">Box Office Status</span>
          <span class="font-bold ${details.revenue > details.budget * 2 ? 'text-green-500' : 'text-[#FFA726]'}">
            ${details.revenue > details.budget * 2 ? 'Blockbuster' : details.revenue > details.budget ? 'Profitable' : 'Average/Below Average'}
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
        <img src="${c.profile_path}" class="w-full h-full object-cover group-hover:scale-105 transition bg-neutral-900" alt="${c.name}">
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

  // 6. Render Similar Movies
  let similarList = [];
  if (details.similar && details.similar.length > 0) {
    similarList = details.similar.slice(0, 4);
  } else {
    similarList = window.mockData.movies.filter(m => 
      m.id !== details.id && m.genres.some(g => details.genres.includes(g))
    ).slice(0, 4);
  }

  similarSection.innerHTML = similarList.map(movie => renderMovieCard(movie, 'aspect-[2/3]')).join('');

  // Fetch showtimes for this movie
  loadTheatreShowtimes(details.title);

  lucide.createIcons();
}

// ── SHOWTIMES & GEOLOCATION LOGIC ────────────────────────────
async function loadTheatreShowtimes(movieTitle) {
  const listEl = document.getElementById('details-showtimes-list');
  if (!listEl) return;

  listEl.innerHTML = `
    <div class="py-12 text-center text-gray-400 text-sm">
      <div class="skeleton w-8 h-8 rounded-full border-t-2 border-[#FF6B00] animate-spin mx-auto mb-3"></div>
      <span>Searching nearby theatres...</span>
    </div>
  `;

  try {
    const showtimes = await window.BoxOfficeAPI.getShowtimes(movieTitle, showtimeCoords.lat, showtimeCoords.lng);
    
    if (!showtimes || showtimes.length === 0) {
      listEl.innerHTML = `
        <div class="py-12 text-center text-gray-400 text-sm">
          <i data-lucide="info" class="w-8 h-8 mx-auto mb-2 text-[#FF6B00]"></i>
          <span>No cinemas found playing this movie nearby today.</span>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    listEl.innerHTML = showtimes.map(c => {
      const showtimeBadges = c.showtimes.map(st => `
        <button onclick="bookShowtimeTicket('${c.cinema_name.replace(/'/g, "\\'")}', '${st.time}', '${st.type}')" class="px-3 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#FF6B00] border border-white/5 hover:border-[#FF6B00] text-xs font-semibold text-gray-300 hover:text-white transition duration-200 flex flex-col items-center justify-center min-w-[70px]">
          <span>${st.time}</span>
          <span class="text-[8px] text-gray-400 hover:text-white/80 font-bold tracking-widest mt-0.5">${st.type}</span>
        </button>
      `).join('');

      return `
        <div class="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-white/10 transition">
          <div class="space-y-1.5">
            <div class="flex items-center space-x-2">
              <h4 class="font-bold text-white text-sm">${c.cinema_name}</h4>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] font-bold">${c.distance} km</span>
            </div>
            <p class="text-xs text-gray-400">${c.address}</p>
          </div>
          
          <div class="flex flex-wrap gap-2 items-center">
            ${showtimeBadges}
          </div>
        </div>
      `;
    }).join('');
    
    lucide.createIcons();
  } catch (error) {
    console.error("Failed loading theatre showtimes:", error);
    listEl.innerHTML = `
      <div class="py-12 text-center text-red-400 text-sm">
        <span>Failed to load live showtimes. Please try again.</span>
      </div>
    `;
  }
}

window.changeShowtimeCity = function(cityValue) {
  const displayEl = document.getElementById('showtime-loc-display');
  const citySelect = document.getElementById('showtime-city-select');

  if (cityValue === 'hyd') {
    showtimeCoords = { lat: '17.3850', lng: '78.4867', label: 'Hyderabad' };
    if (displayEl) displayEl.textContent = `📍 Hyderabad (17.38° N, 78.48° E)`;
  } else if (cityValue === 'blr') {
    showtimeCoords = { lat: '12.9716', lng: '77.5946', label: 'Bangalore' };
    if (displayEl) displayEl.textContent = `📍 Bangalore (12.97° N, 77.59° E)`;
  } else if (cityValue === 'custom') {
    requestUserLocation();
    return;
  }

  if (appState.currentMovieDetails) {
    loadTheatreShowtimes(appState.currentMovieDetails.title);
  }
};

window.requestUserLocation = function() {
  const displayEl = document.getElementById('showtime-loc-display');
  const citySelect = document.getElementById('showtime-city-select');

  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser.", "info");
    return;
  }

  showToast("Requesting your device location...", "info");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(4);
      const lng = position.coords.longitude.toFixed(4);
      
      showtimeCoords = { lat, lng, label: 'Custom Location' };
      
      if (citySelect) citySelect.value = 'custom';
      if (displayEl) displayEl.textContent = `📍 Custom Location (${lat}° N, ${lng}° E)`;
      
      showToast("Location updated successfully!", "success");

      if (appState.currentMovieDetails) {
        loadTheatreShowtimes(appState.currentMovieDetails.title);
      }
    },
    (error) => {
      console.warn("Geolocation permission/retrieval failed:", error);
      showToast("Failed to retrieve location. Defaulting to Hyderabad.", "info");
      if (citySelect) citySelect.value = 'hyd';
      window.changeShowtimeCity('hyd');
    }
  );
};

window.bookShowtimeTicket = function(cinemaName, time, type) {
  showToast(`Booking ${type} show at ${cinemaName} for ${time}...`, "success");
  setTimeout(() => {
    window.open(`https://in.bookmyshow.com/`, '_blank');
  }, 1000);
};

// CINIPHILES FINANCIAL PAGE
async function setupBoxOfficePage() {
  // Snapshot date header title
  const dateDisplay = document.getElementById('snapshot-date-display');
  if (dateDisplay) {
    dateDisplay.textContent = getSnapshotDateLabel(appState.snapshotDayOffset);
  }

  // Snapshot date selector buttons
  const dateButtonsContainer = document.getElementById('snapshot-date-buttons');
  if (dateButtonsContainer) {
    let html = '';
    for (let i = 0; i < 3; i++) {
      const label = getSnapshotDateLabel(i);
      const isActive = appState.snapshotDayOffset === i;
      html += `
        <button onclick="changeSnapshotDate(${i})" class="px-4 py-2 rounded-lg text-xs font-bold transition duration-200 ${
          isActive 
            ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/30' 
            : 'bg-[#1A1A1A] border border-white/5 text-gray-400 hover:text-white'
        }">${label}</button>
      `;
    }
    dateButtonsContainer.innerHTML = html;
  }

  const grid = document.getElementById('live-bo-grid');
  if (!grid) return;

  // Render shimmer skeleton
  grid.innerHTML = Array(3).fill(0).map(() => `
    <div class="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 space-y-6">
      <div class="flex space-x-4">
        <div class="skeleton w-20 h-28 rounded-lg"></div>
        <div class="flex-1 space-y-2.5">
          <div class="skeleton h-5 w-3/4 rounded"></div>
          <div class="skeleton h-4 w-1/2 rounded"></div>
          <div class="skeleton h-5 w-1/3 rounded"></div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="skeleton h-14 rounded-xl"></div>
        <div class="skeleton h-14 rounded-xl"></div>
        <div class="skeleton h-14 rounded-xl"></div>
        <div class="skeleton h-14 rounded-xl"></div>
      </div>
      <div class="skeleton h-10 rounded-xl w-full"></div>
    </div>
  `).join('');

  try {
    // Fetch live box office data from our backend scraper endpoint
    const liveData = await window.BoxOfficeAPI.getLiveBoxOfficeData();
    const scrapedMovies = (liveData && liveData.movies) || [];

    if (scrapedMovies.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-20">
          <i data-lucide="alert-triangle" class="w-12 h-12 text-[#FF6B00] mx-auto mb-4"></i>
          <h3 class="text-xl font-bold text-white">No Movies Found</h3>
          <p class="text-gray-400 mt-2">No live box office data is available at the moment.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Fetch now playing/directory movies to cross-reference titles
    const allDbMovies = await window.BoxOfficeAPI.getNowPlaying();

    const cardsHtml = await Promise.all(scrapedMovies.map(async (scraped) => {
      // Find matching movie by title in local cache/mock list
      let matchedMovie = allDbMovies.find(m => {
        const t1 = m.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const t2 = scraped.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return t1.includes(t2) || t2.includes(t1);
      });

      // If not found locally, try to search TMDB live
      if (!matchedMovie && !window.BoxOfficeAPI.isMockMode()) {
        try {
          const searchResults = await window.BoxOfficeAPI.search(scraped.title);
          if (searchResults && searchResults.length > 0) {
            matchedMovie = searchResults[0];
          }
        } catch (e) {
          console.warn(`TMDB search failed for title ${scraped.title}:`, e);
        }
      }

      // If still not found, construct a default movie structure
      const movieId = matchedMovie ? matchedMovie.id : 999000 + Math.floor(Math.random() * 1000);
      const poster = matchedMovie 
        ? window.BoxOfficeAPI.getImageUrl(matchedMovie.poster_path, 'w500')
        : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
      
      const releaseText = scraped.date || 'N/A';

      // Parse the scraped numbers (e.g., "₹8,18,54,533", "377,210")
      const parseVal = (str) => parseFloat(String(str).replace(/[^\d.]/g, '')) || 0;
      const baseGross = parseVal(scraped.gross);
      const baseTickets = parseVal(scraped.ticketsSold);
      const baseShows = parseVal(scraped.shows);
      const baseOcc = parseVal(scraped.occupancy);

      // Apply offset calculation
      let finalGross = baseGross;
      let finalTickets = baseTickets;
      let finalShows = baseShows;
      let finalOcc = baseOcc;

      if (appState.snapshotDayOffset > 0) {
        // Adjust values dynamically for other days
        const multiplier = 1 + appState.snapshotDayOffset * 0.12;
        finalGross = Math.round(baseGross * multiplier);
        finalTickets = Math.round(baseTickets * multiplier);
        finalShows = Math.round(baseShows * multiplier);
        finalOcc = Math.min(100, parseFloat((baseOcc * (1 + appState.snapshotDayOffset * 0.05)).toFixed(2)));
      }

      const formatRupee = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

      return `
        <div class="relative bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#FF6B00]/30 transition duration-300 flex flex-col justify-between" data-aos="fade-up">
          <!-- Poster blurred glow background -->
          <div class="absolute inset-0 bg-cover bg-center opacity-5 filter blur-2xl scale-110 pointer-events-none" style="background-image: url('${poster}');"></div>
          
          <div class="p-6 space-y-6 z-10 relative flex-1 flex flex-col justify-between">
            <!-- Header Row -->
            <div class="flex space-x-4 items-start">
              <img src="${poster}" class="w-20 h-28 object-cover rounded-lg border border-white/10 shadow-lg bg-neutral-900" alt="">
              <div class="space-y-1.5 min-w-0">
                <h3 class="text-xl font-bold font-heading text-white line-clamp-1 hover:text-[#FF6B00] transition">
                  <a href="#movie-details?id=${movieId}">${scraped.title}</a>
                </h3>
                <span class="text-xs text-gray-500 font-semibold block">${releaseText} • Telugu</span>
                <span class="inline-block px-2 py-0.5 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-[10px] font-bold">LIVE SCRARED DATA</span>
              </div>
            </div>

            <!-- Stats Grid (2x2) -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="bg-[#1F1F1F] border border-white/5 p-3 rounded-xl">
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Gross</span>
                <span class="text-sm font-bold text-green-400 mt-1 block">${formatRupee(finalGross)}</span>
              </div>
              <div class="bg-[#1F1F1F] border border-white/5 p-3 rounded-xl">
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Tickets Sold</span>
                <span class="text-sm font-bold text-white mt-1 block">${finalTickets.toLocaleString()}</span>
              </div>
              <div class="bg-[#1F1F1F] border border-white/5 p-3 rounded-xl">
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Shows</span>
                <span class="text-sm font-bold text-white mt-1 block">${finalShows.toLocaleString()}</span>
              </div>
              <div class="bg-[#1F1F1F] border border-white/5 p-3 rounded-xl">
                <span class="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Occupancy</span>
                <span class="text-sm font-bold text-[#FFA726] mt-1 block">${finalOcc}%</span>
              </div>
            </div>

            <!-- Footer Region Details -->
            <div class="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400">
              <span class="flex items-center space-x-1.5 font-semibold">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#FF8C42]"></i>
                <span>Top Region: <strong class="text-white">${scraped.topRegion || 'N/A'}</strong></span>
              </span>
            </div>
          </div>

          <!-- Action Button -->
          <div class="px-6 pb-6 pt-2 z-10">
            <a href="#movie-details?id=${movieId}" class="block w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8C42] text-xs font-bold text-white text-center shadow-lg transition duration-200 hover:shadow-[#FF6B00]/30">View Breakdown</a>
          </div>
        </div>
      `;
    }));

    grid.innerHTML = cardsHtml.join('');
    lucide.createIcons();
  } catch (err) {
    console.error("Live Box Office load failed:", err);
    grid.innerHTML = `<div class="col-span-full py-20 text-center text-red-500 font-semibold">Failed to load live box office feed.</div>`;
  }
}

//snapshot date changer
function changeSnapshotDate(offset) {
  appState.snapshotDayOffset = offset;
  setupBoxOfficePage();
}
window.changeSnapshotDate = changeSnapshotDate;

//snapshot date labeler
function getSnapshotDateLabel(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

//breakdown tab switcher
function switchBreakdownTab(tab) {
  appState.activeBreakdownTab = tab;
  
  // Highlight active tab button
  document.querySelectorAll('.breakdown-tab').forEach(btn => {
    btn.classList.remove('bg-[#FF6B00]', 'text-white');
    btn.classList.add('text-gray-400', 'hover:text-white');
  });
  
  const activeBtn = document.getElementById(`tab-btn-${tab}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-gray-400', 'hover:text-white');
    activeBtn.classList.add('bg-[#FF6B00]', 'text-white');
  }

  renderPerformanceTable();
}
window.switchBreakdownTab = switchBreakdownTab;

//render breakdown performance tables
function renderPerformanceTable() {
  const table = document.getElementById('breakdown-table');
  if (!table || !appState.currentMovieDetails) return;

  const bo = appState.currentMovieDetails.liveBoxOffice;
  const tab = appState.activeBreakdownTab;
  const formatRupee = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  let html = '';

  if (tab === 'state') {
    html += `
      <thead>
        <tr class="text-xs text-gray-400 border-b border-white/5 uppercase font-bold tracking-wider">
          <th class="py-3.5 px-4">State</th>
          <th class="py-3.5 px-4 text-right">Gross</th>
          <th class="py-3.5 px-4 text-right">Shows</th>
          <th class="py-3.5 px-4 text-right">Tickets Sold</th>
          <th class="py-3.5 px-4 text-right">FF</th>
          <th class="py-3.5 px-4 text-right">Sold Out</th>
          <th class="py-3.5 px-4 text-right">Occ %</th>
        </tr>
      </thead>
      <tbody>
    `;

    bo.stateWise.forEach(st => {
      html += `
        <tr class="border-b border-white/5 hover:bg-white/5 transition text-sm">
          <td class="py-3 px-4 font-semibold text-white">${st.state}</td>
          <td class="py-3 px-4 text-right font-medium text-green-400">${formatRupee(st.gross)}</td>
          <td class="py-3 px-4 text-right text-gray-300">${st.shows.toLocaleString()}</td>
          <td class="py-3 px-4 text-right text-gray-300">${st.ticketsSold.toLocaleString()}</td>
          <td class="py-3 px-4 text-right font-bold text-orange-400">${st.ff}</td>
          <td class="py-3 px-4 text-right font-bold text-red-500">${st.soldOut}</td>
          <td class="py-3 px-4 text-right font-bold text-[#FFA726]">${st.occ}%</td>
        </tr>
      `;
    });

    html += '</tbody>';
  } else if (tab === 'language') {
    html += `
      <thead>
        <tr class="text-xs text-gray-400 border-b border-white/5 uppercase font-bold tracking-wider">
          <th class="py-3.5 px-4">Language</th>
          <th class="py-3.5 px-4 text-right">Gross</th>
          <th class="py-3.5 px-4 text-right">Shows</th>
          <th class="py-3.5 px-4 text-right">Tickets Sold</th>
          <th class="py-3.5 px-4 text-right">Cities</th>
          <th class="py-3.5 px-4 text-right">Occupancy (%)</th>
        </tr>
      </thead>
      <tbody>
    `;

    bo.languageWise.forEach(l => {
      html += `
        <tr class="border-b border-white/5 hover:bg-white/5 transition text-sm">
          <td class="py-3 px-4 font-semibold text-white">${l.language}</td>
          <td class="py-3 px-4 text-right font-medium text-green-400">${formatRupee(l.gross)}</td>
          <td class="py-3 px-4 text-right text-gray-300">${l.shows.toLocaleString()}</td>
          <td class="py-3 px-4 text-right text-gray-300">${l.ticketsSold.toLocaleString()}</td>
          <td class="py-3 px-4 text-right text-gray-300">${l.cities.toLocaleString()}</td>
          <td class="py-3 px-4 text-right font-bold text-[#FFA726]">${l.occ}%</td>
        </tr>
      `;
    });

    html += `
      <tr class="bg-neutral-900/60 font-bold border-t border-white/10 text-sm">
        <td class="py-3.5 px-4 text-white uppercase tracking-wider">Total</td>
        <td class="py-3.5 px-4 text-right text-green-400">${formatRupee(bo.totalGross)}</td>
        <td class="py-3.5 px-4 text-right text-white">${bo.shows.toLocaleString()}</td>
        <td class="py-3.5 px-4 text-right text-white">${bo.ticketsSold.toLocaleString()}</td>
        <td class="py-3.5 px-4 text-right text-white">${bo.cities.toLocaleString()}</td>
        <td class="py-3.5 px-4 text-right text-[#FFA726]">${bo.occupancy}%</td>
      </tr>
      </tbody>
    `;
  } else if (tab === 'format') {
    html += `
      <thead>
        <tr class="text-xs text-gray-400 border-b border-white/5 uppercase font-bold tracking-wider">
          <th class="py-3.5 px-4">Format</th>
          <th class="py-3.5 px-4 text-right">Gross</th>
          <th class="py-3.5 px-4 text-right">Shows</th>
          <th class="py-3.5 px-4 text-right">Tickets Sold</th>
          <th class="py-3.5 px-4 text-right">Cities</th>
          <th class="py-3.5 px-4 text-right">Occupancy (%)</th>
        </tr>
      </thead>
      <tbody>
    `;

    bo.formatWise.forEach(f => {
      html += `
        <tr class="border-b border-white/5 hover:bg-white/5 transition text-sm">
          <td class="py-3 px-4 font-semibold text-white">${f.format}</td>
          <td class="py-3 px-4 text-right font-medium text-green-400">${formatRupee(f.gross)}</td>
          <td class="py-3 px-4 text-right text-gray-300">${f.shows.toLocaleString()}</td>
          <td class="py-3 px-4 text-right text-gray-300">${f.ticketsSold.toLocaleString()}</td>
          <td class="py-3 px-4 text-right text-gray-300">${f.cities.toLocaleString()}</td>
          <td class="py-3 px-4 text-right font-bold text-[#FFA726]">${f.occ}%</td>
        </tr>
      `;
    });

    html += `
      <tr class="bg-neutral-900/60 font-bold border-t border-white/10 text-sm">
        <td class="py-3.5 px-4 text-white uppercase tracking-wider">Total</td>
        <td class="py-3.5 px-4 text-right text-green-400">${formatRupee(bo.totalGross)}</td>
        <td class="py-3.5 px-4 text-right text-white">${bo.shows.toLocaleString()}</td>
        <td class="py-3.5 px-4 text-right text-white">${bo.ticketsSold.toLocaleString()}</td>
        <td class="py-3.5 px-4 text-right text-white">${bo.cities.toLocaleString()}</td>
        <td class="py-3.5 px-4 text-right text-[#FFA726]">${bo.occupancy}%</td>
      </tr>
      </tbody>
    `;
  }

  table.innerHTML = html;
}
window.renderPerformanceTable = renderPerformanceTable;

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
async function setupOTTPage() {
  const container = document.getElementById('ott-platforms-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="col-span-full py-20 text-center">
      <div class="skeleton w-12 h-12 rounded-full border-t-2 border-[#FF6B00] animate-spin mx-auto mb-4"></div>
      <span class="text-sm text-gray-400">Loading live OTT release calendars...</span>
    </div>
  `;

  const today = new Date();
  today.setHours(0,0,0,0);

  const liveOttPlatforms = await window.BoxOfficeAPI.getOTTReleases();

  if (!liveOttPlatforms || liveOttPlatforms.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center text-gray-400 py-12">No active OTT releases scheduled.</div>`;
    return;
  }

  container.innerHTML = liveOttPlatforms.map(platform => {
    const listHtml = platform.movies.map(movie => {
      const releaseDate = new Date(movie.date);
      releaseDate.setHours(0,0,0,0);
      const isReleased = releaseDate <= today;
      
      let statusText = "";
      let badgeHTML = "";
      if (isReleased) {
        statusText = `<span class="text-green-400 font-semibold">Streaming Now</span>`;
        badgeHTML = `<span class="px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/35 text-green-400 text-[9px] font-bold uppercase tracking-wider">Streaming Now</span>`;
      } else {
        const diffDays = Math.ceil(Math.abs(releaseDate - today) / (1000 * 60 * 60 * 24));
        statusText = `<span class="text-[#FF8C42] font-semibold">Upcoming: ${movie.date} (${diffDays}d left)</span>`;
        badgeHTML = `<span class="px-1.5 py-0.5 rounded bg-[#FF6B00]/10 border border-[#FF6B00]/35 text-[#FF8C42] text-[9px] font-bold uppercase tracking-wider">Upcoming</span>`;
      }

      return `
        <div class="bg-[#1E1E1E] p-3 rounded-lg border border-white/5 flex items-center space-x-3 hover:border-white/10 transition">
          <img src="${movie.poster}" data-ott-title="${movie.title}" class="w-10 h-14 rounded object-cover" alt="">
          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-white text-sm font-bold truncate">${movie.title}</h4>
              ${badgeHTML}
            </div>
            <span class="text-xs block">${statusText}</span>
          </div>
        </div>
      `;
    }).join('');

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
