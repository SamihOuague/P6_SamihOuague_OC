const { listProducts, 
    createProduct, 
    getProduct, 
    updateProduct, 
    deleteProduct,
    likeProduct } = require("../controllers/productController");
const multer = require("multer");
let router = require("express").Router();
let storage = multer.diskStorage({
    destination: "./public",
    filename: (req, file, cb) => {
        let fileName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        let imageUrl;
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            imageUrl = fileName + "." + file.mimetype.split("/")[1];
            req.imageUrl = imageUrl;
            cb(null, imageUrl);
        }
        else
            cb(new Error("Bad mimetype"), null);
    }
});
let upload = multer({storage: storage});

router.get("/", listProducts);
router.post("/", upload.any(), createProduct);
router.post("/:id/like", likeProduct);
router.put("/:id", upload.any(), updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

module.exports = router;