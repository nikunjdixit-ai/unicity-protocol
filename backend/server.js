require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const identityRoutes = require("./routes/identity");
const analysisRoutes = require("./routes/analysis");
const paymentRoutes = require("./routes/payment");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Unicity Backend" });
});

app.use("/api/identity", identityRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/payment", paymentRoutes);

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.listen(PORT, () => {
  console.log("Unicity Backend running on port " + PORT);
});
