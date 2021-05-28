var Joi = require('joi');

//register validation
const registerValidation = data => {
    const schema = Joi.object({
        firstname: Joi.string()
            .min(3)
            .required(),
        lastname: Joi.string()
            .min(3)
            .required(),
        Eid: Joi.string()
            .min(6)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        phone: Joi.number()
            .min(9)
            .required()
    }).unknown();
    return schema.validate(data);
}

//register validation
const loginValidation = data => {
    const schema = Joi.object({
        
        Eid: Joi.string()
            .min(6)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
       
    }).unknown();
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;