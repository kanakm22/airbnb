const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

// This fix ensures we pass the function, even if it's nested inside an object
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);