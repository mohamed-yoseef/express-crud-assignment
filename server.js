const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const PORT = 3000;

app.post("/user", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));

  const newUser = {
    id: users.length + 1,
    ...req.body,
  };

  const existingUser = users.find((user) => user.email === newUser.email);
  if (existingUser) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }
  users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.status(201).json({
    message: "User added successfully",
    user: newUser,
  });
});
app.patch("/user/:id", (req, res) => {
  const id = req.params.id;
  const users = JSON.parse(fs.readFileSync("users.json"));

  const userIndex = users.findIndex((user) => user.id === Number(id));

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const { name, age, email } = req.body;
  users[userIndex] = {
    ...users[userIndex],
    name: name ?? users[userIndex].name,
    age: age ?? users[userIndex].age,
    email: email ?? users[userIndex].email,
  };
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({
    message: "User updated successfully",
    user: users[userIndex],
  });
});
app.delete("/user/:id", (req, res) => {
  const id = req.params.id;
  const users = JSON.parse(fs.readFileSync("users.json"));
  const userIndex = users.findIndex((user) => user.id === Number(id));

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  users.splice(userIndex, 1);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json({
    message: "User deleted successfully",
  });
});

app.get("/user/getByName", (req, res) => {
  const { name } = req.query;

  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find((user) => user.name === name);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    message: "User found successfully",
    user: user,
  });
});

app.get("/user", (req, res) => {
  const users = JSON.parse(fs.readFileSync("users.json"));

  res.json({
    users: users,
  });
});

app.get("/user/filter", (req, res) => {
  const minAge = Number(req.query.age);

  const users = JSON.parse(fs.readFileSync("users.json"));

  const filteredUsers = users.filter((user) => user.age >= minAge);

  res.json({
    users: filteredUsers,
  });
});

app.get("/user/:id", (req, res) => {
  const id = req.params.id;

  const users = JSON.parse(fs.readFileSync("users.json"));

  const user = users.find((user) => user.id === Number(id));

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    user: user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
