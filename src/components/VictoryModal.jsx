export default function VictoryModal({ isOpen, won, champion, guessCount, onRestart }) {
  if (!isOpen || !champion) return null;

  return (
    <div className="modal-overlay">
      <section className="modal-content victory-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div className={`victory-badge ${won ? '' : 'lost'}`}>{won ? '✓' : '?'}</div>
        <div className="eyebrow">{won ? 'CHAMPION FOUND' : 'GAME OVER'}</div>
        <h2 id="result-title">{champion.name}</h2>
        <p>{champion.title}</p>
        {won ? (
          <div className="result-stat">{guessCount} {guessCount === 1 ? 'guess' : 'guesses'}</div>
        ) : (
          <div className="result-stat">The mystery champion was {champion.name}</div>
        )}
        <button className="primary-btn" onClick={onRestart}>Play Again</button>
      </section>
    </div>
  );
}
