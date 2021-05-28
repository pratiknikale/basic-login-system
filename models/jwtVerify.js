const jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
    const token = req.header("Authorization");
    console.log(token);
    if(!token){
        res.status(401);
        res.send('unauthorised');
    }
    else{
        try{
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        }
        catch(err){
            res.send(err);
        }
    }
    
}

const token = jwt.sign({ id: user.Eid}, process.env.TOKEN_SECRET);
                                
res.header('Authorization', token);