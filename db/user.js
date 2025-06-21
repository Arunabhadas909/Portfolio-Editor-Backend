// const { string } = require('mathjs');
const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://arunabha909:Arunabhadas%40909@cluster0.io3lfs7.mongodb.net/portfolio");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const UserSchema = new mongoose.Schema({

    userName:String,
    email:String,
    message:String,
    newMessages:[String],
    userNames:[String],
    

})


const Users = mongoose.model('Users', UserSchema);

module.exports =  {

    Users,
}