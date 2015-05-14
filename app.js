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

	for (shipTotal; shipTotal<dataObject.count; shipTotal++){
		console.log(shipList);
		console.log(dataObject);
		shipList[shipTotal] = dataObject.results[shipTotal];
		console.log("Adding ship " + dataObject.results[shipTotal].name + ". Added. Now shiplist shows" + shipList[shipTotal].name + " at index " + shipTotal);
		$(".shipListGroup").append("<div class=\"panel\" onclick=\"inspectShip(this," + shipTotal + ")\">" + shipList[shipTotal].name + "</div>");
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
