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
    //set timer to reload the page
    //let serverTime = firebase.database.ServerValue.TIMESTAMP;
    console.log(moment()._d)
    let visitTimestamp = moment()._d


    $("#refresh").on("click", function () {
        location.reload();
    })

    function printTable() {
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
            let trainRefreshCounter = train.trainRefreshCounter;
            console.log("counter: ", trainRefreshCounter)
            console.log("d. counter: ", train.trainRefreshCounter)
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    printTable();
    // listen to database
    // push children to page
    /*
        database.ref("/train_schedule").on("child_added", function (snapshot) {
            //printTable(snapshot)
    
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
            let trainRefreshCounter = train.trainRefreshCounter;
            console.log("counter: ", trainRefreshCounter)
            console.log("d. counter: ", train.trainRefreshCounter)
    
            // setInterval(function () {
            //     $("#train-table").empty()
            //     printTable(snapshot)
            //     console.log("5sec")
            // }, 5000);
    
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    */

    setInterval(function () {
        console.log("60 sec")
        $("#train-table").empty()
        printTable()
        /* database.ref("/train_schedule").on("child_added", function (snapshot) {

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
            let trainRefreshCounter = train.trainRefreshCounter;
            console.log("counter: ", trainRefreshCounter)
            console.log("d. counter: ", train.trainRefreshCounter)


        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        console.log("5 sec done") */
    }, 60000);





    // listen to submit button
    // then grab fields push to database
    $("#submit").on("click", function (event) {
        //event.preventDefault();
        let trainName = $("#inputName").val();
        let trainDestination = $("#inputDestination").val();
        let trainFirstRun = $("#inputFirstRun").val();
        let trainFrequency = $("#inputFrequency").val();
        let trainRefreshCounter = 0;
        // console.log(trainName)
        // console.log(trainDestination)
        // console.log(trainFirstRun)
        // console.log(trainFrequency)
        console.log("time: ", visitTimestamp)
        database.ref("/train_schedule").push({
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstRun: trainFirstRun,
            trainFrequency: trainFrequency,
            trainRefreshCounter: trainRefreshCounter
        })
        $("#train-table").empty()
        //location.reload()
    });


});