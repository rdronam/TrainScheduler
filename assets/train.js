
  var config = {
    apiKey: "AIzaSyBfVpuZgqBZQLIy7DC1igdgklULEjJwfFA",
    authDomain: "train-schedule-exercise.firebaseapp.com",
    databaseURL: "https://train-schedule-exercise.firebaseio.com",
    projectId: "train-schedule-exercise",
    storageBucket: "train-schedule-exercise.appspot.com",
    messagingSenderId: "604894001238"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var database = firebase.database();
var pageLoadTrigger = false;
var trainName;
var destination;
var firstTrainTime;
var frenquency;



database.ref().on("child_added", function(childSnapshot) {
    if (pageLoadTrigger === false) {
        pageLoadTrigger = true;

        var rowDiv = $('<div>').addClass('row');
        var trainNameCol = $('<div>').addClass('col-sm-3');
        trainNameCol.append($('<h4>').addClass('margins').text('Train Name'));
        rowDiv.append(trainNameCol);
        var destinationCol = $('<div>').addClass('col-sm-3');
        destinationCol.append($('<h4>').addClass('margins').text('Destination'));
        rowDiv.append(destinationCol);
        var frenquencyCol = $('<div>').addClass('col-sm-2 text-center');
        frenquencyCol.append($('<h4>').addClass('margins').text('Frequency (min)'));
        rowDiv.append(frenquencyCol);
        var nextArrivalCol = $('<div>').addClass('col-sm-2 text-center');
        nextArrivalCol.append($('<h4>').addClass('margins').text('Next Arrival'));
        rowDiv.append(nextArrivalCol);
        var minutesAwayCol = $('<div>').addClass('col-sm-2 text-center');
        minutesAwayCol.append($('<h4>').addClass('margins').text('Minutes Away'));
        rowDiv.append(minutesAwayCol);
        $('#train-results').append(rowDiv);
    }

    var trainNameSnap = childSnapshot.val().trainName;
    var destinationSnap = childSnapshot.val().destination;
    var firstTrainTimeSnap = childSnapshot.val().firstTrainTime;
    var firstTrainTimeSnapConv = moment(firstTrainTimeSnap, "HH:mm").subtract(1, "days");
    var frenquencySnap = childSnapshot.val().frenquency;

    var result = moment().diff(moment(firstTrainTimeSnapConv), "minutes");
    var remainder = result % frenquencySnap;
    var minUntilTrain = frenquencySnap - remainder;
    var nextTrain = moment().add(minUntilTrain, 'minutes').format('LT');


    $('#train-results').append('<hr>');
    var rowDivFire = $('<div>').addClass('row');
    var trainNameColFire = $('<div>').addClass('col-sm-3');
    trainNameColFire.append($('<h5>').text(trainNameSnap));
    rowDivFire.append(trainNameColFire);
    var destinationColFire = $('<div>').addClass('col-sm-3');
    destinationColFire.append($('<h5>').text(destinationSnap));
    rowDivFire.append(destinationColFire);
    var frenquencyColFire = $('<div>').addClass('col-sm-2 text-center');
    frenquencyColFire.append($('<h5>').text(frenquencySnap));
    rowDivFire.append(frenquencyColFire);
    var nextArrivalColFire = $('<div>').addClass('col-sm-2 text-center');
    nextArrivalColFire.append($('<h5>').text(nextTrain));
    rowDivFire.append(nextArrivalColFire);
    var minutesAwayColFire = $('<div>').addClass('col-sm-2 text-center');
    minutesAwayColFire.append($('<h5>').text(minUntilTrain));
    rowDivFire.append(minutesAwayColFire);

    $('#train-results').append(rowDivFire);
}, function(errorObject) {
    // Log a read error and its error code.
    console.log("The read failed: " + errorObject.code);
});



$('#submit-button').on('click', function() {
    trainName = $('#train-name').val().trim();
    destination = $('#destination').val().trim();
    firstTrainTime = $('#first-train-time').val().trim();
    frenquency = $('#frenquency').val().trim();
    $('#train-name, #destination, #first-train-time, #frenquency').val('');


    if (trainName === '' || destination === '' || firstTrainTime === '' || frenquency === '') {
        alert('Please fill out all fields');
    } else {
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frenquency: frenquency
        });
    }

    return false;
});