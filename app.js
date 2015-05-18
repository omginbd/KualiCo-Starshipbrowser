var shipList = [];
var shipTotal = 0;
var maxPrice = 0;
var minPrice = 0;

$(document).ready(function(){
	$(".previousOwnerButton").hide();

	var apiCall = "http://swapi.co/api/starships/";
	hitAPI(apiCall);

	//Bind functions
	$("#searchText").on('keyup', function(evt){
		disableControls(0);
		searchFilter(this);
	});

	$("#filterPrice").on('keyup', function(evt){
		disableControls(1);
		priceFilter(this);
	});

	$("#showUnknownPriceCheckbox").on('change', function(evt){
		disableControls(2);
		showUnknownPrice(this.checked);
	});
});


var hitAPI = function(apiURL){

	return $.get(apiURL, onResponse);

}

var onResponse = function(dataObject){
	//Update ShipList
	for (i = 0; i<dataObject.results.length; i++){
		shipList[shipTotal] = dataObject.results[i];
		$(".shipListGroup").append("<div class=\"list-group-item\" onclick=\"inspectShip(this," + shipTotal + ")\">" + shipList[shipTotal].name + "</div>");
		//console.log("Ship : " + dataObject.results[i].name + " added at index " + shipTotal);
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

		//Remove old ship data
		$(".shipDetailsList").empty();
		$(".previousOwnerButton").hide();

		//Activate clicked element
		$(e).addClass("active");


		//MAKE IT PRITTY -- ANIMATIONS === PRODUCTION VALUE
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
				$(".modal-body").empty();
				for (i = 0; i < shipList[shipNumber].pilots.length; i++) {
					$.get(shipList[shipNumber].pilots[i], gotCrap);
				}
			});
		}
	}

}

var gotCrap = function(pilotObject) {
	var homeworldObject = $.ajax(pilotObject.homeworld, {async: false});
	$(".modal-body").append("<div class=\"well-sm\"> " + pilotObject.name + "</div>");
	$(".modal-body").append("Homeworld: " + homeworldObject.responseJSON.name);
	$(".modal-body").append("<hr>");
}

var searchFilter = function(e) {
	//Dat Big O notation... Let's just ignore that for this function.
	//console.log(document.getElementById("shipListGroup").childNodes);

	for (i = 0; i < shipList.length; i++){
		if (!shipList[i].name.toLowerCase().includes(e.value.toLowerCase())) {
			$(document.getElementById("shipListGroup").childNodes[i+1]).hide("fast");
		} else {
			$(document.getElementById("shipListGroup").childNodes[i+1]).show("fast");
		}
	}
}

var priceFilter = function(e) {
	for (i = 0; i < shipList.length; i++){
			if (Number(e.value) > Number(shipList[i].cost_in_credits)) {
				$(document.getElementById("shipListGroup").childNodes[i+1]).show("fast");
			} else {
				$(document.getElementById("shipListGroup").childNodes[i+1]).hide("fast");
			}
		}
}

var showUnknownPrice = function(hide){
	if (!hide) {
		for (i=0; i < shipList.length; i++) {
			if (shipList[i].cost_in_credits == "unknown") {
				$(document.getElementById("shipListGroup").childNodes[i+1]).show("fast");
			}
		}
	} else {
		for (i=0; i < shipList.length; i++) {
			if (shipList[i].cost_in_credits == "unknown") {
				$(document.getElementById("shipListGroup").childNodes[i+1]).hide("fast");
			}
		}
	}
}

var disableControls = function(controlCode) {
	switch(controlCode){
		//Except search
		case 0:
			$("#showUnknownPriceCheckbox").addClass("disabled");
			$("#filterPrice").addClass("disabled");
			break;
		//Except priceFilter
		case 1:
			$("#searchText").addClass("disabled");
			$("#showUnknownPriceCheckbox").addClass("disabled");
			break;
		//Except UnknownPrice
		case 2:
			$("#searchText").addClass("disabled");
			$("#filterPrice").addClass("disabled");
			break;
		deafult:
				break;
	}

}
