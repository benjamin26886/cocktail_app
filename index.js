//import express and axios npm packages
import express, { response } from "express"
import axios from "axios"
import fs from "fs" // This module is used for interacting with files on the computer

var drink_name = null;
var instructions = null;
var image_url = null;


//Cocktail api url
const api_url = "https:www.thecocktaildb.com/api/json/v1/1"; // you need to make sure to add https: to the beggining of your api url

//Pixabay url and info 
const pixabay_url = "https://pixabay.com/api/";
var pixabay_api_key = "?key=45078635-3fdd19d0300b4845efdc97c0e";


// 2. Create an express app and set the port number.
const app = express(); 
const port = 3000;

app.use(express.static("public")); // You need this to serve static files, or in other words this, you cant load custom css without this 

//get random data 
app.get("/",(req,res)=>{
    //let randomWord = "cheese";
    res.render("index.ejs",{name_of_drink:drink_name, instructions:instructions}); //on this line two objects are passed to ejs, the name of the drink under the value drink name and the instructions
})


// Endpoint to handle the GET request
app.get("/get-data",async(req,res)=>{
    try {
        const response = await axios.get(api_url + "/random.php");
        //console.log(response.data);
         // you need to see output of this, turn on if you need to see the whole object
        drink_name = response.data.drinks[0].strDrink; // this is to see if you can acces the drink name in the json object
        instructions = response.data.drinks[0].strInstructions; // this line acceses the json object to get the instructions to be eventually passed into the card 
        
       console.log(drink_name); // Name of drink for debug purposes
       //console.log(instructions);  // Name of instructions for debuig purposes 

        //next (fix code below)
       image_url = await getImage(); // Image url is saved inside here and passed to the function downloadImage
       console.log(image_url);
       //downloadImage(image_url); // The image_url varibale is passed to this function, which then writes the data to the subdirectory images 
       res.redirect("/"); // This redirects the route to the home page 
        
        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
})
//Check to see if port is working 
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});


//Functions:

//Get Image from pixabay, what this does is it gets the url of the image from pixabay, the next function download and save image, saves the image and writes it to a file
async function getImage(){
    try {
        const response = await axios.get(pixabay_url + pixabay_api_key + "&q=" + encodeURIComponent(drink_name) + "&image_type=photo&page=1&per_page=3"); // this is the pixabay response from  the api
        //console.log(response.data); // just like when you see a response in postman, you need to kae sure you access the response.data property if you want to see the object that is sent back
        const picture_url = response.data.hits[0].webformatURL; // this is the image url from the json object, that will link to the actual image
        //console.log(picture_url); // this works finally, you should see the image url and be able to follow it in the console!
        return picture_url; // return image url from  function call 

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
}
//Download and save image 
async function downloadImage(url){ // Url will be passed and an arguement to this fucntion, the imgae url will be passed
    const response = await axios.get(url,{responseType: "arraybuffer"}); // set it to this when you work with binary data, such as images, audio files etc
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Save the image to a file (for example, in the current directory)
    fs.writeFileSync(path.join(__dirname,'public','images','image.jpg'), imageBuffer);
    console.log("Image saved successfully!");
}

/**
 * To do:
 * 1. Intergrate the pixabay api to show the pictures of the cocktails generated
 * 2. Design App to look more user freindly 
 * 3. Resolve the Promise { <pending> }  This finnaly works!
 * 4. fix the download image function 
 */
