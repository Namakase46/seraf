import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.all("/", async (req, res) => {
  const url = req.query.url || req.body.url;

  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url, { timeout: 5000 });
    const text = await response.text();

    // Simpan log
    const log = `\n==== SSRF to ${url} ====\n${text}\n`;
    fs.appendFileSync("log.txt", log);

    res.set("Content-Type", "text/plain");
    res.send(text);
  } catch (err) {
    res.status(500).send("Fetch failed: " + err.message);
  }
});

app.get("/clear", (req, res) => {
  if (fs.existsSync("log.txt")) {
    fs.unlinkSync("log.txt"); // hapus file
    res.send("✅ Log telah dihapus.");
  } else {
    res.send("📭 Tidak ada log untuk dihapus.");
  }
});


// Log viewer
app.get("/log", (req, res) => {
  if (fs.existsSync("log.txt")) {
    const logs = fs.readFileSync("log.txt", "utf-8");
    res.set("Content-Type", "text/plain");
    res.send(logs);
  } else {
    res.send("No logs yet.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy running"));
