async function fetchQuotes(name) {
  try {
    const page = `${toWiki(name)}/LoL/Audio`;

    const url = `https://leagueoflegends.fandom.com/api.php?action=parse&page=${page}&format=json`;

    const res = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const html = res.data?.parse?.text?.["*"];
    if (!html) return [];

    const quotes = [];

    const regex = /<li>(.*?)<\/li>/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, "").trim();

      if (
        text.length > 10 &&
        text.length < 200 &&
        !text.includes(".ogg")
      ) {
        quotes.push(text);
      }
    }

    return [...new Set(quotes)];
  } catch (e) {
    console.log("FAILED:", name);
    return [];
  }
}