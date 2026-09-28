const fs = require("fs");

async function buildChampionData() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/16.19.1/data/en_US/champion.json"
  );

  const result = await response.json();
  const championList = Object.values(result.data);

  const formattedData = championList.map((champ) => ({
    name: champ.name,
    id: parseInt(champ.key),
    quotes: []
  }));

  fs.writeFileSync(
    "champions_with_quotes.json",
    JSON.stringify(formattedData, null, 2)
  );

  console.log(
    `✅ Created champions_with_quotes.json with ${formattedData.length} champions`
  );
}

buildChampionData();