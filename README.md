steps to follow in local
- Install postgress and npm
- change database credentials in server.js
- login to psql through terminal
- follow the commands
- CREATE DATABASE paris;
- \c paris;
- ```CREATE TABLE customers (
  sno SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  age INT,
  phone VARCHAR(15),
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
- uncomment the method in server.js at the line no.75
- open new terminal at the project and run `npm install` after installing the packages run `node server.js`
- it will insert dummy data in the data base,after inserting end the     program with ctrl+ or terminate the terminal
- comment again the method that will be uncommented in the previous step
- open new terminal and run `node server.js`
- open another new terminal and run `npm start`