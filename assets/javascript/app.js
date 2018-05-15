$(document).ready(function () {
    //=========================GLOBAL===============================//
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCOSZbFya-dU4ArdvJH1Ky343FY1Y6lhU8",
        authDomain: "thedemo-833f6.firebaseapp.com",
        databaseURL: "https://thedemo-833f6.firebaseio.com",
        projectId: "thedemo-833f6",
        storageBucket: "thedemo-833f6.appspot.com",
        messagingSenderId: "932306555354"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");
    var selectedFile;
    var userImgURL = "";
    var storageRef;
    var userDisplayImg = $("<img>");

    // array for the users food preferences
    var foodPrefArr = ["American", "Chinese", "Filipino", "French", "German", "Indian", "Italian", "Japanese", "Korean", "Mexican", "Norwegian", "Portuguese", "Spanish", "Thai", "Vietnamese"];

    // array for the users time preferences    
    var timePrefArr = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

    // empty variables for the users input
    var selectedRestName = "";
    var selectedRestAddress = "";
    var selectedRestImgUrl = "";

    // for loop to run through the food preference array
    for (var i = 0; i < foodPrefArr.length; i++) {
        var foodOption = $("<option>");
        foodOption.attr("value", foodPrefArr[i]);
        foodOption.text(foodPrefArr[i]);
        $("#foodPref").append(foodOption);
    };

    //  for loop to run through the time preference array
    for (var i = 0; i < timePrefArr.length; i++) {
        var timeOption = $("<option>");
        timeOption.attr("value", timePrefArr[i]);
        timeOption.text(timePrefArr[i]);
        $("#timePref").append(timeOption);
    };

    //input an event when a file is uploaded.
    $("#file").on("change", function (event) {
        //append a small image of user.
        // setting selectedFile to be the file being uploaded.
        selectedFile = event.target.files[0];

        $("#fileLabel").text(selectedFile.name);
    });


    //button for city entry
    $("#submitImage").on("click", function () {
        event.preventDefault();
        var fileName = selectedFile.name;
        storageRef = firebase.storage().ref("images/" + fileName);
        //console.log("what is file name? " + fileName);
        // storing the image data
        var uploadTask = storageRef.put(selectedFile);
        $("#uploadedImg").html("<img class='animated infinite rotateIn rotateOut loading' src='assets/images/logo_small.svg'>");
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //console.log('Upload is ' + progress + '% done');
            //image uploading process
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    //console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    //console.log('Upload is running');
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
        });
    });



    connectedRef.on("value", function (snap) {
        var userObj = {};
        if (snap.val()) {
            $("#submitPref").on("click", function (event) {
                //preventing the page from reloading when the submit button is clicked
                event.preventDefault();
                // create variables for the user input to be stored, storing the value while using trim() to get rid of any excess white space
                var userName = $("#userName").val().trim();
                var userFoodPref = $("#foodPref").val().trim();
                var userPrefTime = $("#timePref").val().trim();
                var userLoc = $("#userLoc").val().trim();
                //console.log("ENTERED SUBMIT")

                
                if (userName !== '' && userFoodPref !== 'Select' && userPrefTime !== 'Select') {
                    //console.log("ENTERED IF")

                $("#userForm").addClass("d-none");
                $("#restaurant-list").removeClass("d-none");
                $("#restaurantP").append("<img class='animated infinite rotateIn rotateOut loadingRest' src='assets/images/logo_small.svg'>");

                    userObj["name"] = userName;
                    userObj["preference"] = userFoodPref;
                    userObj["preference time"] = userPrefTime;
                    userObj["location"] = userLoc;
                    userObj["imageURL"] = userImgURL;
                    //console.log(userObj);

                    //=====IPData=======/
                    $.get("https://api.ipdata.co/", function (res) {

                        if (userLoc === "") {
                            var currentCity = res["postal"];
                            userObj.location = currentCity;
                        }
                        //=====Google Places=======/

                        var authKey = "AIzaSyCOSZbFya-dU4ArdvJH1Ky343FY1Y6lhU8";
                        var city = userObj["location"];
                        var preference = userObj["preference"];
                        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + preference + " restaurants+in+" + city + "&key=" + authKey;

                        $.ajax({
                            url: queryURL,
                            method: "GET"
                        }).then(function (response) {
                            // console.log("Place ID: " + response.results[0].place_id);
                            var results = response.results
                            console.log(results);
                            $("#restaurantP img:last-child").remove();
                            for (var i = 0; i < 5; i++) {
                                var restDiv = $('<div>');
                                var restDivRow = $('<div>');
                                var restDivSec1 = $('<div>')
                                var restDivSec2 = $('<div>')
                                var restNameTag = $('<h4>');
                                var restAddressTag = $('<p>');
                                var restAddress = results[i]["formatted_address"];
                                var restName = results[i]["name"];
                                var restImgTag = $('<img>');
                                var restImgPhotoRef = results[i]["photos"][0]["photo_reference"];

                                var restImgURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=" + restImgPhotoRef + "&key=" + authKey;

                                restDiv.addClass('restSelected card card-body');
                                restDiv.attr('data-id', results[i]['id']);
                                restDiv.attr('data-name', restName);
                                restDiv.attr('data-address', restAddress);
                                restDiv.attr('data-imgURL', restImgURL);
                                // restDiv.attr('data-url', results[i]['url'])

                                restDivRow.addClass('row justify-content-center');

                                restDivSec1.addClass('col-md-4')
                                restImgTag.addClass('img-fluid');
                                restImgTag.attr("src", restImgURL);
                                restDivSec1.append(restImgTag);

                                restDivSec2.addClass('col-md-4')
                                restNameTag.text(restName);
                                restAddressTag.text(restAddress);
                                restDivSec2.append(restNameTag);
                                restDivSec2.append(restAddressTag);

                                restDivRow.append(restDivSec1);
                                restDivRow.append(restDivSec2);
                                restDiv.append(restDivRow);
                                $('#restaurantP').append(restDiv);

                            }
                           

                        }, "jsonp");
                    });
                } else {
                    console.log("ENTERED ELSE")
                    var msgErrorTag = $("<h4>");
                    var msgError = "Missing an input please check."
                    msgErrorTag.text(msgError);

                    msgErrorTag.attr("id", "errorText")
                    msgErrorTag.addClass("font-weight-bold text-danger text-right my-auto");

                    $("#submitMessage").html(msgErrorTag);
                    // $("#warningModal").modal('toggle');
                    // $("#warningModal").modal('show');
                    // alert("Fill it out");
                }
                //
            });



            $(document).on("click", ".restSelected", function () {

                $("#restaurant-list").addClass("d-none");
                $("#buddy-list").removeClass("d-none");

                //push id into object

                dataID = $(this);
                userObj["rest ID"] = dataID.attr("data-id")

                console.log(userObj);
                var con = connectionsRef.push(userObj);
                var newID = con.getKey();
                var userMatched = false;
                var listOfBuddies = [];
                var listofBudImgs = [];


                // adding new section for the 'matched' restaurant results to display when matched with your buddy.
                var restChosenDiv = $('<div>');
                var restChosenDivSec1 = $('<div>');
                var restChosenDivSec2 = $('<div>');
                var restNameMatchTag = $('<h3>');
                var restAddrMatchTag = $('<p>');
                var restPrefTimeMatchTag = $('<p>');
                var restRestImgTag = $('<img>');

                restNameMatchTag.text($(this).attr('data-name'));
                restAddrMatchTag.text($(this).attr('data-address'));
                restPrefTimeMatchTag.attr('id', 'meetUpTime');
                restPrefTimeMatchTag.text("Please meet up at: " + userObj["preference time"]);
                restRestImgTag.attr('src', $(this).attr('data-imgURL'));
                restRestImgTag.addClass('img-fluid');

                restChosenDiv.addClass("row justify-content-center");
                restChosenDivSec1.addClass("col-md-4");
                restChosenDivSec2.addClass("col-md-4");

                // append the images and the restaurant information for choices
                restChosenDivSec1.append(restRestImgTag);
                restChosenDivSec2.append(restNameMatchTag);
                restChosenDivSec2.append(restAddrMatchTag);
                restChosenDivSec2.append(restPrefTimeMatchTag);

                restChosenDiv.append(restChosenDivSec1);
                restChosenDiv.append(restChosenDivSec2);

                $('#restaurant-info').append(restChosenDiv);



                //Cycling through current connections, however it is currently including the user from above due to "connectionsRef.push(userObj)"
                //May need to create a unique number ID as part of the object prior to push.
                database.ref("/connections").on("child_added", function (childSnapshot) {
                    // storing into the data and running it.
                    var matchRestID = childSnapshot.val()["rest ID"];
                    var matchUniqueID = childSnapshot.key;
                    var matchTimePref = childSnapshot.val()["preference time"];
                    // console.log(userObj["rest ID"]);
                    // console.log(matchRestID);
                    // console.log(newID);
                    // console.log(matchUniqueID);

                    // if the user is MATCHED, do the following
                    if ((matchRestID === userObj["rest ID"]) && (matchTimePref === userObj["preference time"]) && (newID !== matchUniqueID)) {

                        var headerText = "";
                        userMatched = true;
                        //store the list in the data base
                        listOfBuddies.push(childSnapshot.val()["name"]);
                        listofBudImgs.push(childSnapshot.val()["imageURL"])

                        $("#buddyResults").empty();
                        var buddyDiv = $("<div>");
                        var header = $("<h3>");
                        // when the buddy has match, append this message
                        header.text("We found some fellow Foodtroverts!");
                        buddyDiv.append(header);


                        // list the buddies with the match, multiple can be included in the result
                        for (var i = 0; i < listOfBuddies.length; i++) {
                            
                            var imageTag = $("<img>");
                            var imageSrc = listofBudImgs[i];
                            var personName = $("<p>");
                            
                            imageTag.attr("src", imageSrc);
                            imageTag.addClass("userImage");
                            personName.text(listOfBuddies[i]);
                            // append the buddy results that you are matched with
                            buddyDiv.append(imageTag);
                            buddyDiv.append(personName);
                            $("#buddyResults").append(buddyDiv);
                        }
                        //console.log(headerText);

                        //if the user DOES NOT have a match
                    } else if (userMatched === false) {
                        //console.log("sorry no match yet :(")
                        $("#buddyResults").empty();
                        //creating a space to append the results
                        var buddyDiv = $("<div>");
                        var header = $("<h3>");
                        var loadingImg = $("<img>");
                        // loading image that appears to show the program is still searching for a buddy
                        loadingImg.attr("src", "assets/images/logo_small.svg");
                        loadingImg.addClass('animated infinite rotateIn rotateOut loading');
                        header.text("Searching for fellow Foodtroverts...");
                        // append the image logo
                        buddyDiv.append(loadingImg);
                        buddyDiv.append(header);

                        // append buddy results
                        $("#buddyResults").append(buddyDiv);
                    }

                })
                // on disconnect remove all data stored in firebase
                con.onDisconnect().remove().then(function () {
                    // storageRef.delete();
                });
            });
        }
    });

});

