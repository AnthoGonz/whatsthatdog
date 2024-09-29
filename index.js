const express = require("express")
const axios = require('axios');
const path = require('path')

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));


//Shuffle Array
function shuffleArray(arr){

    let arrInt = arr.length

    while (arrInt != 0){
        let randomInt = Math.floor(Math.random() * arrInt);
        arrInt--;

        [arr[arrInt], arr[randomInt]] = [arr[randomInt], arr[arrInt]]
    }
    return(arr)
}


//Check the format of the dog
function checkDog(dog){

    let checkArr = ["bullterrier", "cattledog", "cotondetulear", "germanshepherd", "stbernard", "mexicanhairless"]
    let dict = {
        "bullterrier": "Bull Terrier",
        "cattledog": "Cattle Dog",
        "cotondetulear": "Conton de Tulear",
        "germanshepherd": "German Shepherd",
        "stbernard": "St Bernard",
        "mexicanhairless" : "Mexican Hairless"
        }

    let finalDog = dog

    if (checkArr.includes(dog)){
        finalDog = dict[dog]
    }
    
    return(finalDog)
}

//Iterate the checkDog() function over an array
function checkMultipleDogs(dogArr){

    for(i = 0; i < dogArr.length; i++){
        dogArr[i] = checkDog(dogArr[i])
    }
    return dogArr
}


//Load Game
app.get("/",function(req,res){

    //Get a list of all the dogs
    axios.get("https://dog.ceo/api/breeds/list/all").then(response => {
        list = response.data
        arr = []
        opt = []

        //Push the list of dogs to an array
        for (const key in list["message"]){

            //If the dog has sub breeds, select a random sub breed
            if (list["message"][key].length != 0){
                let r = Math.floor(Math.random() * list["message"][key].length)
                arr.push(list["message"][key][r] + " "+ key)
            }else{
                arr.push(key)
            }
        }

        //Shuffle array of dogs
        arr = shuffleArray(arr)

        //Initiate correct breed and option values
        correctBreed = arr[0]
        opt = [correctBreed, arr[1],arr[2],arr[3]]

        //Check options and shuffle array
        opt = checkMultipleDogs(opt)
        opt = shuffleArray(opt)

        //If correct dog is a sub breed, use the sub breed image API
        if (correctBreed.split(" ").length === 2){
            async function getUrlSub(){

                let splitBreed = correctBreed.split(" ")

                let d = await axios.get("https://dog.ceo/api/breed/" + splitBreed[1] + "/" + splitBreed[0] + "/images/random")
                let u = d.data
                let url = u["message"]

                context = {
                    "picture" : url,
                    "correctBreed" : checkDog(correctBreed),
                    "options" : opt}
        
        
                res.render("index", context)
            }
            getUrlSub()

        //If correct dog is not a sub breed, use the main breed API
        }else{
            async function getUrl(){
                let d = await axios.get("https://dog.ceo/api/breed/" + correctBreed + "/images/random")
                let u = d.data

                let url = u["message"]

                context = {
                    "picture" : url,
                    "correctBreed" : checkDog(correctBreed),
                    "options" : opt}
        
        
                res.render("index", context)
            }
            getUrl()
        }

    })
})

app.listen(10000, function () {
console.log("Started application on port %d", 10000)
});

