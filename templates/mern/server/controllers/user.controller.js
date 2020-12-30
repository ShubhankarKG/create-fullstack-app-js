const User = require("../models/User");

module.exports = {
  /* 
   * @route POST api/user
   * @description Create an User
   * @param {Object} req The request
   * @param {Object} res The response
   */
    async createUser(req, res) {
        const user = req.body;
        
        const response = await User.create(user);

    }

};
