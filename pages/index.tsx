import './root_style.css';
import { useState } from 'react';
export default function Home() {
  const [movieGenre, setMovieGenre] = useState('action');
  const [movieDecade, setMovieDecade] = useState('1960s');
  const usedMovies = [];
  const handleButtonClick = async () => {
    const openAiEndpoint = "https://api.openai.com/v1/chat/completions";
    const prompt = `
      You are in the mood for a ${movieGenre} movie the decade of the ${movieDecade} please consider every year in the decade. 
      Give me a single movie that fits this description. and give it to me as a single hash with the keys "title" and "year".
      dont say anything else, only give me that hash with the two items inside of it. It also cant be one of these movies: ${usedMovies}.
      so give me like { "title": "The Matrix", "year": 1999 } or something like that. NOTHING ELSE
      }
    `;
    const response = await fetch(openAiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          { 
            "role": "user",
            "content": prompt
          }
        ]
      })
    });
    const data = await response.json();
    const movie = JSON.parse(data.choices[0].message.content);
    const movieTitle = movie.title;
    const movieYear = String(movie.year);
    usedMovies.push(movieTitle);
    console.log(movieTitle, movieYear);

    const omdbKey = "91bc5109";
    const omdbEndpoint = `http://www.omdbapi.com/?apikey=${omdbKey}&t=${movieTitle}&y=${movieYear}plot=full`;

    const omdbResponse = await fetch(omdbEndpoint);
    const omdbData = await omdbResponse.json();

    const movieDisplaySection = document.getElementById('movie-display-section');
    const movieDisplayHeader = document.getElementById('movie-display-header');
    const movieDisplayYear = document.getElementById('movie-display-year');
    const movieDisplayPoster = document.getElementById('movie-display-poster');
    const movieDisplayPlot = document.getElementById('movie-display-plot');
    movieDisplayHeader.textContent = movieTitle;
    movieDisplayYear.textContent = movieYear;
    movieDisplayPoster.src = omdbData.Poster;
    movieDisplayPlot.textContent = omdbData.Plot;
    movieDisplaySection.style.visibility = 'visible';
  };
  return (
    <div id="main-section">
      <div id="container">
        <div id="movie-query-section">
          <h1 id="movie-query-header">What type of movie are you feeling?</h1>
          <select id="movie-genre" value={movieGenre} onChange={(e) => setMovieGenre(e.target.value)}>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-Fi</option>
          </select>
          <select id="movie-decade" value={movieDecade} onChange={(e) => setMovieDecade(e.target.value)}>
            <option value="1960s">1960s</option>
            <option value="1970s">1970s</option>
            <option value="1980s">1980s</option>
            <option value="1990s">1990s</option>
            <option value="2000s">2000s</option>
            <option value="2010s">2010s</option>
            <option value="2020s">2020s</option>
          </select>
          <button onClick={handleButtonClick} id="movie-query-button">Find my movie!</button>
        </div>
        <div id="movie-display-section">
          <h3 id="movie-display-header"></h3>
          <h4 id="movie-display-year"></h4>
          <img id="movie-display-poster" src="" alt="Movie Poster" />
          <h4 id="movie-display-plot"></h4>
        </div>
      </div>
    </div>
  );
}
