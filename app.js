var shipList = [];
var shipTotal = 0;

$(document).ready(function(){
	$(".previousOwnerButton").hide();

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
		//console.log("Getting next page");
		hitAPI(dataObject.next);
	}
	return;
}

var inspectShip = function(e, shipNumber) {
	//dat efficiency do
	if (!e.classList.contains("active")) {

		//Disactivate previously activated element
		$(".list-group .list-group-item").removeClass("active");

		//Remove any already highlighted ship
		$(".shipDetailsList").empty();
		$(".previousOwnerButton").hide();

		//Activate clicked element
		$(e).addClass("active");


		//MAKE IT PRITTY -- ANIMATIONS == PRODUCTION VALUE
		$(".shipDetailsList").hide();

		//
		$(".shipDetailsList").append("<div class=\"list-group-item\">Model: " + shipList[shipNumber].model + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Class: " + shipList[shipNumber].starship_class + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Price: " + shipList[shipNumber].cost_in_credits + " credits</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Top Speed: " + shipList[shipNumber].MGLT + " MGLT/Hour</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Top Atmospheric Speed: " + shipList[shipNumber].max_atmosphering_speed + " Units/Time</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Cargo Capacity: " + shipList[shipNumber].cargo_capacity + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Crew: " + shipList[shipNumber].crew + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Hyperdrive Rating: " + shipList[shipNumber].hyperdrive_rating + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Length: " + shipList[shipNumber].length + " meters</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Manufacturer: " + shipList[shipNumber].manufacturer + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Passengers: " + shipList[shipNumber].passengers + "</div>");

		//THE PRESTIGE
		$(".shipDetailsList").show("fast");

		if(shipList[shipNumber].pilots.length > 0)
		{
			$(".previousOwnerButton").show("fast");
			$(".previousOwnerButton").on('click', function() {
				//console.log(shipNumber);
				$.get(shipList[shipNumber].pilots
			});
		}
	}

}

var gotCrap = function(shipIndex) {
	//console.log("Getting Previous Owner info for ship number: " + shipIndex);


}
