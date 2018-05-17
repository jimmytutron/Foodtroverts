# Foodtroverts :rice:
![logo](assets/images/logo.png)

Ever been hungry but wanted some company, or just some good food and conversation? Are all of your friends busy during your lunch hours? Maybe there is a new place you want to try in your area but your tastebuds are more adventurous than the people you would usually eat out with? Good news… We’re here to help!

![demo](demo1.gif)
![demo](demo2.gif)

# Getting Started :spaghetti:

Simply navigate to ‘Get Started’ by either clicking the navigation link at the top or scrolling to the bottom of the page. There you will see a form to fill out. Fill in your name, upload a selfie, pick your food preference and a time, enter a zip code or city and wala~ The app will the populate the closest restaurants near you.

After selecting the restaurant you want, the app will then search our database for any other users near your location who picked the same restaurant and match you! You can then meet up at the restaurant at the designated time and hang out with your new foodtrovert buddy.

# Motivation :stew:

Foodtroverts is a platform built with the intention of bringing people together, everyone has to eat so why not add some company? Often times people associate food with dating - so we are here to get rid of that stigma. However - new friends, great experiences, networking, and maybe a new mate… it’s ALL welcomed here after a good meal!

What do you have to lose? Get started today!


## Use the app! :ice_cream:
Launch Foodtroverts [here!](https://jimmytutron.github.io/Foodtroverts/)

## Built With :pizza:

A presentation of our application that goes in depth about the technolgies we used is available on [Google Slides.](https://docs.google.com/presentation/d/e/2PACX-1vQ5dTUnLjPxNQ54pOlWbjHl97Zq7EhUZppogH72tmrttXUoagyMKfEonKZp8VEnkv9pOGnIlmrWuh0k/pub?start=false&loop=false&delayms=3000)

* [HTML5](https://www.w3.org/TR/html/) - markup language
* [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3) - styling
* [Javascript](https://www.javascript.com/) - programming language
* [jQuery](https://jquery.com/) - javascript library
* [Bootstrap](https://getbootstrap.com/) - website framework
* [Google Places API](https://developers.google.com/places/web-service/intro) - restuarant and location data
* [IPData API](https://ipdata.co/) - location data
* [Firebase](https://firebase.google.com/) - cloud database

## Authors :ramen: 

* **Lena Martinson** - [Blonded](https://github.com/Blonded)
* **Eric Ng** - [EricNg314](https://github.com/EricNg314)
* **Jimmy Tu** - [jimmytutron](https://github.com/jimmytutron)


## Acknowledgments :pray:

Thanks to the following people for their beautiful :sparkles:animations:sparkles: libraries and Unsplash for their photos!

* [Animate.css](https://daneden.github.io/animate.css/) - [Daniel Eden](https://daneden.me/)
* [AOS - Animate of Scroll Library](https://michalsnik.github.io/aos/) - [Michał Sajnóg](https://github.com/michalsnik)
* [Unsplash](https://unsplash.com/) - Attribution free photography

and of course a big thank you to our instructor and TAs, without their help we would have been pulling our hair out. :grimacing:



## Relevant snippets of code

### Animate on Scroll (AOS)

Applying AOS for element to fade in from the left and modifying its duration and transition animations

```html        

<div class="card my-4" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine" data-aos-duration="500">

```

### Using Animate.css to create a loading icon

```javascript      
$("#restaurantP").append("<img class='animated infinite rotateIn rotateOut loadingRest' src='assets/images/logo_small.svg'>");

//removing the loading icon when restuarants are populated
$("#restaurantP img:last-child").remove();
```

### Using Firebase Storage

Uploading an image/file to Firebase storage, providing a loading image, and retrieving url for download.

```javascript        
var storageRef;

$("#file").on("change", function (event) {
    selectedFile = event.target.files[0];
    $("#fileLabel").text(selectedFile.name);
});

$("#submitImage").on("click", function () {
    event.preventDefault();
    var fileName = selectedFile.name;
    storageRef = firebase.storage().ref("images/" + fileName);

    var uploadTask = storageRef.put(selectedFile);
    $("#uploadedImg").html("<img class='animated infinite rotateIn rotateOut loading' src='assets/images/logo_small.svg'>");
    uploadTask.on('state_changed', function (snapshot) {
    //progression of upload
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
    }, function (error) {
    // Handle unsuccessful uploads
    }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
        userImgURL = downloadURL;
        userDisplayImg.attr("src", downloadURL);
        userDisplayImg.addClass("userImage")
        $("#uploadedImg").html(userDisplayImg);
    });
```

### Looping through data stored in Firebase

Creating a connection with variable "con", storing user input into firebase, looping through connections to compare.

```javascript        
connectedRef.on("value", function (snap) {
    var con = connectionsRef.push(userObj);
    var newID = con.getKey();

    database.ref("/connections").on("child_added", function (childSnapshot) {

        var matchRestID = childSnapshot.val()["rest ID"];
        var matchUniqueID = childSnapshot.key;
        var matchTimePref = childSnapshot.val()["preference time"];

        if ((matchRestID === userObj["rest ID"]) && (matchTimePref === userObj["preference time"]) && (newID !== matchUniqueID)) {
        ...
        } else {
        ...
        }
```

