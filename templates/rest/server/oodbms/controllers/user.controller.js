const User = require("../models/User");
const passwordHasher = require("password-hasher");

/* Utility function for creating password hash */
function passwordHash(password) {
  const hash = passwordhasher.createHash(
    "ssha512",
    password,
    new Buffer.from("83d88386463f0625", "hex")
  );
  const rfcHash = passwordhasher.formatRFC2307(hash);
  return rfcHash;
}

module.exports = {
  /*
   * @route POST api/user
   * @description Create an User
   * @param {Object} req The request
   * @param {Object} res The response
   */
  async createUser(req, res) {
    const user = req.body;
    try {
      // Check if User is already present by using email
      const existingUser = await User.exists({ email: user.email });
      if (existingUser) {
        /* If user exists, return 422 - 
      visit https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists for more details
      */
        return res.status(422).json({ error: "User already exists!" });
      }
      // Hash the password before storing it.
      user.password = passwordHash(user.password);
      await User.create(user);
      return res.status(201).json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Server error : " + error.message });
    }
  },

  /*
   * @route GET api/users
   * @description Reads all users
   * @param {Object} req The request
   * @param {Object} res The response
   */
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: "Server error : " + error.message });
    }
  },

  /*
   * @route GET api/user/:id
   * @description Get a single User
   * @param {Object} req The request
   * @param {Object} res The response
   */
  async getUser(req, res) {
    const id = req.params.id;
    try {
      // Check if User exists. If exists, return user, else return 404.
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Don't allow user's password to go through!
      user.password = null;
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: "Server error : " + error.message });
    }
  },

  /*
   * @route PUT api/user/:id
   * @description Edit an User
   * @param {Object} req The request
   * @param {Object} res The response
   */
  async updateUser(req, res) {
    const user = req.body;
    const id = req.params.id;
    try {
      const existingUser = await User.findById(id);
      if (existingUser) {
        // If user object has password field, hash it and then update
        if (password in user) {
          user.password = passwordHash(user.password);
        }
        const updatedUser = await User.findByIdAndUpdate(id, user, {
          new: true,
        });
        return res.status(201).json({ updatedUser });
      }
      return res.status(404).json({ error: "User does not exist." });
    } catch (error) {
      return res.status(500).json({ error: "Server error : " + error.message });
    }
  },

  /*
   * @route DELETE api/user
   * @description Delete an User
   * @param {Object} req The request
   * @param {Object} res The response
   */
  async deleteUser(req, res) {
    const id = req.params.id;
    try {
      const existingUser = await User.findById(id);
      if (existingUser) {
        await User.findByIdAndDelete(id);
        return res.status(204).json({});
      }
      return res.status(404).json({ error: "User does not exist." });
    } catch (error) {
      return res.status(500).json({ error: "Server error : " + error.message });
    }
  },
};
