// generic
// https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=a72f11d02f33ee95d3125aac2554131c"

// put ajax within ajax

// uv index
// https://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=a72f11d02f33ee95d3125aac2554131c

// for history of search
// https://getbootstrap.com/docs/4.5/components/card/#list-groups

// waits for page to load
$(document).ready(function () {
    // finds citybtn
    var cityBtn = $("#search-city-btn")

    // openweather app id
    var appID = "a72f11d02f33ee95d3125aac2554131c";


    // when citybtn is clicked
    cityBtn.on("click", function () {
        // empty div with id today
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
            // console.log(weather);

            // for uv, get lon and lat
            var lon = weather.coord.lon;
            var lat = weather.coord.lat;

            var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?lon=" + lon + "&lat=" + lat + "&appid=" + appID;
            $.ajax({
                url: uvQueryUrl,
                method: "GET"

            }).then(function (uv) {

                // set temp, humidity,wind,name
                var temp = weather.main.temp;
                var humidity = weather.main.humidity;
                var wind = weather.wind.speed;
                var name = weather.name;

                var uvIndex = uv.value;

                // log all results
                console.log("name", name);
                console.log("t", temp);
                console.log("h", humidity);
                console.log("w", wind);
                console.log("uv", uvIndex);

                // push all results to the page
                var nameH1 = $("<h2>").text(name);
                var tempP = $("<p>").text("Temp " + temp);
                var humidityP = $("<p>").text("Humidity " + humidity);
                var windP = $("<p>").text("Wind " + wind);

                // if statements to determine if the uv is bad and change it to a badge 
                // https://getbootstrap.com/docs/4.5/components/badge/
                // <span class="badge badge-primary">


                var uvP = $("<p>").text("UV " + uvIndex);

                // currently pushes to under the search bar
                todayDiv.append(nameH1, tempP, humidityP, windP, uvP);

                var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&units=metric&appid=" + appID;
                console.log(forecastQueryUrl);
                $.ajax({
                    url: forecastQueryUrl,
                    method: "GET"

                }).then(function (forecast) {

                    // loop through each day except for today for the next 5 days
                    for (let i = 1; i < 5 + 1; i++) {
                        // convert unix time to human time
                        var unixTime = forecast.daily[i].dt;
                        var milliTime = unixTime * 1000;
                        var dateObj = new Date(milliTime);
                        var dateFormat = dateObj.toLocaleString();

                        // get date
                        var forecastDate = dateFormat.substr(0, 10);
                        // get weather icon for date
                        var weatherIcon = forecast.daily[i].weather[0].icon;
                        // get temp for date
                        var temp = forecast.daily[i].temp.day;
                        // get humidity for date
                        var humidity = forecast.daily[i].humidity;

                        // debug
                        console.log(forecastDate, temp, humidity, weatherIcon);

                        // empty div with id forecast
                        var forecastDiv = $("#forecast");

                        // push data to screen
                        var dayDiv = $("<div style= width:100px; background-color:blue; margin:0px;>");
                        var dateP = $("<p>").text(forecastDate);
                        var iconP = $("<p>").text(weatherIcon);
                        var tempP = $("<p>").text("Temp " + temp);
                        var humidityP = $("<p>").text("Humidity " + humidity);

                        var emptyDiv = $("<div style= width:50px; background-color:red;margin:0px;>");

                        dayDiv.append(dateP, iconP, tempP, humidityP);
                        forecastDiv.append(dayDiv, emptyDiv);




                    }

                });



            });
        });

    });
});