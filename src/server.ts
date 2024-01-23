import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ status: "API is running on /api" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
