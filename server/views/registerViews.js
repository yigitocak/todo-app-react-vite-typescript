import knex from "knex";
import knexfile from "../knexfile.js";
import bcrypt from "bcrypt";
const db = knex(knexfile.development);

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Bad request body",
        success: false,
      });
    }

    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exist!",
        success: false,
        created_at: new Date(),
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db("users").insert({
      email,
      password: hashedPassword,
    });
    return res.status(200).json({ message: "Account created", success: true });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Failed to create an account!", success: false });
  }
};