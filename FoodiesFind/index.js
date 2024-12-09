let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

let app = express();
let PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });
})();

// 1. Get All Restaurants
async function fetchAllRestaurants() {
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants", async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Restaurant by ID
async function fetchRestaurantById(id) {
  let query = "SELECT * FROM restaurants WHERE id = ?";
  let response = await db.get(query, [id]);
  return { restaurant: response };
}

app.get("/restaurants/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let results = await fetchRestaurantById(id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Restaurants by Cuisine
async function fetchRestaurantsByCuisine(cuisine) {
  let query = "SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  const { cuisine } = req.params;
  try {
    let results = await fetchRestaurantsByCuisine(cuisine);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Restaurants by Filter
async function fetchRestaurantsByFilter(filters) {
  let { isVeg, hasOutdoorSeating, isLuxury } = filters;
  let query = 'SELECT * FROM restaurants WHERE 1=1';
  let params = [];

  if (isVeg) {
    query += ' AND isVeg = ?';
    params.push(isVeg);
  }
  if (hasOutdoorSeating) {
    query += ' AND hasOutdoorSeating = ?';
    params.push(hasOutdoorSeating);
  }
  if (isLuxury) {
    query += ' AND isLuxury = ?';
    params.push(isLuxury);
  }

  let response = await db.all(query, params);
  return { restaurants: response };
}

app.get("/restaurants/filter", async (req, res) => {
  const filters = req.query;
  try {
    let results = await fetchRestaurantsByFilter(filters);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Restaurants Sorted by Rating
async function fetchRestaurantsSortedByRating() {
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let results = await fetchRestaurantsSortedByRating();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Get All Dishes
async function fetchAllDishes() {
  let query = "SELECT * FROM dishes";
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get("/dishes", async (req, res) => {
  try {
    let results = await fetchAllDishes();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Dish by ID
async function fetchDishById(id) {
  let query = "SELECT * FROM dishes WHERE id = ?";
  let response = await db.get(query, [id]);
  return { dish: response };
}

app.get("/dishes/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let results = await fetchDishById(id);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Get Dishes by Filter
async function fetchDishesByFilter(filters) {
  let { isVeg } = filters;
  let query = "SELECT * FROM dishes WHERE isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get("/dishes/filter", async (req, res) => {
  const filters = req.query;
  try {
    let results = await fetchDishesByFilter(filters);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Get Dishes Sorted by Price
async function fetchDishesSortedByPrice() {
  let query = "SELECT * FROM dishes ORDER BY price ASC";
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let results = await fetchDishesSortedByPrice();
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, () => console.log("Server running on port " + PORT));