// TMDB & OMDB API Integration Client — Ciniphiles Platform
// Live data is fetched automatically whenever a TMDB key is saved.
// No checkbox needed — having a key = LIVE MODE ON.

const BoxOfficeAPI = {

  // ── KEY MANAGEMENT ─────────────────────────────────────────
  _keys: {
    tmdbKey: 'd9b5a4008faa1a1cd3c2e42d985cb619',
    omdbKey: '4a6891d5',
    moviegluClient: 'NIZA',
    moviegluApiKey: 'JOBGMwXWLD7NX0gHJIHmKaUd05UHItQT35JdUrS9',
    moviegluAuth: 'Basic TklaQTp1RmN5aVpva0lVYUc='
  },

  // Initialize keys from backend (and fallback to localStorage/hardcoded)
  async initKeys() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.tmdbKey) this._keys.tmdbKey = data.tmdbKey.trim();
        if (data.omdbKey) this._keys.omdbKey = data.omdbKey.trim();
        if (data.moviegluClient) this._keys.moviegluClient = data.moviegluClient.trim();
        if (data.moviegluApiKey) this._keys.moviegluApiKey = data.moviegluApiKey.trim();
        if (data.moviegluAuth) this._keys.moviegluAuth = data.moviegluAuth.trim();
        // Sync to localStorage
        localStorage.setItem('bo_tmdb_key', this._keys.tmdbKey);
        localStorage.setItem('bo_omdb_key', this._keys.omdbKey);
        localStorage.setItem('bo_movieglu_client', this._keys.moviegluClient);
        localStorage.setItem('bo_movieglu_api_key', this._keys.moviegluApiKey);
        localStorage.setItem('bo_movieglu_auth', this._keys.moviegluAuth);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn("Failed to fetch keys from backend, using default/localStorage fallback:", e);
      this._keys.tmdbKey = localStorage.getItem('bo_tmdb_key') || this._keys.tmdbKey;
      this._keys.omdbKey = localStorage.getItem('bo_omdb_key') || this._keys.omdbKey;
      this._keys.moviegluClient = localStorage.getItem('bo_movieglu_client') || this._keys.moviegluClient;
      this._keys.moviegluApiKey = localStorage.getItem('bo_movieglu_api_key') || this._keys.moviegluApiKey;
      this._keys.moviegluAuth = localStorage.getItem('bo_movieglu_auth') || this._keys.moviegluAuth;
    }
    // Normalize mock movies with liveBoxOffice details
    if (window.mockData && window.mockData.movies) {
      window.mockData.movies = window.mockData.movies.map(m => this._normaliseTMDB(m));
    }
  },

  getKeys() {
    if (!this._keys.tmdbKey) this._keys.tmdbKey = 'd9b5a4008faa1a1cd3c2e42d985cb619';
    if (!this._keys.omdbKey) this._keys.omdbKey = '4a6891d5';
    if (!this._keys.moviegluClient) this._keys.moviegluClient = 'NIZA';
    if (!this._keys.moviegluApiKey) this._keys.moviegluApiKey = 'JOBGMwXWLD7NX0gHJIHmKaUd05UHItQT35JdUrS9';
    if (!this._keys.moviegluAuth) this._keys.moviegluAuth = 'Basic TklaQTp1RmN5aVpva0lVYUc=';
    return this._keys;
  },

  async setKeys(tmdbKey, omdbKey, moviegluClient, moviegluApiKey, moviegluAuth) {
    const cleanTmdb = (tmdbKey || '').trim() || 'd9b5a4008faa1a1cd3c2e42d985cb619';
    const cleanOmdb = (omdbKey || '').trim() || '4a6891d5';
    const cleanMgClient = (moviegluClient || '').trim() || 'NIZA';
    const cleanMgKey = (moviegluApiKey || '').trim() || 'JOBGMwXWLD7NX0gHJIHmKaUd05UHItQT35JdUrS9';
    const cleanMgAuth = (moviegluAuth || '').trim() || 'Basic TklaQTp1RmN5aVpva0lVYUc=';

    this._keys.tmdbKey = cleanTmdb;
    this._keys.omdbKey = cleanOmdb;
    this._keys.moviegluClient = cleanMgClient;
    this._keys.moviegluApiKey = cleanMgKey;
    this._keys.moviegluAuth = cleanMgAuth;

    localStorage.setItem('bo_tmdb_key', cleanTmdb);
    localStorage.setItem('bo_omdb_key', cleanOmdb);
    localStorage.setItem('bo_movieglu_client', cleanMgClient);
    localStorage.setItem('bo_movieglu_api_key', cleanMgKey);
    localStorage.setItem('bo_movieglu_auth', cleanMgAuth);
    
    // Flush cache whenever keys change
    this._cache = {};

    // Save to backend
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tmdbKey: cleanTmdb, 
          omdbKey: cleanOmdb,
          moviegluClient: cleanMgClient,
          moviegluApiKey: cleanMgKey,
          moviegluAuth: cleanMgAuth
        })
      });
    } catch (e) {
      console.error("Failed to save keys to backend:", e);
    }
  },

  // ── LIVE MODE CHECK ────────────────────────────────────────
  isMockMode() {
    return !this.getKeys().tmdbKey;
  },

  // ── INTERNAL CACHE ─────────────────────────────────────────
  _cache: {},

  clearCache() {
    this._cache = {};
  },

  async _fetch(url) {
    if (this._cache[url]) return this._cache[url];
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); if (j.status_message) msg = j.status_message; } catch (_) {}
      throw new Error(msg);
    }
    const data = await res.json();
    this._cache[url] = data;
    return data;
  },

  // ── IMAGE URL HELPER ────────────────────────────────────────
  getImageUrl(path, size = 'w500') {
    const fallback = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
    if (!path) return fallback;
    if (path.startsWith('http')) return path; // already absolute (mock data)
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // ── DYNAMIC LIVE BOX OFFICE STATS GENERATOR ──────────────────
  generateLiveBoxOfficeData(movie, dayOffset = 0) {
    const seed = (movie.id || 0) + dayOffset * 13;
    const rand = (n) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };

    // Calculate a realistic base gross in Indian Rupees (INR)
    // Base gross between 50 Lakhs (5,000,000) and 50 Crores (500,000,000) based on popularity
    const pop = movie.popularity || 100;
    const rating = movie.vote_average || 7.5;
    let baseGross = Math.round((pop * 200000) * (rating / 7));
    if (baseGross < 5000000) baseGross = 5000000 + Math.round(rand(1) * 15000000);
    if (baseGross > 800000000) baseGross = 500000000 + Math.round(rand(2) * 300000000);

    // Apply day offset collections drop-off/accumulation
    // For advance bookings, each day ahead has slightly different data
    let totalGross = Math.round(baseGross * (1 + dayOffset * 0.12 + rand(3) * 0.05));

    // Tickets sold
    const avgTicketPrice = 180 + Math.round(rand(4) * 70); // 180 to 250 INR
    const ticketsSold = Math.round(totalGross / avgTicketPrice);

    // Shows
    const avgOcc = 0.04 + rand(5) * 0.12; // 4% to 16%
    const shows = Math.round(ticketsSold / (avgOcc * 150)); // hall capacity 150

    // Cities
    const cities = Math.max(10, Math.round(shows / (8 + rand(6) * 10)));

    // Real Occupancy
    const occupancy = parseFloat(((ticketsSold / Math.max(1, shows * 150)) * 100).toFixed(2));

    // Top Region
    const regions = ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra"];
    const topRegion = regions[Math.floor(rand(7) * regions.length)];

    // State wise breakdown
    const statesList = [
      { name: "Andhra Pradesh", share: 0.38, occBoost: 1.3 },
      { name: "Telangana", share: 0.32, occBoost: 1.3 },
      { name: "Karnataka", share: 0.11, occBoost: 1.0 },
      { name: "Tamil Nadu", share: 0.035, occBoost: 0.8 },
      { name: "Maharashtra", share: 0.033, occBoost: 0.7 },
      { name: "Gujarat", share: 0.028, occBoost: 0.5 },
      { name: "NCR", share: 0.017, occBoost: 0.8 },
      { name: "Uttar Pradesh", share: 0.016, occBoost: 0.4 },
      { name: "Rajasthan", share: 0.012, occBoost: 0.6 },
      { name: "West Bengal", share: 0.0075, occBoost: 0.7 },
      { name: "Odisha", share: 0.0052, occBoost: 0.5 },
      { name: "Madhya Pradesh", share: 0.0044, occBoost: 0.4 },
      { name: "Chhattisgarh", share: 0.0043, occBoost: 0.5 },
      { name: "Punjab", share: 0.0042, occBoost: 0.5 },
      { name: "Kerala", share: 0.0032, occBoost: 0.6 },
      { name: "Jharkhand", share: 0.0031, occBoost: 0.5 }
    ];

    const stateWise = statesList.map((st, idx) => {
      const stRand = rand(idx + 10);
      const shareVar = 0.9 + stRand * 0.2;
      let stGross = Math.round(totalGross * st.share * shareVar);
      let stShows = Math.round(shows * st.share * shareVar);
      let stTickets = Math.round(ticketsSold * st.share * shareVar);

      const ff = Math.round(stShows * 0.05 * rand(idx + 30));
      const soldOut = Math.round(stShows * 0.01 * rand(idx + 40));
      const stOcc = parseFloat(Math.min(100, (stTickets / Math.max(1, stShows * 150) * 100 * st.occBoost)).toFixed(2));

      return {
        state: st.name,
        gross: stGross,
        shows: stShows,
        ticketsSold: stTickets,
        ff,
        soldOut,
        occ: stOcc
      };
    });

    // Language Wise breakdown
    const languagesList = [
      { name: "Telugu", share: 0.82, occBoost: 1.2 },
      { name: "Hindi", share: 0.11, occBoost: 0.8 },
      { name: "Tamil", share: 0.04, occBoost: 0.9 },
      { name: "Kannada", share: 0.02, occBoost: 0.9 },
      { name: "Malayalam", share: 0.01, occBoost: 0.8 }
    ];

    const languageWise = languagesList.map((lang, idx) => {
      const lRand = rand(idx + 50);
      const shareVar = 0.95 + lRand * 0.1;
      const lGross = Math.round(totalGross * lang.share * shareVar);
      const lShows = Math.round(shows * lang.share * shareVar);
      const lTickets = Math.round(ticketsSold * lang.share * shareVar);
      const lOcc = parseFloat(Math.min(100, (lTickets / Math.max(1, lShows * 150) * 100 * lang.occBoost)).toFixed(2));
      const lCities = Math.max(1, Math.round(cities * lang.share * shareVar * 2));

      return {
        language: lang.name,
        gross: lGross,
        shows: lShows,
        ticketsSold: lTickets,
        cities: lCities,
        occ: lOcc
      };
    });

    // Format Wise breakdown
    const formatsList = [
      { name: "Standard", share: 0.952, occBoost: 1.0 },
      { name: "Dolby Cinema", share: 0.012, occBoost: 1.5 },
      { name: "IMAX", share: 0.015, occBoost: 1.3 },
      { name: "4DX", share: 0.01, occBoost: 1.2 },
      { name: "EPIQ", share: 0.006, occBoost: 1.4 },
      { name: "HDR By Barco", share: 0.003, occBoost: 1.2 },
      { name: "ICE", share: 0.002, occBoost: 1.1 }
    ];

    const formatWise = formatsList.map((fmt, idx) => {
      const fRand = rand(idx + 70);
      const shareVar = 0.95 + fRand * 0.1;
      const fGross = Math.round(totalGross * fmt.share * shareVar);
      const fShows = Math.round(shows * fmt.share * shareVar);
      const fTickets = Math.round(ticketsSold * fmt.share * shareVar);
      const fOcc = parseFloat(Math.min(100, (fTickets / Math.max(1, fShows * 150) * 100 * fmt.occBoost)).toFixed(2));
      const fCities = Math.max(1, Math.round(cities * fmt.share * shareVar * 2));

      return {
        format: fmt.name,
        gross: fGross,
        shows: fShows,
        ticketsSold: fTickets,
        cities: fCities,
        occ: fOcc
      };
    });

    return {
      totalGross,
      ticketsSold,
      shows,
      cities,
      occupancy,
      topRegion,
      stateWise,
      languageWise,
      formatWise
    };
  },

  // ── NORMALISE TMDB LIST ITEMS ──────────────────────────────
  _normaliseTMDB(movie) {
    const norm = {
      ...movie,
      genres: movie.genre_ids || movie.genres || [],
      tagline: movie.tagline || '',
      trailer_url: movie.trailer_url || '',
      overview: movie.overview || '',
      runtime: movie.runtime || 0,
      omdb: movie.omdb || null,
      credits: movie.credits || { cast: [], crew: [] },
      reviews: movie.reviews || [],
      similar: movie.similar || []
    };
    norm.liveBoxOffice = this.generateLiveBoxOfficeData(norm);
    return norm;
  },

  // ── KEY VALIDATION ─────────────────────────────────────────
  async testTMDBKey(tmdbKey) {
    if (!tmdbKey) return { valid: false, error: 'Key is empty' };
    try {
      const res = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey.trim()}`, { cache: 'no-store' });
      if (res.ok) return { valid: true };
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); if (j.status_message) msg = j.status_message; } catch (_) {}
      return { valid: false, error: msg };
    } catch (e) {
      return { valid: false, error: e.message || 'Network error' };
    }
  },

  async testOMDBKey(omdbKey) {
    if (!omdbKey) return { valid: false, error: 'Key is empty' };
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${omdbKey.trim()}&t=Dune`, { cache: 'no-store' });
      if (!res.ok) return { valid: false, error: `HTTP ${res.status}` };
      const data = await res.json();
      if (data.Response === 'True') return { valid: true };
      return { valid: false, error: data.Error || 'Invalid Key' };
    } catch (e) {
      return { valid: false, error: e.message || 'Network error' };
    }
  },

  // ── 1. TRENDING ────────────────────────────────────────────
  async getTrending(timeWindow = 'week') {
    if (this.isMockMode()) {
      return window.mockData.movies.filter(m => m.popularity > 300);
    }
    try {
      const { tmdbKey } = this.getKeys();
      // Fetch only Telugu movies using TMDB discover
      const data = await this._fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&sort_by=popularity.desc&region=IN`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('Trending API failed, using mock:', err.message);
      return window.mockData.movies.filter(m => m.popularity > 300);
    }
  },

  // ── 2. NOW PLAYING ─────────────────────────────────────────
  async getNowPlaying(lang = '') {
    if (this.isMockMode()) {
      return window.mockData.movies.filter(m => m.id < 999000);
    }
    try {
      const { tmdbKey } = this.getKeys();
      // Enforce Telugu language
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&sort_by=popularity.desc&region=IN`;
      const data = await this._fetch(url);
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('NowPlaying API failed, using mock:', err.message);
      return window.mockData.movies.filter(m => m.id < 999000);
    }
  },

  // ── 2.5. MOVIES BY LANGUAGE ────────────────────────────────
  async getMoviesByLanguage(lang) {
    if (this.isMockMode()) {
      return window.mockData.movies.filter(m => m.original_language === 'te');
    }
    try {
      const { tmdbKey } = this.getKeys();
      // Enforce Telugu language
      const data = await this._fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&sort_by=popularity.desc&region=IN`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn(`Language te API failed, using mock:`, err.message);
      return window.mockData.movies.filter(m => m.original_language === 'te');
    }
  },

  // ── 3. TOP RATED ───────────────────────────────────────────
  async getTopRated() {
    if (this.isMockMode()) {
      return window.mockData.movies
        .filter(m => m.vote_average >= 7.0)
        .sort((a, b) => b.vote_average - a.vote_average);
    }
    try {
      const { tmdbKey } = this.getKeys();
      // Fetch only Telugu movies using discover sorted by vote average
      const data = await this._fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&sort_by=vote_average.desc&vote_count.gte=50&region=IN`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('TopRated API failed, using mock:', err.message);
      return window.mockData.movies
        .filter(m => m.vote_average >= 7.0)
        .sort((a, b) => b.vote_average - a.vote_average);
    }
  },

  // ── 4. UPCOMING ────────────────────────────────────────────
  async getUpcoming() {
    if (this.isMockMode()) {
      return window.mockData.movies.filter(m => m.id >= 999000 || new Date(m.release_date) > new Date());
    }
    try {
      const { tmdbKey } = this.getKeys();
      const today = new Date().toISOString().split('T')[0];
      // Fetch upcoming Telugu movies
      const data = await this._fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&primary_release_date.gte=${today}&sort_by=primary_release_date.asc&region=IN`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('Upcoming API failed, using mock:', err.message);
      return window.mockData.movies.filter(m => m.id >= 999000 || new Date(m.release_date) > new Date());
    }
  },

  // ── 4.5. OTT RELEASES FROM WATCH PROVIDERS ──────────────────
  async getOTTReleases() {
    if (this.isMockMode()) {
      return window.mockData.ottReleases;
    }

    try {
      const { tmdbKey } = this.getKeys();
      // Discover popular Telugu movies on streaming in India (using watch provider filters across two pages)
      const url1 = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&watch_region=IN&with_watch_providers=8|119|122|232|531&sort_by=popularity.desc&page=1`;
      const url2 = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=te&watch_region=IN&with_watch_providers=8|119|122|232|531&sort_by=popularity.desc&page=2`;
      
      const [data1, data2] = await Promise.all([
        this._fetch(url1).catch(() => ({ results: [] })),
        this._fetch(url2).catch(() => ({ results: [] }))
      ]);

      const movies = [...(data1.results || []), ...(data2.results || [])];
      
      if (movies.length === 0) {
        return window.mockData.ottReleases;
      }
      
      const platformsMap = {
        'Netflix': {
          platform: 'Netflix',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
          movies: [],
          ids: [8]
        },
        'Amazon Prime Video': {
          platform: 'Amazon Prime Video',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
          movies: [],
          ids: [119, 9]
        },
        'Disney+': {
          platform: 'Disney+',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
          movies: [],
          ids: [122, 337]
        },
        'aha (Telugu)': {
          platform: 'aha (Telugu)',
          logo: 'https://www.aha.video/images/aha-logo.svg',
          movies: [],
          ids: [531]
        },
        'ZEE5 (Telugu)': {
          platform: 'ZEE5 (Telugu)',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Zee5_Official_logo.svg',
          movies: [],
          ids: [232]
        }
      };

      // Fetch watch providers for each movie in parallel
      await Promise.all(movies.map(async (movie) => {
        try {
          const providersUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${tmdbKey}`;
          const res = await fetch(providersUrl);
          if (!res.ok) return;
          const data = await res.json();
          
          const inProviders = data.results && data.results.IN;
          if (!inProviders || !inProviders.flatrate) return;

          // Find which platform matches
          inProviders.flatrate.forEach(provider => {
            const pId = provider.provider_id;
            Object.keys(platformsMap).forEach(pName => {
              const plat = platformsMap[pName];
              if (plat.ids.includes(pId)) {
                let streamingDate = movie.release_date;

                if (!plat.movies.some(m => m.title === movie.title)) {
                  plat.movies.push({
                    title: movie.title,
                    date: streamingDate,
                    poster: this.getImageUrl(movie.poster_path, 'w185')
                  });
                }
              }
            });
          });
        } catch (e) {
          console.warn(`Failed fetching watch providers for movie ${movie.id}:`, e);
        }
      }));

      // Filter out platforms that ended up with no movies
      const result = Object.values(platformsMap).filter(p => p.movies.length > 0);
      
      if (result.length === 0) {
        return window.mockData.ottReleases;
      }
      
      result.forEach(plat => {
        plat.movies.sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      return result;
    } catch (err) {
      console.warn('getOTTReleases API failed, using mock:', err.message);
      return window.mockData.ottReleases;
    }
  },

  // ── 5. POPULAR ACTORS ──────────────────────────────────────
  async getPopularActors() {
    if (this.isMockMode()) return window.mockData.actors;
    try {
      const { tmdbKey } = this.getKeys();
      // To get Tollywood actors in live mode, we fetch credits of the top trending Telugu films
      const trending = await this.getTrending();
      if (!trending || trending.length === 0) return window.mockData.actors;

      const actorMap = new Map();
      for (const movie of trending.slice(0, 3)) {
        try {
          const detail = await this.getDetails(movie.id);
          if (detail && detail.credits && detail.credits.cast) {
            detail.credits.cast.forEach(castMember => {
              if (!actorMap.has(castMember.name)) {
                actorMap.set(castMember.name, {
                  id: castMember.id,
                  name: castMember.name,
                  profile_path: castMember.profile_path,
                  known_for: movie.title,
                  movies: [movie.title]
                });
              } else {
                const act = actorMap.get(castMember.name);
                if (!act.movies.includes(movie.title)) {
                  act.movies.push(movie.title);
                  act.known_for += `, ${movie.title}`;
                }
              }
            });
          }
        } catch (e) {
          console.warn(`Failed fetching cast for movie ${movie.id}:`, e);
        }
      }

      const actorsList = Array.from(actorMap.values());
      return actorsList.length > 0 ? actorsList.slice(0, 5) : window.mockData.actors;
    } catch (err) {
      console.warn('Actors API failed, using mock:', err.message);
      return window.mockData.actors;
    }
  },

  // ── 6. SEARCH ──────────────────────────────────────────────
  async search(query) {
    if (!query || !query.trim()) return [];
    if (this.isMockMode()) {
      const q = query.toLowerCase().trim();
      return window.mockData.movies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        (m.overview && m.overview.toLowerCase().includes(q))
      );
    }
    try {
      const { tmdbKey } = this.getKeys();
      const data = await this._fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(query)}`
      );
      // Filter search results to only return Telugu movies
      return data.results
        .filter(m => m.original_language === 'te')
        .map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('Search API failed, using mock:', err.message);
      const q = query.toLowerCase().trim();
      return window.mockData.movies.filter(m => m.title.toLowerCase().includes(q));
    }
  },

  // ── 7. MOVIE DETAILS (TMDB + OMDB merged) ─────────────────
  async getDetails(id) {
    const numId = parseInt(id, 10);

    if (this.isMockMode()) {
      const movie = window.mockData.movies.find(m => m.id === numId);
      return movie || window.mockData.movies[0];
    }

    try {
      const { tmdbKey, omdbKey } = this.getKeys();

      // Full details with videos, credits, reviews, similar
      const tmdb = await this._fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&append_to_response=videos,credits,reviews,similar`
      );

      // OMDB enrichment (ratings, awards, box office)
      let omdb = {
        imdbRating: tmdb.vote_average ? tmdb.vote_average.toFixed(1) : 'N/A',
        Metascore: 'N/A',
        RottenTomatoes: 'N/A',
        Awards: 'N/A',
        BoxOffice: tmdb.revenue ? `$${tmdb.revenue.toLocaleString()}` : 'N/A',
        Worldwide: tmdb.revenue ? `$${tmdb.revenue.toLocaleString()}` : 'N/A'
      };

      if (tmdb.imdb_id && omdbKey) {
        try {
          const omdbData = await this._fetch(
            `https://www.omdbapi.com/?apikey=${omdbKey}&i=${tmdb.imdb_id}`
          );
          const rt = omdbData.Ratings
            ? (omdbData.Ratings.find(r => r.Source === 'Rotten Tomatoes') || {}).Value
            : null;
          omdb = {
            imdbRating: omdbData.imdbRating || omdb.imdbRating,
            Metascore: omdbData.Metascore || 'N/A',
            RottenTomatoes: rt || 'N/A',
            Awards: omdbData.Awards || 'N/A',
            BoxOffice: omdbData.BoxOffice || omdb.BoxOffice,
            Worldwide: omdb.Worldwide
          };
        } catch (_) { /* OMDB failed — keep TMDB values */ }
      }

      // Extract trailer
      const videos = (tmdb.videos && tmdb.videos.results) || [];
      const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];
      const trailer_url = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

      // Extract cast / crew
      const rawCast = (tmdb.credits && tmdb.credits.cast) || [];
      const rawCrew = (tmdb.credits && tmdb.credits.crew) || [];
      const cast = rawCast.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path
          ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      }));
      const crew = rawCrew
        .filter(c => ['Director', 'Writer', 'Screenplay', 'Novel', 'Original Music Composer'].includes(c.job))
        .map(c => ({ name: c.name, job: c.job }));

      // Reviews
      const reviews = ((tmdb.reviews && tmdb.reviews.results) || []).slice(0, 3).map(r => ({
        author: r.author,
        rating: (r.author_details && r.author_details.rating) || 8,
        content: r.content,
        date: r.created_at ? r.created_at.split('T')[0] : ''
      }));

      // Box office estimates
      const rev = tmdb.revenue || 0;
      const bud = tmdb.budget || 0;
      const domestic = Math.floor(rev * 0.4);
      const international = rev - domestic;

      const details = {
        id: tmdb.id,
        title: tmdb.title,
        tagline: tmdb.tagline || '',
        overview: tmdb.overview || '',
        backdrop_path: tmdb.backdrop_path
          ? `https://image.tmdb.org/t/p/original${tmdb.backdrop_path}`
          : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
        poster_path: tmdb.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}`
          : 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
        vote_average: tmdb.vote_average || 0,
        vote_count: tmdb.vote_count || 0,
        release_date: tmdb.release_date || '',
        runtime: tmdb.runtime || 0,
        original_language: tmdb.original_language || 'en',
        budget: bud,
        revenue: rev,
        popularity: tmdb.popularity || 0,
        trailer_url,
        genres: tmdb.genres ? tmdb.genres.map(g => g.id) : [],
        production_companies: tmdb.production_companies || [],
        omdb,
        boxOffice: {
          domestic,
          international,
          worldwide: rev,
          openingWeekend: Math.floor(domestic * 0.25),
          dailyTrend: [
            { day: 'Fri', amount: Math.floor(domestic * 0.10) },
            { day: 'Sat', amount: Math.floor(domestic * 0.08) },
            { day: 'Sun', amount: Math.floor(domestic * 0.06) },
            { day: 'Mon', amount: Math.floor(domestic * 0.02) },
            { day: 'Tue', amount: Math.floor(domestic * 0.02) },
            { day: 'Wed', amount: Math.floor(domestic * 0.015) },
            { day: 'Thu', amount: Math.floor(domestic * 0.012) }
          ]
        },
        credits: { cast, crew },
        reviews,
        similar: ((tmdb.similar && tmdb.similar.results) || []).slice(0, 6)
      };
      details.liveBoxOffice = this.generateLiveBoxOfficeData(details);

      // Merge live scraped box office stats if title matches
      try {
        const liveData = await this.getLiveBoxOfficeData();
        if (liveData && liveData.movies) {
          const clean = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanTitle = clean(details.title);
          const scraped = liveData.movies.find(m => {
            const mClean = clean(m.title);
            return mClean.includes(cleanTitle) || cleanTitle.includes(mClean);
          });
          if (scraped) {
            console.log(`[Details API] Merging live scraped box office stats for: ${details.title}`);
            const parseVal = (str) => parseFloat(String(str).replace(/[^\d.]/g, '')) || 0;
            const grossVal = parseVal(scraped.gross);
            const ticketsVal = parseVal(scraped.ticketsSold);
            const showsVal = parseVal(scraped.shows);
            const occVal = parseVal(scraped.occupancy);
            
            const originalGross = details.liveBoxOffice.totalGross || 1;
            const ratio = grossVal / originalGross;

            details.liveBoxOffice.totalGross = grossVal;
            details.liveBoxOffice.ticketsSold = ticketsVal;
            details.liveBoxOffice.shows = showsVal;
            details.liveBoxOffice.occupancy = occVal;
            details.liveBoxOffice.topRegion = scraped.topRegion || details.liveBoxOffice.topRegion;
            
            // Proportionally scale breakdown tables so they align with the scraped total
            if (details.liveBoxOffice.stateWise) {
              details.liveBoxOffice.stateWise.forEach(st => {
                st.gross = Math.round(st.gross * ratio);
                st.shows = Math.round(st.shows * ratio);
                st.ticketsSold = Math.round(st.ticketsSold * ratio);
              });
            }
            if (details.liveBoxOffice.languageWise) {
              details.liveBoxOffice.languageWise.forEach(l => {
                l.gross = Math.round(l.gross * ratio);
                l.shows = Math.round(l.shows * ratio);
                l.ticketsSold = Math.round(l.ticketsSold * ratio);
              });
            }
            if (details.liveBoxOffice.formatWise) {
              details.liveBoxOffice.formatWise.forEach(f => {
                f.gross = Math.round(f.gross * ratio);
                f.shows = Math.round(f.shows * ratio);
                f.ticketsSold = Math.round(f.ticketsSold * ratio);
              });
            }
          }
        }
      } catch (e) {
        console.warn("Failed to enrich movie details with live box office scraper data:", e);
      }

      return details;
    } catch (err) {
      console.warn(`Details API failed for ${id}, using mock:`, err.message);
      return window.mockData.movies.find(m => m.id == id) || window.mockData.movies[0];
    }
  },

  async getShowtimes(movieTitle, lat, lng) {
    if (!lat || !lng) {
      // Default to Hyderabad
      lat = '17.3850';
      lng = '78.4867';
    }

    const { moviegluClient, moviegluApiKey, moviegluAuth } = this.getKeys();
    const today = new Date().toISOString().split('T')[0];

    try {
      // Fetch movies now playing near the geolocation
      const headers = {
        'client': moviegluClient,
        'x-api-key': moviegluApiKey,
        'authorization': moviegluAuth,
        'territory': 'IN',
        'api-version': 'v201',
        'geolocation': `${lat};${lng}`,
        'device-datetime': new Date().toISOString()
      };

      console.log(`[Movieglu] Fetching movies now playing for geolocation: ${lat};${lng}`);
      const moviesRes = await fetch('https://api-gate2.movieglu.com/moviesNowPlaying/?n=20', {
        method: 'GET',
        headers: headers
      });

      if (!moviesRes.ok) {
        throw new Error(`Failed to fetch movies now playing: ${moviesRes.status}`);
      }

      const moviesData = await moviesRes.json();
      console.log('[Movieglu] Now playing data:', moviesData);

      let filmId = null;
      if (moviesData && moviesData.films && moviesData.films.length > 0) {
        // Look for our movieTitle in the now playing list
        const cleanTitle = movieTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchedFilm = moviesData.films.find(f => {
          const fNameClean = f.film_name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return fNameClean.includes(cleanTitle) || cleanTitle.includes(fNameClean);
        });

        if (matchedFilm) {
          filmId = matchedFilm.film_id;
          console.log(`[Movieglu] Found matching film on Movieglu: ${matchedFilm.film_name} (ID: ${filmId})`);
        }
      }

      // If we didn't find the film by name, try to use the first film available as a proxy, 
      // or if nothing is found, throw to fall back to mock data.
      if (!filmId && moviesData && moviesData.films && moviesData.films.length > 0) {
        filmId = moviesData.films[0].film_id;
        console.log(`[Movieglu] Movie not found in listings. Using proxy film ID: ${filmId}`);
      }

      if (!filmId) {
        throw new Error('No movies found in now playing list to fetch showtimes.');
      }

      // Fetch showtimes for that film ID
      console.log(`[Movieglu] Fetching showtimes for film ID ${filmId} on date ${today}`);
      const showtimesRes = await fetch(`https://api-gate2.movieglu.com/cinemaShowTimes/?film_id=${filmId}&date=${today}`, {
        method: 'GET',
        headers: headers
      });

      if (!showtimesRes.ok) {
        throw new Error(`Failed to fetch showtimes: ${showtimesRes.status}`);
      }

      const showtimesData = await showtimesRes.json();
      console.log('[Movieglu] Showtimes data:', showtimesData);

      if (showtimesData && showtimesData.cinemas && showtimesData.cinemas.length > 0) {
        // Map the Movieglu response to our standardized showtimes format
        return showtimesData.cinemas.map(c => {
          let times = [];
          if (c.showtimes) {
            Object.keys(c.showtimes).forEach(type => {
              if (c.showtimes[type] && c.showtimes[type].times) {
                c.showtimes[type].times.forEach(t => {
                  times.push({
                    time: t.start_time,
                    type: type.toUpperCase()
                  });
                });
              }
            });
          }
          return {
            cinema_name: c.cinema_name,
            distance: parseFloat(c.distance || '0'),
            address: c.address || c.city || 'Local Area',
            showtimes: times.slice(0, 5) // limit to 5 showtimes
          };
        });
      }

      throw new Error('No showtimes returned from Movieglu API.');

    } catch (e) {
      console.warn(`[Movieglu] API request failed (falling back to mock data):`, e.message);
      return this._generateMockShowtimes(movieTitle, lat, lng);
    }
  },

  // Helper to generate premium mock showtimes for fallback
  _generateMockShowtimes(movieTitle, lat, lng) {
    const isHyd = Math.abs(parseFloat(lat) - 17.3850) < 1.0;
    const isBlr = Math.abs(parseFloat(lat) - 12.9716) < 1.0;

    let cinemas = [];
    if (isHyd) {
      cinemas = [
        { name: "Prasads Multiplex", address: "NTR Gardens, Hyderabad", baseDist: 1.2 },
        { name: "AMB Cinemas", address: "Gachibowli, Hyderabad", baseDist: 4.8 },
        { name: "PVR Forum Mall", address: "Kukatpally, Hyderabad", baseDist: 6.3 },
        { name: "Inox GVK One", address: "Banjara Hills, Hyderabad", baseDist: 2.9 },
        { name: "Cinepolis Mantra Mall", address: "Attapur, Hyderabad", baseDist: 7.1 }
      ];
    } else if (isBlr) {
      cinemas = [
        { name: "PVR Director's Cut", address: "Forum Rex Walk, Bangalore", baseDist: 1.5 },
        { name: "Inox Lido Mall", address: "Ulsoor, Bangalore", baseDist: 3.2 },
        { name: "Cinepolis Royal Meenakshi Mall", address: "Bannerghatta Road, Bangalore", baseDist: 8.4 },
        { name: "Urvashi Cinema", address: "Lalbagh Road, Bangalore", baseDist: 2.1 }
      ];
    } else {
      // Generic local cinemas
      cinemas = [
        { name: "PVR Cinemas (Local Mall)", address: "Down Town, Near You", baseDist: 2.4 },
        { name: "Inox Multiplex", address: "Central Square, Near You", baseDist: 3.8 },
        { name: "Cinepolis", address: "Galaxy Mall, Near You", baseDist: 5.1 }
      ];
    }

    // Generate times with small randomized variations
    const timeSlots = [
      ["10:30 AM", "1:45 PM", "4:30 PM", "7:15 PM", "10:15 PM"],
      ["11:00 AM", "2:15 PM", "5:00 PM", "8:00 PM", "11:00 PM"],
      ["10:00 AM", "1:15 PM", "4:00 PM", "7:00 PM", "10:00 PM"]
    ];

    return cinemas.map((c, idx) => {
      const slots = timeSlots[idx % timeSlots.length];
      const distance = parseFloat((c.baseDist + Math.random() * 0.8).toFixed(1));
      
      const showtimes = slots.map((time, tIdx) => {
        let type = "Standard";
        if (tIdx === 1) type = "Dolby Atmos";
        if (tIdx === 3 && (c.name.includes("Prasads") || c.name.includes("Director"))) type = "IMAX";
        if (tIdx === 4) type = idx % 2 === 0 ? "4DX" : "Standard";
        return { time, type };
      });

      return {
        cinema_name: c.name,
        distance,
        address: c.address,
        showtimes
      };
    });
  },

  async getLiveBoxOfficeData() {
    try {
      const res = await fetch('/api/live-box-office');
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      console.warn("Failed to fetch live box office from server, returning default mock/fallback:", e);
      try {
        const fallbackRes = await fetch('/live_box_office.json');
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      } catch (innerErr) {
        console.error("Failed to load local live_box_office.json fallback:", innerErr);
      }
      return null;
    }
  }
};

window.BoxOfficeAPI = BoxOfficeAPI;
console.log('BoxOfficeAPI client ready. Live mode:', !BoxOfficeAPI.isMockMode());
