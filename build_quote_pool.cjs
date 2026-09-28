const fs = require("fs");

const data = require("./champions_with_quotes.json");

const pool = {};

for (const champ of data) {
  if (champ.quotes && champ.quotes.length > 0) {
    pool[champ.name] = champ.quotes;
  }
}

fs.writeFileSync(
  "quote_pool.json",
  JSON.stringify(pool, null, 2)
);

console.log("Pool created:", Object.keys(pool).length, "champions");