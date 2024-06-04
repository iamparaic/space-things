window.onload = function() {
    const canvas = document.getElementById('game-canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 1100;
    canvas.height = 700;

    // Load the ship image
    const shipImage = new Image();
    shipImage.src = 'media/ship.png';

    let ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 20,
        angle: 0, 
        rotation: 0,
        thrust: {x: 0, y: 0},
        thrusting: false
    };

    // Functions to draw the ship
    function drawShip(x, y, angle) {
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.drawImage(shipImage, -ship.radius, -ship.radius, ship.radius * 2, ship.radius * 2);
        context.restore();
    }

    // Game loop
    function update() {
        // Rotate the ship
        ship.angle += ship.rotation;

        // Move the ship
        if (ship.thrusting) {
            ship.thrust.x += 0.05 * Math.cos(ship.angle);
            ship.thrust.y -= 0.05 * Math.sin(ship.angle);
        } else {
            ship.thrust.x -= 0.99 * ship.thrust.x;
            ship.thrust.y -= 0.99 * ship.thrust.y;
        }

        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;

        // Handle edge of the screen
        if (ship.x < 0 - ship.radius) ship.x = canvas.width + ship.radius;
        if (ship.x > canvas.width + ship.radius) ship.x = 0 - ship.radius;
        if (ship.y < 0 - ship.radius) ship.y = canvas.height + ship.radius;
        if (ship.y > canvas.height + ship.radius) ship.y = 0 - ship.radius;

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the ship
        drawShip(ship.x, ship.y, ship.angle);

        // Request the next frame
        requestAnimationFrame(update);
    }

    // Keydown event to handle rotation and thrust
    document.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
            case 37: // left arrow (rotate left)
                ship.rotation = -0.1;
                break;
            case 39: // right arrow (rotate right)
                ship.rotation = 0.1;
                break;
            case 38: // up arrow (thrust forward)
                ship.thrusting = true;
                break;
        }
    });

    // Keyup event to stop rotation and thrust
    document.addEventListener('keyup', function(event) {
        switch(event.keyCode) {
            case 37: // left arrow (stop rotating left)
            case 39: // right arrow (stop rotating right)
                ship.rotation = 0;
                break;
            case 38: // up arrow (stop thrusting)
                ship.thrusting = false;
                break;
        }
    });

    // Start the game loop when the ship image is loaded
    shipImage.onload = function() {
        update();
    };
};
