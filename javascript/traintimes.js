// Initialize Firebase
var config = {
  apiKey: "AIzaSyAlRpl3hMd2MrOZRk0-YsdY6E0IOBfwKkI",
  authDomain: "trainhomework-13e76.firebaseapp.com",
  databaseURL: "https://trainhomework-13e76.firebaseio.com",
  projectId: "trainhomework-13e76",
  storageBucket: "trainhomework-13e76.appspot.com",
  messagingSenderId: "1047406425516"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding new Train
$("#addTrainButton").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName").val().trim();
  var trainDest = $("#destination").val().trim();
  var trainStart = moment($("#time").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#myRange").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    dest: trainDest,
    time: trainStart,
    myRange: trainFrequency
  };

  // Uploads train info to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.trainDest);
  console.log(newTrain.trainStart);
  console.log(newTrain.frequency);

  // Clears all of the text-boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#time").val("");
  $("#myRange").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().myRange;

  // Train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart, "HH:mm");
  console.log(trainFrequency);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var startTimeConverted = moment(trainStart, "hh:mm").subtract(1, "years");
  console.log(startTimeConverted);

  // time right now //
  var currentTime = moment().calendar();
  console.log(currentTime);
  
  // To calculate the time left
  var timeLeft = moment().diff(moment(startTimeConverted, "minutes"));
  console.log(timeLeft);

  var remainder = timeLeft % trainFrequency;
  console.log(remainder);

  var tMinutes = trainFrequency - remainder;
  console.log(tMinutes);

  var nextTrain = moment().add(remainder, "minutes");
  console.log(nextTrain);
  var catchTrain = moment(nextTrain).format("HH:mm");
  console.log(catchTrain);

  // Prettify the train start
  var trainStartPretty = moment.unix(trainStart).format("HH:mm");
  console.log(trainStartPretty);

  // prettify the time left
  var timeLeftPretty = moment.unix(timeLeft).format("mm");
  console.log(timeLeftPretty);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFrequency),
    $("<td>").text(trainStartPretty),
    $("<td>").text(timeLeftPretty)
  );

  // Append the new row to the table
  $("#trainTable > tbody").append(newRow);
});

// date picker //

var timepicker = new TimePicker('time', {
  lang: 'en',
  theme: 'dark'
});
timepicker.on('change', function (evt) {

  var value = (evt.hour || '00') + ':' + (evt.minute || '00');
  evt.element.value = value;

});

//   time slider //

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
}
