const express = require('express');
const router = express.Router();
const { userList, userPages } = require('../views');
const { Page, User } = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.send(userList(users));
    }
    catch(error) {
        next(error);
    }    
})

router.get("/:userId", async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId);
      const pages = await Page.findAll({
        where: {
          authorId: req.params.userId
        }
      });
  
      res.send(userPages(user, pages));
    } catch (error) { next(error) }
  });

module.exports = router;