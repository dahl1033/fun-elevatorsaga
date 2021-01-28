// LeRoy Dahl : dahl1033
// https://play.elevatorsaga.com/


{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // first elevator

        // When elevator is on idle, cycle through floors in building
        elevator.on("idle", function() {
            // cycle through amount of floors in building on idle
            for(var i=0; i < floors.length; i++){
                elevator.goToFloor(i);
            }
        });
    },
    update: function(dt, elevators, floors) {
        
    }
}