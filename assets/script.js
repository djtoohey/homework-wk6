// waits for page to load
$(document).ready(function () {
    // declare array for cities
    var citySearchArray = [];

    // gets the last search from localstorage
    var lastSearch = localStorage.getItem("search");

    // checks if lastsearch is empty
    if (lastSearch === null) {
        // if it is, hide the history div so the empty card is not visible
        $("#history").hide();
    }
    else {
        // if it has a city
        // add the city to array
        citySearchArray.push(lastSearch);
        // push a button for the city to the screen
        searchList(citySearchArray, lastSearch);
    }

    // find cityBtn
    var cityBtn = $("#search-city-btn")

    // find 5day heading
    var forecastHeading = $("#5day-heading");
    // hide it 
    forecastHeading.hide();

    // find today
    var todayDiv = $("#today");
    // hide it
    todayDiv.hide();

    // when citybtn is clicked
    cityBtn.on("click", function (event) {
        searchCity()
    });


    function searchCity() {
        // stops page reload
        event.preventDefault();

        // openweather app id
        var appID = "a72f11d02f33ee95d3125aac2554131c";

        // empty div with id today
        var todayDiv = $("#today");
        // empty anything that is in todayDiv
        todayDiv.empty();

        // get the value from the search input
        var city = $("#search-city").val();

        // search city, with units set to metric
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + appID;

        // put queryUrl into ajax
        $.ajax({
            url: queryUrl,
            method: "GET"

        }).then(function (weather) {
            // set name to name of city according to openwathermap, makes it easier for comparing
            var name = weather.name;

            // add previously searched cities to the screen
            searchList(citySearchArray, name);

            // for uv index, get lon and lat
            var lon = weather.coord.lon;
            var lat = weather.coord.lat;

            // search city, using coords 
            var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?lon=" + lon + "&lat=" + lat + "&appid=" + appID;

            $.ajax({
                url: uvQueryUrl,
                method: "GET"

            }).then(function (uv) {
                // show todayDiv
                todayDiv.show();

                // set temp, humidity, wind (converting to km/h using m/s* 3.6 = km/h), 
                // name, weather icon, date and uvIndex
                var temp = weather.main.temp;
                var humidity = weather.main.humidity;
                var wind = (weather.wind.speed * 3.6).toFixed(2);
                var name = weather.name;
                var weatherIcon = weather.weather[0].icon;
                var date = unixTimeConverter(weather.dt);
                var uvIndex = uv.value;

                // push all results to todayDiv
                var weatherDiv = $("<div id=todayforecast>");
                var nameH2 = $("<h2>").text(`${name} (${date})`);
                var imgSpan = $("<img>").attr("src", `https://openweathermap.org/img/wn/${weatherIcon}.png`);
                imgSpan.attr("alt", weather.weather[0].description);
                nameH2.append(imgSpan);
                weatherDiv.append(nameH2);

                var tempP = $("<p>").text(`Temperature: ${temp} °C`);
                var humidityP = $("<p>").text(`Humidity: ${humidity}%`);
                var windP = $("<p>").text(`Wind Speed: ${wind} KM/H`);
                var uvP = $("<p>").text("UV Index: ");

                // sets color for badge according to uv index
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

                // adds badge to uv p tag
                uvP.append(uvBadge);

                // pushes all elements to the screen in the todayDiv
                todayDiv.append(weatherDiv, tempP, humidityP, windP, uvP);

                // search city, using coords, with units set to metric
                var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + lon + "&lat=" + lat + "&units=metric&appid=" + appID;

                $.ajax({
                    url: forecastQueryUrl,
                    method: "GET"

                }).then(function (forecast) {
                    // show forecast heading
                    forecastHeading.show()

                    // get forecast div
                    var forecastDiv = $("#forecast");
                    // clear it
                    forecastDiv.empty();

                    // loop through each day except for today for the next 5 days
                    for (let i = 1; i < 5 + 1; i++) {
                        // get date
                        var forecastDate = unixTimeConverter(forecast.daily[i].dt)
                        // get weather icon for date
                        var weatherIcon = forecast.daily[i].weather[0].icon;
                        // get temp for date
                        var temp = forecast.daily[i].temp.day;
                        // get humidity for date
                        var humidity = forecast.daily[i].humidity;

                        // push data to elements
                        var dayDiv = $("<div class='forecast card text-white bg-primary'>");
                        var dateP = $("<h4>").text(forecastDate);
                        var iconP = $("<img>").attr("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                        var tempP = $("<p>").text(`Temp: ${temp}°C`);
                        var humidityP = $("<p>").text(`Humidity: ${humidity}%`);

                        // push all elements to the dayDiv box
                        dayDiv.append(dateP, iconP, tempP, humidityP);
                        // push the dayDiv box to the forecastDiv
                        forecastDiv.append(dayDiv);
                    }
                });
            });
        });
    };

    // convert unix time to human time, return the date
    function unixTimeConverter(unixTime) {
        // convert seconds to milliseconds
        var milliTime = unixTime * 1000;

        // create the exact date & time
        var dateObj = new Date(milliTime);

        // get the date
        var date = (dateObj.toLocaleString()).substr(0, 10);

        // return the date
        return date;
    }

    // set search list
    function searchList(citySearchArray, name) {
        // check if name is already in citySearchArray
        if (citySearchArray.includes(name)) {
            // if is, find its index pos
            var deletePos = citySearchArray.indexOf(name);
            // and delete it
            citySearchArray.splice(deletePos, 1);
        }

        // add name to array in first pos
        citySearchArray.unshift(name);
        // set it to search in localStorage
        localStorage.setItem("search", name);

        // get history div
        var cityHistoryDiv = $("#history");
        // show cityHistoryDiv
        cityHistoryDiv.show();
        // empty it
        cityHistoryDiv.empty();

        // create new list
        var cityList = $("<ul>");
        // add classes list-group and list-group-flush from bootstrap
        cityList.addClass("list-group list-group-flush");

        for (let i = 0; i < citySearchArray.length; i++) {
            // create a new btn
            var newCity = $("<button>");
            // add classes list-group-item btn-group-vertical from bootstrap
            newCity.addClass("list-group-item btn-group-vertical");

            // set the text to the array index text
            newCity.text(citySearchArray[i]);

            // add click event 
            newCity.on("click", function () {
                // sets the value of the search box to the array index text
                $("#search-city").val(citySearchArray[i]);
                // searchCity function runs
                searchCity();
            });

            // add button to list
            cityList.append(newCity);
            // add list to div
            cityHistoryDiv.append(cityList);
        }
    }
});