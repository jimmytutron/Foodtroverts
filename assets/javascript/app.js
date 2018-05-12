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
        var userObj = {};
        if (snap.val()) {
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
                        var currentCity = res["city"];
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

                        for (var i = 0; i < 5; i++) {
                            var restDiv = $('<div>');
                            var restNameTag = $('<h1>');
                            var restAddress = $('<p>');
                            var address = results[i]["formatted_address"];
                            var restName = results[i]["name"];

                            restDiv.addClass('restSelected');
                            restDiv.attr('data-id', results[i]['id']);
                            restNameTag.text(restName);
                            restAddress.text(address);

                            restDiv.append(restName);
                            restDiv.append(restAddress);
                            $('#restaurantP').append(restDiv);

                        }


                    }, "jsonp");
                });



            });



            $(document).on("click", ".restSelected", function () {
                //push id into object
                userObj["rest ID"] = $(".restSelected").attr('data-id');

                console.log(userObj);
                var con = connectionsRef.push(userObj);
                var newID = con.getKey();

                //Cycling through current connections, however it is currently including the user from above due to "connectionsRef.push(userObj)"
                //May need to create a unique number ID as part of the object prior to push.
                database.ref("/connections").on("child_added", function (childSnapshot) {

                    var matchID = "";

                    matchRestID = childSnapshot.val()["rest ID"];
                    matchUniqueID = childSnapshot.key;
                    // console.log(userObj["rest ID"]);
                    // console.log(matchRestID);
                    // console.log(newID);
                    // console.log(matchUniqueID);

                    if ((matchRestID === userObj["rest ID"]) && (newID !== matchUniqueID)) {
                        console.log("WOOOHOOO")
                    } else {

                        console.log("sorry no match yet :(")
                    }

                })
                con.onDisconnect().remove();
            });
        }

    });
});




//=====================GLOBAL (END)=============================//
//=========================Jimmy===============================//






//=====================Jimmy (END)=============================//
//=========================Eric===============================//






//=====================Eric (END)=============================//
//=========================Lena===============================//







//=====================Lena (END)=============================//