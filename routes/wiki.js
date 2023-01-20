const express = require('express');
const router = express.Router();
const { addPage, wikiPage, main, editPage } = require('../views'); 
const { Page, User } = require("../models");
const marked = require('marked');

router.get('/', async (req, res, next) => {
    // res.send('Youve reached /wiki/');
    try {
        const pages = await Page.findAll();
        res.send(main(pages));
        // res.send(pages);
    }
    catch(error) {
        next(error);
    } 
})

function createSlug (title) {
    if (title === '') {
        title = 'un-named title';
    }
    
    return title.split(' ').join('_');
}

router.post('/', async(req, res, next) => {
    // res.send('youve reached /wiki/post')
    // res.json(req.body.author);
    const title = req.body.title;
    const content = req.body.content;
    const slug = createSlug(title);

    try {
       
        const [user, wasCreated] = await User.findOrCreate({
            where: {
              name: req.body.author,
              email: req.body.author_email
            }
          });
          
          const page = await Page.create({
            title: title,
            content: content,
            slug: slug
          });
          
          // `setAuthor` returns a Promise! We should await it so we don't redirect before the author is set
          await page.setAuthor(user);
    
        // make sure we only redirect *after* our save is complete! Don't forget to `await` the previous step. `create` returns a Promise.
        res.redirect(`/wiki/${page.slug}`);
      } catch (error) { next(error) }
})

router.get('/add', (req, res) => {
    res.send(addPage());
})

router.get('/:slug', async(req, res, next) => {
    const slug = req.params.slug;
    
    // res.send(`hit dynamic route at ${req.params.slug}`);
    try {
        const page = await Page.findOne({
            where: {
                slug: slug
            }
        })

        if (page === null) {
            res.send(marked('Page Not Found'));
        }
        // res.json(page);
        const user = await User.findByPk(page.authorId);

        // res.send(req.body);
        res.send(wikiPage(page, user.name));
    }
    catch(error) {
        next(error);
    }
    
  });

  router.get('/:slug/edit', async (req, res, next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        })

        const user = await User.findByPk(page.authorId);

        // res.send(req.body);
        res.send(editPage(page, user));
    }
    catch(error) {
        next(error);
    }
    
  })

  router.post('/:slug', async (req, res, next) => {
    try {
        // res.json(req.params.slug);
        
        await Page.update({
            title: req.body.title,
            slug: createSlug(req.body.title),
            content: req.body.content,
            status: req.body.status
        }, {
            where: {
                slug: req.params.slug
            }
        })

        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        })

        // res.json(page);

        // const user = await User.findByPk(page.authorId);
        await User.update({
            name: req.body.author,
            email: req.body.author_email
        }, {
            where: {
                id: page.authorId
            }
        })

        const user = await User.findOne({
            where: {
                id: page.authorId
            }
        })

        // res.send(req.body);
        res.redirect(`/wiki/${req.params.slug}`);
    }
    catch(error) {
        next(error);
    }
  })

  router.get('/:slug/delete', async (req, res, next) => {
    try {
        const page = await Page.findOne({
            where: {
                slug: req.params.slug
            }
        })

        const pages = await Page.findAll({
            where: {
                authorId: page.authorId
            }
        })

        // res.json(pages.length);

        if (pages.length === 1) {
            await User.destroy({
            where: {
                id: page.authorId
            }
        })
        }

        await Page.destroy({
            where: {
                id: page.id
            }
        })

        res.redirect('/wiki/');
    }
    catch (error) {
        next(error);
    }
  })

module.exports = router;