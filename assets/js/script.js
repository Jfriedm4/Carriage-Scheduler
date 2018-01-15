$(function() {

    // variables
    var name = "";
    var destination = "";
    var departureTime = "";
    var frequency = "";

    var nextCarriage = "";
    var minutesAway = "";

    var currentTime = moment().format("HH:mm");
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD8oEjYpNkp5dN5wMrXg5Kyj-lzQKLLR3E",
        authDomain: "trains-have-schedules.firebaseapp.com",
        databaseURL: "https://trains-have-schedules.firebaseio.com",
        projectId: "trains-have-schedules",
        storageBucket: "trains-have-schedules.appspot.com",
        messagingSenderId: "212956304441"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // onclick to add carriage to schedule board
    $(".submitBtn").on("click", function(event){
        event.preventDefault();

        // form values are stored in variables
        name = $("#name").val().trim() + "'s Carriage";
        destination = $("#destination").val().trim();
        departureTime = $("#departureTime").val().trim();
        frequency = $("#frequency").val().trim();

        // Creates local "temporary" object for holding carriage data
        var newCarriage = {
            name: name,
            destination: destination,
            departureTime: departureTime,
            frequency: frequency
        };

        // Uploads carriage data to the database
        database.ref().push(newCarriage);

        // Clears all of the text-boxes
        $("#name").val("");
        $("#destination").val("");
        $("#departureTime").val("");
        $("#frequency").val("");

    });

    // add train data to database and create new row to display carriage in html
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        // $(".carriageSchedule > tbody").empty();
        console.log(childSnapshot.val());
        console.log(currentTime);
  
        // Store everything into a variable.
        name = childSnapshot.val().name;
        destination = childSnapshot.val().destination;
        departureTime = childSnapshot.val().departureTime;
        frequency = childSnapshot.val().frequency;
  
        // define nextArrival
        var nextArrival = moment(departureTime, 'HH:mm').add(frequency, 'minutes').format("HH:mm");
        console.log(nextArrival);


        // define minutesAway
        var mins = moment.utc(moment(currentTime, "HH:mm").diff(moment(departureTime, "HH:mm"))).format("mm");
        console.log(mins);


        minutesAway = frequency - mins;
  
        // Add each carriage's data into the table
        $(".carriageSchedule > tbody").append(`
            <tr>
                <th scope='row'> ${name} </th>
                <td> ${destination} </td>
                <td> ${frequency} minutes</td>
                <td> ${nextArrival} </td>
                <td> ${minutesAway} </td>
            </tr>
        `);

    }); 


});