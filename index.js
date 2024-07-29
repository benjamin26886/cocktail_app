//import express and axios npm packages
import express from "express"
import axios from "axios"

var drink_name = null;
var instructions = null;

//api url
const api_url = "https:www.thecocktaildb.com/api/json/v1/1"; // you need to make sure to add https: to the beggining of your api url

// 2. Create an express app and set the port number.
const app = express(); 
const port = 3000;

app.use(express.static("public")); // You need this to serve static files, or in other words this, you cant load custom css without this 

//get random data 
app.get("/",(req,res)=>{
    //let randomWord = "cheese";
    res.render("index.ejs",{name_of_drink:drink_name, instructions:instructions});
})


// Endpoint to handle the GET request
app.get("/get-data",async(req,res)=>{
    try {
        const response = await axios.get(api_url + "/random.php");
        ; // you need to see output of this, turn on if you need to see the whole object
        drink_name = response.data.drinks[0].strDrink; // this is to see if you can acces the drink name in the json object
        instructions = response.data.drinks[0].strInstructions;
        console.log(drink_name);
        console.log(instructions);
        //console.log(response.data)
       // res.render("index.ejs",{name_of_drink:drink_name}); // change after testing the line above
        //res.render("index.ejs",{name_of_drink:drink_name});
        res.redirect("/");
        //res.json(response.data);
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
})
//Check to see if port is working 
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});



