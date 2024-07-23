//import express and axios npm packages
import express from "express"
import axios from "axios"

//api url
const api_url = "https:www.thecocktaildb.com/api/json/v1/1"; // you need to make sure to add https: to the beggining of your api url

// 2. Create an express app and set the port number.
const app = express(); 
const port = 3000;

app.use(express.static("public")); // You need this to serve static files, or in other words this, you cant load custom css without this 

//get random data 
app.get("/",(req,res)=>{
    res.render("index.ejs");
})


// Endpoint to handle the GET request
app.get("/get-data",async(req,res)=>{
    try {
        const response = await axios.get(api_url + "/random.php");
        console.log(response.data); // you need to see output of this 
        //res.render({content:response.data}); // change after testing the line above
        res.json(response.data);
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
})
//Check to see if port is working 
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});



