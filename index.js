const express = require("express");
require("dotenv").config();
const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.use(express.json());

app.use('/api', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
