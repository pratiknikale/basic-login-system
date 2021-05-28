var express = require('express');
var app = express();
var route1 = require('./route1.js');
var auth1 = require('./auth.js');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');                             //
mongoose.connect('mongodb://localhost/my_db');                  //mongo connection and 
var personSchema = mongoose.Schema({                            //
    name: String,                                               //
    age: Number,                                                //model creating
    nationality: String                                         //
});                                                             //
var Person = mongoose.model("person", personSchema);            //

app.set('view engine', 'pug');                                  //engine used to access pug files
app.set('views', './views');
app.engine('html', require('ejs').renderFile);                  //engine used to access html files
app.set('views', __dirname);


app.use(bodyParser.json());                                     // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));             // for parsing application/xwww-
//form-urlencoded
app.use(upload.array());                                        // for parsing multipart/form-data
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));


app.get('/', function (req, res) {
    res.render('./public/person_form.html');
});


app.post('/person', function (req, res) {
    var personInfo = req.body;                                  //req.body = get the parsed information
    

    if (!personInfo.name || !personInfo.age || !personInfo.nationality) {
        res.send("Sorry, you provided worng info");
    }
    else {
        var newPerson = new Person({
            name : personInfo.name,
            age : personInfo.age,
            nationality : personInfo.nationality
        });

        newPerson.save(function (err, person) {
            if (err){
                res.send("database error");
            }
            else
               
                {
            
                res.render('./public/person_info.html', { person:newPerson });
            }
            
        });

    }

    //res.send("recieved your request!");
});

app.get('/people', function(req, res){                          //
    Person.find({name: "pratik"},function(err, response){       // all fields where name is pratik
       res.json(response);                                      //// retrieving database document in json format
    });                                                         //
});                                                             //

app.get('/components/:iron', function (req, res) {
    var hero = '';
    if (req.params.iron === 'ironman') {
        hero = "/82012.jpg";
    }
    else if (req.params.iron === 'batman') {
        hero = "/batman.jpg";
    }
    else {
        hero = '';
    }
    res.render('content', {
        img: hero
    });
});
app.use('/route', route1);
app.use('/auth', auth1)
app.listen(3000);