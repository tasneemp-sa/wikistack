const morgan = require('morgan');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const PORT = 3000;
const layout = require('./views/layout.js');
const { db, Page, User } = require('./models');
const routeUser = require('./routes/users');
const routeWiki = require('./routes/wiki');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use('/wiki', routeWiki);
app.use('/users', routeUser);

db.authenticate() 
  .then(() => { 
    console.log('connected to the database'); 
})

app.get('/', (req, res) => {
    res.redirect('/wiki');
})

const init = async () =>{
    await db.sync();

    app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    })
}

init();