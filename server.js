const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const conn = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

const Product = conn.define('product', {
  name: Sequelize.STRING,
});

const User = conn.define('user', {
  name: Sequelize.STRING,
});

Product.belongsTo(User, { as: 'manager' });

const syncAndSeed = () => {
  return conn.sync({ force: true }).then(async () => {
    const [moe, larry, curly] = await Promise.all([
      User.create({ name: 'Moe' }),
      User.create({ name: 'Larry' }),
      User.create({ name: 'Curly' }),
    ]);

    Promise.all([
      Product.create({ name: 'Bar', managerId: moe.id }),
      Product.create({ name: 'Bazz', managerId: moe.id }),
      Product.create({ name: 'Foo', managerId: curly.id }),
    ]);
  });
};

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

//GET Users
app.get('/api/users', (req, res, next) => {
  User.findAll()
    .then(users => {
      res.send(users);
    })
    .catch(next);
});

//GET Products
app.get('/api/products', (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.send(products);
    })
    .catch(next);
});

//PUT Products by Id
app.put('/api/products/:id', (req, res, next) => {
  Product.findByPk(req.params.id * 1)
    .then(product => {
      product.update(req.body);
    })
    .then(product => {
      res.send(product);
    })
    .catch(next);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status(404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal Server Error');
});

syncAndSeed().then(() => {
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
});
