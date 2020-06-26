// generic
// https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=a72f11d02f33ee95d3125aac2554131c"

// put ajax within ajax

// uv index
// https://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37&appid=a72f11d02f33ee95d3125aac2554131c

// for history of search
// https://getbootstrap.com/docs/4.5/components/card/#list-groups


var citySearchArray = [];

var lastSearch = localStorage.getItem("search");
citySearchArray.push(lastSearch);


// waits for page to load
$(document).ready(function () {
    searchList(citySearchArray, lastSearch);
    // finds citybtn
    var cityBtn = $("#search-city-btn")

    var forecastHeading = $("#5day-heading");

    forecastHeading.hide();

    var todayDiv = $("#today");
    todayDiv.hide();

    // when citybtn is clicked
    cityBtn.on("click", function (event) {
        searchCity()
    });


    function searchCity() {
        event.preventDefault();
        // openweather app id
        var appID = "a72f11d02f33ee95d3125aac2554131c";

        // empty div with id today
        var todayDiv = $("#today");

        todayDiv.empty();

        // get the value from the search input
        var city = $("#search-city").val();

        // search city, with units set to metric
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + appID;
        // console.log("init query" + queryUrl);

        // put queryUrl into ajax
        $.ajax({
            url: queryUrl,
            method: "GET"

        }).then(function (weather) {
            // get weather back
            // console.log(weather);

            var name = weather.name;

            // search history
            // change screen
            searchList(citySearchArray, name);

            // for uv, get lon and lat
            var lon = weather.coord.lon;
            var lat = weather.coord.lat;

            var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?lon=" + lon + "&lat=" + lat + "&appid=" + appID;
            $.ajax({
                url: uvQueryUrl,
                method: "GET"

            }).then(function (uv) {
                todayDiv.show();
                // set temp, humidity, wind (converting to km/h using m/s* 3.6 = km/h), name


                var temp = weather.main.temp;
                var humidity = weather.main.humidity;
                var wind = (weather.wind.speed * 3.6).toFixed(2);
                var name = weather.name;
                var weatherIcon = weather.weather[0].icon;


                var unixTime = 1593183227;
                var milliTime = unixTime * 1000;
                var dateObj = new Date(milliTime);
                var dateFormat = (dateObj.toLocaleString()).substr(0, 10);
                // console.log("HEY LISTEN " + dateFormat);

                var uvIndex = uv.value;

                // push all results to todayDiv
                var weatherDiv = $("<div id=todayforecast>")
                var nameH2 = $("<h2>").text(`${name} (${dateFormat})`);

                var imgSpan = $("<img>").attr("src", `https://openweathermap.org/img/wn/${weatherIcon}.png`);
                imgSpan.attr("alt", weather.weather[0].description);
                nameH2.append(imgSpan);
                weatherDiv.append(nameH2);

                var tempP = $("<p>").text(`Temp: ${temp} °C`);
                var humidityP = $("<p>").text(`Humidity: ${humidity}%`);
                var windP = $("<p>").text(`Wind Speed: ${wind} KM/H`);
                var uvP = $("<p>").text("UV Index: ");

                // sets color for badge
                if (uvIndex <= 2) {
                    // less than or equal to 2 === Green Badge
                    var uvBadge = $("<span class='badge badge-green'>").text(uvIndex);
                }
                else if (uvIndex <= 5) {
                    // between 2 and 5 === Yellow Badge
                    var uvBadge = $("<span class='badge badge-yellow'>").text(uvIndex);
                }
                else if (uvIndex <= 7) {
                    // between 5 and 7 === Orange Badge
                    var uvBadge = $("<span class='badge badge-orange'>").text(uvIndex);
                }
                else if (uvIndex <= 10) {
                    // between 7 and 10 === Red Badge
                    var uvBadge = $("<span class='badge badge-red'>").text(uvIndex);
                }
                else {
                    // More than 10 === Purple Badge
                    var uvBadge = $("<span class='badge badge-purple'>").text(uvIndex);
                }

                uvP.append(uvBadge);

                // currently pushes to under the search bar
                todayDiv.append(weatherDiv, tempP, humidityP, windP, uvP);

                var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&units=metric&appid=" + appID;
                // console.log(forecastQueryUrl);
                $.ajax({
                    url: forecastQueryUrl,
                    method: "GET"

                }).then(function (forecast) {
                    var forecastHeading = $("#5day-heading");
                    forecastHeading.show();

                    var forecastDiv = $("#forecast");
                    forecastDiv.empty();

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
                        // console.log(forecastDate, temp, humidity, weatherIcon);

                        // empty div with id forecast


                        // push data to screen
                        var dayDiv = $("<div class='forecast card text-white bg-primary'>");
                        var dateP = $("<p>").text(forecastDate);
                        var iconP = $("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                        var tempP = $("<p>").text("Temp " + temp);
                        var humidityP = $("<p>").text("Humidity " + humidity);



                        dayDiv.append(dateP, iconP, tempP, humidityP);
                        forecastDiv.append(dayDiv);




                    }

                });



            });
        });

    };
    function searchList(citySearchArray, name) {
        if (citySearchArray.includes(name)) {

            var deletePos = citySearchArray.indexOf(name);
            citySearchArray.splice(deletePos, 1);
        }

        citySearchArray.unshift(name);
        localStorage.setItem("search", name);
        var cityHistoryDiv = $("#history");
        cityHistoryDiv.empty();
        cityHistoryDiv.addClass("card");
        var cityList = $("<ul>");
        cityList.addClass("list-group list-group-flush");
        for (let i = 0; i < citySearchArray.length; i++) {
            var newCity = $("<button>");
            newCity.addClass("list-group-item btn-group-vertical");

            newCity.text(citySearchArray[i]);

            newCity.on("click", function () {
                $("#search-city").val(citySearchArray[i]);
                searchCity();
            });



            cityList.append(newCity);
            cityHistoryDiv.append(cityList);


        }
    }
});

