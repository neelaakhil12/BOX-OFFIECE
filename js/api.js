// TMDB & OMDB API Integration Client — BOX OFFICE Platform
// Live data is fetched automatically whenever a TMDB key is saved.
// No checkbox needed — having a key = LIVE MODE ON.

const BoxOfficeAPI = {

  // ── KEY MANAGEMENT ─────────────────────────────────────────
  _keys: {
    tmdbKey: 'd9b5a4008faa1a1cd3c2e42d985cb619',
    omdbKey: '4a6891d5'
  },

  // Initialize keys from backend (and fallback to localStorage/hardcoded)
  async initKeys() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.tmdbKey) this._keys.tmdbKey = data.tmdbKey.trim();
        if (data.omdbKey) this._keys.omdbKey = data.omdbKey.trim();
        // Sync to localStorage
        localStorage.setItem('bo_tmdb_key', this._keys.tmdbKey);
        localStorage.setItem('bo_omdb_key', this._keys.omdbKey);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      console.warn("Failed to fetch keys from backend, using default/localStorage fallback:", e);
      this._keys.tmdbKey = localStorage.getItem('bo_tmdb_key') || this._keys.tmdbKey;
      this._keys.omdbKey = localStorage.getItem('bo_omdb_key') || this._keys.omdbKey;
    }
  },

  getKeys() {
    if (!this._keys.tmdbKey) this._keys.tmdbKey = 'd9b5a4008faa1a1cd3c2e42d985cb619';
    if (!this._keys.omdbKey) this._keys.omdbKey = '4a6891d5';
    return this._keys;
  },

  async setKeys(tmdbKey, omdbKey) {
    const cleanTmdb = (tmdbKey || '').trim() || 'd9b5a4008faa1a1cd3c2e42d985cb619';
    const cleanOmdb = (omdbKey || '').trim() || '4a6891d5';
    this._keys.tmdbKey = cleanTmdb;
    this._keys.omdbKey = cleanOmdb;

    localStorage.setItem('bo_tmdb_key', cleanTmdb);
    localStorage.setItem('bo_omdb_key', cleanOmdb);
    
    // Flush cache whenever keys change
    this._cache = {};

    // Save to backend
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbKey: cleanTmdb, omdbKey: cleanOmdb })
      });
    } catch (e) {
      console.error("Failed to save keys to backend:", e);
    }
  },

  // ── LIVE MODE CHECK ────────────────────────────────────────
  // Live mode is ON if a TMDB key exists — no toggle required.
  isMockMode() {
    return !this.getKeys().tmdbKey;
  },

  // ── INTERNAL CACHE ─────────────────────────────────────────
  _cache: {},

  // Clear cache (called on every router navigation so data is always fresh)
  clearCache() {
    this._cache = {};
  },

  // Fetch with cache (uses cache only within the same navigation)
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
  // Handles both TMDB relative paths (/abc.jpg) and absolute URLs (http...)
  getImageUrl(path, size = 'w500') {
    const fallback = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
    if (!path) return fallback;
    if (path.startsWith('http')) return path; // already absolute (mock data)
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // ── NORMALISE TMDB LIST ITEMS ──────────────────────────────
  // TMDB list endpoints return genre_ids[], not genres[].
  // We map to the same structure as mock data so the app never crashes.
  _normaliseTMDB(movie) {
    return {
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
      return window.mockData.movies.filter(m => m.popularity > 500);
    }
    try {
      const { tmdbKey } = this.getKeys();
      const data = await this._fetch(
        `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${tmdbKey}`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('Trending API failed, using mock:', err.message);
      return window.mockData.movies.filter(m => m.popularity > 500);
    }
  },

  // ── 2. NOW PLAYING ─────────────────────────────────────────
  async getNowPlaying(lang = '') {
    if (this.isMockMode()) {
      let list = window.mockData.movies.filter(m => m.id < 999000);
      if (lang && lang !== 'all') list = list.filter(m => m.original_language === lang);
      return list;
    }
    try {
      const { tmdbKey } = this.getKeys();
      let url;
      if (lang && lang !== 'all') {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=${lang}&sort_by=popularity.desc&region=IN`;
      } else {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbKey}&region=IN`;
      }
      const data = await this._fetch(url);
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('NowPlaying API failed, using mock:', err.message);
      let list = window.mockData.movies.filter(m => m.id < 999000);
      if (lang && lang !== 'all') list = list.filter(m => m.original_language === lang);
      return list;
    }
  },

  // ── 2.5. MOVIES BY LANGUAGE ────────────────────────────────
  async getMoviesByLanguage(lang) {
    if (this.isMockMode()) {
      return window.mockData.movies.filter(m => m.original_language === lang);
    }
    try {
      const { tmdbKey } = this.getKeys();
      const data = await this._fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_original_language=${lang}&sort_by=popularity.desc`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn(`Language ${lang} API failed, using mock:`, err.message);
      return window.mockData.movies.filter(m => m.original_language === lang);
    }
  },

  // ── 3. TOP RATED ───────────────────────────────────────────
  async getTopRated() {
    if (this.isMockMode()) {
      return window.mockData.movies
        .filter(m => m.vote_average >= 7.5)
        .sort((a, b) => b.vote_average - a.vote_average);
    }
    try {
      const { tmdbKey } = this.getKeys();
      const data = await this._fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbKey}`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('TopRated API failed, using mock:', err.message);
      return window.mockData.movies
        .filter(m => m.vote_average >= 7.5)
        .sort((a, b) => b.vote_average - a.vote_average);
    }
  },

  // ── 4. UPCOMING ────────────────────────────────────────────
  async getUpcoming() {
    if (this.isMockMode()) {
      return window.mockData.movies.filter(m => m.id >= 999000);
    }
    try {
      const { tmdbKey } = this.getKeys();
      const data = await this._fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbKey}&region=IN`
      );
      return data.results.map(m => this._normaliseTMDB(m));
    } catch (err) {
      console.warn('Upcoming API failed, using mock:', err.message);
      return window.mockData.movies.filter(m => m.id >= 999000);
    }
  },

  // ── 5. POPULAR ACTORS ──────────────────────────────────────
  async getPopularActors() {
    if (this.isMockMode()) return window.mockData.actors;
    try {
      const { tmdbKey } = this.getKeys();
      const data = await this._fetch(
        `https://api.themoviedb.org/3/person/popular?api_key=${tmdbKey}`
      );
      return data.results.map(actor => ({
        id: actor.id,
        name: actor.name,
        profile_path: actor.profile_path
          ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        known_for: actor.known_for.map(m => m.title || m.name).join(', '),
        movies: actor.known_for.map(m => m.title || m.name)
      }));
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
      return data.results.map(m => this._normaliseTMDB(m));
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

      return {
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
    } catch (err) {
      console.warn(`Details API failed for ${id}, using mock:`, err.message);
      return window.mockData.movies.find(m => m.id == id) || window.mockData.movies[0];
    }
  }
};

window.BoxOfficeAPI = BoxOfficeAPI;
console.log('BoxOfficeAPI client ready. Live mode:', !BoxOfficeAPI.isMockMode());
