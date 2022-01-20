let Model = require("../models/productModel");

const listProducts = (req, res) => {
    Model.find({}, (error, result) => {
        if (error) return res.status(422).send(new Error("bad request"));
        return res.status(200).send(result);
    });
}

const getProduct = (req, res) => {
    let { id } = req.params;
    if (!id) return res.status(422).send(new Error("bad request"));
    Model.findOne({_id: id}, (err, prod) => {
        if (err) return res.status(422).send({err});
        if (prod) return res.status(200).send(prod);
        else return res.status(404).send(prod);
    });
}

const createProduct = (req, res) => {
    let sauce = (req.body.sauce) ? JSON.parse(req.body.sauce) : req.body.sauce;
    let invalidForm = !(sauce.name 
        && sauce.manufacturer 
        && sauce.description 
        && sauce.mainPepper 
        && sauce.heat 
        && sauce.userId) || (
            sauce.name === ""
            || sauce.manufacturer === "" 
            || sauce.description === ""
            || sauce.mainPepper === ""
            || sauce.heat === ""
            || sauce.userId === "");
    if (!sauce || invalidForm || !req.imageUrl)
        return res.status(400).send(new Error("bad request"));
    let model = new Model({
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        heat: sauce.heat,
        userId: sauce.userId,
        imageUrl: req.imageUrl,
    });
    model.save((err) => {
        if (err) return res.status(422).send(err);
        return res.status(201).send({message: "OK"});
    });
}

const updateProduct = (req, res) => {
    let sauce = (req.body.sauce) ? JSON.parse(req.body.sauce) : req.body;
    let invalidForm = !(sauce.name 
        && sauce.manufacturer 
        && sauce.description 
        && sauce.mainPepper 
        && sauce.heat 
        && sauce.userId) || (
            sauce.name === ""
            || sauce.manufacturer === "" 
            || sauce.description === ""
            || sauce.mainPepper === ""
            || sauce.heat === ""
            || sauce.userId === "");
    if (!sauce || invalidForm || !req.params.id)
        return res.status(400).send({error: new Error("bad request")});
    Model.findOne({_id: req.params.id}, (err, prod) => {
        if (err) return res.status(422).send(err);
        prod.name = sauce.name;
        prod.manufacturer = sauce.manufacturer;
        prod.description = sauce.description;
        prod.mainPepper = sauce.mainPepper;
        prod.heat = sauce.heat;
        if (req.imageUrl)
            prod.imageUrl = req.imageUrl;
        prod.save((err) => {
            if (err) return res.status(422).send(err);
            return res.status(200).send({message: "OK"});
        });
    });
}

const deleteProduct = (req, res) => {
    Model.findOneAndDelete({_id: req.params.id}, (err, docs) => {
        if (err) return res.status(404).send(err);
        return res.status(200).send({message: docs});
    });
}

const likeProduct = (req, res) => {
    const { userId, like } = req.body;
    Model.findOne({_id: req.params.id}, (err, prod) => {
        if (err) return res.status(422).send(err);
        switch(like) {
            case -1:
                prod.dislikes += 1;
                prod.usersDisliked.push(userId);
                break;
            case 0:
                prod.usersDisliked = prod.usersDisliked.filter((val) => {
                    return val !== userId;
                });
                prod.usersLiked = prod.usersLiked.filter((val) => {
                    return val !== userId;
                });
                prod.likes = prod.usersLiked.length;
                prod.dislikes = prod.usersDisliked.length;
                break;
            case 1:
                prod.likes += 1;
                prod.usersLiked.push(userId);
                break;
            default:
                return res.status(422).send(new Error("Undefined index"));
        }
        prod.save((err) => {
            if (err) return res.status(422).send(err);
            return res.status(200).send({message: "OK"});
        });
    });
}

module.exports = {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    likeProduct,
}