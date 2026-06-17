// high-fidelity mock database for the Ciniphiles platform
const mockData = {
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ],

  languages: [
    { code: "en", name: "English" },
    { code: "te", name: "Telugu" },
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "ml", name: "Malayalam" },
    { code: "kn", name: "Kannada" },
    { code: "ko", name: "Korean" },
    { code: "ja", name: "Japanese" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" }
  ],

  movies: [
    {
      id: 1011985,
      title: "Dune: Part Two",
      tagline: "Long live the fighters.",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
      backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.3,
      vote_count: 4850,
      release_date: "2024-03-01",
      runtime: 166,
      original_language: "en",
      budget: 190000000,
      revenue: 712000000,
      popularity: 985.4,
      trailer_url: "https://www.youtube.com/embed/Way9Dexny3w",
      genres: [28, 12, 878],
      production_companies: [
        { name: "Legendary Pictures", logo_path: null },
        { name: "Warner Bros. Pictures", logo_path: null }
      ],
      omdb: {
        imdbRating: "8.5",
        Metascore: "79",
        RottenTomatoes: "92%",
        Awards: "Nominated for 5 Oscars. 12 wins & 45 nominations overall.",
        BoxOffice: "$282,144,305 (Domestic)",
        Worldwide: "$712,000,000"
      },
      boxOffice: {
        domestic: 282144305,
        international: 429855695,
        worldwide: 712000000,
        openingWeekend: 82505391,
        dailyTrend: [
          { day: "Fri", amount: 32200000 },
          { day: "Sat", amount: 28800000 },
          { day: "Sun", amount: 21505391 },
          { day: "Mon", amount: 7300000 },
          { day: "Tue", amount: 6800000 },
          { day: "Wed", amount: 5500000 },
          { day: "Thu", amount: 4800000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 111000000 },
          { label: "Week 2", amount: 75000000 },
          { label: "Week 3", amount: 46000000 },
          { label: "Week 4", amount: 28000000 },
          { label: "Week 5", amount: 15000000 }
        ]
      },
      credits: {
        cast: [
          { id: 1, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
          { id: 2, name: "Zendaya", character: "Chani", profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop" },
          { id: 3, name: "Rebecca Ferguson", character: "Lady Jessica Atreides", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
          { id: 4, name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 5, name: "Florence Pugh", character: "Princess Irulan", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Denis Villeneuve", job: "Director" },
          { name: "Frank Herbert", job: "Novel" },
          { name: "Jon Spaihts", job: "Screenplay" },
          { name: "Hans Zimmer", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "CinematicMaster", rating: 9, content: "A visual masterpiece that surpasses the first film in almost every way. The scale is monumental, and Hans Zimmer's score is absolutely earth-shaking.", date: "2024-03-02" },
        { author: "MovieCritic99", rating: 8, content: "Stunning adaptation. Timothée Chalamet and Austin Butler deliver career-defining performances. Denis Villeneuve proves once again he is a sci-fi legend.", date: "2024-03-05" }
      ]
    },
    {
      id: 872585,
      title: "Oppenheimer",
      tagline: "The world forever changes.",
      overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, showing his leadership of the Manhattan Project and the dramatic security hearing in 1954 that questioned his loyalty.",
      backdrop_path: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.6,
      vote_count: 7900,
      release_date: "2023-07-21",
      runtime: 180,
      original_language: "en",
      budget: 100000000,
      revenue: 975000000,
      popularity: 852.1,
      trailer_url: "https://www.youtube.com/embed/uYPbbksJxIg",
      genres: [18, 36],
      production_companies: [
        { name: "Universal Pictures", logo_path: null },
        { name: "Syncopy", logo_path: null }
      ],
      omdb: {
        imdbRating: "8.9",
        Metascore: "90",
        RottenTomatoes: "93%",
        Awards: "Won 7 Academy Awards including Best Picture and Best Director.",
        BoxOffice: "$329,865,000 (Domestic)",
        Worldwide: "$975,000,000"
      },
      boxOffice: {
        domestic: 329865000,
        international: 645135000,
        worldwide: 975000000,
        openingWeekend: 82455420,
        dailyTrend: [
          { day: "Fri", amount: 33000000 },
          { day: "Sat", amount: 27500000 },
          { day: "Sun", amount: 21955420 },
          { day: "Mon", amount: 12600000 },
          { day: "Tue", amount: 11800000 },
          { day: "Wed", amount: 10100000 },
          { day: "Thu", amount: 9200000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 125000000 },
          { label: "Week 2", amount: 90000000 },
          { label: "Week 3", amount: 60000000 },
          { label: "Week 4", amount: 40000000 },
          { label: "Week 5", amount: 25000000 }
        ]
      },
      credits: {
        cast: [
          { id: 6, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 7, name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
          { id: 8, name: "Matt Damon", character: "Leslie Groves", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
          { id: 9, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop" },
          { id: 5, name: "Florence Pugh", character: "Jean Tatlock", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Christopher Nolan", job: "Director" },
          { name: "Kai Bird", job: "Book Author" },
          { name: "Martin J. Sherwin", job: "Book Author" },
          { name: "Ludwig Göransson", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "NolanFan", rating: 10, content: "A triumphant achievement in filmmaking. Cillian Murphy's performance is incredibly nuanced, and the sound design leaves you speechless.", date: "2023-07-22" },
        { author: "HistoryBuff", rating: 9, content: "Captures the tension of the era beautifully. Nolan does a brilliant job weaving three different timelines together.", date: "2023-07-26" }
      ]
    },
    {
      id: 569094,
      title: "Spider-Man: Across the Spider-Verse",
      tagline: "It's how you wear the mask.",
      overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider-Society, a team of Spider-People charged with protecting the Multiverse's very existence. But when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders.",
      backdrop_path: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.4,
      vote_count: 6200,
      release_date: "2023-06-02",
      runtime: 140,
      original_language: "en",
      budget: 100000000,
      revenue: 690897215,
      popularity: 742.3,
      trailer_url: "https://www.youtube.com/embed/cqGjhVJWtEg",
      genres: [16, 28, 12, 878],
      production_companies: [
        { name: "Sony Pictures Animation", logo_path: null },
        { name: "Marvel Entertainment", logo_path: null }
      ],
      omdb: {
        imdbRating: "8.6",
        Metascore: "86",
        RottenTomatoes: "95%",
        Awards: "Nominated for 1 Oscar. 15 wins & 40 nominations overall.",
        BoxOffice: "$381,311,319 (Domestic)",
        Worldwide: "$690,897,215"
      },
      boxOffice: {
        domestic: 381311319,
        international: 309585896,
        worldwide: 690897215,
        openingWeekend: 120663589,
        dailyTrend: [
          { day: "Fri", amount: 51850000 },
          { day: "Sat", amount: 37600000 },
          { day: "Sun", amount: 31213589 },
          { day: "Mon", amount: 13200000 },
          { day: "Tue", amount: 15100000 },
          { day: "Wed", amount: 10800000 },
          { day: "Thu", amount: 9500000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 169000000 },
          { label: "Week 2", amount: 95000000 },
          { label: "Week 3", amount: 58000000 },
          { label: "Week 4", amount: 38000000 },
          { label: "Week 5", amount: 24000000 }
        ]
      },
      credits: {
        cast: [
          { id: 10, name: "Shameik Moore", character: "Miles Morales / Spider-Man (voice)", profile_path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop" },
          { id: 2, name: "Zendaya", character: "MJ (voice - cameo)", profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop" },
          { id: 11, name: "Hailee Steinfeld", character: "Gwen Stacy / Spider-Woman (voice)", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
          { id: 12, name: "Oscar Isaac", character: "Miguel O'Hara / Spider-Man 2099 (voice)", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Joaquim Dos Santos", job: "Director" },
          { name: "Kemp Powers", job: "Director" },
          { name: "Justin K. Thompson", job: "Director" },
          { name: "Phil Lord", job: "Writer / Producer" }
        ]
      },
      reviews: [
        { author: "AnimationGeek", rating: 10, content: "Every frame of this movie is a painting. Truly pushes the boundaries of what animation can do. Absolutely sensational.", date: "2023-06-03" }
      ]
    },
    {
      id: 157336,
      title: "Interstellar",
      tagline: "Mankind was born on Earth. It was never meant to die here.",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      backdrop_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.4,
      vote_count: 34300,
      release_date: "2014-11-05",
      runtime: 169,
      original_language: "en",
      budget: 165000000,
      revenue: 701729206,
      popularity: 382.4,
      trailer_url: "https://www.youtube.com/embed/zSWdZVtXT7E",
      genres: [12, 18, 878],
      production_companies: [
        { name: "Paramount Pictures", logo_path: null },
        { name: "Legendary Pictures", logo_path: null },
        { name: "Syncopy", logo_path: null }
      ],
      omdb: {
        imdbRating: "8.7",
        Metascore: "74",
        RottenTomatoes: "73%",
        Awards: "Won 1 Oscar for Best Visual Effects. 44 wins & 148 nominations overall.",
        BoxOffice: "$188,020,017 (Domestic)",
        Worldwide: "$701,729,206"
      },
      boxOffice: {
        domestic: 188020017,
        international: 513709189,
        worldwide: 701729206,
        openingWeekend: 47510360,
        dailyTrend: [
          { day: "Fri", amount: 17000000 },
          { day: "Sat", amount: 18200000 },
          { day: "Sun", amount: 12310360 },
          { day: "Mon", amount: 4200000 },
          { day: "Tue", amount: 3900000 },
          { day: "Wed", amount: 3400000 },
          { day: "Thu", amount: 2900000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 62000000 },
          { label: "Week 2", amount: 41000000 },
          { label: "Week 3", amount: 28000000 },
          { label: "Week 4", amount: 19000000 },
          { label: "Week 5", amount: 11000000 }
        ]
      },
      credits: {
        cast: [
          { id: 13, name: "Matthew McConaughey", character: "Cooper", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
          { id: 14, name: "Anne Hathaway", character: "Brand", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
          { id: 15, name: "Jessica Chastain", character: "Murph", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 16, name: "Michael Caine", character: "Professor Brand", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Christopher Nolan", job: "Director" },
          { name: "Jonathan Nolan", job: "Screenplay" },
          { name: "Hans Zimmer", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "CosmosLover", rating: 10, content: "Emotionally charged, scientifically compelling, and absolutely gorgeous. Nolan makes space feel so infinite and terrifying.", date: "2014-11-06" }
      ]
    },
    {
      id: 155,
      title: "The Dark Knight",
      tagline: "Why So Serious?",
      overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
      backdrop_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.5,
      vote_count: 31900,
      release_date: "2008-07-18",
      runtime: 152,
      original_language: "en",
      budget: 185000000,
      revenue: 1004558444,
      popularity: 345.9,
      trailer_url: "https://www.youtube.com/embed/EXeTwQWrcwY",
      genres: [28, 80, 18, 53],
      production_companies: [
        { name: "Warner Bros. Pictures", logo_path: null },
        { name: "Legendary Pictures", logo_path: null },
        { name: "Syncopy", logo_path: null }
      ],
      omdb: {
        imdbRating: "9.0",
        Metascore: "84",
        RottenTomatoes: "94%",
        Awards: "Won 2 Oscars including Best Supporting Actor (Heath Ledger).",
        BoxOffice: "$534,858,444 (Domestic)",
        Worldwide: "$1,004,558,444"
      },
      boxOffice: {
        domestic: 534858444,
        international: 469700000,
        worldwide: 1004558444,
        openingWeekend: 158411483,
        dailyTrend: [
          { day: "Fri", amount: 67165092 },
          { day: "Sat", amount: 47650240 },
          { day: "Sun", amount: 43596151 },
          { day: "Mon", amount: 24493312 },
          { day: "Tue", amount: 20868722 },
          { day: "Wed", amount: 18412000 },
          { day: "Thu", amount: 16500000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 238000000 },
          { label: "Week 2", amount: 110000000 },
          { label: "Week 3", amount: 60000000 },
          { label: "Week 4", amount: 40000000 },
          { label: "Week 5", amount: 25000000 }
        ]
      },
      credits: {
        cast: [
          { id: 17, name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 18, name: "Heath Ledger", character: "The Joker", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
          { id: 19, name: "Gary Oldman", character: "Jim Gordon", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 20, name: "Aaron Eckhart", character: "Harvey Dent", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Christopher Nolan", job: "Director" },
          { name: "Jonathan Nolan", job: "Screenplay" },
          { name: "David S. Goyer", job: "Story" }
        ]
      },
      reviews: [
        { author: "JokerFanatic", rating: 10, content: "Heath Ledger gave the greatest acting performance in superhero cinema history. Flawless pacing, dark themes, excellent score.", date: "2008-07-20" }
      ]
    },
    {
      id: 346698,
      title: "Barbie",
      tagline: "She's everything. He's just Ken.",
      overview: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
      backdrop_path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.1,
      vote_count: 8500,
      release_date: "2023-07-21",
      runtime: 114,
      original_language: "en",
      budget: 145000000,
      revenue: 1445638421,
      popularity: 610.1,
      trailer_url: "https://www.youtube.com/embed/pBk4NYhWNMM",
      genres: [35, 12, 14],
      production_companies: [
        { name: "LuckyChap Entertainment", logo_path: null },
        { name: "Mattel", logo_path: null },
        { name: "Warner Bros. Pictures", logo_path: null }
      ],
      omdb: {
        imdbRating: "7.0",
        Metascore: "80",
        RottenTomatoes: "88%",
        Awards: "Won 1 Oscar for Best Original Song. 18 wins & 74 nominations overall.",
        BoxOffice: "$636,238,421 (Domestic)",
        Worldwide: "$1,445,638,421"
      },
      boxOffice: {
        domestic: 636238421,
        international: 809400000,
        worldwide: 1445638421,
        openingWeekend: 162022044,
        dailyTrend: [
          { day: "Fri", amount: 70500000 },
          { day: "Sat", amount: 48500000 },
          { day: "Sun", amount: 43022044 },
          { day: "Mon", amount: 26100000 },
          { day: "Tue", amount: 26000000 },
          { day: "Wed", amount: 23000000 },
          { day: "Thu", amount: 21200000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 258000000 },
          { label: "Week 2", amount: 155000000 },
          { label: "Week 3", amount: 95000000 },
          { label: "Week 4", amount: 65000000 },
          { label: "Week 5", amount: 40000000 }
        ]
      },
      credits: {
        cast: [
          { id: 21, name: "Margot Robbie", character: "Barbie", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 22, name: "Ryan Gosling", character: "Ken", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 23, name: "America Ferrera", character: "Gloria", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
          { id: 24, name: "Will Ferrell", character: "Mattel CEO", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Greta Gerwig", job: "Director / Writer" },
          { name: "Noah Baumbach", job: "Writer" }
        ]
      },
      reviews: [
        { author: "PinkLover", rating: 8, content: "Surprisingly deep, funny, and incredibly stylish. Greta Gerwig takes a corporate brand and makes it a feminist manifesto.", date: "2023-07-23" }
      ]
    },
    {
      id: 76600,
      title: "Avatar: The Way of Water",
      tagline: "Return to Pandora.",
      overview: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
      backdrop_path: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.6,
      vote_count: 10400,
      release_date: "2022-12-16",
      runtime: 192,
      original_language: "en",
      budget: 350000000,
      revenue: 2320250281,
      popularity: 541.2,
      trailer_url: "https://www.youtube.com/embed/d9MyW72ELq0",
      genres: [28, 12, 878],
      production_companies: [
        { name: "Lightstorm Entertainment", logo_path: null },
        { name: "20th Century Studios", logo_path: null }
      ],
      omdb: {
        imdbRating: "7.6",
        Metascore: "67",
        RottenTomatoes: "76%",
        Awards: "Won 1 Oscar for Best Visual Effects. 23 wins & 124 nominations overall.",
        BoxOffice: "$684,075,767 (Domestic)",
        Worldwide: "$2,320,250,281"
      },
      boxOffice: {
        domestic: 684075767,
        international: 1636174514,
        worldwide: 2320250281,
        openingWeekend: 134100226,
        dailyTrend: [
          { day: "Fri", amount: 53200000 },
          { day: "Sat", amount: 44500000 },
          { day: "Sun", amount: 36400226 },
          { day: "Mon", amount: 16200000 },
          { day: "Tue", amount: 20100000 },
          { day: "Wed", amount: 14500000 },
          { day: "Thu", amount: 13100000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 268000000 },
          { label: "Week 2", amount: 185000000 },
          { label: "Week 3", amount: 145000000 },
          { label: "Week 4", amount: 98000000 },
          { label: "Week 5", amount: 72000000 }
        ]
      },
      credits: {
        cast: [
          { id: 25, name: "Sam Worthington", character: "Jake Sully", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 26, name: "Zoe Saldaña", character: "Neytiri", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
          { id: 27, name: "Sigourney Weaver", character: "Kiri", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" },
          { id: 28, name: "Kate Winslet", character: "Ronal", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "James Cameron", job: "Director / Writer / Producer" },
          { name: "Rick Jaffa", job: "Screenplay" },
          { name: "Amanda Silver", job: "Screenplay" }
        ]
      },
      reviews: [
        { author: "VisualFiend", rating: 9, content: "Never bet against James Cameron. The underwater sequence is arguably the greatest cinematic CG rendering ever accomplished.", date: "2022-12-18" }
      ]
    },
    {
      id: 414906,
      title: "The Batman",
      tagline: "Unmask the truth.",
      overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      backdrop_path: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.7,
      vote_count: 9200,
      release_date: "2022-03-04",
      runtime: 176,
      original_language: "en",
      budget: 200000000,
      revenue: 772000000,
      popularity: 410.5,
      trailer_url: "https://www.youtube.com/embed/mqqft2x_Aa4",
      genres: [28, 80, 9648, 53],
      production_companies: [
        { name: "DC Films", logo_path: null },
        { name: "6th & Idaho", logo_path: null },
        { name: "Warner Bros. Pictures", logo_path: null }
      ],
      omdb: {
        imdbRating: "7.8",
        Metascore: "72",
        RottenTomatoes: "85%",
        Awards: "Nominated for 3 Oscars. 18 wins & 52 nominations overall.",
        BoxOffice: "$369,345,583 (Domestic)",
        Worldwide: "$772,000,000"
      },
      boxOffice: {
        domestic: 369345583,
        international: 402654417,
        worldwide: 772000000,
        openingWeekend: 134005141,
        dailyTrend: [
          { day: "Fri", amount: 56600000 },
          { day: "Sat", amount: 43200000 },
          { day: "Sun", amount: 34205141 },
          { day: "Mon", amount: 10800000 },
          { day: "Tue", amount: 12200000 },
          { day: "Wed", amount: 9100000 },
          { day: "Thu", amount: 8200000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 194000000 },
          { label: "Week 2", amount: 98000000 },
          { label: "Week 3", amount: 62000000 },
          { label: "Week 4", amount: 42000000 },
          { label: "Week 5", amount: 26000000 }
        ]
      },
      credits: {
        cast: [
          { id: 29, name: "Robert Pattinson", character: "Bruce Wayne / Batman", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 30, name: "Zoë Kravitz", character: "Selina Kyle / Catwoman", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 31, name: "Paul Dano", character: "Edward Nashton / Riddler", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
          { id: 32, name: "Colin Farrell", character: "Oswald Cobblepot / Penguin", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Matt Reeves", job: "Director / Writer" },
          { name: "Peter Craig", job: "Writer" },
          { name: "Michael Giacchino", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "NoirDetective", rating: 9, content: "A gritty, rain-slicked detective thriller masquerading as a superhero film. Robert Pattinson is phenomenal. The cinematography is incredible.", date: "2022-03-05" }
      ]
    },
    // Upcoming Movie 1 (with countdown info)
    {
      id: 999001,
      title: "Avatar 3: Fire and Ash",
      tagline: "New clans will rise.",
      overview: "The third installment in James Cameron's epic science fiction saga, exploring a new, aggressive volcanic clan of Na'vi known as the 'Ash People'.",
      backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=500&auto=format&fit=crop",
      vote_average: 0.0,
      vote_count: 0,
      release_date: "2026-12-18",
      runtime: 180,
      original_language: "en",
      budget: 350000000,
      revenue: 0,
      popularity: 310.2,
      trailer_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder trailer
      genres: [28, 12, 878],
      production_companies: [
        { name: "Lightstorm Entertainment", logo_path: null },
        { name: "20th Century Studios", logo_path: null }
      ],
      omdb: {
        imdbRating: "N/A",
        Metascore: "N/A",
        RottenTomatoes: "N/A",
        Awards: "Under Production",
        BoxOffice: "N/A",
        Worldwide: "N/A"
      },
      credits: {
        cast: [
          { id: 25, name: "Sam Worthington", character: "Jake Sully", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 26, name: "Zoe Saldaña", character: "Neytiri", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "James Cameron", job: "Director / Writer / Producer" }
        ]
      },
      reviews: []
    },
    // Upcoming Movie 2
    {
      id: 999002,
      title: "Avengers: Doomsday",
      tagline: "Enter Doom.",
      overview: "Robert Downey Jr. returns to the MCU as Victor von Doom / Doctor Doom in an epic crossing of realities, culminating in a clash of the multiverse.",
      backdrop_path: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=500&auto=format&fit=crop",
      vote_average: 0.0,
      vote_count: 0,
      release_date: "2026-05-01",
      runtime: 150,
      original_language: "en",
      budget: 400000000,
      revenue: 0,
      popularity: 512.4,
      trailer_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      genres: [28, 12, 878],
      production_companies: [
        { name: "Marvel Studios", logo_path: null }
      ],
      omdb: {
        imdbRating: "N/A",
        Metascore: "N/A",
        RottenTomatoes: "N/A",
        Awards: "Pre-production",
        BoxOffice: "N/A",
        Worldwide: "N/A"
      },
      credits: {
        cast: [
          { id: 9, name: "Robert Downey Jr.", character: "Doctor Doom", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 33, name: "Pedro Pascal", character: "Reed Richards / Mr. Fantastic", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Anthony Russo", job: "Director" },
          { name: "Joe Russo", job: "Director" },
          { name: "Stephen McFeely", job: "Writer" }
        ]
      },
      reviews: []
    },
    {
      id: 579974,
      title: "RRR",
      tagline: "Rise Roar Revolt.",
      overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
      backdrop_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.8,
      vote_count: 1250,
      release_date: "2022-03-24",
      runtime: 187,
      original_language: "te",
      budget: 72000000,
      revenue: 160000000,
      popularity: 450.2,
      trailer_url: "https://www.youtube.com/embed/NgBoMJy386M",
      genres: [28, 12, 18],
      production_companies: [
        { name: "DVV Entertainment", logo_path: null }
      ],
      omdb: {
        imdbRating: "7.8",
        Metascore: "69",
        RottenTomatoes: "95%",
        Awards: "Won 1 Oscar (Best Original Song - Naatu Naatu). 42 wins total.",
        BoxOffice: "$14,500,000 (Domestic)",
        Worldwide: "$160,000,000"
      },
      boxOffice: {
        domestic: 14500000,
        international: 145500000,
        worldwide: 160000000,
        openingWeekend: 9500000,
        dailyTrend: [
          { day: "Fri", amount: 3500000 },
          { day: "Sat", amount: 3100000 },
          { day: "Sun", amount: 2900000 },
          { day: "Mon", amount: 1200000 },
          { day: "Tue", amount: 1100000 },
          { day: "Wed", amount: 900000 },
          { day: "Thu", amount: 800000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 15000000 },
          { label: "Week 2", amount: 8000000 },
          { label: "Week 3", amount: 4500000 },
          { label: "Week 4", amount: 2000000 },
          { label: "Week 5", amount: 1000000 }
        ]
      },
      credits: {
        cast: [
          { id: 40, name: "N.T. Rama Rao Jr.", character: "Komaram Bheem", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 41, name: "Ram Charan", character: "Alluri Sitarama Raju", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 42, name: "Alia Bhatt", character: "Sita", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 43, name: "Ajay Devgn", character: "Venkata Rama Raju", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "S.S. Rajamouli", job: "Director" },
          { name: "V. Vijayendra Prasad", job: "Writer" },
          { name: "M.M. Keeravani", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "TollywoodLover", rating: 10, content: "The energy of Naatu Naatu and the bromance action sequences are legendary. Best cinematic experience ever!", date: "2022-03-25" }
      ]
    },
    {
      id: 350312,
      title: "Baahubali 2: The Conclusion",
      tagline: "The boy he raised must confront him.",
      overview: "When Mahendra Baahubali, the son of Amarendra Baahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.",
      backdrop_path: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.0,
      vote_count: 980,
      release_date: "2017-04-27",
      runtime: 167,
      original_language: "te",
      budget: 37000000,
      revenue: 278000000,
      popularity: 380.5,
      trailer_url: "https://www.youtube.com/embed/qD-DxDYBUew",
      genres: [28, 12, 14, 18],
      production_companies: [
        { name: "Arka Media Works", logo_path: null }
      ],
      omdb: {
        imdbRating: "8.2",
        Metascore: "N/A",
        RottenTomatoes: "90%",
        Awards: "Won 3 National Film Awards. Global blockbuster success.",
        BoxOffice: "$22,000,000 (Domestic)",
        Worldwide: "$278,000,000"
      },
      boxOffice: {
        domestic: 22000000,
        international: 256000000,
        worldwide: 278000000,
        openingWeekend: 10100000,
        dailyTrend: [
          { day: "Fri", amount: 3800000 },
          { day: "Sat", amount: 3300000 },
          { day: "Sun", amount: 3000000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 28000000 },
          { label: "Week 2", amount: 15000000 }
        ]
      },
      credits: {
        cast: [
          { id: 45, name: "Prabhas", character: "Amarendra Baahubali / Mahendra Baahubali", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 46, name: "Rana Daggubati", character: "Bhallaladeva", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 47, name: "Anushka Shetty", character: "Devasena", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 48, name: "Tamannaah Bhatia", character: "Avanthika", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "S.S. Rajamouli", job: "Director" },
          { name: "V. Vijayendra Prasad", job: "Writer" },
          { name: "M.M. Keeravani", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "RajamouliFan", rating: 10, content: "An epic conclusion to the legendary Baahubali saga. The battle scenes, the set design, and the story beats are majestic.", date: "2017-04-28" }
      ]
    },
    {
      id: 872906,
      title: "Jawan",
      tagline: "A father-son emotional journey.",
      overview: "A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago. He commits high-profile hijackings and robberies, drawing the attention of a seasoned officer.",
      backdrop_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.2,
      vote_count: 850,
      release_date: "2023-09-07",
      runtime: 168,
      original_language: "hi",
      budget: 36000000,
      revenue: 140000000,
      popularity: 312.5,
      trailer_url: "https://www.youtube.com/embed/COv5277XA94",
      genres: [28, 12, 53],
      production_companies: [
        { name: "Red Chillies Entertainment", logo_path: null }
      ],
      omdb: {
        imdbRating: "7.0",
        Metascore: "N/A",
        RottenTomatoes: "82%",
        Awards: "Won Filmfare Awards. Huge commercial success.",
        BoxOffice: "$15,200,000 (Domestic)",
        Worldwide: "$140,000,000"
      },
      boxOffice: {
        domestic: 15200000,
        international: 124800000,
        worldwide: 140000000,
        openingWeekend: 8500000,
        dailyTrend: [
          { day: "Fri", amount: 2900000 },
          { day: "Sat", amount: 2700000 },
          { day: "Sun", amount: 2900000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 22000000 },
          { label: "Week 2", amount: 11000000 }
        ]
      },
      credits: {
        cast: [
          { id: 50, name: "Shah Rukh Khan", character: "Vikram Rathore / Azad", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 51, name: "Nayanthara", character: "Narmada Rai", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 52, name: "Vijay Sethupathi", character: "Kalee Gaikwad", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Atlee", job: "Director / Writer" },
          { name: "Anirudh Ravichander", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "BollywoodFan", rating: 9, content: "Mass action, emotional story, and SRK in a dual role. Complete entertainment!", date: "2023-09-08" }
      ]
    },
    {
      id: 888001,
      title: "Peddi",
      tagline: "The God of the Playground.",
      overview: "In 1980s rural Andhra Pradesh, a spirited villager named Peddi, known as the 'God of the Playground', unites his community through sports—specifically cricket and wrestling—to defend their pride and identity against a powerful, ruthless rival.",
      backdrop_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.9,
      vote_count: 540,
      release_date: "2026-06-04",
      runtime: 158,
      original_language: "te",
      budget: 30000000,
      revenue: 38000000,
      popularity: 980.5,
      trailer_url: "https://www.youtube.com/embed/NgBoMJy386M",
      genres: [28, 12, 18],
      production_companies: [
        { name: "Mythri Movie Makers", logo_path: null }
      ],
      omdb: {
        imdbRating: "7.9",
        Metascore: "N/A",
        RottenTomatoes: "88%",
        Awards: "Highest-grossing South Indian film of 2026.",
        BoxOffice: "$3,500,000",
        Worldwide: "$38,000,000"
      },
      boxOffice: {
        domestic: 35000000,
        international: 3000000,
        worldwide: 38000000,
        openingWeekend: 18000000,
        dailyTrend: [
          { day: "Fri", amount: 6000000 },
          { day: "Sat", amount: 6500000 },
          { day: "Sun", amount: 5500000 }
        ],
        weeklyTrend: [
          { label: "Week 1", amount: 38000000 }
        ]
      },
      credits: {
        cast: [
          { id: 41, name: "Ram Charan", character: "Peddi", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 60, name: "Janhvi Kapoor", character: "Sita", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [
          { name: "Buchi Babu Sana", job: "Director / Writer" },
          { name: "A.R. Rahman", job: "Original Music Composer" }
        ]
      },
      reviews: [
        { author: "CharanFan", rating: 9, content: "Ram Charan's performance is incredibly high-energy. A.R. Rahman's score hits the perfect emotional beats.", date: "2026-06-05" }
      ]
    },
    // Recent Telugu/Tollywood Movies
    {
      id: 888002,
      title: "Kalki 2898-AD",
      tagline: "The Future is Written.",
      overview: "A dystopian science fiction epic set in the year 2898 AD, where mythology meets advanced technology. A bounty hunter named Bhairava pursues a pregnant woman carrying humanity's last hope — the final avatar of Lord Vishnu.",
      backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.6,
      vote_count: 3240,
      release_date: "2024-06-27",
      runtime: 181,
      original_language: "te",
      budget: 55000000,
      revenue: 210000000,
      popularity: 890.5,
      trailer_url: "https://www.youtube.com/embed/RnAaKFNKHmM",
      genres: [878, 28, 12, 14],
      production_companies: [{ name: "Vyjayanthi Movies", logo_path: null }],
      omdb: { imdbRating: "7.6", Metascore: "N/A", RottenTomatoes: "84%", Awards: "Biggest opening for a Telugu film globally.", BoxOffice: "$8,000,000", Worldwide: "$210,000,000" },
      boxOffice: {
        domestic: 170000000, international: 40000000, worldwide: 210000000, openingWeekend: 95000000,
        dailyTrend: [
          { day: "Fri", amount: 35000000 }, { day: "Sat", amount: 30000000 }, { day: "Sun", amount: 30000000 },
          { day: "Mon", amount: 15000000 }, { day: "Tue", amount: 10000000 }, { day: "Wed", amount: 8000000 }, { day: "Thu", amount: 6000000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 134000000 }, { label: "Week 2", amount: 45000000 }, { label: "Week 3", amount: 20000000 }, { label: "Week 4", amount: 11000000 }]
      },
      credits: {
        cast: [
          { id: 70, name: "Prabhas", character: "Bhairava", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 71, name: "Deepika Padukone", character: "Sumathi / SUM-80", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
          { id: 72, name: "Amitabh Bachchan", character: "Ashwatthama", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
          { id: 73, name: "Kamal Haasan", character: "Supreme Yaskin", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Nag Ashwin", job: "Director" }, { name: "Santhosh Narayanan", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "SciFiTelugu", rating: 8, content: "A visual spectacle! Nag Ashwin has created something truly unique — mythological sci-fi that only Indian cinema can produce.", date: "2024-06-28" }
      ]
    },
    {
      id: 888003,
      title: "Devara: Part 1",
      tagline: "Conquer your fear.",
      overview: "A fearless sea-side gangster uses the power of fear to control rivals, but his cowardly son must find that same courage when the world his father built begins to crumble.",
      backdrop_path: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.0,
      vote_count: 1680,
      release_date: "2024-09-27",
      runtime: 166,
      original_language: "te",
      budget: 28000000,
      revenue: 86000000,
      popularity: 720.3,
      trailer_url: "https://www.youtube.com/embed/yh8Z3Wph47g",
      genres: [28, 53, 18],
      production_companies: [{ name: "Yuvasudha Arts", logo_path: null }],
      omdb: { imdbRating: "7.0", Metascore: "N/A", RottenTomatoes: "75%", Awards: "Block-buster at the box office.", BoxOffice: "$5,200,000", Worldwide: "$86,000,000" },
      boxOffice: {
        domestic: 70000000, international: 16000000, worldwide: 86000000, openingWeekend: 42000000,
        dailyTrend: [
          { day: "Fri", amount: 14000000 }, { day: "Sat", amount: 15000000 }, { day: "Sun", amount: 13000000 },
          { day: "Mon", amount: 5000000 }, { day: "Tue", amount: 4000000 }, { day: "Wed", amount: 3000000 }, { day: "Thu", amount: 2500000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 56500000 }, { label: "Week 2", amount: 18000000 }, { label: "Week 3", amount: 8000000 }, { label: "Week 4", amount: 3500000 }]
      },
      credits: {
        cast: [
          { id: 40, name: "N.T. Rama Rao Jr.", character: "Devara / Chandra", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 74, name: "Janhvi Kapoor", character: "Thangam", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 75, name: "Saif Ali Khan", character: "Bhaira", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Koratala Siva", job: "Director" }, { name: "Anirudh Ravichander", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "NTRFan", rating: 8, content: "NTR Jr. at his terrifying best in the first half — that beach sequence is one for the ages.", date: "2024-09-28" }
      ]
    },
    {
      id: 888004,
      title: "Pushpa 2: The Rule",
      tagline: "Jhukega Nahi.",
      overview: "Pushpa Raj, now the undisputed king of red sandalwood smuggling, faces a new challenge from the determined Shekhawat IPS who will do anything to bring him down — even as Pushpa's own empire grows unstoppable.",
      backdrop_path: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.5,
      vote_count: 4200,
      release_date: "2024-12-05",
      runtime: 190,
      original_language: "te",
      budget: 40000000,
      revenue: 340000000,
      popularity: 950.8,
      trailer_url: "https://www.youtube.com/embed/M9MJNcjMGmo",
      genres: [28, 18, 53],
      production_companies: [{ name: "Mythri Movie Makers", logo_path: null }],
      omdb: { imdbRating: "7.5", Metascore: "N/A", RottenTomatoes: "78%", Awards: "Highest-grossing Telugu film of all time.", BoxOffice: "$18,000,000", Worldwide: "$340,000,000" },
      boxOffice: {
        domestic: 290000000, international: 50000000, worldwide: 340000000, openingWeekend: 165000000,
        dailyTrend: [
          { day: "Fri", amount: 58000000 }, { day: "Sat", amount: 56000000 }, { day: "Sun", amount: 51000000 },
          { day: "Mon", amount: 22000000 }, { day: "Tue", amount: 18000000 }, { day: "Wed", amount: 15000000 }, { day: "Thu", amount: 12000000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 232000000 }, { label: "Week 2", amount: 62000000 }, { label: "Week 3", amount: 28000000 }, { label: "Week 4", amount: 18000000 }]
      },
      credits: {
        cast: [
          { id: 76, name: "Allu Arjun", character: "Pushpa Raj", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 77, name: "Rashmika Mandanna", character: "Srivalli", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" },
          { id: 78, name: "Fahadh Faasil", character: "Bhanwar Singh Shekhawat IPS", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Sukumar", job: "Director" }, { name: "Devi Sri Prasad (DSP)", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "StylishStar", rating: 9, content: "Allu Arjun is absolutely magnetic. Sukumar creates a world so visceral you can feel the dust on your skin.", date: "2024-12-06" }
      ]
    },
    {
      id: 888005,
      title: "Game Changer",
      tagline: "Power to the People.",
      overview: "An upright IAS officer stands up against political corruption and a ruthless power syndicate, using the democratic electoral process as his weapon to change the system from within.",
      backdrop_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=500&auto=format&fit=crop",
      vote_average: 6.8,
      vote_count: 890,
      release_date: "2025-01-10",
      runtime: 167,
      original_language: "te",
      budget: 30000000,
      revenue: 62000000,
      popularity: 610.4,
      trailer_url: "https://www.youtube.com/embed/5YoV8e6ykGc",
      genres: [28, 18, 53],
      production_companies: [{ name: "Dil Raju Productions", logo_path: null }],
      omdb: { imdbRating: "6.8", Metascore: "N/A", RottenTomatoes: "60%", Awards: "Massive opening day collections.", BoxOffice: "$4,500,000", Worldwide: "$62,000,000" },
      boxOffice: {
        domestic: 52000000, international: 10000000, worldwide: 62000000, openingWeekend: 32000000,
        dailyTrend: [
          { day: "Fri", amount: 11000000 }, { day: "Sat", amount: 11500000 }, { day: "Sun", amount: 9500000 },
          { day: "Mon", amount: 4500000 }, { day: "Tue", amount: 3500000 }, { day: "Wed", amount: 2500000 }, { day: "Thu", amount: 2000000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 44500000 }, { label: "Week 2", amount: 12000000 }, { label: "Week 3", amount: 4000000 }, { label: "Week 4", amount: 1500000 }]
      },
      credits: {
        cast: [
          { id: 41, name: "Ram Charan", character: "Ram Shankar IAS / Appanna", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
          { id: 79, name: "Kiara Advani", character: "Deepika / Saachi", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 80, name: "S.J. Suryah", character: "Bobbili Mopidevi", profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Shankar", job: "Director" }, { name: "Thaman S", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "ChiruFan", rating: 7, content: "Shankar's visuals are spectacular. Ram Charan delivers on mass appeal, even if the story is familiar.", date: "2025-01-11" }
      ]
    },
    {
      id: 888006,
      title: "Dragon",
      tagline: "Legend Never Dies.",
      overview: "A highly-skilled mercenary who lost everything embarks on a path of vengeance and redemption after uncovering a global conspiracy that stretches across continents.",
      backdrop_path: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.2,
      vote_count: 760,
      release_date: "2025-04-10",
      runtime: 155,
      original_language: "te",
      budget: 25000000,
      revenue: 72000000,
      popularity: 680.2,
      trailer_url: "https://www.youtube.com/embed/NgBoMJy386M",
      genres: [28, 12, 53],
      production_companies: [{ name: "People Media Factory", logo_path: null }],
      omdb: { imdbRating: "7.2", Metascore: "N/A", RottenTomatoes: "72%", Awards: "Summer blockbuster 2025.", BoxOffice: "$5,800,000", Worldwide: "$72,000,000" },
      boxOffice: {
        domestic: 62000000, international: 10000000, worldwide: 72000000, openingWeekend: 36000000,
        dailyTrend: [
          { day: "Fri", amount: 13000000 }, { day: "Sat", amount: 12000000 }, { day: "Sun", amount: 11000000 },
          { day: "Mon", amount: 4000000 }, { day: "Tue", amount: 3500000 }, { day: "Wed", amount: 3000000 }, { day: "Thu", amount: 2500000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 49000000 }, { label: "Week 2", amount: 16000000 }, { label: "Week 3", amount: 5000000 }, { label: "Week 4", amount: 2000000 }]
      },
      credits: {
        cast: [
          { id: 82, name: "Naga Chaitanya", character: "Arjun / Dragon", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 83, name: "Ananya Panday", character: "Priya", profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Parasuram", job: "Director" }, { name: "Thaman S", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "Chaitu4Ever", rating: 7, content: "Naga Chaitanya shows a new action avatar here. The fight choreography is top-notch.", date: "2025-04-11" }
      ]
    },
    {
      id: 888007,
      title: "Sankranthiki Vasthunam",
      tagline: "A New Year, A New Chase.",
      overview: "A retired intelligence officer living a peaceful life in Germany is pulled back into action when a case involving a woman in danger collides with the secrets of his own past.",
      backdrop_path: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=500&auto=format&fit=crop",
      vote_average: 7.8,
      vote_count: 1100,
      release_date: "2025-01-14",
      runtime: 160,
      original_language: "te",
      budget: 20000000,
      revenue: 95000000,
      popularity: 810.7,
      trailer_url: "https://www.youtube.com/embed/Way9Dexny3w",
      genres: [28, 35, 53],
      production_companies: [{ name: "Sithara Entertainments", logo_path: null }],
      omdb: { imdbRating: "7.8", Metascore: "N/A", RottenTomatoes: "89%", Awards: "Huge Sankranthi blockbuster 2025.", BoxOffice: "$6,000,000", Worldwide: "$95,000,000" },
      boxOffice: {
        domestic: 82000000, international: 13000000, worldwide: 95000000, openingWeekend: 46000000,
        dailyTrend: [
          { day: "Fri", amount: 16000000 }, { day: "Sat", amount: 16500000 }, { day: "Sun", amount: 13500000 },
          { day: "Mon", amount: 6000000 }, { day: "Tue", amount: 5000000 }, { day: "Wed", amount: 4000000 }, { day: "Thu", amount: 3500000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 64500000 }, { label: "Week 2", amount: 20000000 }, { label: "Week 3", amount: 7500000 }, { label: "Week 4", amount: 3000000 }]
      },
      credits: {
        cast: [
          { id: 84, name: "Venkatesh Daggubati", character: "Vijay Sai IPS", profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
          { id: 85, name: "Aishwarya Rajesh", character: "Nanditha", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
          { id: 86, name: "Meenakshi Chaudhary", character: "Keerthi", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Anil Ravipudi", job: "Director" }, { name: "Devi Sri Prasad (DSP)", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "VictoryFan", rating: 9, content: "A perfect mass entertainer! Venkatesh is in terrific form and the action-comedy blend is perfectly calibrated.", date: "2025-01-15" }
      ]
    },
    {
      id: 888008,
      title: "Lucky Baskhar",
      tagline: "Ek Baar Ka Moka.",
      overview: "A mild-mannered bank employee stumbles into a massive money laundering scheme and decides to use his insider knowledge to build a perfect crime — transforming from a nobody into an unlikely criminal mastermind.",
      backdrop_path: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1920&auto=format&fit=crop",
      poster_path: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=500&auto=format&fit=crop",
      vote_average: 8.1,
      vote_count: 1450,
      release_date: "2024-10-31",
      runtime: 145,
      original_language: "te",
      budget: 12000000,
      revenue: 68000000,
      popularity: 740.6,
      trailer_url: "https://www.youtube.com/embed/uYPbbksJxIg",
      genres: [80, 53, 18],
      production_companies: [{ name: "Sithara Entertainments", logo_path: null }],
      omdb: { imdbRating: "8.1", Metascore: "N/A", RottenTomatoes: "91%", Awards: "Critically acclaimed blockbuster. Best Telugu film of 2024 by many critics.", BoxOffice: "$4,200,000", Worldwide: "$68,000,000" },
      boxOffice: {
        domestic: 58000000, international: 10000000, worldwide: 68000000, openingWeekend: 28000000,
        dailyTrend: [
          { day: "Fri", amount: 10000000 }, { day: "Sat", amount: 9500000 }, { day: "Sun", amount: 8500000 },
          { day: "Mon", amount: 3500000 }, { day: "Tue", amount: 3000000 }, { day: "Wed", amount: 2500000 }, { day: "Thu", amount: 2000000 }
        ],
        weeklyTrend: [{ label: "Week 1", amount: 39000000 }, { label: "Week 2", amount: 17000000 }, { label: "Week 3", amount: 8000000 }, { label: "Week 4", amount: 4000000 }]
      },
      credits: {
        cast: [
          { id: 87, name: "Dulquer Salmaan", character: "Baskhar", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
          { id: 88, name: "Meenakshi Chaudhary", character: "Padma", profile_path: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" }
        ],
        crew: [{ name: "Venky Atluri", job: "Director" }, { name: "G.V. Prakash Kumar", job: "Original Music Composer" }]
      },
      reviews: [
        { author: "CrimeFilmLover", rating: 9, content: "Dulquer is absolutely magnetic. A perfectly layered crime drama with heart and wit. Telugu cinema's answer to Breaking Bad.", date: "2024-11-01" }
      ]
    }
  ],

  actors: [
    {
      id: 1,
      name: "Timothée Chalamet",
      known_for: "Dune, Wonka, Call Me by Your Name",
      profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      movies: ["Dune: Part Two", "Dune: Part One", "Wonka", "Little Women"]
    },
    {
      id: 2,
      name: "Zendaya",
      known_for: "Dune, Euphoria, Spider-Man: Homecoming",
      profile_path: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop",
      movies: ["Dune: Part Two", "Spider-Man: No Way Home", "Challengers", "Euphoria"]
    },
    {
      id: 6,
      name: "Cillian Murphy",
      known_for: "Oppenheimer, Peaky Blinders, Inception",
      profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
      movies: ["Oppenheimer", "The Dark Knight", "Inception", "Peaky Blinders"]
    },
    {
      id: 5,
      name: "Florence Pugh",
      known_for: "Oppenheimer, Little Women, Midsommar",
      profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      movies: ["Dune: Part Two", "Oppenheimer", "Black Widow", "Midsommar"]
    },
    {
      id: 33,
      name: "Pedro Pascal",
      known_for: "The Last of Us, The Mandalorian, Gladiator II",
      profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
      movies: ["Gladiator II", "The Last of Us", "The Mandalorian", "Game of Thrones"]
    }
  ],

  ottReleases: [
    {
      platform: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      movies: [
        { title: "Devara: Part 1", date: "2026-06-15", poster: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=150&auto=format&fit=crop" },
        { title: "Pushpa 2: The Rule", date: "2026-07-04", poster: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=150&auto=format&fit=crop" },
        { title: "Saripodhaa Sanivaaram", date: "2026-08-12", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=150&auto=format&fit=crop" }
      ]
    },
    {
      platform: "Amazon Prime Video",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
      movies: [
        { title: "Kalki 2898 AD", date: "2026-06-20", poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=150&auto=format&fit=crop" },
        { title: "Guntur Kaaram", date: "2026-07-15", poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=150&auto=format&fit=crop" },
        { title: "Game Changer", date: "2026-08-25", poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=150&auto=format&fit=crop" }
      ]
    },
    {
      platform: "Disney+",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
      movies: [
        { title: "Hanuman", date: "2026-06-25", poster: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=150&auto=format&fit=crop" },
        { title: "Double iSmart", date: "2026-07-28", poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=150&auto=format&fit=crop" }
      ]
    },
    {
      platform: "aha (Telugu)",
      logo: "https://www.aha.video/images/aha-logo.svg",
      movies: [
        { title: "Committee Kurrollu", date: "2026-06-18", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=150&auto=format&fit=crop" },
        { title: "Mathu Vadalara 2", date: "2026-08-01", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=150&auto=format&fit=crop" }
      ]
    },
    {
      platform: "ZEE5 (Telugu)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Zee5_Official_logo.svg",
      movies: [
        { title: "Aay", date: "2026-07-10", poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=150&auto=format&fit=crop" },
        { title: "Tantiram", date: "2026-08-15", poster: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=150&auto=format&fit=crop" }
      ]
    }
  ],

  news: [
    {
      id: 1,
      category: "Movie News",
      headline: "Denis Villeneuve Confirms 'Dune: Messiah' Script is Nearing Completion",
      summary: "Director Denis Villeneuve reveals that progress on the script for the third Dune film is moving faster than expected, hinting at a darker tone and the return of major cast members.",
      content: "Fans of Frank Herbert's epic sci-fi series have reason to celebrate. Director Denis Villeneuve recently revealed that the script for 'Dune: Messiah', the planned third film in his franchise, is nearing completion. In an interview, the filmmaker noted that while he had initially wanted to take a break after the grueling schedule of 'Dune: Part Two', the creative spark had taken hold, and he is eager to return to Arrakis. The script, adapting Herbert's complex 1969 sequel, will explore the consequences of Paul Atreides' rise to power and his tragic destiny.",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
      date: "2026-06-08",
      source: "Hollywood Reporter"
    },
    {
      id: 2,
      category: "Box Office News",
      headline: "Box Office Analysis: Why 'Gladiator II' is Poised for an Opening Weekend Surge",
      summary: "Industry analysts forecast a massive opening weekend for Ridley Scott's highly anticipated Gladiator sequel, pointing to nostalgic draw and high action appeal.",
      content: "Twenty-six years after Russell Crowe's Maximus shook the Colosseum, director Ridley Scott is preparing to bring audiences back to Rome with Gladiator II. Starring Paul Mescal and Pedro Pascal, the sequel is tracking for a massive global debut. Early metrics show high interest across multiple demographics, especially males over 25. High production values, premium IMAX screen bookings, and a starry cast are projected to propel the film to an opening weekend exceeding $90 million domestically, marking one of Ridley Scott's largest debuts.",
      image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop",
      date: "2026-06-07",
      source: "Variety"
    },
    {
      id: 3,
      category: "Celebrity Updates",
      headline: "Zendaya Teases New Directorial Ambitions and Future Creative Ventures",
      summary: "Speaking at a film festival, Zendaya discussed her desire to transition behind the camera, potentially directing an indie drama in the near future.",
      content: "Zendaya continues to expand her footprint in Hollywood. At a recent roundtable, the Emmy-winning actress and style icon spoke passionately about her ambition to direct. 'I've spent years watching incredible directors like Denis Villeneuve and Sam Levinson work on set,' Zendaya said. 'I've basically been going to film school every day of my career. I think my next major step is to direct a small, character-focused indie film that I've been writing.' Her comments have sparked excitement among producers eager to back her project.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop",
      date: "2026-06-06",
      source: "Deadline"
    },
    {
      id: 4,
      category: "OTT News",
      headline: "Streaming Wars: Netflix and Disney+ Go Head-to-Head with Blockbuster Summer Lineups",
      summary: "A breakdown of the highly anticipated streaming releases coming to major OTT platforms this summer, including blockbuster movies making their small screen debuts.",
      content: "The battle for subscribers is heating up as summer arrives. Netflix is preparing to launch major action sequels like 'Extraction 3', while Disney+ will host Pixar's record-breaking 'Inside Out 2' and Marvel's 'Deadpool & Wolverine'. This aggressive release schedule signifies a return to high-budget direct-to-streaming blockbusters, aiming to retain audiences as physical theatrical windows continue to adapt.",
      image: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?q=80&w=600&auto=format&fit=crop",
      date: "2026-06-05",
      source: "Streaming Today"
    }
  ],

  boxOfficeReports: {
    worldwideChart: [
      { rank: 1, title: "Avatar: The Way of Water", year: 2022, revenue: 2320250281, studio: "20th Century" },
      { rank: 2, title: "Barbie", year: 2023, revenue: 1445638421, studio: "Warner Bros." },
      { rank: 3, title: "The Dark Knight", year: 2008, revenue: 1004558444, studio: "Warner Bros." },
      { rank: 4, title: "Oppenheimer", year: 2023, revenue: 975000000, studio: "Universal" },
      { rank: 5, title: "The Batman", year: 2022, revenue: 772000000, studio: "Warner Bros." },
      { rank: 6, title: "Dune: Part Two", year: 2024, revenue: 712000000, studio: "Legendary" },
      { rank: 7, title: "Interstellar", year: 2014, revenue: 701729206, studio: "Paramount" },
      { rank: 8, title: "Spider-Man: Across the Spider-Verse", year: 2023, revenue: 690897215, studio: "Sony" }
    ],
    domesticChart: [
      { rank: 1, title: "Avatar: The Way of Water", revenue: 684075767 },
      { rank: 2, title: "Barbie", revenue: 636238421 },
      { rank: 3, title: "The Dark Knight", revenue: 534858444 },
      { rank: 4, title: "Spider-Man: Across the Spider-Verse", revenue: 381311319 },
      { rank: 5, title: "The Batman", revenue: 369345583 },
      { rank: 6, title: "Oppenheimer", revenue: 329865000 },
      { rank: 7, title: "Dune: Part Two", revenue: 282144305 },
      { rank: 8, title: "Interstellar", revenue: 188020017 }
    ],
    openingWeekendChart: [
      { rank: 1, title: "Barbie", opening: 162022044 },
      { rank: 2, title: "The Dark Knight", opening: 158411483 },
      { rank: 3, title: "Avatar: The Way of Water", opening: 134100226 },
      { rank: 4, title: "The Batman", opening: 134005141 },
      { rank: 5, title: "Spider-Man: Across the Spider-Verse", opening: 120663589 },
      { rank: 6, title: "Dune: Part Two", opening: 82505391 },
      { rank: 7, title: "Oppenheimer", opening: 82455420 },
      { rank: 8, title: "Interstellar", opening: 47510360 }
    ],
    weeklyCollections: [
      { week: "Week 1", "Barbie": 258, "Oppenheimer": 125, "Dune: Part Two": 111, "Avatar 2": 268 },
      { week: "Week 2", "Barbie": 155, "Oppenheimer": 90, "Dune: Part Two": 75, "Avatar 2": 185 },
      { week: "Week 3", "Barbie": 95, "Oppenheimer": 60, "Dune: Part Two": 46, "Avatar 2": 145 },
      { week: "Week 4", "Barbie": 65, "Oppenheimer": 40, "Dune: Part Two": 28, "Avatar 2": 98 },
      { week: "Week 5", "Barbie": 40, "Oppenheimer": 25, "Dune: Part Two": 15, "Avatar 2": 72 }
    ]
  }
};

// Restrict to Tollywood (Telugu) only
mockData.movies = mockData.movies.filter(m => m.original_language === 'te');

// Update actors to Tollywood stars
mockData.actors = [
  {
    id: 70,
    name: "Prabhas",
    known_for: "Baahubali, Kalki 2898-AD, Salaar",
    profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    movies: ["Kalki 2898-AD", "Baahubali 2: The Conclusion", "Salaar"]
  },
  {
    id: 41,
    name: "Ram Charan",
    known_for: "RRR, Game Changer, Rangasthalam",
    profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    movies: ["RRR", "Game Changer", "Peddi"]
  },
  {
    id: 40,
    name: "N.T. Rama Rao Jr.",
    known_for: "RRR, Devara, Temper",
    profile_path: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    movies: ["RRR", "Devara: Part 1"]
  },
  {
    id: 76,
    name: "Allu Arjun",
    known_for: "Pushpa: The Rise, Pushpa 2: The Rule, Ala Vaikunthapurramuloo",
    profile_path: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
    movies: ["Pushpa 2: The Rule", "Pushpa: The Rise"]
  },
  {
    id: 87,
    name: "Dulquer Salmaan",
    known_for: "Lucky Baskhar, Sita Ramam, Mahanati",
    profile_path: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop",
    movies: ["Lucky Baskhar"]
  }
];

// Update boxOfficeReports to Tollywood blockbusters
mockData.boxOfficeReports = {
  worldwideChart: [
    { rank: 1, title: "Baahubali 2: The Conclusion", year: 2017, revenue: 278000000, studio: "Arka Media Works" },
    { rank: 2, title: "Kalki 2898-AD", year: 2024, revenue: 210000000, studio: "Vyjayanthi Movies" },
    { rank: 3, title: "RRR", year: 2022, revenue: 160000000, studio: "DVV Entertainment" },
    { rank: 4, title: "Pushpa 2: The Rule", year: 2024, revenue: 340000000, studio: "Mythri Movie Makers" },
    { rank: 5, title: "Sankranthiki Vasthunam", year: 2025, revenue: 95000000, studio: "Sithara Entertainments" },
    { rank: 6, title: "Devara: Part 1", year: 2024, revenue: 86000000, studio: "Yuvasudha Arts" },
    { rank: 7, title: "Dragon", year: 2025, revenue: 72000000, studio: "People Media Factory" },
    { rank: 8, title: "Lucky Baskhar", year: 2024, revenue: 68000000, studio: "Sithara Entertainments" }
  ],
  domesticChart: [
    { rank: 1, title: "Pushpa 2: The Rule", revenue: 290000000 },
    { rank: 2, title: "Baahubali 2: The Conclusion", revenue: 220000000 },
    { rank: 3, title: "Kalki 2898-AD", revenue: 170000000 },
    { rank: 4, title: "Sankranthiki Vasthunam", revenue: 82000000 },
    { rank: 5, title: "Devara: Part 1", revenue: 70000000 },
    { rank: 6, title: "Dragon", revenue: 62000000 },
    { rank: 7, title: "Lucky Baskhar", revenue: 58000000 },
    { rank: 8, title: "Game Changer", revenue: 52000000 }
  ],
  openingWeekendChart: [
    { rank: 1, title: "Pushpa 2: The Rule", opening: 165000000 },
    { rank: 2, title: "Baahubali 2: The Conclusion", opening: 101000000 },
    { rank: 3, title: "Kalki 2898-AD", opening: 95000000 },
    { rank: 4, title: "RRR", opening: 95000000 },
    { rank: 5, title: "Sankranthiki Vasthunam", opening: 46000000 },
    { rank: 6, title: "Devara: Part 1", opening: 42000000 },
    { rank: 7, title: "Dragon", opening: 36000000 },
    { rank: 8, title: "Game Changer", opening: 32000000 }
  ],
  weeklyCollections: [
    { week: "Week 1", "Pushpa 2": 232, "Kalki 2898-AD": 134, "Devara": 56.5, "Peddi": 38 },
    { week: "Week 2", "Pushpa 2": 62, "Kalki 2898-AD": 45, "Devara": 18, "Peddi": 12 },
    { week: "Week 3", "Pushpa 2": 28, "Kalki 2898-AD": 20, "Devara": 8, "Peddi": 5 },
    { week: "Week 4", "Pushpa 2": 18, "Kalki 2898-AD": 11, "Devara": 3.5, "Peddi": 2 }
  ]
};

// Make it available globally in static environment
window.mockData = mockData;
console.log("Mock data initialized successfully with Tollywood restrictions!");
