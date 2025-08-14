import express, { Request, Response } from "express";
import cors from "cors";
import { items, Item } from "./data";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// POST /items → Add new item
app.post("/items", (req: Request, res: Response) => {
  const { name, desc, price, img } = req.body;

  if (!name || !desc || !price || !img) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newItem: Item = {
    id: items.length + 1,
    name,
    desc,
    price,
    img,
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// GET /items → List & search items
app.get("/items", (req: Request, res: Response) => {
  const { search, page = "1", limit = "10" } = req.query;
  let filteredItems = items;

  if (search && typeof search === "string") {
    const lowerSearch = search.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.desc.toLowerCase().includes(lowerSearch) ||
        item.price.toString().includes(lowerSearch) ||
        item.img.toLowerCase().includes(lowerSearch)
    );
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startInd = (pageNum - 1) * limitNum;
  const endInd = startInd + limitNum;
  const paginatedItems = filteredItems.slice(startInd, endInd);

  res.json({
    page: pageNum,
    limit: limitNum,
    total: filteredItems.length,
    items: paginatedItems,
  });
});
