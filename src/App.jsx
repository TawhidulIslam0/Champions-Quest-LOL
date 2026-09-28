import { useCallback, useEffect, useMemo, useState } from 'react';
import ChampionInput from './components/ChampionInput';
import GuessGrid from './components/GuessGrid';
import VictoryModal from './components/VictoryModal';
import ClueDeck from './components/ClueDeck';
import championsData from './data/champions.json';
import quotesData from './data/quotes-clean.json';
import './App.css';

const STATS_KEY = 'loldle-game-stats-v1';

const emptyStats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayed: null,
};

const loadStats = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY));
    return saved ? { ...emptyStats, ...saved } : emptyStats;
  } catch {
    return emptyStats;
  }
};

const getArrayMatchStatus = (guessedValue, targetValue) => {
  const guessed = guessedValue
    ? guessedValue.split(',').map((value) => value.trim()).filter(Boolean)
    : [];
  const target = targetValue
    ? targetValue.split(',').map((value) => value.trim()).filter(Boolean)
    : [];

  if (!guessed.length || !target.length) return 'incorrect';
  if (guessed.length === target.length && guessed.every((value) => target.includes(value))) {
    return 'correct';
  }
  return guessed.some((value) => target.includes(value)) ? 'partial' : 'incorrect';
};

const getYearMatch = (guessYear, targetYear) => {
  if (guessYear === targetYear) return 'correct';
  return guessYear < targetYear ? 'incorrect higher' : 'incorrect lower';
};

export default function App() {
  const [targetChampion, setTargetChampion] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [guessedNames, setGuessedNames] = useState(new Set());
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(emptyStats);
  const [showStats, setShowStats] = useState(false);

  const availableChampions = useMemo(
    () => championsData.filter((champion) => !guessedNames.has(champion.name)),
    [guessedNames]
  );

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const chooseTarget = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * championsData.length);
    setTargetChampion(championsData[randomIndex]);
    setGuesses([]);
    setGuessedNames(new Set());
    setIsWon(false);
    setIsGameOver(false);
    setError('');
    setShowStats(false);
  }, []);

  useEffect(() => {
    chooseTarget();
  }, [chooseTarget]);

  const finishGame = useCallback((won) => {
    const today = new Date().toISOString().slice(0, 10);

    setStats((current) => {
      const nextStreak = won ? current.currentStreak + 1 : 0;
      const next = {
        played: current.played + 1,
        wins: current.wins + (won ? 1 : 0),
        currentStreak: nextStreak,
        bestStreak: Math.max(current.bestStreak, nextStreak),
        lastPlayed: today,
      };
      localStorage.setItem(STATS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleGuess = (guessedName) => {
    if (!targetChampion || isGameOver) return;

    const normalized = guessedName.trim().toLowerCase();
    const guessedChamp = championsData.find(
      (champion) => champion.name.toLowerCase() === normalized
    );

    if (!guessedChamp) {
      setError('Choose a champion from the suggestion list.');
      return;
    }

    if (guessedNames.has(guessedChamp.name)) {
      setError('You already guessed that champion.');
      return;
    }

    setError('');

    const newGuess = {
      name: guessedChamp.name,
      image: guessedChamp.image?.full || '',
      remoteImage: guessedChamp.image?.remote || '',
      gender: guessedChamp.gender || 'Unknown',
      genderMatch: guessedChamp.gender === targetChampion.gender ? 'correct' : 'incorrect',
      position: guessedChamp.lane || 'Unknown',
      positionMatch: getArrayMatchStatus(guessedChamp.lane, targetChampion.lane),
      genre: guessedChamp.genre || 'Unknown',
      genreMatch: getArrayMatchStatus(guessedChamp.genre, targetChampion.genre),
      resource: guessedChamp.resource || 'Unknown',
      resMatch: guessedChamp.resource === targetChampion.resource ? 'correct' : 'incorrect',
      rangeType: guessedChamp.attackType || 'Unknown',
      rangeMatch: guessedChamp.attackType === targetChampion.attackType ? 'correct' : 'incorrect',
      region: guessedChamp.region || 'Unknown',
      regionMatch: guessedChamp.region === targetChampion.region ? 'correct' : 'incorrect',
      year: guessedChamp.releaseDate || 'Unknown',
      yearMatch: getYearMatch(guessedChamp.releaseDate, targetChampion.releaseDate),
    };

    setGuesses((current) => [...current, newGuess]);
    setGuessedNames((current) => new Set([...current, guessedChamp.name]));

    if (guessedChamp.name === targetChampion.name) {
      setIsWon(true);
      setIsGameOver(true);
      finishGame(true);
    }
  };

  const handleGiveUp = () => {
    if (!targetChampion || isGameOver) return;
    setIsGameOver(true);
    finishGame(false);
  };

  return (
    <main className="app">
      <header className="hero">
        <div className="eyebrow">LEAGUE OF LEGENDS</div>
        <h1>Champion Quest</h1>
        <p>Guess the champion. Use every clue. Master the roster.</p>
      </header>

      <section className="game-panel" aria-label="Champion guessing game">
        <ClueDeck champion={targetChampion} guessCount={guesses.length} quotes={quotesData} />

        <div className="game-controls">
          <ChampionInput onGuess={handleGuess} options={availableChampions} />
          <button className="secondary-btn" onClick={chooseTarget}>New Game</button>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}

        <div className="utility-row">
          <div className="legend" aria-label="Feedback legend">
            <span><i className="dot correct-dot" />Correct</span>
            <span><i className="dot partial-dot" />Partial</span>
            <span><i className="dot incorrect-dot" />Incorrect</span>
          </div>
          <div className="utility-actions">
            <span className="guess-count">{guesses.length} guess{guesses.length === 1 ? '' : 'es'}</span>
            <button className="text-btn" onClick={() => setShowStats(true)}>Stats</button>
            <button className="text-btn give-up" onClick={handleGiveUp} disabled={isGameOver}>Give up</button>
          </div>
        </div>

        {guesses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">?</div>
            <h2>Who is the mystery champion?</h2>
            <p>Start typing a champion name to make your first guess.</p>
          </div>
        ) : (
          <>
            <div className="grid-scroll">
              <div className="grid-header">
                <span>Champion</span><span>Gender</span><span>Position</span>
                <span>Class</span><span>Resource</span><span>Range</span>
                <span>Region</span><span>Year</span>
              </div>
              <GuessGrid guesses={guesses} />
            </div>
          </>
        )}
      </section>

      <VictoryModal
        isOpen={isGameOver}
        won={isWon}
        champion={targetChampion}
        guessCount={guesses.length}
        onRestart={chooseTarget}
      />

      {showStats && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <section className="modal-content stats-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowStats(false)} aria-label="Close statistics">×</button>
            <div className="eyebrow">YOUR RECORD</div>
            <h2>Game Statistics</h2>
            <div className="stats-grid">
              <div><strong>{stats.played}</strong><span>Played</span></div>
              <div><strong>{stats.wins}</strong><span>Wins</span></div>
              <div><strong>{stats.currentStreak}</strong><span>Current streak</span></div>
              <div><strong>{stats.bestStreak}</strong><span>Best streak</span></div>
            </div>
            <p className="stats-note">Stats are stored locally in this browser.</p>
          </section>
        </div>
      )}
    </main>
  );
}
