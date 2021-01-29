// LeRoy Dahl : dahl1033
// https://play.elevatorsaga.com/


{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // first elevator

        // When elevator is on idle, cycle through floors 
        // finding requested floors and calculate which is closest
        elevator.on("idle", function() {
            console.log("idle", elevator)
            var floorNum = elevator.currentFloor()  // current floor
            var requests = [];                      // array of requests from floors
            // of the requested floors calculate which number is closest to our floor
            const closest = (arr, num) => {
                return arr.reduce((acc, val) => {
                    if(Math.abs(val - num) < Math.abs(acc)){
                        return val - num;
                    }else{
                        return acc;
                    }
                }, Infinity) + num;
            }
            // Loop through and find requested floors push them to temp array
            floors.forEach(function(floor) {
                if (floor.requestedUp || floor.requestedDown) {
                    console.log('pushed')
                    requests.push(floor.level)
                }
            });
            // if there are any requested floors calulate closest and goto it, clearing call markers,
            // otherwise on idle, goto floor 0
            if (requests.length > 0){
                console.log('rerouting', requests, closest(requests, floorNum))
                elevator.goToFloor(closest(requests, floorNum) , true);
                
                floors[floorNum].requestedUp = false;
                floors[floorNum].requestedDown = false;
                
            } else {
                elevator.goToFloor(0);
            }
        
        });
        // When a floor button in the elevator is pressed add to elevator queue
        elevator.on("floor_button_pressed", function(floorNum) {
            console.log("pressed:", floorNum, "Queue", elevator.destinationQueue)
            // If floor isn't already queued, then add it
            if (elevator.destinationQueue.indexOf(floorNum) === -1) { 
                elevator.goToFloor(floorNum); 
            }
        });
        // Before an elevator passes floor check for new passengers
        elevator.on("passing_floor", function(floorNum, direction) {
            currFloor = elevator.currentFloor();
            queue = elevator.destinationQueue;
            pressedFloors = elevator.getPressedFloors();
            
            console.log("passing", currFloor, queue, pressedFloors)
            
            console.log("passing floor", floorNum, floors[floorNum], "direction: ", direction, elevator.destinationQueue);
            // If there is room on board, pick up passengers  and clear direction indicator based on the corresponding elevator direction when arriving
                if (floors[floorNum].requestedUp || floors[floorNum].requestedDown) { 
                    console.log("passing floor", floorNum, "stopping for requested pickup");
                    elevator.goToFloor(floorNum, true);
                    if (elevator.destinationDirection() == "up") {
                        floors[floorNum].requestedUp = false;
                    } 
                    else if (elevator.destinationDirection() == "down") {
                        floors[floorNum].requestedDown = false;
                    }
                }
        });
        // When elevator has stopeed at a floor, do this
        elevator.on("stopped_at_floor", function(floorNum) {
            console.log("stopped at floor", floorNum,"Que: ", elevator.destinationQueue, elevator.getPressedFloors(), "floor info: ", floors[floorNum]);
            //elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floorNum), 1);
        });
        
        // Initializes actions for each floor when passengers arrive
        floors.forEach(function(floor) {
            // When up button is pressed, mark floor requested UP value to true
            floor.on("up_button_pressed", function() {
                floor.requestedUp = true;
                console.log('changing up', floor);
            });
            // When down button is pressed, mark floor requested DOWN value to true
            floor.on("down_button_pressed", function() {
                floor.requestedDown = true;
                console.log('changing down', floor);
            });
        });
    },
        update: function(dt, elevators, floors) {

        }
}