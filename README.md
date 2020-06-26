# homework-wk6
## Submission for the Homework for Week 6 (Weather Dashboard)

Making html:

* made HTML divs based off of the example image, but used Javascript to add anything to the screen
* search button and input are in a form
* array of cities search are added below the form into a list of buttons
* each button changes the search form to what its value is and then searches using that value

API:

* got api data from openweathermap using ajax:
    * to search the user input and get basic data as well as coords
    * to get uv index using coords from first ajax call
    * to get 5 day forecast using coords from first ajax call

Buttons:

* search button runs func searchCity() using the value of the search input to search for the city
* each city button runs the same as the search button by filling the search input with the text of the button and then runs func searchCity() 

LocalStorage:

* list gets search value from localStorage
    * however, if it is not present, it will not do anything
    * but if it does, it will add a button with the city that is saved

Misc Javascript:
* used jquery to get, set and add html elements to the screen
* citySearchArray updates each time a new city is searched
    * if a city has already been searched, it will delete it from the array
    * deleting it from the array, deletes it from the list, but then adds it right back to the first position for both
* func unixTimeConverter 
    * used to convert unix time from openweathermap api into readable time, then returns only the date, not the time
* func searchList
    * used to add city to array as well as search history list
    * adds event listeners to the buttons to update screen to city's api data

Other:

* modified and added to css styling
* added comments 
* made [README.md](/README.md)

![alt text](assets\finished.png "finished page")

## GitHub Pages: https://djtoohey.github.io/homework-wk6/index.html