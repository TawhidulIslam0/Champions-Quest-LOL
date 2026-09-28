import { useEffect, useMemo, useState } from 'react';

const DATA_DRAGON_VERSION = '16.19.1';
const FALLBACK_QUOTE = "Guilt's a sickness, and I've got the cure.";

const getQuote = (champion, quotes) => {
  const source = quotes?.[champion?.name] || (champion?.name === 'Locke' ? [FALLBACK_QUOTE] : []);
  return source.length ? source[Math.floor(Math.random() * source.length)] : '';
};


const getUnlockText = (guessCount, threshold) => {
  if (guessCount >= threshold) return 'Unlocked';
  const remaining = threshold - guessCount;
  return `in ${remaining} ${remaining === 1 ? 'try' : 'tries'}`;
};

export default function ClueDeck({ champion, guessCount, quotes }) {
  const [ability, setAbility] = useState(null);
  const [splash, setSplash] = useState(null);
  const quote = useMemo(() => getQuote(champion, quotes), [champion?.name, quotes]);

  const unlocked = {
    quote: guessCount >= 5,
    ability: guessCount >= 11,
    splash: guessCount >= 17,
  };

  useEffect(() => {
    let cancelled = false;
    setAbility(null);
    setSplash(null);

    if (!champion) return () => { cancelled = true; };

    fetch(`https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/data/en_US/champion/${champion.id}.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load champion data');
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        const data = payload?.data?.[champion.id];
        const abilities = (data?.spells || [])
          .map((spell) => ({
            name: spell.name,
            image: spell.image?.full,
          }))
          .filter((spell) => spell.image);

        if (abilities.length) {
          setAbility(abilities[Math.floor(Math.random() * abilities.length)]);
        }

        // Use a skin belonging to the mystery champion. Chroma variants are
        // excluded, but base + regular skins are both valid clue art.
        const skins = (data?.skins || []).filter((skin) => !skin.parentSkin && Number.isFinite(Number(skin.num)));
        if (skins.length) {
          const skin = skins[Math.floor(Math.random() * skins.length)];
          setSplash({
            name: skin.name,
            url: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Keep the clue cards usable even if Data Dragon is temporarily unavailable.
          setAbility(null);
          setSplash({
            name: 'Default splash',
            url: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`,
          });
        }
      })

    return () => { cancelled = true; };
  }, [champion]);

  return (
    <section className="clue-deck" aria-label="Mystery champion clues">
      <article className={`clue-card quote-card ${unlocked.quote ? 'is-unlocked' : 'is-locked'}`}>
        <div className="clue-icon quote-icon">“</div>
        <div className="clue-meta">
          <strong>Quote clue</strong>
          <span>{getUnlockText(guessCount, 5)}</span>
        </div>
        {unlocked.quote ? (
          <blockquote>“{quote || 'No quote clue available.'}”</blockquote>
        ) : (
          <div className="clue-lock">Keep guessing</div>
        )}
      </article>

      <article className={`clue-card ability-card ${unlocked.ability ? 'is-unlocked' : 'is-locked'}`}>
        <div className="clue-icon ability-icon">
          {unlocked.ability && ability?.image ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/img/spell/${ability.image}`}
              alt=""
            />
          ) : '✦'}
        </div>
        <div className="clue-meta">
          <strong>Ability clue</strong>
          <span>{getUnlockText(guessCount, 11)}</span>
        </div>
        {!unlocked.ability && <div className="clue-lock">Keep guessing</div>}
      </article>

      <article className={`clue-card splash-card ${unlocked.splash ? 'is-unlocked' : 'is-locked'}`}>
        {unlocked.splash ? (
          <div className="splash-window">
            {splash ? (
              <img
                src={splash.url}
                alt="Mystery champion splash art clue"
                onError={(event) => {
                  if (!event.currentTarget.dataset.fallback) {
                    event.currentTarget.dataset.fallback = 'true';
                    event.currentTarget.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
                  }
                }}
              />
            ) : (
              <div className="splash-loading">Loading splash…</div>
            )}
          </div>
        ) : (
          <div className="clue-icon splash-icon">◈</div>
        )}
        <div className="clue-meta">
          <strong>Splash clue</strong>
          <span>{getUnlockText(guessCount, 17)}</span>
        </div>
        {!unlocked.splash && <div className="clue-lock">Keep guessing</div>}
      </article>
    </section>
  );
}
