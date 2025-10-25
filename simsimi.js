const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB = "./memory.json";
if (!fs.existsSync(DB)) fs.writeFileSync(DB, JSON.stringify({}));

function readDB() {
  return JSON.parse(fs.readFileSync(DB));
}
function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// Teach (শেখানো)
app.post("/teach", (req, res) => {
  const { ask, ans } = req.body || {};
  if (!ask || !ans)
    return res.json({ success: false, message: "Missing ask or ans" });

  const db = readDB();
  db[ask.toLowerCase()] = ans;
  writeDB(db);
  res.json({ success: true, message: `Learned: ${ask} -> ${ans}` });
});

// Ask (প্রশ্ন করা)
app.post("/ask", (req, res) => {
  const { text } = req.body || {};
  if (!text)
    return res.json({ success: false, message: "Missing text" });

  const db = readDB();
  const reply = db[text.toLowerCase()] || "আমি এটা এখনো শেখিনি 😢";
  res.json({ success: true, reply });
});

// Browser GET টেস্ট
app.get("/", (req, res) => res.send("✅ My SimSimi Server is running!"));

app.get("/simsimi", (req, res) => {
  const text = (req.query.text || "").toString();
  const db = readDB();
  const reply = db[text.toLowerCase()] || "আমি এটা এখনো শেখিনি 😢";
  res.json({ response: reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SimSimi Server running on port ${PORT}`));
