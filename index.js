//import express and axios npm packages
import express from "express"
import axios from "axios"

//api url
const api_url = "www.thecocktaildb.com/api/json/v1/1";

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
        console.log(response);
        res.render({content:response.data});
    } catch (error) {
        
    }
})
//Check to see if port is working 
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});



app.get("/", (req, res) => {
    res.render("index.ejs", { content: "Waiting for data..." });
  });
  
  app.post("/get-secret", async (req, res) => {
    const searchId = req.body.id;
    try {
      const result = await axios.get(API_URL + "/secrets/" + searchId, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) }); // the returned data is shown but in a strigified format 
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  });