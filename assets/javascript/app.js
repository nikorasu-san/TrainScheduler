$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBM_dNWCIKLsZ7HcFJH6JSJ0wIh9MtL7ec",
        authDomain: "class-test-e0f98.firebaseapp.com",
        databaseURL: "https://class-test-e0f98.firebaseio.com",
        projectId: "class-test-e0f98",
        storageBucket: "class-test-e0f98.appspot.com",
        messagingSenderId: "1067230549341"
    };
    firebase.initializeApp(config);
    let database = firebase.database();
    let trainDatabase = database.ref("/train_schedule")
    // listen to database
    // push children to page
    database.ref("/train_schedule").on("child_added", function (snapshot) {
        console.log("before if: ", snapshot.val());
        let train = snapshot.val()
        let row = $("<tr>");
        let colName = $("<td class='name'>");
        $(colName).html(train.trainName)
        let colDestination = $("<td class='destination'>");
        $(colDestination).html(train.trainDestination)
        let colFrequency = $("<td class='freq'>");
        $(colFrequency).html(train.trainFrequency);
        // math for next train and minutes to next train
        let initialRun = moment(train.trainFirstRun, "HH:mm").subtract(1, "months");
        console.log("1 month subtracted: ", initialRun);
        let currentTime = moment();
        let timeDiff = moment().diff(moment(initialRun), "minutes");
        let remainder = timeDiff % train.trainFrequency;
        //console.log("remainder: ", remainder)
        let minutesAway = train.trainFrequency - remainder;
        let colMinutesAway = $("<td class='min-away'>");
        $(colMinutesAway).html(minutesAway)
        //console.log("min away: ", minutesAway)
        let nextTrain = moment().add(minutesAway, "minutes");
        let nextTrainFormat = moment(nextTrain).format("HH:mm");
        let colNextTrain = $("<td class='next-train'>");
        $(colNextTrain).html(nextTrainFormat);

        // print row
        $(row).append(colName, colDestination, colFrequency, colNextTrain, colMinutesAway);
        $("#train-table").append(row)

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });







    // listen to submit button
    // then grab fields push to database
    $("#submit").on("click", function (event) {
        event.preventDefault();
        let trainName = $("#inputName").val();
        let trainDestination = $("#inputDestination").val();
        let trainFirstRun = $("#inputFirstRun").val();
        let trainFrequency = $("#inputFrequency").val();

        // console.log(trainName)
        // console.log(trainDestination)
        // console.log(trainFirstRun)
        // console.log(trainFrequency)

        database.ref("/train_schedule").push({
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstRun: trainFirstRun,
            trainFrequency: trainFrequency
        })
    });


});