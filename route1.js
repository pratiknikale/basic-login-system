var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.send('hello route1 page');
});


module.exports = router;





