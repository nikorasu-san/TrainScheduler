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


    // refresh button for any user ease  
    $("#refresh").on("click", function () {
        location.reload();
    })

    function printTable() {
        database.ref("/train_schedule").on("child_added", function (snapshot) {
            console.log("snap: ", snapshot)
            console.log("key: ", snapshot.key)
            console.log("before if: ", snapshot.val());
            let train = snapshot.val()
            let row = $("<tr>");
            $(row).attr("id", snapshot.key)
            let colName = $("<td class='name editable'>");
            $(colName).html(train.trainName)
            let colDestination = $("<td class='destination editable'>");
            $(colDestination).html(train.trainDestination)
            let colFrequency = $("<td class='freq editable'>");
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
            // create edit and remove buttons
            let colControls = $("<td class='controls'>")
            let editButton = $("<button class='edit btn btn-secondary'>");
            $(editButton).html("Edit")
            let removeButton = $("<button class='remove btn btn-danger'>");
            $(removeButton).html("Remove");
            $(colControls).append(editButton, removeButton)

            // print row
            $(row).append(colName, colDestination, colFrequency, colNextTrain, colMinutesAway, colControls);
            $("#train-table").append(row)
            let trainRefreshCounter = train.trainRefreshCounter;
            console.log("counter: ", trainRefreshCounter)
            console.log("d. counter: ", train.trainRefreshCounter)
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }

    printTable();


    // every second increase the progress bar. starting two to closer match database speed
    let counter = 0;
    let countdown = 60;
    setInterval(function () {
        let progress = counter * 1.67;
        if (counter < 60) {
            counter++;
            countdown--;
            $(".progress-bar").attr("style", "width: " + progress + "%")
            $(".progress-bar").html("Automatic update in " + countdown + " seconds.")
            console.log(counter)
        } else {
            counter = 0;
            countdown = 60;
            $(".progress-bar").attr("style", "width: " + progress + "%")
            $("#train-table").empty();
            printTable();
        }
    }, 1000);

    // set page to refresh every minute
    setInterval(function () {
        console.log("60 sec", moment()._d);
        // $("#train-table").empty();
        // printTable();
    }, 60000);

    // edit button
    $(document).on("click", ".edit", function () {
        //isolate this .name .destination .freq
        let trainRow = $(this).siblings(".editable");
        console.log("trainRow class: ", $(trainRow).attr("class"));
        let trainRowClass = $(trainRow).attr("class");
        // $(trainRow).on("<td>").replaceWith("<td><input>");
        $(trainRow).html("<input>");
        //$("input").addClass(trainRowClass);
        $("input").addClass("field");
        console.log("this ", this);
        $(this).attr("class", "save btn btn-success");
        $(this).text("Save");
    });

    // save button
    $(document).on("click", ".save", function () {
        // grab value
        let valueName = $(this).siblings(".name").children().val();
        let valueDestination = $(this).siblings(".destination").children().val();
        let valueFreq = $(this).siblings(".freq").children().val();
        console.log("edit set: " + valueName + "," + valueDestination + "," + valueFreq)
        // grab id
        let key = $(this).parent().attr("id")
        console.log('this id on save: ', key)
        // check value and set to database in correct object/node
        console.log('save: database.ref("/train_schedule/' + key + '")')
        if (valueName !== "" && valueName.trim() !== "") {
            database.ref('/train_schedule/' + key).update({
                trainName: valueName
            })
        }

        if (valueDestination !== "" && valueDestination.trim() !== "") {
            database.ref('/train_schedule/' + key).update({
                trainDestination: valueDestination
            })
        }

        if (valueFreq !== "" && valueFreq.trim() !== "") {
            database.ref('/train_schedule/' + key).update({
                trainFrequency: valueFreq
            })
        }

        location.reload()
    });

    // remove button
    $(document).on("click", ".remove", function () {
        let key = $(this).parent().attr("id")
        database.ref('/train_schedule/' + key).remove()
        location.reload()
    });



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
    });


});