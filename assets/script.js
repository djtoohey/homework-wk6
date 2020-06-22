// generic
// https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=a72f11d02f33ee95d3125aac2554131c"

// uv index
// https://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=a72f11d02f33ee95d3125aac2554131c

// waits for page to load
$(document).ready(function () {
    // finds citybtn
    var cityBtn = $("#search-city-btn")

    // openweather app id
    var appID = "a72f11d02f33ee95d3125aac2554131c";


    // when citybtn is clicked
    cityBtn.on("click", function () {
        // empty todaydiv
        var todayDiv = $("#today");
        todayDiv.empty();

        // get the value from the search input
        var city = $("#search-city").val();
        // search city, with units set to metric
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + appID;
        console.log(queryUrl);

        // put queryurl into ajax
        $.ajax({
            url: queryUrl,
            method: "GET"

        }).then(function (weather) {
            // get weather back
            console.log(weather);

            // set temp, humidity,wind,name
            var temp = weather.main.temp;
            var humidity = weather.main.humidity;
            var wind = weather.wind.speed;
            var name = weather.name;

            // for uv, get lon and lat
            var lon = weather.coord.lon;
            var lat = weather.coord.lat;

            // set uv to uvIndex func()
            var uv = uvIndex(lon, lat);

            // log all results
            console.log("name", name);
            console.log("t", temp);
            console.log("h", humidity);
            console.log("w", wind);
            console.log("uv", uv);


            // push all results to the page
            var nameH1 = $("<h2>").text(name);
            var tempP = $("<p>").text("Temp " + temp);
            var humidityP = $("<p>").text("Humidity " + humidity);
            var windP = $("<p>").text("Wind " + wind);
            var uvP = $("<p>").text("UV " + uv);

            // currently pushes to under the search bar
            todayDiv.append(nameH1, tempP, humidityP, windP, uvP);

        });
    });

    // uvindex takes in the lon and lat
    function uvIndex(lon, lat) {
        // set query url to uvi with lon of lon and lat of lat
        var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?lon=" + lon + "&lat=" + lat + "&appid=" + appID;
        // console.log(uvQueryUrl);

        // set uv as a local var
        var uv;

        $.ajax({
            url: uvQueryUrl,

            // says its deprecation but it works?
            async: false,

            type: "GET",

            // unsure about this
            success: function (uvResponse) {
                // console.log(uvResponse);
                // set uv to value
                uv = uvResponse.value;
                // console.log("uv: " + uv)

                // bring uv up a level
                return uv;
            }

        });

        // and oncemore to return the function
        return uv;

    };








});