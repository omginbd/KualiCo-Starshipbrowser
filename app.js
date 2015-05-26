// KualiCo StarshipTrader.com
// Made By: Michael Collier

var shipList = [];
var searchFilterList = [];
var priceFilterList = [];
var visibleShipList = [];
var ajaxRequests = [];
var shipTotal = 0;

$(document).ready(function(){
  //Fix Window Height
  $(".shipDetailsPane").height(function(){ return 0.74 * $(window).height()});
  $(".shipBrowserPane").height(function(){ return 0.74 * $(window).height()});
  $(".filterOptionsPane").height(function(){ return 0.74 * $(window).height()});
  $(".headerTitleWell").height(function(){ return 0.05 * $(window).height()});
  $(".footerWell").height(function(){ return .02 * $(window).height()});

  //Show Mr. Ajax who's boss
	var apiCall = "http://swapi.co/api/starships/";
	ajaxRequests.push(punchAPI(apiCall));

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
	sortForPrice(evt);
	  updateDisplayList(visibleShipList);
	});

	$(".sortHighToLow").on('click', function(evt){
	  sortForPrice(evt);
	  visibleShipList.reverse();
	  updateDisplayList(visibleShipList);
	});

	$(".sortAToZ").on('click', function(evt){
	  sortByName(evt);
	  updateDisplayList(visibleShipList);
	});

	$(".sortZToA").on('click', function(evt){
	  sortByName(evt);
	  visibleShipList.reverse();
	  updateDisplayList(visibleShipList);
	});
});

var punchAPI = function(apiURL){

	return $.get(apiURL, onResponse);

}

var onResponse = function(dataObject){
	//Update ShipList
	ajaxRequests.pop();
	for (i = 0; i<dataObject.results.length; i++){
		shipList[shipTotal] = dataObject.results[i];
		shipTotal++;
	}

	//Get Next Pages
	//next will == null when on last page
	if (dataObject.next !== null)
	{
		ajaxRequests.push(punchAPI(dataObject.next));
	} else {
	  ajaxRequests.pop();
	  shipTotal--;
	  $(".shipLoadingBar").hide("fast");
	  $("#searchText").prop('disabled', false);
	  $("#filterPrice").prop('disabled', false);
	  $(".sortDrop").prop('disabled', false);
	  updateDisplayList(shipList);
	  visibleShipList = shipList.slice();
	}
	return;
}

var updateDisplayList = function(shipArray){
  $(".shipListGroup").empty();
  for (i=0; i<shipArray.length; i++){
	if (shipArray[i].cost_in_credits == "unknown"){
	  $(".shipListGroup").append("<div class=\"list-group-item unknownPrice\" onclick=\"inspectShip(this," + i + ")\">" +
	   shipArray[i].name + "</div>");
	} else {
	   $(".shipListGroup").append("<div class=\"list-group-item\" onclick=\"inspectShip(this," + i + ")\">" +
	   shipArray[i].name + "</div>");
	}
  }
}

var inspectShip = function(e, shipNumber) {
	//dat efficiency do
	if (!e.classList.contains("active")) {

		//Disactivate previously activated element
		$(".list-group .list-group-item").removeClass("active");

		//Remove old ship data
		$(".shipDetailsList").empty();
		$(".previousOwnerList").empty();
		$(".previousOwnerTitle").hide();
		$(".previousOwnerBar").hide();

		//Activate clicked element
		$(e).addClass("active");

		//Abort old Ajax Requests
		for (i=0; i<ajaxRequests.length; i++){
			ajaxRequests[i].abort();
		}

		//MAKE IT PRITTY -- ANIMATIONS === PRODUCTION VALUE
		$(".shipDetailsList").hide();

		//
		$(".shipDetailsList").append("<div class=\"list-group-item\">Model: " + visibleShipList[shipNumber].model + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Class: " + visibleShipList[shipNumber].starship_class + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Price: " + visibleShipList[shipNumber].cost_in_credits + " credits</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Top Speed: " + visibleShipList[shipNumber].MGLT + " MGLT/Hour</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Top Atmospheric Speed: " +
		visibleShipList[shipNumber].max_atmosphering_speed + " Units/Time</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Cargo Capacity: " + visibleShipList[shipNumber].cargo_capacity + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Crew: " + visibleShipList[shipNumber].crew + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Hyperdrive Rating: " + visibleShipList[shipNumber].hyperdrive_rating + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Length: " + visibleShipList[shipNumber].length + " meters</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Manufacturer: " + visibleShipList[shipNumber].manufacturer + "</div>");

		$(".shipDetailsList").append("<div class=\"list-group-item\">Passengers: " + visibleShipList[shipNumber].passengers + "</div>");

		//THE PRESTIGE
		$(".shipDetailsList").show("fast");
		if(visibleShipList[shipNumber].pilots.length > 0)
		{
		  var pilotCounter = 0;
		  $(".previousOwnerBar").show("fast");
		  $(".previousOwnerTitle").show("fast");
			for (i = 0; i < visibleShipList[shipNumber].pilots.length; i++) {
				ajaxRequests.push($.get(visibleShipList[shipNumber].pilots[i], function(dataObject){
					pilotCounter++;
					$(".previousOwnerList").append("<div class=\"list-group-item\">" + dataObject.name + "</div>");
					if (pilotCounter === visibleShipList[shipNumber].pilots.length){
						$(".previousOwnerBar").hide("fast");
						$(".previousOwnerList").show("fast");
					}
				}));
			}
		}
	}

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

var sortForPrice = function(evt) {
  for (i=0; i<visibleShipList.length; i++){
	if (visibleShipList[i].cost_in_credits == "unknown") {
	  visibleShipList.splice(i, 1);
	  i--;
	}
  }
	visibleShipList.sort(function(a, b){
	return Number(a.cost_in_credits) - Number(b.cost_in_credits);
	});
}

var sortByName = function(evt){
  if ($("#searchText").val() === "" && $("#filterPrice").val() === "") {
	visibleShipList = shipList.slice();
  }
  visibleShipList.sort(function(a, b){
	if (a.name.toLowerCase() < b.name.toLowerCase()){
	  return -1;
	} else if (a.name.toLowerCase() > b.name.toLowerCase()){
	  return 1;
	} else {
	  return 0;
	}
  });
}
