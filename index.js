const express = require('express');
const bodyParser = require('body-parser');

const userController = require('./controllers/user.controller');
const healthController = require('./controllers/health.controller');
const authController = require('./controllers/auth.controller');
const msgController = require('./controllers/message.controller');
const middleware = require('./middleware.js');

const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/check', healthController.check);
app.post('/user', userController.createUser);
app.post('/login', authController.login);

// TODO: these endpoints should be secured
app.post('/messages', middleware.ensureAuthenticated, msgController.send);
app.get('/messages', middleware.ensureAuthenticated, msgController.get);

app.listen(port, () => {
  console.log(`ASAPP Challenge app running on port ${port}`);
});
