import { useEffect, useMemo, useRef, useState } from 'react';

const getImageUrl = (champion) => champion?.image?.remote || '';

export default function ChampionInput({ onGuess, options }) {
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];

    return options
      .filter((champion) => champion.name.toLowerCase().includes(value))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(value);
        const bStarts = bName.startsWith(value);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return aName.localeCompare(bName);
      })
      .slice(0, 8);
  }, [options, query]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  const selectChampion = (champion) => {
    onGuess(champion.name);
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setQuery('');
      return;
    }

    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setHighlighted((current) => Math.min(current + 1, suggestions.length - 1));
      return;
    }

    if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setHighlighted((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (suggestions.length) {
        selectChampion(suggestions[highlighted]);
      } else if (query.trim()) {
        onGuess(query.trim());
        setQuery('');
      }
    }
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Guess a champion..."
          autoComplete="off"
          aria-label="Guess a champion"
          aria-autocomplete="list"
          aria-controls="champion-suggestions"
        />
        <kbd>ENTER</kbd>
      </div>

      {suggestions.length > 0 && (
        <ul className="dropdown" id="champion-suggestions" role="listbox">
          {suggestions.map((champion, index) => (
            <li
              key={champion.name}
              className={index === highlighted ? 'highlighted' : ''}
              role="option"
              aria-selected={index === highlighted}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectChampion(champion)}
              onMouseEnter={() => setHighlighted(index)}
            >
              <img
                src={getImageUrl(champion)}
                alt=""
                onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
              />
              <span>{champion.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
