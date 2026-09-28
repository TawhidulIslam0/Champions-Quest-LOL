const getImageUrl = (guess) => guess?.remoteImage || '';

export default function GuessGrid({ guesses }) {
  // Show the newest guess first so every new attempt appears above the previous one.
  const displayedGuesses = [...guesses].reverse();

  return (
    <div className="guess-grid">
      {displayedGuesses.map((guess) => (
        <div key={guess.name} className="guess-row">
          <div className="cell champion-cell" title={guess.name}>
            <img
              src={getImageUrl(guess)}
              alt={guess.name}
              onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
            />
            <span>{guess.name}</span>
          </div>
          <div className={`cell ${guess.genderMatch}`}>{guess.gender}</div>
          <div className={`cell ${guess.positionMatch}`}>{guess.position}</div>
          <div className={`cell ${guess.genreMatch}`}>{guess.genre}</div>
          <div className={`cell ${guess.resMatch}`}>{guess.resource}</div>
          <div className={`cell ${guess.rangeMatch}`}>{guess.rangeType}</div>
          <div className={`cell ${guess.regionMatch}`}>{guess.region}</div>
          <div className={`cell ${guess.yearMatch}`}>{guess.year}</div>
        </div>
      ))}
    </div>
  );
}
