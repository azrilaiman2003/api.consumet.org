import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import fs from 'fs';
import path from 'path';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // API Documentation endpoint
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const docsHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consumet API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 0;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 10px;
        }

        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .nav {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .nav a {
            color: #667eea;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .nav a:hover {
            background-color: #f0f0f0;
        }

        .section {
            background: white;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .section-header {
            background: #667eea;
            color: white;
            padding: 20px;
            font-size: 1.5em;
            font-weight: bold;
        }

        .section-content {
            padding: 30px;
        }

        .endpoint {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .endpoint-header {
            background: #f8f9fa;
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
        }

        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8em;
            margin-right: 10px;
        }

        .method.get {
            background: #d4edda;
            color: #155724;
        }

        .method.post {
            background: #cce7ff;
            color: #004085;
        }

        .url {
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }

        .endpoint-content {
            padding: 20px;
        }

        .parameters {
            margin-top: 15px;
        }

        .parameter {
            background: #f8f9fa;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }

        .param-name {
            font-weight: bold;
            color: #667eea;
        }

        .param-type {
            color: #666;
            font-style: italic;
        }

        .example {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            overflow-x: auto;
        }

        .response-example {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }

        .status-codes {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }

        .status-code {
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }

        .status-200 {
            background: #d4edda;
            color: #155724;
        }

        .status-404 {
            background: #f8d7da;
            color: #721c24;
        }

        .status-500 {
            background: #f8d7da;
            color: #721c24;
        }

        .provider-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .provider-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            background: #fafafa;
        }

        .provider-name {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }

        .provider-routes {
            font-size: 0.9em;
            color: #666;
        }

        .base-url {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            margin: 15px 0;
            text-align: center;
            font-weight: bold;
            color: #1976d2;
        }

        @media (max-width: 768px) {
            .nav ul {
                flex-direction: column;
            }

            .provider-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎯 Consumet API Documentation</h1>
            <p class="subtitle">A comprehensive API for anime, manga, movies, books, and more</p>
        </header>

        <nav class="nav">
            <ul>
                <li><a href="#overview">📋 Overview</a></li>
                <li><a href="#manga">📚 Manga</a></li>
                <li><a href="#anime">🎌 Anime</a></li>
                <li><a href="#movies">🎬 Movies & TV</a></li>
                <li><a href="#books">📖 Books</a></li>
                <li><a href="#light-novels">📚 Light Novels</a></li>
                <li><a href="#news">📰 News</a></li>
                <li><a href="#meta">🔗 Meta</a></li>
                <li><a href="#utils">🛠️ Utils</a></li>
                <li><a href="#examples">💡 Examples</a></li>
                <li><a href="#errors">⚠️ Error Handling</a></li>
            </ul>
        </nav>

        <section id="overview" class="section">
            <div class="section-header">📋 API Overview</div>
            <div class="section-content">
                <div class="base-url">
                    Base URL: ${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}
                </div>
                <p>The Consumet API provides access to various entertainment content including anime, manga, movies, books, and news. All endpoints return JSON responses and support CORS for web applications.</p>

                <h3>Rate Limiting</h3>
                <p>Please be respectful with API usage. Heavy usage may result in temporary restrictions.</p>

                <h3>Response Format</h3>
                <p>All successful responses return JSON data. Error responses include a message field explaining the issue.</p>

                <div class="status-codes">
                    <div class="status-code status-200">200 - Success</div>
                    <div class="status-code status-404">404 - Not Found</div>
                    <div class="status-code status-500">500 - Server Error</div>
                </div>
            </div>
        </section>

                <section id="manga" class="section">
            <div class="section-header">📚 Manga API</div>
            <div class="section-content">
                <p>Access manga content from multiple providers including MangaDex, MangaPill, MangaKakalot, and more.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">MangaDex</div>
                        <div class="provider-routes">
                            /manga/mangadex/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Read: /read/:chapterId<br>
                            • Random: /random<br>
                            • Recent Added: /recent-added<br>
                            • Latest Updates: /latest-updates<br>
                            • Popular: /popular
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MangaPill</div>
                        <div class="provider-routes">
                            /manga/mangapill/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MangaKakalot</div>
                        <div class="provider-routes">
                            /manga/mangakakalot/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id&mangaId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MangaSee123</div>
                        <div class="provider-routes">
                            /manga/mangasee123/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MangaHere</div>
                        <div class="provider-routes">
                            /manga/mangahere/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MangaPark</div>
                        <div class="provider-routes">
                            /manga/mangapark/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MangaReader</div>
                        <div class="provider-routes">
                            /manga/managreader/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/manga/mangadex/:query</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Search for manga on MangaDex</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">query</span> <span class="param-type">(string, required)</span><br>
                                Search term for manga
                            </div>
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                        </div>
                        <div class="example">
GET /manga/mangadex/naruto?page=1
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/manga/mangadex/info/:id</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get detailed information about a specific manga</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">id</span> <span class="param-type">(string, required)</span><br>
                                Manga ID from Mangadex
                            </div>
                        </div>
                        <div class="example">
GET /manga/mangadex/info/46e530ce-0766-4cbd-b005-5e6fb0ba5e71
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/manga/mangadex/read/:chapterId</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get pages for reading a specific chapter</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">chapterId</span> <span class="param-type">(string, required)</span><br>
                                Chapter ID from MangaDex (NOT the manga ID)
                            </div>
                        </div>
                        <div class="example">
GET /manga/mangadex/read/1209ee25-793c-4fe5-bd2a-2a1e6c882509
                        </div>
                        <div class="response-example">
                            <strong>Response Example:</strong>
                            <pre>{
  "pages": [
    {
      "img": "https://uploads.mangadex.org/data/...",
      "page": 1
    }
  ]
}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

                <section id="anime" class="section">
            <div class="section-header">🎌 Anime API</div>
            <div class="section-content">
                <p>Access anime content from multiple providers including GogoAnime, Zoro, 9Anime, and more.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">GogoAnime</div>
                        <div class="provider-routes">
                            /anime/gogoanime/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Watch: /watch/:episodeId<br>
                            • Servers: /servers/:episodeId<br>
                            • Genre: /genre/:genre<br>
                            • Top Airing: /top-airing<br>
                            • Movies: /movies<br>
                            • Popular: /popular<br>
                            • Recent: /recent-episodes
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Zoro</div>
                        <div class="provider-routes">
                            /anime/zoro/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id<br>
                            • Servers: /servers?episodeId=:id<br>
                            • Recent: /recent-episodes<br>
                            • Top Airing: /top-airing
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">9Anime</div>
                        <div class="provider-routes">
                            /anime/9anime/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id<br>
                            • Servers: /servers?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">AnimePahe</div>
                        <div class="provider-routes">
                            /anime/animepahe/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Anix</div>
                        <div class="provider-routes">
                            /anime/anix/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id<br>
                            • Recent: /recent-episodes
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Crunchyroll</div>
                        <div class="provider-routes">
                            /anime/crunchyroll/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Bilibili</div>
                        <div class="provider-routes">
                            /anime/bilibili/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">AnimeFox</div>
                        <div class="provider-routes">
                            /anime/animefox/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">AnimeKai</div>
                        <div class="provider-routes">
                            /anime/animekai/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Watch: /watch/:episodeId<br>
                            • Popular: /popular<br>
                            • Recent: /recent
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Marin</div>
                        <div class="provider-routes">
                            /anime/marin/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Anify</div>
                        <div class="provider-routes">
                            /anime/anify/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/anime/gogoanime/:query</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Search for anime on GogoAnime</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">query</span> <span class="param-type">(string, required)</span><br>
                                Search term for anime
                            </div>
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                        </div>
                        <div class="example">
GET /anime/gogoanime/naruto?page=1
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/anime/gogoanime/info/:id</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get detailed information about a specific anime</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">id</span> <span class="param-type">(string, required)</span><br>
                                Anime ID from GogoAnime
                            </div>
                        </div>
                        <div class="example">
GET /anime/gogoanime/info/naruto-dub
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/anime/gogoanime/watch/:episodeId</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get streaming sources for a specific episode</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">episodeId</span> <span class="param-type">(string, required)</span><br>
                                Episode ID from GogoAnime
                            </div>
                            <div class="parameter">
                                <span class="param-name">server</span> <span class="param-type">(string, optional)</span><br>
                                Streaming server (vidstreaming, gogo, streamsb, etc.)
                            </div>
                        </div>
                        <div class="example">
GET /anime/gogoanime/watch/naruto-dub-episode-1?server=vidstreaming
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/anime/gogoanime/top-airing</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get currently airing anime</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                        </div>
                        <div class="example">
GET /anime/gogoanime/top-airing?page=1
                        </div>
                    </div>
                </div>
            </div>
        </section>

                <section id="movies" class="section">
            <div class="section-header">🎬 Movies & TV Shows API</div>
            <div class="section-content">
                <p>Access movie and TV show content from various providers including FlixHQ, Goku, SFlix, and more.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">FlixHQ</div>
                        <div class="provider-routes">
                            /movies/flixhq/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id&mediaId=:id<br>
                            • Servers: /servers?episodeId=:id&mediaId=:id<br>
                            • Trending: /trending<br>
                            • Recent Movies: /recent-movies<br>
                            • Recent Shows: /recent-shows<br>
                            • Country: /country/:country<br>
                            • Genre: /genre/:genre
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">Goku</div>
                        <div class="provider-routes">
                            /movies/goku/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id&mediaId=:id<br>
                            • Servers: /servers?episodeId=:id&mediaId=:id<br>
                            • Recent Movies: /recent-movies<br>
                            • Recent Shows: /recent-shows
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">SFlix</div>
                        <div class="provider-routes">
                            /movies/sflix/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id&mediaId=:id<br>
                            • Recent Movies: /recent-movies<br>
                            • Recent Shows: /recent-shows
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MoviesHD</div>
                        <div class="provider-routes">
                            /movies/movieshd/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id&mediaId=:id<br>
                            • Servers: /servers?episodeId=:id&mediaId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">FMovies</div>
                        <div class="provider-routes">
                            /movies/fmovies/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id&mediaId=:id<br>
                            • Recent: /recent
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MultiMovies</div>
                        <div class="provider-routes">
                            /movies/multimovies/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">DramaCool</div>
                        <div class="provider-routes">
                            /movies/dramacool/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id&mediaId=:id<br>
                            • Popular: /popular<br>
                            • Recent: /recent
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">ViewAsian</div>
                        <div class="provider-routes">
                            /movies/viewasian/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Watch: /watch?episodeId=:id
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/movies/flixhq/:query</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Search for movies and TV shows on FlixHQ</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">query</span> <span class="param-type">(string, required)</span><br>
                                Search term for movies/shows
                            </div>
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                        </div>
                        <div class="example">
GET /movies/flixhq/avengers?page=1
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/movies/flixhq/info</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get detailed information about a specific movie or TV show</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">id</span> <span class="param-type">(string, required)</span><br>
                                Movie/TV show ID from FlixHQ
                            </div>
                        </div>
                        <div class="example">
GET /movies/flixhq/info?id=movie/watch-avengers-endgame-39408
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/movies/flixhq/watch</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get streaming sources for a specific episode/movie</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">episodeId</span> <span class="param-type">(string, required)</span><br>
                                Episode ID from FlixHQ
                            </div>
                            <div class="parameter">
                                <span class="param-name">mediaId</span> <span class="param-type">(string, required)</span><br>
                                Media ID from FlixHQ
                            </div>
                            <div class="parameter">
                                <span class="param-name">server</span> <span class="param-type">(string, optional)</span><br>
                                Streaming server preference
                            </div>
                        </div>
                        <div class="example">
GET /movies/flixhq/watch?episodeId=1122333&mediaId=movie/watch-avengers-endgame-39408
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/movies/flixhq/trending</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get trending movies and TV shows</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">type</span> <span class="param-type">(string, optional)</span><br>
                                Content type: 'movie' or 'tv' (default: both)
                            </div>
                        </div>
                        <div class="example">
GET /movies/flixhq/trending?type=movie
                        </div>
                    </div>
                </div>
            </div>
        </section>

                <section id="books" class="section">
            <div class="section-header">📖 Books API</div>
            <div class="section-content">
                <p>Access book content from providers like LibGen for downloading academic and general books.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">LibGen</div>
                        <div class="provider-routes">
                            /books/libgen/<br>
                            • Search: /:query<br>
                            • Download: /download/:id
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/books/libgen/:query</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Search for books on LibGen</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">query</span> <span class="param-type">(string, required)</span><br>
                                Search term for books (title, author, ISBN, etc.)
                            </div>
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                        </div>
                        <div class="example">
GET /books/libgen/javascript?page=1
                        </div>
                        <div class="response-example">
                            <strong>Response Example:</strong>
                            <pre>{
  "currentPage": 1,
  "hasNextPage": true,
  "results": [
    {
      "id": "123456",
      "title": "JavaScript: The Good Parts",
      "author": "Douglas Crockford",
      "publisher": "O'Reilly Media",
      "year": "2008",
      "pages": "176",
      "language": "English",
      "size": "2.1 MB",
      "format": "PDF",
      "image": "https://...",
      "download": "https://..."
    }
  ]
}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="light-novels" class="section">
            <div class="section-header">📚 Light Novels API</div>
            <div class="section-content">
                <p>Access light novel content from various providers for reading Japanese light novels.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">ReadLightNovels</div>
                        <div class="provider-routes">
                            /light-novels/readlightnovels/<br>
                            • Search: /:query<br>
                            • Info: /info?id=:id<br>
                            • Read: /read?chapterId=:id
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/light-novels/readlightnovels/:query</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Search for light novels</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">query</span> <span class="param-type">(string, required)</span><br>
                                Search term for light novels
                            </div>
                        </div>
                        <div class="example">
GET /light-novels/readlightnovels/overlord
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/light-novels/readlightnovels/info</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get detailed information about a light novel</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">id</span> <span class="param-type">(string, required)</span><br>
                                Light novel ID
                            </div>
                        </div>
                        <div class="example">
GET /light-novels/readlightnovels/info?id=overlord-wn
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/light-novels/readlightnovels/read</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Read a specific chapter of a light novel</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">chapterId</span> <span class="param-type">(string, required)</span><br>
                                Chapter ID to read
                            </div>
                        </div>
                        <div class="example">
GET /light-novels/readlightnovels/read?chapterId=overlord-wn-chapter-1
                        </div>
                    </div>
                </div>
            </div>
        </section>

                <section id="news" class="section">
            <div class="section-header">📰 News API</div>
            <div class="section-content">
                <p>Get latest anime and manga news from various news providers.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">Anime News Network</div>
                        <div class="provider-routes">
                            /news/ann/<br>
                            • Recent News: /recent-feeds<br>
                            • News Info: /info?id=:id
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/news/ann/recent-feeds</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get latest anime and manga news from Anime News Network</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">topic</span> <span class="param-type">(string, optional)</span><br>
                                News topic filter (anime, manga, industry, etc.)
                            </div>
                        </div>
                        <div class="example">
GET /news/ann/recent-feeds?topic=anime
                        </div>
                        <div class="response-example">
                            <strong>Response Example:</strong>
                            <pre>{
  "results": [
    {
      "id": "news-12345",
      "title": "New Anime Season Announced",
      "summary": "Popular manga series getting anime adaptation...",
      "thumbnail": "https://...",
      "url": "https://...",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "topics": ["anime", "adaptation"]
    }
  ]
}</pre>
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/news/ann/info</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get detailed information about a specific news article</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">id</span> <span class="param-type">(string, required)</span><br>
                                News article ID
                            </div>
                        </div>
                        <div class="example">
GET /news/ann/info?id=news-12345
                        </div>
                    </div>
                </div>
            </div>
        </section>

                <section id="meta" class="section">
            <div class="section-header">🔗 Meta API</div>
            <div class="section-content">
                <p>Enhanced metadata and information aggregation from multiple sources including AniList, MAL, and TMDB.</p>

                <div class="provider-grid">
                    <div class="provider-card">
                        <div class="provider-name">AniList (Anime)</div>
                        <div class="provider-routes">
                            /meta/anilist/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Watch: /watch/:episodeId<br>
                            • Advanced Search: /advanced-search<br>
                            • Character: /character/:id<br>
                            • Random: /random-anime<br>
                            • Trending: /trending<br>
                            • Popular: /popular<br>
                            • Airing: /airing-schedule
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">AniList (Manga)</div>
                        <div class="provider-routes">
                            /meta/anilist-manga/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Read: /read?chapterId=:id<br>
                            • Advanced Search: /advanced-search<br>
                            • Character: /character/:id<br>
                            • Random: /random-manga<br>
                            • Trending: /trending<br>
                            • Popular: /popular
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">MyAnimeList</div>
                        <div class="provider-routes">
                            /meta/mal/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Watch: /watch/:episodeId<br>
                            • Top: /top<br>
                            • Season: /season/:year/:season
                        </div>
                    </div>
                    <div class="provider-card">
                        <div class="provider-name">TMDB</div>
                        <div class="provider-routes">
                            /meta/tmdb/<br>
                            • Search: /:query<br>
                            • Info: /info/:id<br>
                            • Trending: /trending<br>
                            • Popular: /popular<br>
                            • Top Rated: /top-rated
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/meta/anilist/:query</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Search for anime using AniList metadata</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">query</span> <span class="param-type">(string, required)</span><br>
                                Search term for anime
                            </div>
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                            <div class="parameter">
                                <span class="param-name">perPage</span> <span class="param-type">(number, optional)</span><br>
                                Results per page (default: 20)
                            </div>
                        </div>
                        <div class="example">
GET /meta/anilist/demon-slayer?page=1&perPage=20
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/meta/anilist/info/:id</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get detailed anime information from AniList</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">id</span> <span class="param-type">(string, required)</span><br>
                                AniList anime ID
                            </div>
                            <div class="parameter">
                                <span class="param-name">provider</span> <span class="param-type">(string, optional)</span><br>
                                Streaming provider preference
                            </div>
                        </div>
                        <div class="example">
GET /meta/anilist/info/21459?provider=gogoanime
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/meta/anilist/trending</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Get trending anime from AniList</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">page</span> <span class="param-type">(number, optional)</span><br>
                                Page number (default: 1)
                            </div>
                            <div class="parameter">
                                <span class="param-name">perPage</span> <span class="param-type">(number, optional)</span><br>
                                Results per page (default: 20)
                            </div>
                        </div>
                        <div class="example">
GET /meta/anilist/trending?page=1&perPage=10
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="utils" class="section">
            <div class="section-header">🛠️ Utility APIs</div>
            <div class="section-content">
                <p>Utility endpoints for various helper functions and tools.</p>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get">GET</span>
                        <span class="url">/utils/cors-proxy</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> CORS proxy for accessing external resources</p>
                        <div class="parameters">
                            <div class="parameter">
                                <span class="param-name">url</span> <span class="param-type">(string, required)</span><br>
                                URL to proxy through CORS
                            </div>
                        </div>
                        <div class="example">
GET /utils/cors-proxy?url=https://example.com/api/data
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="errors" class="section">
            <div class="section-header">⚠️ Error Handling</div>
            <div class="section-content">
                <p>Understanding API errors and how to handle them properly.</p>

                <h3>Common Error Responses</h3>
                <div class="status-codes">
                    <div class="status-code status-400" style="background: #fff3cd; color: #856404;">400 - Bad Request</div>
                    <div class="status-code status-404">404 - Not Found</div>
                    <div class="status-code status-429" style="background: #f8d7da; color: #721c24;">429 - Too Many Requests</div>
                    <div class="status-code status-500">500 - Internal Server Error</div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header">
                        <span class="method get" style="background: #f8d7da; color: #721c24;">ERROR</span>
                        <span class="url">Error Response Format</span>
                    </div>
                    <div class="endpoint-content">
                        <p><strong>Description:</strong> Standard error response structure</p>
                        <div class="response-example">
                            <strong>Error Response Example:</strong>
                            <pre>{
  "message": "Something went wrong. Please try again later.",
  "error": "page not found",
  "statusCode": 404
}</pre>
                        </div>
                    </div>
                </div>

                <h3>Error Handling Best Practices</h3>
                <div class="response-example">
                    <strong>JavaScript Error Handling:</strong>
                    <pre>async function fetchAnime(query) {
  try {
    const response = await fetch('/anime/gogoanime/' + query);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching anime:', error);
    // Handle error appropriately
    return null;
  }
}</pre>
                </div>

                <h3>Rate Limiting</h3>
                <p>To ensure fair usage, the API implements rate limiting. If you exceed the rate limits, you'll receive a 429 status code. Please implement appropriate retry logic with exponential backoff.</p>

                <div class="response-example">
                    <strong>Rate Limiting Headers:</strong>
                    <pre>X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200</pre>
                </div>
            </div>
        </section>

        <section id="examples" class="section">
            <div class="section-header">💡 Usage Examples</div>
            <div class="section-content">
                <h3>JavaScript/Fetch Example</h3>
                <div class="example">
// Search for manga
fetch('${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/naruto')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get manga info
fetch('${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/info/46e530ce-0766-4cbd-b005-5e6fb0ba5e71')
  .then(response => response.json())
  .then(data => console.log(data));

// Read chapter pages
fetch('${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/read/1209ee25-793c-4fe5-bd2a-2a1e6c882509')
  .then(response => response.json())
  .then(data => console.log(data));
                </div>

                <h3>Python Example</h3>
                <div class="example">
import requests

# Search for manga
response = requests.get('${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/naruto')
data = response.json()
print(data)

# Get chapter pages
response = requests.get('${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/read/1209ee25-793c-4fe5-bd2a-2a1e6c882509')
pages = response.json()
for page in pages:
    print(f"Page {page['page']}: {page['img']}")
                </div>

                                <h3>React/Next.js Example</h3>
                <div class="example">
// hooks/useAnime.js
import { useState, useEffect } from 'react';

export function useAnime(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchAnime = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(\`/anime/gogoanime/\${query}\`);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [query]);

  return { data, loading, error };
}

// components/AnimeSearch.jsx
import { useAnime } from '../hooks/useAnime';

export default function AnimeSearch() {
  const [query, setQuery] = useState('');
  const { data, loading, error } = useAnime(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anime..."
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          {data.results.map(anime => (
            <div key={anime.id}>
              <h3>{anime.title}</h3>
              <img src={anime.image} alt={anime.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
                </div>

                <h3>Node.js/Express Backend Example</h3>
                <div class="example">
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

// Anime search endpoint
app.get('/api/anime/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(
      \`${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/anime/gogoanime/\${query}?page=\${page}\`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching anime:', error);
    res.status(500).json({
      error: 'Failed to fetch anime data',
      message: error.message
    });
  }
});

// Get anime info
app.get('/api/anime/info/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      \`${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/anime/gogoanime/info/\${id}\`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anime info' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
                </div>

                <h3>cURL Examples</h3>
                <div class="example">
# Search for anime
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/anime/gogoanime/naruto"

# Get anime information
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/anime/gogoanime/info/naruto-dub"

# Get episode streaming sources
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/anime/gogoanime/watch/naruto-dub-episode-1"

# Search manga
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/one-piece"

# Get manga chapter pages
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/manga/mangadex/read/1209ee25-793c-4fe5-bd2a-2a1e6c882509"

# Search movies
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/movies/flixhq/avengers"

# Get trending from AniList
curl "${process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000'}/meta/anilist/trending"
                </div>

                <h3>Common Issues & Solutions</h3>
                <div class="response-example">
                    <strong>Issue 1:</strong> Getting "page not found" error for manga read endpoint<br>
                    <strong>Solution:</strong> Make sure you're using only the chapter ID, not the manga ID + chapter ID<br><br>

                    ❌ <strong>Wrong:</strong> /manga/mangadex/read/46e530ce-0766-4cbd-b005-5e6fb0ba5e71/1209ee25-793c-4fe5-bd2a-2a1e6c882509<br>
                    ✅ <strong>Correct:</strong> /manga/mangadex/read/1209ee25-793c-4fe5-bd2a-2a1e6c882509<br><br>

                    <strong>Issue 2:</strong> CORS errors when accessing from browser<br>
                    <strong>Solution:</strong> Use the API from a server-side application or use a CORS proxy<br><br>

                    <strong>Issue 3:</strong> 429 Too Many Requests error<br>
                    <strong>Solution:</strong> Implement rate limiting in your application and add delays between requests<br><br>

                    <strong>Issue 4:</strong> Episodes/chapters not loading<br>
                    <strong>Solution:</strong> Try different providers as some may be temporarily unavailable
                </div>
            </div>
        </section>

        <footer style="text-align: center; padding: 40px 0; color: #666;">
            <p>Made with ❤️ by the Consumet Team</p>
            <p>For more information, visit <a href="https://github.com/consumet/consumet.ts" style="color: #667eea;">GitHub</a></p>
        </footer>
    </div>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add copy to clipboard functionality for code examples
        document.querySelectorAll('.example').forEach(example => {
            example.style.position = 'relative';
            example.style.cursor = 'pointer';
            example.title = 'Click to copy';

            example.addEventListener('click', function() {
                navigator.clipboard.writeText(this.textContent.trim()).then(() => {
                    const original = this.style.backgroundColor;
                    this.style.backgroundColor = '#4caf50';
                    setTimeout(() => {
                        this.style.backgroundColor = original;
                    }, 200);
                });
            });
        });
    </script>
</body>
</html>`;

      return reply.type('text/html').send(docsHtml);
    } catch (error) {
      return reply.status(500).send({
        message: 'Could not load documentation',
        error: (error as Error).message
      });
    }
  });

  // API endpoints info in JSON format
  fastify.get('/json', async (request: FastifyRequest, reply: FastifyReply) => {
    const apiDocs = {
      title: 'Consumet API Documentation',
      version: '2.0.0',
      description: 'A comprehensive API for anime, manga, movies, books, light novels, and news',
      baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.consumet.org' : 'http://localhost:3000',
      documentation: '/docs',
      endpoints: {
        manga: {
          providers: ['mangadex', 'mangapill', 'mangakakalot', 'mangasee123', 'mangahere', 'mangapark', 'managreader'],
          routes: {
            search: '/:provider/:query',
            info: '/:provider/info/:id',
            read: '/:provider/read/:chapterId'
          },
          description: 'Access manga content from multiple providers'
        },
        anime: {
          providers: ['gogoanime', 'zoro', '9anime', 'animepahe', 'anix', 'crunchyroll', 'bilibili', 'animefox', 'animekai', 'marin', 'anify'],
          routes: {
            search: '/:provider/:query',
            info: '/:provider/info/:id',
            watch: '/:provider/watch/:episodeId',
            servers: '/:provider/servers/:episodeId',
            topAiring: '/:provider/top-airing',
            popular: '/:provider/popular',
            recent: '/:provider/recent-episodes'
          },
          description: 'Access anime content from multiple providers'
        },
        movies: {
          providers: ['flixhq', 'goku', 'sflix', 'movieshd', 'fmovies', 'multimovies', 'dramacool', 'viewasian'],
          routes: {
            search: '/:provider/:query',
            info: '/:provider/info',
            watch: '/:provider/watch',
            servers: '/:provider/servers',
            trending: '/:provider/trending',
            recentMovies: '/:provider/recent-movies',
            recentShows: '/:provider/recent-shows',
            country: '/:provider/country/:country',
            genre: '/:provider/genre/:genre'
          },
          description: 'Access movie and TV show content'
        },
        books: {
          providers: ['libgen'],
          routes: {
            search: '/:provider/:query',
            download: '/:provider/download/:id'
          },
          description: 'Access book content for download'
        },
        lightNovels: {
          providers: ['readlightnovels'],
          routes: {
            search: '/:provider/:query',
            info: '/:provider/info',
            read: '/:provider/read'
          },
          description: 'Access light novel content'
        },
        news: {
          providers: ['ann'],
          routes: {
            recentFeeds: '/:provider/recent-feeds',
            info: '/:provider/info'
          },
          description: 'Get latest anime and manga news'
        },
        meta: {
          providers: ['anilist', 'anilist-manga', 'mal', 'tmdb'],
          routes: {
            search: '/:provider/:query',
            info: '/:provider/info/:id',
            watch: '/:provider/watch/:episodeId',
            read: '/:provider/read',
            trending: '/:provider/trending',
            popular: '/:provider/popular',
            advancedSearch: '/:provider/advanced-search',
            character: '/:provider/character/:id',
            random: '/:provider/random-anime'
          },
          description: 'Enhanced metadata from multiple sources'
        },
        utils: {
          routes: {
            corsProxy: '/utils/cors-proxy'
          },
          description: 'Utility endpoints and tools'
        }
      },
      examples: {
        manga: {
          search: '/manga/mangadex/naruto',
          info: '/manga/mangadex/info/46e530ce-0766-4cbd-b005-5e6fb0ba5e71',
          read: '/manga/mangadex/read/1209ee25-793c-4fe5-bd2a-2a1e6c882509'
        },
        anime: {
          search: '/anime/gogoanime/demon-slayer',
          info: '/anime/gogoanime/info/demon-slayer-dub',
          watch: '/anime/gogoanime/watch/demon-slayer-dub-episode-1',
          topAiring: '/anime/gogoanime/top-airing'
        },
        movies: {
          search: '/movies/flixhq/avengers',
          info: '/movies/flixhq/info?id=movie/watch-avengers-endgame-39408',
          watch: '/movies/flixhq/watch?episodeId=1122333&mediaId=movie/watch-avengers-endgame-39408',
          trending: '/movies/flixhq/trending'
        },
        meta: {
          search: '/meta/anilist/one-piece',
          info: '/meta/anilist/info/21459',
          trending: '/meta/anilist/trending'
        },
        books: {
          search: '/books/libgen/javascript'
        },
        lightNovels: {
          search: '/light-novels/readlightnovels/overlord'
        },
        news: {
          recent: '/news/ann/recent-feeds'
        }
      },
      statusCodes: {
        200: 'Success',
        400: 'Bad Request - Invalid parameters',
        404: 'Not Found - Resource not available',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error'
      },
      rateLimit: {
        description: 'API implements rate limiting to ensure fair usage',
        headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
      }
    };

    return reply.status(200).send(apiDocs);
  });
};

export default routes;
