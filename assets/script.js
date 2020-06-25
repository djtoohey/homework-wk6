// generic
// https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=a72f11d02f33ee95d3125aac2554131c"

// put ajax within ajax

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
                var uvP = $("<p>").text("UV " + uvIndex);

                // currently pushes to under the search bar
                todayDiv.append(nameH1, tempP, humidityP, windP, uvP);

                // https://openweathermap.org/api/one-call-api <-- CHANGE TO THIS MUCH EASIER THAN FORECAST

                var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + appID;
                console.log(forecastQueryUrl);
                $.ajax({
                    url: forecastQueryUrl,
                    method: "GET"

                }).then(function (forecast) {
                    days = 0;
                    var i = 0;
                    while (days < 5) {
                        // console.log(i);
                        var newDateCheck = forecast.list[i].dt_txt.substr(11, 8);
                        if (newDateCheck === "00:00:00") {
                            days++;
                            // console.log(forecast.list[i].dt_txt.substr(0, 10));

                            var newDate = forecast.list[i].dt_txt.substr(0, 10);

                            var weatherIcon = forecast.list[i].weather[0].icon;

                            var temp = forecast.list[i].main.temp;
                            var humidity = forecast.list[i].main.humidity;

                            console.log(newDate, weatherIcon, temp, humidity);
                        }
                        i++;

                    }

                });



            });
        });

    });
});