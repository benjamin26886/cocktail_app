//Instead of importing axios as you usally do inside your sever, you need to import axios using the cdn into your index.ejs file isntead, this will load axios globally.
const fetch_data_button = document.getElementById("fetchData"); // this is the button to get random cocktails
fetch_data_button.style.backgroundColor = "green"; // this is here to test to see if the button is correctly connected 
console.log("Button Script loaded"); // this is to test to see if this works properly 

//This code below will execute a request, when a button is clicked on the client side 
fetch_data_button.addEventListener("click",async()=>{
    try {
        const response = await axios.get("/get-data"); // connect to the localhost this compueter, to the get-data endpoint on the server
        //console.log("triggerd");
        console.log(response.data); // output the response data that was recived from the api
        //const cocktail = response.data.drinks[0];

    } catch (error) {
        console.error("Error fetching data:", error);   
    }
});

/// try to get background color for button to some color eg: green red blue etc: