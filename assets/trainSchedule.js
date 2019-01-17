//Initialize Firebase database
// Initialize Firebase
var config = {
	apiKey: "AIzaSyDVHDHJB9_nzHoIxEmbia_nHhCctNVFyfE",
	authDomain: "traintimes-8b5c3.firebaseapp.com",
	databaseURL: "https://traintimes-8b5c3.firebaseio.com",
	projectId: "traintimes-8b5c3",
	storageBucket: "traintimes-8b5c3.appspot.com",
	messagingSenderId: "519966311888"
};
firebase.initializeApp(config);

//Create database variable to create reference to firebase.database().
var database = firebase.database();

var tMinutesTillTrain = 0;

var tRow = "";
var getKey = "";

//Click event for the submit button. When user clicks Submit button to add a train to the schedule...
$("#submit-button").on("click", function(event) {
	event.preventDefault();

	//Grab the values that the user enters in the text boxes in the "Add train" section. Store the values in variables.
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrainTime = $("#first-train-time").val().trim();
	var trainFrequency = $("#frequency2").val().trim();

	//Print the values that the user enters in the text boxes to the console for debugging purposes.
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(trainFrequency);

var newTrain = {
    name: trainName,
    dest: destination,
    start: firstTrainTime,
    freq: frequency
  };

  database.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.start);
  console.log(newTrain.freq);

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency2").val("");
});

database.ref().on("child_added", function (childSnapshot) {
	console.log(childSnapshot.val());

	//Set variables for form input field values equal to the stored values in firebase.
	var trainName = childSnapshot.val().train-name;
	var destination = childSnapshot.val().destination;
	var firstTrainTime = childSnapshot.val().first-train-time;
	var trainFrequency = childSnapshot.val().frequency2;
	var nextTrain = childSnapshot.val().nextTrain;
	var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;
	var currentTime = childSnapshot.val().currentTime;

	//Train info
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(nextTrain);
	console.log(tMinutesTillTrain);
	console.log(trainFrequency);
	console.log(currentTime);

	//Moment JS math caclulations to determine train next arrival time and the number of minutes away from destination.
	// First Time (pushed back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	console.log(firstTimeConverted);

	// Current Time
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	// Difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
	var tRemainder = diffTime % trainFrequency;
	console.log(tRemainder);

	// Minute Until Train
	var tMinutesTillTrain = trainFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	// Next Train
	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


	//Update the HTML (schedule table) to reflect the latest stored values in the firebase database.
	var tRow = $("<tr>").append(
		$("<td>").text(trainName),
		$("<td>").text(destination),
		$("<td>").text(nextTrain),
		$("<td>").text(trainFrequency),
		$("<td>").text(tMinutesTillTrain)
	);

	// Append the table row to the table body
	$("#schedule-body > tbody").append(tRow);
});


// time picker info

var timepicker = new TimePicker('first-train-time', {
	lang: 'en',
	theme: 'dark'
});

timepicker.on('change', function (evt) {

	var value = (evt.hour || '00') + ':' + (evt.minute || '00');
	evt.element.value = value;

});

// time slider info

var slider = document.getElementById("frequency2");
var output = document.getElementById("frequency");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
	output.innerHTML = this.value;
};
