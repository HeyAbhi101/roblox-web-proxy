const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/fetch", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let result = {
      title: $("title").text(),
      headers: [],
      paragraphs: [],
    };

    $("h1,h2,h3").each((i, el) => {
      result.headers.push($(el).text());
    });

    $("p").each((i, el) => {
      if (i < 10) result.paragraphs.push($(el).text());
    });

    res.json(result);
  } catch (e) {
    res.status(500).send("Error: " + e.message);
  }
});

app.listen(3000, () => console.log("Web proxy running"));
