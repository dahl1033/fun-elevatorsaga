// LeRoy Dahl : dahl1033
// https://play.elevatorsaga.com/


{
    init: function(elevators, floors) {
        elevators.forEach(function(elevator, index) {

        // When elevator is on idle, cycle through floors 
        // finding requested floors and calculate which is closest
        elevator.on("idle", function() {
            console.log("idle", elevator, elevator.getPressedFloors, elevator.destinationQueue);
            var floorNum = elevator.currentFloor()
            var requests = [];
            // function for finding closest floor request to current elevator floor
            const closest = (arr, num) => {
                return arr.reduce((acc, val) => {
                    if(Math.abs(val - num) < Math.abs(acc)){
                        return val - num;
                    }else{
                        return acc;
                    }
                }, Infinity) + num;
            }
            // loop through and find any requested floors(up or down), if requested push them to new array
            floors.forEach(function(floor) {
                if (floor.requestedUp || floor.requestedDown) {
                    console.log('pushed')
                    requests.push(floor.level)
                }
            });
            // if there are requested floors calculate closest floor for elevator to goto
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
        // Before an elevator passes floor check if there is room for more a new passenger(s) and add it to the queue
        elevator.on("passing_floor", function(floorNum, direction) {
            console.log("passing floor", floorNum, floors[floorNum], "direction: ", direction, elevator.destinationQueue, "loadFactor", elevator.loadFactor());
            // If there is room on board, pick up passengers based on the corresponding elevator direction when arriving
            if (elevator.loadFactor() < 0.69) {
                // If passing floor is already in queue, make it the priority and goto it next
                if (elevator.destinationQueue.indexOf(floorNum) != -1) {
                    elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floorNum), 1);
                    elevator.goToFloor(floorNum, true); 
                }
                // If elevator is going UP and the passing floor has requested UP, queue floor number.
                 else if (elevator.destinationDirection() == "up" && floors[floorNum].requestedUp) {
                    if (elevator.destinationQueue.indexOf(floorNum) == -1) { 
                        elevator.goToFloor(floorNum, true); 
                    }
                    // If floor numer is already in the queue, reposition it to next floor and update queue, change floor requested value
                    else {  
                        elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floorNum), 1);
                        elevator.goToFloor(floorNum, true);
                    }
                    floors[floorNum].requestedUp = false;
                } 
                // If elevator is going UP and the passing floor has requested UP, queue floor number.
                else if (elevator.destinationDirection() == "down" && floors[floorNum].requestedDown) {
                    if (elevator.destinationQueue.indexOf(floorNum) == -1) { 
                        elevator.goToFloor(floorNum, true); 
                    }
                    // If floor numer is already in the queue, reposition it to next floor and update queue, change floor requested value
                    else {
                        elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floorNum), 1);
                        elevator.goToFloor(floorNum, true);
                    }
                    floors[floorNum].requestedDown = false;
                }
            }
        });
        // When elevator has stopeed at a floor, do this
        elevator.on("stopped_at_floor", function(floorNum) {
            console.log("stopped at floor", floorNum,"Que: ", elevator.destinationQueue, elevator.getPressedFloors(), "floor info: ", floors[floorNum]);
            //elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floorNum), 1);
        });
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