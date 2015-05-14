var shipList = [];
var shipTotal = 0;

$(document).ready(function(){
	var apiCall = "http://swapi.co/api/starships/";
	hitAPI(apiCall);
});


var hitAPI = function(apiURL){

	return $.get(apiURL, onResponse);

}

var onResponse = function(dataObject){
	//Update ShipList
	for (i = 0; i<dataObject.results.length; i++){
		shipList[shipTotal] = dataObject.results[i];
		//console.log("Ship : " + dataObject.results[i].name + " added at index " + shipTotal);
		$(".shipListGroup").append("<div class=\"list-group-item\" onclick=\"inspectShip(this," + shipTotal + ")\">" + shipList[shipTotal].name + "</div>");
		shipTotal++;
	}

	//Get Next Pages
	//next will == null when on last page
	if (dataObject.next !== null)
	{
		console.log("Getting next page");
		hitAPI(dataObject.next);
	}
	return;
}

var inspectShip = function(e, shipNumber) {
	//Disactivate previously activated element
	$(".list-group .list-group-item").removeClass("active");
	//Activate clicked element
	$(e).addClass("active");
	//Populate Ship Details view

}
