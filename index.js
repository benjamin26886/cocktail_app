//import express and axios npm packages
import express, { response } from "express"
import axios from "axios"
import fs from "fs" // This module is used for interacting with files on the computer
import path from "path"
import { fileURLToPath } from 'url';

//You need to use the two lines of code below becuase in package.json type is set to module, because __dirname is not defined in es module scope
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file, to this current file
const __dirname = path.dirname(__filename); // get the name of the directory , then set the dirname to the current file path, in this case it will be /Users/nick/web_projects/cocktail_app


var drink_name = null;
var instructions = null;
var image_url = null; // from pixabay
let imgUrl = path.join('images','random_cocktail.jpg' ); // to directory


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
    //console.log(image_url);
    res.render("index.ejs",{name_of_drink:drink_name, instructions:instructions,imageUrl:imgUrl}); //on this line two objects are passed to ejs, the name of the drink under the value drink name and the instructions 
})


// Endpoint to handle the GET request
app.get("/get-data",async(req,res)=>{
    try {
        const response = await axios.get(api_url + "/random.php");
        //console.log(response.data);
         // you need to see output of this, turn on if you need to see the whole object
        drink_name = response.data.drinks[0].strDrink + " " + "cocktail"; // this is to see if you can acces the drink name in the json object
        instructions = response.data.drinks[0].strInstructions; // this line acceses the json object to get the instructions to be eventually passed into the card 
        
        console.log(drink_name); // Name of drink for debug purposes
       //console.log(instructions);  // Name of instructions for debuig purposes 

        //next (fix code below)
        image_url = await getImage(); // Image url is saved inside here and passed to the function downloadImage
        //console.log(image_url);
        imgUrl = await downloadImage(image_url); // The image_url varibale is passed to this function, which then writes the data to the subdirectory images, the url connected to the image in the sub directory is passed into this global varibale, meaning the last image that was generated
        //console.log(__dirname); // log this to see the directory name X
        //imgUrl = path.join('images','image.jpg'); // set this variable to the actuall image, then dynamically pass it (global)
        //console.log(imgUrl);
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
        //console.log(response.data); // just like when you see a response in postman, you need to make sure you access the response.data property if you want to see the object that is sent back
        const picture_url = response.data.hits[0].webformatURL; // this is the image url from the json object, that will link to the actual image, in the data object it takes the first object in the hits array, and takes the property webformatUrl
        //console.log(picture_url); // this works finally, you should see the image url and be able to follow it in the console!
        return picture_url; // return image url from  function call 

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
}
//Download and save image 
async function downloadImage(url){ // Url will be passed and an arguement to this fucntion, the imgae url will be passed
    const response = await axios.get(url,{responseType: "arraybuffer"}); // set it to this when you work with binary data, such as images, audio files, the responseType key value pair is an option, that will treat the data as binary, it will retrun the repsonse as binary  etc
    const imageBuffer = Buffer.from(response.data, 'binary'); // Buffer from will create a buffer instance from the response.data, so this will create an instance of the image 

    // Use a unique filename based on timestamp
    const timestamp = new Date().getTime(); // generate a time stamp for each time an image is generated 
    const imagePath = path.join(__dirname, 'public', 'images', `image_${timestamp}.jpg`); //add time stamp to the image 
    fs.writeFileSync(imagePath, imageBuffer); // write image to the images folder 
    // Save the image to a file (for example, in the current directory)
    //fs.writeFileSync(path.join(__dirname,'public','images',`image_${timestamp}.jpg`), imageBuffer); // the first arguement in write filesync is the path of where to save the data, the second arguement is the actuall data that will be written into the file image.jpg
    console.log("Image saved successfully!");

    // Return the new image path
    return `images/image_${timestamp}.jpg`; // return dynamically created image with time stamp 
}

/**
 * To do:
 * 1. Intergrate the pixabay api to show the pictures of the cocktails generated
 * 2. Design App to look more user freindly 
 * 3. Resolve the Promise { <pending> }  This finnaly works!
 * 4. fix the download image function  This finnaly works, kind of, image is displayed however, it only uses the last imgae that was generated 
 */
