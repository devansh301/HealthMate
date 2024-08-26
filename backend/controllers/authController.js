const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("../config/neo4j");
require("dotenv").config();

async function register(req, res) {
  const { name, email, password, birthYear, homestate, pinCode } = req.body;
  console.log(req.body);
  if (!name || !email || !password || !birthYear || !homestate || !pinCode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUserResult = await session.run(
      `MATCH (p:Person {email: $email}) RETURN p`,
      { email }
    );

    if (existingUserResult.records.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    await session.run(
      `CREATE (p:Person {name: $name, email: $email, password: $password, birthYear: $birthYear})
       RETURN p`,
      { name, email, password: hashedPassword, birthYear }
    );

    await session.run(
      `MATCH (p:Person {email: $email})
       MERGE (s:State {state: $homestate})
       MERGE (c:City {pinCode: $pinCode})
       MERGE (s)-[:HAS_CITY]->(c)
       MERGE (c)-[:HAS_PERSON]->(p)`,
      { email, homestate, pinCode }
    );

    // const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userResult = await session.run(
      `MATCH (p:Person {email: $email}) RETURN p`,
      { email }
    );

    if (userResult.records.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = userResult.records[0].get("u").properties;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
}

module.exports = {
  register,
  login,
};
