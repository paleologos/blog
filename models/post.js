var mongoose= require("mongoose");

var postSchema= mongoose.Schema({
                title:String,
                category: String,
                image: String,
                content: String,
                

})

module.exports= mongoose.model("Post", postSchema);
