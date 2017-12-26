var  express= require("express"),
     bodyParser= require("body-parser"),
     methodOverride= require("method-override"),
     mongoose= require("mongoose"),
     expressSanitizer= require("express-sanitizer"),

     //models
     Post= require("./models/Post"),

     port= process.env.PORT || 8000,
     app= express();

     app.set("view engine", "ejs");

     // FOR APIs - JSON response
     app.use(function(req, res, next) {

           res.header("Access-Control-Allow-Origin", "*");
           res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
           next();
      });

      app.use(bodyParser.urlencoded({extended:true}));
      app.use(expressSanitizer());
      app.use(methodOverride("_method"));//obavezno dolazi posle bodyParser-a
      app.use(express.static(__dirname+"/public"));
      app.use(express.static(__dirname+"/node_modules/bootstrap/dist/css/"));
      app.use(express.static(__dirname+"/node_modules/bootstrap/dist/js/"));
      app.use(express.static(__dirname+"/node_modules/jquery/dist/"));

      //mongoose connection
      var url="mongodb://localhost/openblog";
      mongoose.connect(url, {useMongoClient:true});


    // redirect to the /posts
     app.get("/", function(req, res){
          res.redirect("/posts");
     });

     // render home page
     app.get("/posts", function(req, res){
       Post.find({}, function(err, foundPosts){
                  if(err){
                    console.log(err);
                  }else{
                    res.render("index", {foundPosts:foundPosts});
                  }
       });
     });

    //render input form
     app.get("/posts/new/", function(req, res){
              res.render("new");
     });

     //handle post request /posts/new - add new posts
     app.post("/posts/new", function(req, res){
       var postInput= {};

       // sanitizing inputs
       postInput.title=req.body.title= req.sanitize(req.body.title);
       postInput.category=req.body.category= req.sanitize(req.body.category);
       postInput.image= req.body.image= req.sanitize(req.body.image);
       postInput.content= req.body.content= req.sanitize(req.body.content);

       Post.create(postInput, function(err, postCreated){
                     if(err){
                       console.log(err);
                       res.redirect("/posts");
                     }else{

                       res.redirect("/posts");

                     }

       });

     });


     app.listen(port, function(){
       console.log("SERVER STARTED AT PORT: "+port);
     });
