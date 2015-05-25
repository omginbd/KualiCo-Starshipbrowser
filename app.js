var shipList = [];
var searchFilterList = [];
var priceFilterList = [];
var visibleShipList = [];
var shipTotal = 0;

$(document).ready(function(){
  //Fix Window Height

  $(".shipDetailsPane").height(function(){ return 0.8 * $(window).height()});
  $(".shipBrowserPane").height(function(){ return 0.8 * $(window).height()});
  $(".filterOptionsPane").height(function(){ return 0.8 * $(window).height()});
  $(".headerTitleWell").height(function(){ return 0.2 * $(window).height()});

  //clean up
	$(".previousOwnerButton").hide();

  //Show Mr. Ajax who's boss
	var apiCall = "http://swapi.co/api/starships/";
	punchAPI(apiCall);

	//Bind functions
	$("#searchText").on('keyup', function(evt){
	  searchFilterList = shipList.filter(searchFilter);
	  if ($("#filterPrice").val() !== ""){
	    visibleShipList = searchFilterList.filter(function(n) {
	      return priceFilterList.indexOf(n) != -1;
	    });
	  } else {
	    visibleShipList = searchFilterList;
	  }
		updateDisplayList(visibleShipList);
	});

	$("#filterPrice").on('keyup', function(evt){
	  priceFilterList = shipList.filter(priceFilter);
	  if ($("#searchText").val() !== ""){
	    visibleShipList = priceFilterList.filter(function(n){
	      return searchFilterList.indexOf(n) != -1;
	    });
	  } else {
	    visibleShipList = priceFilterList;
	  }
	  updateDisplayList(visibleShipList);
	});
	
	$(".sortLowToHigh").on('click', function(evt){
	  visibleShipList.sort(function(a, b){
	    
	  });
	});
});

var punchAPI = function(apiURL){

	return $.get(apiURL, onResponse);

}

var onResponse = function(dataObject){
	//Update ShipList
	for (i = 0; i<dataObject.results.length; i++){
		shipList[shipTotal] = dataObject.results[i];
		shipTotal++;
	}

	//Get Next Pages
	//next will == null when on last page
	if (dataObject.next !== null)
	{
		punchAPI(dataObject.next);
	} else {
	  shipTotal--;
	  updateDisplayList(shipList);
	  visibleShipList = shipList;
	}
	return;
}

var updateDisplayList = function(shipArray){
  $(".shipListGroup").empty();
  for (i=0; i<shipArray.length; i++){
	   $(".shipListGroup").append("<div class=\"list-group-item\" onclick=\"inspectShip(this," + i + ")\">" +
	   shipArray[i].name + "</div>");
  }
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

		$(".shipDetailsList").append("<div class=\"list-group-item\">Top Atmospheric Speed: " +
		shipList[shipNumber].max_atmosphering_speed + " Units/Time</div>");

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

var searchFilter = function(elt, i, ar) {
	var compareString = $("#searchText").val();
	  if (elt.name.toLowerCase().includes(compareString.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

var priceFilter = function(elt, i, ar) {
	var comparePrice = $("#filterPrice").val();
	if (Number(elt.cost_in_credits) < Number(comparePrice)){
	  return true;
	} else {
	  return false;
	}
}
