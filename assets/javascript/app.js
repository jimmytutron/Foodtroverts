$(document).ready(function () {
    //=========================GLOBAL===============================//
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDQhnkQVQxYFIzpHHe3f9j46KYowZpgGRg",
        authDomain: "foodtroverts-1525972295801.firebaseapp.com",
        databaseURL: "https://foodtroverts-1525972295801.firebaseio.com",
        projectId: "foodtroverts-1525972295801",
        storageBucket: "",
        messagingSenderId: "945445095089"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var connectionsRef = database.ref("/connections");
    var connectedRef = database.ref(".info/connected");


    //button for city entry


    connectedRef.on("value", function (snap) {
        if (snap.val()) {
            var userObj = {};

            $("#submitPref").on("click", function (event) {
                event.preventDefault();

                var userName = $("#userName").val().trim();
                var userFoodPref = $("#foodPref").val().trim();
                var userPrefTime = $("#timePref").val().trim();
                var userLoc = $("#userLoc").val().trim();

                userObj["name"] = userName;
                userObj["preference"] = userFoodPref;
                userObj["preference time"] = userPrefTime;
                userObj["location"] = userLoc;


                //=====IPData=======/
                $.get("https://api.ipdata.co/", function (res) {

                    if (userLoc === "") {
                        userLocationInfo = res;
                        console.log("userLocationInfo:", userLocationInfo)
                        var currentCity = res["city"];
                        userObj.location = currentCity;
                    }

                    console.log(userObj.location);
                    var con = connectionsRef.push(userObj);


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
                        console.log(response.results[0]["name"]);
                        console.log(response.results[0]["formatted_address"]);
                        var results = response.results

                        for (var i = 0; i < 5; i++) {
                            console.log(results[i]["name"]);
                            var restDiv = $('<div>');
                            var restNameTag = $('<h1>');
                            var restAddress = $('<p>');
                            var address = results[i]["formatted_address"];
                            var restName = results[i]["name"];

                            restDiv.addClass('restSelected');
                            restNameTag.text(restName);
                            restAddress.text(address);

                            restDiv.append(restName);
                            restDiv.append(restAddress);
                            $('#restaurantP').append(restDiv);

                        }


                        con.onDisconnect().remove();
                    }, "jsonp");
                });



            });



        }

    });

    
    $(document).on("click", ".restSelected", function () {
        //Cycling through current connections, however it is currently including the user from above due to "connectionsRef.push(userObj)"
        //May need to create a unique number ID as part of the object prior to push.
        database.ref("/connections").on("child_added", function (childSnapshot) {

            console.log(childSnapshot.val());
            console.log(childSnapshot.val()["name"]);
            console.log(childSnapshot.val()["preference"])

        })
    });


    
});




                //=====================GLOBAL (END)=============================//
                //=========================Jimmy===============================//






                //=====================Jimmy (END)=============================//
                //=========================Eric===============================//






                //=====================Eric (END)=============================//
                //=========================Lena===============================//







                //=====================Lena (END)=============================//

