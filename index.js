import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url, { timeout: 5000 });
    const text = await response.text();
    res.set("Content-Type", "text/plain");
    res.send(text);
  } catch (err) {
    res.status(500).send("Fetch failed: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running on port " + PORT));
