//Cities and Variables


var city="";

var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];

//Search City
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//API  Key
var APIKey="";

function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
function currentWeather(city){

//Query for URL
    var queryURL= "" + city + "" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
         
         console.log(response);
         
         var weathericon= response.weather[0].icon;
         var iconurl=""+weathericon +"";
         
         var date=new Date(response.dt*1000).toLocaleDateString();
         
         $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");
        
 
         var tempF = (response.main.temp - 273.15) * 1.80 + 32;
         $(currentTemperature).html((tempF).toFixed(2)+"");
         
         $(currentHumidty).html(response.main.humidity+"%");
         
         var ws=response.wind.speed;
         var windsmph=(ws*2.237).toFixed(1);
         $(currentWSpeed).html(windsmph+"MPH");
         
         UVIndex(response.coord.lon,response.coord.lat);
         forecast(response.id);
         if(response.cod==200){
             sCity=JSON.parse(localStorage.getItem("cityname"));
             console.log(sCity);
             if (sCity==null){
                 sCity=[];
                 sCity.push(city.toUpperCase()
                 );
                 localStorage.setItem("cityname",JSON.stringify(sCity));
                 addToList(city);
             }
             else {
                 if(find(city)>0){
                     sCity.push(city.toUpperCase());
                     localStorage.setItem("cityname",JSON.stringify(sCity));
                     addToList(city);
                 }
             }
         }
 
     });
 }

 //UV Index
 function UVIndex(ln,lt){
    
    var uvqURL=""+ APIKey+""+lt+""+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
    

function forecast(cityid){
    var dayover= false;
    var queryforcastURL=""+cityid+""+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl=""+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempF+"&#8457");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}

//Attempt at lists
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}

function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}