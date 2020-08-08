//I have 2 issues still... remaining: 

//1) It stopped rendering buttons
//2) Local storage is creating duplicate buttons 

//Current Weather, Five Day, and UV 
$('#citySearchBtn').on("click", displayWeather);
//$(".city").on("click", displayWeather);
$(document).on("click", ".city", makeBtnWork);

function displayWeather(){
    
    event.preventDefault();

    var citySearch = $('#cityID').val().trim() 
    var currentDay = moment().format("MMMM Do, YYYY")
    var myKey = "6cdfc4f710fc4985c2ade926b44f8ae9";
    var queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + myKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
        // Transfer content to HTML
        $(".date").html(" " + currentDay);
        $(".crrCity").html("<h3>" + response.name + "</h3>");
        $(".wind").text("Wind Speed: " + response.wind.speed + "mph");
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // add temp content to html
        $(".tempF").text("Temperature: " + tempF.toFixed(0) + "℉");

        //Weather Icon
        $(".icon").empty();
        var imageURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"; 
        var iconImage = $("<img>");
        iconImage.attr("src", imageURL);
        iconImage.attr("alt", "Weather Icon");  
        $(".icon").append(iconImage);     
        
        //UVI
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?" + "&appid=" + myKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
            $.ajax({
            url: uvURL,
            method: "GET"
                }).then(function (uvresponse) {
            var uvindex = uvresponse.value;
            var riskColor;
            if (uvindex <= 4) {
                riskColor = "green";
            }
            else if (uvindex >= 4 || uvindex <= 7) {
                riskColor = "yellow";
            }
            else {
                riskColor = "red";
            }
            $('.uv').text("UV: " + uvindex).attr("style", ("background-color:" + riskColor));
        });
        fiveDay();
    }); 

    function fiveDay(){
        event.preventDefault();
        $("#fiveDay").empty();
        var citySearch = $('#cityID').val().trim();
        var myKey = "6cdfc4f710fc4985c2ade926b44f8ae9";
    
        var queryURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + myKey;
    
        $.ajax({
            url: queryURL,
            method: "GET"
    
        }) .then(function (response) {
            console.log(response)
            // Creating a div to hold each day
    
            var dayDiv = $("<div>").attr("class", "day");
            $("#fiveDay").append(dayDiv);
    
            for (var i = 0; i < response.list.length; i=i+8) {
                var dayBox = $("<div>").attr("class", "dayBox");
                dayDiv.append(dayBox);
    
                var dayCard = $("<div>").attr("class", "dayCard");
                dayBox.append(dayCard);
    
                var dayHead = $("<div>").attr("class", "card-header").text(moment(response.list[i].dt, "X").format("dddd"));
                dayCard.append(dayHead);
    
                var dayImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png");
                dayCard.append(dayImg);
    
                var cardBody = $("<div>").attr("class", "card-body");
                dayCard.append(cardBody);
                
                var tempF = (response.list[i].main.temp - 273.15) * 1.80 + 32;
    
                cardBody.append($("<p>").attr("class", "card-text").html("Temp: " + tempF.toFixed(0) + "℉"));
    
                cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + "%"));               
            } //end of for
        }); //end of .then  
    }; //end of fiveDay Function   
} //end of displayWeather Function

var priorCities = [];

function renderButtons() {

    // Deleting the city buttons prior to adding new city buttons
    // (this is necessary otherwise we will have repeat buttons)
    $("#priorSearches").empty();

    for (var i = 0; i < priorCities.length; i++) {
        var a = $("<button>");
        a.addClass("city");
        a.attr("data-name", priorCities[i]);
        a.text(priorCities[i]);
        $("#priorSearches").append(a);
    }
}

    // This function handles events where one button is clicked
    $("#citySearchBtn").on("click", function(event) {

    event.preventDefault();
    var city = $("#cityID").val().trim();
    priorCities.push(city);
    localStorage.setItem("search",JSON.stringify(priorCities));
    renderButtons();
    });

renderButtons();

    function renderLocalStorage(){
        var cities = JSON.parse(localStorage.getItem("search"));
        if (cities){
            priorCities = cities;
            renderButtons();
        }
    }

    function makeBtnWork (event){
        event.preventDefault();
        console.log($(this).attr("data-name"));
        $('#cityID').val($(this).attr("data-name"));
        displayWeather();
    }

renderLocalStorage();









