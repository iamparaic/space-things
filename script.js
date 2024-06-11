window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 1000;
    canvas.height = 600;
    

    // Game variables
    let score = 0;
    let ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        angle: 0,
        rotation: 0,
        thrust: {x: 0, y: 0},
        thrusting: false
    };


    let missiles = [];
    let asteroids = [];

    // Function to create random asteroids
    function createAsteroid() {
        if (asteroids.length < 4) { // Check if the number of asteroids is less than 5
            const asteroid = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random () * 40 + 20, // Random size 
                velocityX: Math.random() * 3 - 2, // Random speed 
                velocityY: Math.random() * 3 - 2 
            };
            asteroids.push(asteroid);
        }
    }

    // Function to draw asteroids
    function drawAsteroids() {
        context.fillStyle = '#f1d73b';
        for (let asteroid of asteroids) {
            context.beginPath();
            context.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
            context.fill();
        }
    }

    // Function to update asteroids' positions
    function updateAsteroids() {
        for (let asteroid of asteroids) {
            asteroid.x += asteroid.velocityX;
            asteroid.y += asteroid.velocityY;

            // Wrap around the screen
            if (asteroid.x < -asteroid.radius) asteroid.x = canvas.width + asteroid.radius;
            if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = -asteroid.radius;
            if (asteroid.y < -asteroid.radius) asteroid.y = canvas.height + asteroid.radius;
            if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = -asteroid.radius;
        }
    }

    // Functions to draw the ship
function drawShip(x, y, angle) {
    context.fillStyle = '#499db4'; // Setting fill color to white
    context.strokeStyle = 'white'; // Setting stroke color to white for the other borders
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo( // Nose of the ship
        x + 4 / 3 * ship.radius * Math.cos(angle),
        y - 4 / 3 * ship.radius * Math.sin(angle)
    );
    context.lineTo( // Rear left
        x - ship.radius * (2 / 3 * Math.cos(angle) + Math.sin(angle)),
        y + ship.radius * (2 / 3 * Math.sin(angle) - Math.cos(angle))
    );
    context.lineTo( // Rear right
        x - ship.radius * (2 / 3 * Math.cos(angle) - Math.sin(angle)),
        y + ship.radius * (2 / 3 * Math.sin(angle) + Math.cos(angle))
    );
    context.closePath();
    context.stroke();
    context.fill();
    
    // Draw bottom border separately with #499db4 color
    context.strokeStyle = '#499db4'; // Setting stroke color to #499db4 for the bottom border
    context.beginPath();
    context.moveTo(
        x - ship.radius * (2 / 3 * Math.cos(angle) + Math.sin(angle)),
        y + ship.radius * (2 / 3 * Math.sin(angle) - Math.cos(angle))
    );
    context.lineTo(
        x - ship.radius * (2 / 3 * Math.cos(angle) - Math.sin(angle)),
        y + ship.radius * (2 / 3 * Math.sin(angle) + Math.cos(angle))
    );
    context.stroke();
}


    // Function to draw missiles
    function drawMissiles() {
        context.fillStyle = 'white';
        for (let missile of missiles) {
            context.beginPath();
            context.arc(missile.x, missile.y, 2, 0, Math.PI * 2);
            context.fill();
        }
    }

    // Function to update missiles' positions
    function updateMissiles() {
        for (let missile of missiles) {
            missile.x += missile.velocityX;
            missile.y += missile.velocityY;
        }

        // Remove missiles that are out of the canvas
        missiles = missiles.filter(missile => missile.x >= 0 && missile.x <= canvas.width && missile.y >= 0 && missile.y <= canvas.height);
    }

// Function to draw the score
function drawScore() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 10, 30); // Adjust position as needed
}

// Function to check collisions between objects
function checkCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        for (let j = 0; j < missiles.length; j++) {
            const missile = missiles[j];
            const dx = asteroid.x - missile.x;
            const dy = asteroid.y - missile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.radius) {
                // Collision detected
                
                // Increment score
                score += 1;

                if (asteroid.radius > 40) {
                    // Split the asteroid into two smaller ones
                    asteroids.splice(i, 1);
                    createAsteroid();
                    createAsteroid();
                } else {
                    // Remove the asteroid
                    asteroids.splice(i, 1);
                }
                // Remove the missile
                missiles.splice(j, 1);
                break;
            }
        }
    }
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

        // Update asteroids
        updateAsteroids();

        // Update missiles
        updateMissiles();

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw asteroids
        drawAsteroids();

        // Draw the ship
        drawShip(ship.x, ship.y, ship.angle);

        // Draw missiles
        drawMissiles();

        // Request the next frame
        requestAnimationFrame(update);
    }

    // Keydown event to handle rotation, thrust, and firing missiles
    document.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
            case 37: // left arrow (rotate left)
                ship.rotation = 0.1;
                break;
            case 39: // right arrow (rotate right)
                ship.rotation = -0.1;
                break;
            case 38: // up arrow (thrust forward)
                ship.thrusting = true;
                break;
            case 32: // space bar (fire missile)
                const missile = {
                    x: ship.x,
                    y: ship.y,
                    velocityX: 5 * Math.cos(ship.angle),
                    velocityY: -5 * Math.sin(ship.angle)
                };
                missiles.push(missile);
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

    // Create initial asteroids
    for (let i = 0; i < 10; i++) {
        createAsteroid();
    }

    // Function to check collisions between objects
function checkCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        for (let j = 0; j < missiles.length; j++) {
            const missile = missiles[j];
            const dx = asteroid.x - missile.x;
            const dy = asteroid.y - missile.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < asteroid.radius) {
                // Collision detected
                if (asteroid.radius > 40) {
                    // Split the asteroid into two smaller ones
                    asteroids.splice(i, 1);
                    createAsteroid();
                    createAsteroid();
                } else {
                    // Remove the asteroid
                    asteroids.splice(i, 1);
                }
                // Remove the missile
                missiles.splice(j, 1);
                break;
            }
        }
    }
}



// Call checkCollisions() inside the update() function before drawing the objects
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

    // Update asteroids
    updateAsteroids();

    // Function to draw the score
    function drawScore() {
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText('Score: ' + score, 10, 30); // Adjust position as needed
}

    // Update missiles
    updateMissiles();

    // Check for collisions
    checkCollisions();

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw asteroids
    drawAsteroids();

    // Draw the ship
    drawShip(ship.x, ship.y, ship.angle);

    // Draw missiles
    drawMissiles();

    // Request the next frame
    requestAnimationFrame(update);
}


    // Start the game loop
    update();

    
};


