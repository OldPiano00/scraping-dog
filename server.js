const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const content = await page.content();
    res.send(content);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  } finally {
    if (browser) await browser.close();
  }
});

app.get("/", (req, res) => {
  res.send("✅ Puppeteer API running. Use /scrape?url=https://example.com");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
