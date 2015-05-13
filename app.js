var shipList = [];

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
		shipList[i] = dataObject.results[i];
		$(".shipListGroup").append("<div class=\"panel\" onclick=\"inspectShip(this," + i + ")\">" + shipList[i].name + "</div>");
	}

	if (dataObject.next !== null)
	{
		console.log("Getting next page");
		hitAPI(dataObject.next);
	}
	return;
}

var inspectShip = function(e, shipNumber) {
	console.log(shipList[shipNumber]);
}
