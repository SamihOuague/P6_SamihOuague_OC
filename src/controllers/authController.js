let jwt = require("jsonwebtoken");
let Model = require("../models/userModel");

const signUp = (req, res) => {
    const { email, password } = req.body;
    if (!(email && password) || !(email !== "" || password !== ""))
        return res.status(400).send({error: "bad request !"});
    Model.findOne({email}, (err, user) => {
        console.log(user);
        if (user) return res.status(422).send({error: "User already exists"});
        if (err) return res.send({err});
        let model = new Model({
            email,
            password,
        });
        model.save((err) => {
            if (err) return res.status(400).send({err});
            return res.status(201).send({message: "User created succesfull !"});
        });
    });
}

const logIn = (req, res) => {
    const { email, password } = req.body;
    if (!(email && password) || !(email !== "" || password !== ""))
        return res.status(400).send({error: "bad request !"});
    Model.findOne({email}, (err, user) => {
        if (err) return res.status(422).send({err});
        else if (!user) return res.status(401).send({err: "User does not exists !"});
        user.comparePwd(password, (err, same) => {
            if (err || !same) return res.status(401).send({err: "Invalid password !"});
            jwt.sign({userId: user._id}, "secret_key", (err, token) => {
                if (err || !token) return res.status(422).send({err});
                return res.send({userId: user._id, token});
            });
        });
    });
}

module.exports = {
    signUp,
    logIn
}
