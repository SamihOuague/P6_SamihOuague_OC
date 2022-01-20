let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 12, (err, encoded) => {
        if (!err) this.set("password", encoded);
        next();
    });
});

UserSchema.methods.comparePwd = function(pwd, cb) {
    bcrypt.compare(pwd, this.password, (err, same) => {
        if (err) return cb(err);
        else return cb(null, same);
    });
}

module.exports = mongoose.model("user", UserSchema);