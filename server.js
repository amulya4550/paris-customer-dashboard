const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3001;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "paris",
  password: "********",// enter your postgres password
  port: 5432,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const insertDummyRecords = async () => {
  const generateDummyRecords = () => {
    const dummyRecords = [];

    for (let i = 1; i <= 50; i++) {
      const record = {
        sno: i,
        customer_name: `Customer ${i}`,
        age: Math.floor(Math.random() * 30) + 20, // Random age between 20 and 50
        phone: `+91 ${Math.floor(Math.random() * 10000000000)
          .toString()
          .padStart(10, "0")}`, // Random phone number
        location: `City ${Math.floor(Math.random() * 10) + 1}`, // Random city
        created_at: new Date().toISOString(),
      };

      dummyRecords.push(record);
    }

    return dummyRecords;
  };

  const dummyRecords = generateDummyRecords();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const record of dummyRecords) {
      await client.query(
        "INSERT INTO customers (sno, customer_name, age, phone, location, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          record.sno,
          record.customer_name,
          record.age,
          record.phone,
          record.location,
          record.created_at,
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Dummy records inserted successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting dummy records:", error);
  } finally {
    client.release();
  }
};

// insertDummyRecords();  // Uncomment this line to insert dummy records

app.get("/api/customers", async (req, res) => {
  console.log("req.query:", req.query);
  const filterName = req.query.filterName;
  const filterLocation = req.query.filterLocation;
  console.log("filterName:", filterName);
  console.log("filterLocation:", filterLocation);
  const client = await pool.connect();

  try {
    let query = "SELECT * FROM customers";
    let values = [];

    if (filterName) {
      query += " WHERE customer_name ILIKE '%" + filterName + "%'";
      values = [`%${query}%`];
    }

    if (filterLocation) {
      query += " WHERE location ILIKE '%" + filterLocation + "%'";
      values = [`%${query}%`];
    }

    console.log("Query:", query, values);
    const result = await client.query(query);

    console.log("result.rows:", result.rows);
    console.log("result.rows.length:", result.rows.length);
    console.log("Filter Name:", filterName);
    console.log("Filter Location:", filterLocation);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
