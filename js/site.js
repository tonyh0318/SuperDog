const events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

//this function is loaded automatically on page load with window.onload in app.html
//It builds a dropdown of specific cities for PICK A LOCATION
//when user Adds Data, they may enter a new City
//this function will look for distinct cities to list them once in PICK A LOCATION
function buildDropDown() {

  //grab the select list we want to add city names to.
  let eventDD = document.getElementById("eventDropDown");
  eventDD.innerHTML = "";
  //grab a template we want to use to populate the select list
  const template = document.getElementById("cityDD-template");

  //Pull the events from local storage if there are none pull from the
  //default data.
  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || events;

  /*
    create distinct list of cities using Set...'e' is a name chosen here..could be anything
    ellipses (...) is like writing a for loop
    
    MAP function https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    Traditional Anonymous Function
      function (a) {
        return a + 100;
      }

      Arrow Function Break Down
      1. Remove the word "function" and place arrow between the argument and opening body bracket
        (a) => {
          return a + 100;
        }

       2. Remove the body braces and word "return" -- the return is implied.
        (a) => a + 100;

       3. Remove the argument parentheses
          a => a + 100;
  */
  let cities = curEvents.map((e) => e.city);

  //  A set is a collection of items which are unique i.e no element can be repeated
  //https://www.geeksforgeeks.org/sets-in-javascript/
  //without using ellipses, distinctCities will contatin a Set object..still has the
  //values, but it isn't s pure array object.  Ellipses pulls out the array.
  let distinctCities = [...new Set(cities)];
  let ddItemNode = document.importNode(template.content, true);

  //Add a drop item for 'ALL' to the DOM
  ddItem = ddItemNode.querySelector("a");
  ddItem.setAttribute("data-string", "All");
  ddItem.textContent = "All";
  eventDD.appendChild(ddItem);

  //Loop over the distinct cities and add a dropdown item for each city
  for (var i = 0; i < distinctCities.length; i++) {
    ddItemNode = document.importNode(template.content, true);
    ddItem = ddItemNode.querySelector("a");
    ddItem.setAttribute("data-string", distinctCities[i]);
    ddItem.textContent = distinctCities[i];
    eventDD.appendChild(ddItem);
  }
  //Call Display Stats passing the list of current Events
  displayStats(curEvents);
  //Call display data and show the data in a grid
  displayData();
}

//show stats for the selected city from the drop down
//this fires when the user selects a city.  'element' is the <a> link
//that's passed in here
function getEvents(element) {
  //get the city name from a-link parameter named element
  let city = element.getAttribute("data-string");

  //grab the events from local storage or the default data
  curEvents = JSON.parse(localStorage.getItem("eventsArray")) || events;
  let filteredEvents = curEvents;

  //change the header for the stats area on the page
  document.getElementById("statsHeader").innerHTML = `Stats For ${city} Events`;

  if (city != "All") {
    //use an array filter to return events for the selected city
    filteredEvents = curEvents.filter(function (item) {
      if (item.city == city) {
        return item;
      }
    });
  }
  //Call displays stats with event data filtered for the selected city
  displayStats(filteredEvents);
}

//Display Stats for the set of events being passed in
function displayStats(filteredEvents) {
  let total = 0;
  let average = 0;
  let most = 0;
  let least = -1;
  let currentAttendance = 0;

  //calculate total, average, most and least attendance by looping over the events
  for (let i = 0; i < filteredEvents.length; i++) {
    currentAttendance = filteredEvents[i].attendance;
    total += currentAttendance;

    if (most < currentAttendance) {
      most = currentAttendance;
    }

    if (least > currentAttendance || least < 0) {
      least = currentAttendance;
    }
  }
  average = total / filteredEvents.length;

  //Display the values on the page
  document.getElementById("total").innerHTML = total.toLocaleString();
  document.getElementById("most").innerHTML = most.toLocaleString();
  document.getElementById("least").innerHTML = least.toLocaleString();
  document.getElementById("average").innerHTML = average.toLocaleString(
    undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );
}

//display the event data in a grid using a template
function displayData() {
  const template = document.getElementById("eventData-template");
  const eventBody = document.getElementById("eventBody");
  //clear table first
  eventBody.innerHTML = "";

  //grab the events from local storage  or set currentEvents to an empty array
  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || [];

  //If curEvents is empty set local storage to the default data
  if (curEvents.length == 0) {
    curEvents = events;
    localStorage.setItem("eventsArray", JSON.stringify(curEvents));
  }

  //display the data in a grid by loop over the event data
  for (let i = 0; i < curEvents.length; i++) {
    const eventRow = document.importNode(template.content, true);
    //grab only the columns in the template
    eventCols = eventRow.querySelectorAll("td");

    //Push the current event data to the correct column
    eventCols[0].textContent = curEvents[i].event;
    eventCols[1].textContent = curEvents[i].city;
    eventCols[2].textContent = curEvents[i].state;
    eventCols[3].textContent = curEvents[i].attendance;
    eventCols[4].textContent = new Date(
      curEvents[i].date
    ).toLocaleDateString();

    eventBody.appendChild(eventRow);
  }
}

//Save Event Data form a local modal form into local storage
function saveEventData() {
  //grab the events out of local storage or detault data
  let curEvents = JSON.parse(localStorage.getItem("eventsArray")) || events;

  //grab the values from the modal form push the values into the event object
  let eventObj = {};

  eventObj["event"] = document.getElementById("newEventName").value;
  eventObj["city"] = document.getElementById("newEventCity").value;
  let stateSel = document.getElementById("newEventState");
  eventObj["state"] = stateSel.options[stateSel.selectedIndex].text

  eventObj["attendance"] = parseInt(
    document.getElementById("newEventAttendance").value,
    10
  );
  let eventDate = document.getElementById("newEventDate").value;
  let eventDate2 = `${eventDate} 00:00`
  eventObj["date"] = new Date(eventDate2).toLocaleDateString();

  curEvents.push(eventObj);
  localStorage.setItem("eventsArray", JSON.stringify(curEvents));

  //rebuild the dropdown and data grid with the new event data
  buildDropDown();
  displayData();
}