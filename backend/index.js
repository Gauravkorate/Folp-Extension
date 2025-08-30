require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API Server is running");
});

// Example real API route
app.get("/image", async (req, res) => {
  try {
    const response = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "🚀 Folp backend is running" });
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
