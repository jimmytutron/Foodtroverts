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

    connectedRef.on("value", function (snap) {
        if (snap.val()) {
            var userObj = {};

            $("#submitPref").on("click", function (event) {
                event.preventDefault();
                
                var userName = $("#userName").val().trim();
                var userFoodPref = $("#foodPref").val().trim();
                var userPrefTime = $("#timePref").val().trim();
                console.log(userName);
                console.log(userFoodPref);
                console.log(userPrefTime);

                //=====IPStack=======/
                $.get("http://api.ipstack.com/check?access_key=30d7443ccd61f6cddd884e4525271361", function (res) {
                    userLocationInfo = res;
                    // console.log("userLocationInfo:", userLocationInfo)
                    currentCity = res["city"];
                    userObj.location = currentCity;
                    // console.log(currentCity);
                    var con = connectionsRef.push(userObj);


                    //=====Google Places=======/

                    var authKey = "AIzaSyAZPAsF-Fb-C5lnhtkitRLjplX24zRkqeE";
                    var city = currentCity;
                    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+" + city + "&key=" + authKey;

                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).then(function (response) {
                        // console.log("Place ID: " + response.results[0].place_id);
                    });











                    //=====================GLOBAL (END)=============================//
                    //=========================Jimmy===============================//






                    //=====================Jimmy (END)=============================//
                    //=========================Eric===============================//






                    //=====================Eric (END)=============================//
                    //=========================Lena===============================//







                    //=====================Lena (END)=============================//
                    con.onDisconnect().remove();
                }, "jsonp");
            });
        }
    });
});