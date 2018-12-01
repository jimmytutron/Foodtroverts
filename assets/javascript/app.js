$(document).ready(function () {
    //=========================GLOBAL===============================//
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDQhnkQVQxYFIzpHHe3f9j46KYowZpgGRg",
        authDomain: "foodtroverts-1525972295801.firebaseapp.com",
        databaseURL: "https://foodtroverts-1525972295801.firebaseio.com",
        projectId: "foodtroverts-1525972295801",
        storageBucket: "foodtroverts-1525972295801.appspot.com",
        messagingSenderId: "945445095089"
      };
      firebase.initializeApp(config);

    var database = firebase.database();

    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");
    var selectedFile;
    var userImgURL = "";
    var storageRef;
    var userDisplayImg = $("<img>");

    var foodPrefArr = ["American", "Chinese", "Filipino", "French", "German", "Indian", "Italian", "Japanese", "Korean", "Mexican", "Norwegian", "Portuguese", "Spanish", "Thai", "Vietnamese"];

    
    var timePrefArr = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
    
    for (var i = 0; i < foodPrefArr.length; i++) {
        var foodOption = $("<option>");
        foodOption.attr("value", foodPrefArr[i]);
        foodOption.text(foodPrefArr[i]);
        $("#foodPref").append(foodOption);
    };


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
        console.log("what is file name? " + fileName);

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
        });
    });



    connectedRef.on("value", function (snap) {
        var userObj = {};
        if (snap.val()) {
            $("#submitPref").on("click", function (event) {
                event.preventDefault();

                var userName = $("#userName").val().trim();
                var userFoodPref = $("#foodPref").val().trim();
                var userPrefTime = $("#timePref").val().trim();
                var userLoc = $("#userLoc").val().trim();

                if (userName !== '' && userFoodPref !== 'Select' && userPrefTime !== 'Select' && userImgURL !== '') {


                $("#userForm").addClass("d-none");
                $("#restaurant-list").removeClass("d-none");
                $("#restaurantP").append("<img class='animated infinite rotateIn rotateOut loadingRest' src='assets/images/logo_small.svg'>");

                    userObj["name"] = userName;
                    userObj["preference"] = userFoodPref;
                    userObj["preference time"] = userPrefTime;
                    userObj["location"] = userLoc;
                    userObj["imageURL"] = userImgURL;
                    console.log(userObj);

                    //=====IPData=======/
                    $.get(" https://api.ipdata.co?api-key=218a0d03983a403708b94dd833c2ec2aabecba02eb8675d5dec31f97", function (res) {

                        if (userLoc === "") {
                            var currentCity = res["postal"];
                            userObj.location = currentCity;
                        }
                        //=====Google Places=======/

                        var authKey = "AIzaSyAZPAsF-Fb-C5lnhtkitRLjplX24zRkqeE";
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

                                var restImgURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photoreference=" + restImgPhotoRef + "&key=" + authKey;

                                restDiv.addClass('restSelected card card-body');
                                restDiv.attr('data-id', results[i]['id']);
                                restDiv.attr('data-name', restName);
                                restDiv.attr('data-address', restAddress);
                                restDiv.attr('data-imgURL', restImgURL);
                                // restDiv.attr('data-url', results[i]['url'])

                                restDivRow.addClass('row justify-content-center animated fadeInLeft');

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
                    var msgError = "Missing an input or image upload please check."
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

                    var matchRestID = childSnapshot.val()["rest ID"];
                    var matchUniqueID = childSnapshot.key;
                    var matchTimePref = childSnapshot.val()["preference time"];
                    // console.log(userObj["rest ID"]);
                    // console.log(matchRestID);
                    // console.log(newID);
                    // console.log(matchUniqueID);

                    if ((matchRestID === userObj["rest ID"]) && (matchTimePref === userObj["preference time"]) && (newID !== matchUniqueID)) {

                        var headerText = "";
                        userMatched = true;

                        listOfBuddies.push(childSnapshot.val()["name"]);
                        listofBudImgs.push(childSnapshot.val()["imageURL"])

                        $("#buddyResults").empty();
                        var header = $("<h3 class='text-center'>");
                        var headerColumn = $("<div>");
                        headerColumn.addClass('col-12 mx-auto')
                        header.text("We found some fellow Foodtroverts!");
                        headerColumn.append(header);

                        $("#buddyHeader").html(headerColumn);



                        for (var i = 0; i < listOfBuddies.length; i++) {
                            var buddyColumn = $("<div>");
                            buddyColumn.addClass('col-sm-12 col-md-12 col-lg-3 mx-auto animated slideInDown');

                            var imageTag = $("<img>");
                            var imageSrc = listofBudImgs[i];
                            var personName = $("<p>");

                            imageTag.attr("src", imageSrc);
                            imageTag.addClass("userImage img-fluid");
                            personName.text(listOfBuddies[i]);

                            buddyColumn.append(imageTag);
                            buddyColumn.append(personName);
                            $("#buddyResults").append(buddyColumn);
                        }
                        console.log(headerText);

                    } else if (userMatched === false) {
                        console.log("sorry no match yet :(")
                        $("#buddyResults").empty();

                        var buddyDiv = $("<div>");
                        var header = $("<h3>");
                        var loadingImg = $("<img>");
                        loadingImg.attr("src", "assets/images/logo_small.svg");
                        loadingImg.addClass('animated infinite rotateIn rotateOut loading');
                        header.text("Searching for fellow Foodtroverts...");
                        buddyDiv.append(loadingImg);
                        buddyDiv.append(header);


                        $("#buddyResults").append(buddyDiv);
                    }

                })
                con.onDisconnect().remove().then(function () {
                    // storageRef.delete();
                });
            });
        }
    });

});

