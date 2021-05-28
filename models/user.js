var mongoose = require('mongoose');

var userSchema = mongoose.Schema({                                 //
    Eid: String,                                                    //
    password: String,
    firstname: String,
    lastname: String,
    phone: Number                                               //model creating
});

module.exports = mongoose.model("Users", userSchema);
