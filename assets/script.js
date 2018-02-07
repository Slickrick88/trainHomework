$(document).ready(function () {
    //declare variables
    var name;
    var destination;
    var firstTrain;
    var frequency;
    var nextArrival;
    var minutesAway
    var counter = 0;
    var config = {
        apiKey: "AIzaSyBf5E4bGj8h9LyLK6HI8sU68qDc8Wo767A",
        authDomain: "trainschedule-96c69.firebaseapp.com",
        databaseURL: "https://trainschedule-96c69.firebaseio.com",
        projectId: "trainschedule-96c69",
        storageBucket: "trainschedule-96c69.appspot.com",
        messagingSenderId: "1018052406248"
    };
    firebase.initializeApp(config);
    // Get a reference to the database service
    var database = firebase.database();
    $("#click-button").on("click", function (event) {
        event.preventDefault();
        //grab values from form and assign them to the variables
        name = $("#tName").val().trim();
        destination = $("#dest").val().trim();
        firstTrain = $("#firstArrival").val().trim();
        frequency = $("#freq").val().trim();
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        console.log("Name: " + name);
        //pulls in existing trains to schedule
        pullTrains();
        //resets form
        $("#trainInputForm")[0].reset();
    });

    // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        //sets up the train objects in the dom
        event.preventDefault();
        name = childSnapshot.val().name;
        destination = childSnapshot.val().destination;
        frequency = childSnapshot.val().frequency;
        firstTrain = childSnapshot.val().firstTrain;
        var start = moment(firstTrain, "HH:mm").format("HH:mm");
        // console.log("start time: " + start);
        currentTime = moment().format("HH:mm");
        // console.log("current time: " + currentTime);

        var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        var currentTime = moment();
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % frequency;
        tMinutesTillTrain = frequency - tRemainder;
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm A");

        console.log('diffTime: ', diffTime);
        console.log('tRemainder: ', tRemainder);
        console.log('tMinutesTillTrain:', tMinutesTillTrain);
        counter++;
        console.log("counter = :" + counter);
        //sets up the train objects in the dom
        $("#scheduleTitles > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + nextTrain + "</td><td class ='minutesUpdate'>" + tMinutesTillTrain + "</td></tr>");
    });

    function trainTable() {
        var min = document.getObjectByClass("minutesUpdate");
        console.log("min element: "+ min);
        for (i=0; i< min.length; i++){
            var timeLeft = min[i].html()
            console.log(timeLeft)
        }
    };

    function trainRefresh() {
        timer = setInterval(trainTable, 1 * 1000)
    };
});