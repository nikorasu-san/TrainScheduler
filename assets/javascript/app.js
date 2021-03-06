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


    // refresh button for any user ease  
    $("#refresh").on("click", function () {
        location.reload();
    });

    // function to print results from database
    function printTable() {
        database.ref("/train_schedule").on("child_added", function (snapshot) {
            let train = snapshot.val()
            let row = $("<tr>");
            $(row).attr("id", snapshot.key)
            let colName = $("<td class='name editable'>");
            $(colName).html(train.trainName)
            let colDestination = $("<td class='destination editable'>");
            $(colDestination).html(train.trainDestination)
            let colFrequency = $("<td class='freq editable'>");
            $(colFrequency).html(train.trainFrequency);
            // math and column for minutes till next train
            let initialRun = moment(train.trainFirstRun, "HH:mm").subtract(1, "months");
            console.log("1 month subtracted: ", initialRun);
            let timeDiff = moment().diff(moment(initialRun), "minutes");
            let remainder = timeDiff % train.trainFrequency;
            let minutesAway = train.trainFrequency - remainder;
            let colMinutesAway = $("<td class='min-away'>");
            $(colMinutesAway).html(minutesAway)
            // column for next train
            let nextTrain = moment().add(minutesAway, "minutes");
            let nextTrainFormat = moment(nextTrain).format("HH:mm");
            let colNextTrain = $("<td class='next-train'>");
            $(colNextTrain).html(nextTrainFormat);
            // create edit and remove buttons
            let colControls = $("<td class='controls'>")
            let editButton = $("<button class='edit btn btn-secondary'>");
            $(editButton).html("Edit")
            let removeButton = $("<button class='remove btn btn-danger'>");
            $(removeButton).html("Remove");
            $(colControls).append(editButton, removeButton);
            // print row for train details
            $(row).append(colName, colDestination, colFrequency, colNextTrain, colMinutesAway, colControls);
            $("#train-table").append(row);
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    printTable();

    // Every second increase the progress bar. At 1 minute, re-print the schedule
    let counter = 0;
    let countdown = 60;
    setInterval(function () {
        let progress = counter * 1.67;
        if (counter < 60) {
            counter++;
            countdown--;
            $(".progress-bar").attr("style", "width: " + progress + "%")
            $(".progress-bar").html("Automatic update in " + countdown + " seconds.")
        } else {
            counter = 0;
            countdown = 60;
            $(".progress-bar").attr("style", "width: " + progress + "%")
            $("#train-table").empty();
            printTable();
        }
    }, 1000);


    // edit button
    $(document).on("click", ".edit", function () {
        // isolate this name, destination, & freq cells in row
        let trainRow = $(this).parent().siblings(".editable");
        // turn those cells into input elements
        $(trainRow).html("<input>");
        // update button into a save button
        $(this).attr("class", "save btn btn-success");
        $(this).text("Save");
    });

    // save button
    $(document).on("click", ".save", function () {
        // grab value from input fields on desired train/row 
        let valueName = $(this).parent().siblings(".name").children().val();
        let valueDestination = $(this).parent().siblings(".destination").children().val();
        let valueFreq = $(this).parent().siblings(".freq").children().val();
        // grab id which is the relevant train key in database
        let key = $(this).parents("tr").attr("id")
        // check if there is a real value and set value to relevant object/train in database
        if (valueName.trim() !== "") {
            database.ref('/train_schedule/' + key).update({
                trainName: valueName
            });
        };

        if (valueDestination.trim() !== "") {
            database.ref('/train_schedule/' + key).update({
                trainDestination: valueDestination
            });
        };

        if (valueFreq.trim() !== "") {
            database.ref('/train_schedule/' + key).update({
                trainFrequency: valueFreq
            });
        };
        location.reload();
    });

    // remove button
    $(document).on("click", ".remove", function () {
        let key = $(this).parents("tr").attr("id");
        database.ref('/train_schedule/' + key).remove();
        location.reload();
    });

    // submit button
    $("#submit").on("click", function () {
        // grab user input
        let trainName = $("#inputName").val();
        let trainDestination = $("#inputDestination").val();
        let trainFirstRun = $("#inputFirstRun").val();
        let trainFrequency = $("#inputFrequency").val();
        // push input to database as new entry/train
        database.ref("/train_schedule").push({
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstRun: trainFirstRun,
            trainFrequency: trainFrequency
        });
        $("#train-table").empty();
    });

});