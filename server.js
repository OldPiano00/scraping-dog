const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Missing 'url' query parameter.");
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const content = await page.content();

    await browser.close();
    res.send(content);
  } catch (err) {
    console.error("Scraping error:", err);
    res.status(500).send("Failed to scrape the provided URL.");
  }
});

app.get("/", (req, res) => {
  res.send("ScrapingDog API is live 🐶 Use /scrape?url=https://example.com");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
