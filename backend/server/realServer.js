
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const FormData = require("form-data");
const app = express();
app.use(express.json()); 

console.log("✅ Real server started");


// --- Clearbit for name search ---
async function searchName(name) {
    const r = await fetch(
        `https://person.clearbit.com/v2/combined/find?query=${encodeURIComponent(name)}`,
        {
            headers: { Authorization: `Bearer ${process.env.CLEARBIT_KEY}` }
        }
    );
    if (!r.ok) return { error: "Clearbit API error", status: r.status };
    return r.json();
}c

// --- PimEyes (Unofficial) for face search ---
async function searchFacePimEyes(imageBase64) {
    try {
        const form = new FormData();
        form.append("file", Buffer.from(imageBase64, "base64"), { filename: "face.jpg" });

        const r = await fetch("https://pimeyes.com/en/search", {
            method: "POST",
            headers: {
                Cookie: process.env.PIMEYES_COOKIE, // Must log in to PimEyes & copy cookies
                ...form.getHeaders()
            },
            body: form
        });

        const html = await r.text();
        // You would parse HTML here for results — needs cheerio or regex
        return { html };
    } catch (err) {
        console.error(err);
        return { error: "PimEyes request failed" };
    }
}

// --- Face++ as backup ---
async function searchFaceFacePlusPlus(imageBase64) {
    const r = await fetch("https://api-us.faceplusplus.com/facepp/v3/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            api_key: process.env.FACEPP_KEY,
            api_secret: process.env.FACEPP_SECRET,
            image_base64: imageBase64
        })
    });
    return r.json();
}

// --- Main Search Endpoint ---
app.post("/search", async (req, res) => {
    const { type, value } = req.body;
    let result;

    if (type === "name") {
        result = await searchName(value);
    } else if (type === "face") {
        // Try PimEyes first
        result = await searchFacePimEyes(value);
        // If PimEyes fails, fallback to Face++
        if (!result || result.error) {
            result = await searchFaceFacePlusPlus(value);
        }
    } else {
        result = { error: "Invalid search type" };
    }

    res.json(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));
