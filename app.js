$(document).ready(function(){
	var apiCall = "http://swapi.co/api/starships/";
	hitAPI(apiCall);
	$(".next").on('click', nextPage);
	$(".previous").on('click', previousPage);
});


var hitAPI = function(apiURL){

	return $.get(apiURL, onResponse);
}

var onResponse = function(dataObject){
	//Update ShipList
	var shipList = dataObject.results;
	for (i = 0; i<shipList.length; i++){
		console.log(shipList[i]);
		$(".shipListPanelGroup").append("<div class=\"panel\">" + shipList[i].name + "</div>");
	}
}

var nextPage = function(){

}

var previousPage = function(){

}
