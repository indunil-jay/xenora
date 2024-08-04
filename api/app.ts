import express from "express";

const app = express();

app.get("/test", (req, res) => {
  res.send("testing end point.");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listing t0 ${PORT}`);
});
