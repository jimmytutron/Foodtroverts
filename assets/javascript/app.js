$(document).ready(function () {
    //=========================GLOBAL===============================//


    // event.preventDefault();


    var authKey = "AIzaSyAZPAsF-Fb-C5lnhtkitRLjplX24zRkqeE";
    var city = "San Francisco";
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+" + city + "&key=" + authKey;

    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: 'jsonp',
        cache: false
    }).then(function (response) {
        console.log(response);

    });






    
//=====Section below for ipstack is working.=======/
    // $.get("http://api.ipstack.com/check?access_key=30d7443ccd61f6cddd884e4525271361", function (res) {
    //     userLocationInfo = res;
    //     console.log("userLocationInfo:", userLocationInfo)
    //     currentCity = res["city"];
    //     console.log(currentCity);
    // }, "jsonp");



    //=====================GLOBAL (END)=============================//
    //=========================Jimmy===============================//






    //=====================Jimmy (END)=============================//
    //=========================Eric===============================//






    //=====================Eric (END)=============================//
    //=========================Lena===============================//







    //=====================Lena (END)=============================//
});