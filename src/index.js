const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config')

const app = express();
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/' , (req, res) => {
    res.render('login');
});

app.get('/register' , (req, res) => {
    res.render('register');
});

app.post("/register", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.render('already');
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        res.render('sucess');
    }

});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.render('error')
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.render('error');
        }
        else {
            res.render("profile");
        }
    }
    catch {
        res.send("wrong Details");
    }
});


app.get('/logout', function(req, res, next) {
      res.redirect('/');
  });



const port = 5000;
app.listen(port);