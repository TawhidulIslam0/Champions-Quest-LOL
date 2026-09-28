const fs = require("fs");

async function build() {
  const VERSION = "16.19.1";
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion.json`
  );

  const data = await res.json();

  const champions = Object.values(data.data).map((c) => ({
    id: c.id,
    name: c.name,
    key: c.key,
    image: {
      full: c.image?.full || `${c.id}.png`,
      remote: `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${c.id}.png`
    },
    quotes: []
  }));

  fs.writeFileSync(
    "champions.json",
    JSON.stringify(champions, null, 2) + "\n"
  );

  console.log("✔ Champions built:", champions.length);
}

build();
