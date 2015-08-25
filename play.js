var playState = {
    
	create: function () {
        game.time.advancedTiming = true;
   
        var tempKey = {
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            jump: Phaser.Keyboard.W,
        };
        
        this.input = new this.PlayerControl(tempKey);
        
        this.player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'demoman');
        game.physics.arcade.enable(this.player);
        
        this.bg = this.game.add.image(0, 0, 'bg');
        
        this.tempGround = this.game.add.sprite(0, game.world.height - 1, 'ground');
        game.physics.arcade.enable(this.tempGround);
        this.tempGround.body.immovable = true;
        this.tempGround.body.setSize(800, 40);
        
        this.player.anchor.setTo(0.5, 0.5);
        this.player.smoothed = false;
        this.player.scale.setTo(2, 2);
        
        this.player.body.setSize(9, 18, 0, 12);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity = new Phaser.Point(500, 500);
        
        game.camera.follow(this.player);
        
        this.input = new this.PlayerControl(tempKey);
        this.player.stat = new this.CharacterStat();
        this.characterController = new this.CharacterControl(this.input, this.player.body, this.player.stat);
	},
 
	update: function () {
        game.physics.arcade.collide(this.player, this.tempGround);
        this.input.update();
        this.characterController.update();
	},
    
    render: function () {
        game.debug.text("fps: " + game.time.fps, game.world.width - 80, game.world.height - 16);
//        game.debug.text("elapsed: " + game.time.elapsed, 16, 32);
//        game.debug.text("physicsElapsed: " + game.time.physicsElapsed, 16, 48);
        
//        game.debug.cameraInfo(game.camera, 32, 32);
        
//        game.debug.body(this.player);
//        game.debug.body(this.tempGround);

//        game.debug.text("velocity.x: " + this.player.body.velocity.x, 432, 64);
//        game.debug.text("velocity.y: " + this.player.body.velocity.y, 432, 80);
//        game.debug.text("gravity: " + this.player.body.gravity.y, 432, 80);
//        game.debug.text("jumpInitialVelocity: " + this.player.stat.jumpInitialVelocity, 432, 96);
//        game.debug.text("jumpsRemaining: " + this.characterController.jumpsRemaining, 432, 112);
//        game.debug.text("jumpKeyCleared: " + this.input.jumpKeyCleared, 432, 96);
//        game.debug.text("acceleration.x: " + this.player.body.acceleration.x, 432, 32);
    },
    
    CharacterStat: function () {
        // All values expressed in pixels and seconds unless otherwise noted.
        this.ACCELERATION_MAX = new Phaser.Point(1000, 1000);
        this.VELOCITY_MAX = new Phaser.Point(230, 200);
        this.DRAG = new Phaser.Point(500, 0);
        this.VELOCITY_TERMINAL = 300; 
        this.JUMP_HEIGHT = 60;
        this.JUMP_TIME = 10/11;
        this.GRAVITY = 2 * this.JUMP_HEIGHT / Math.pow(0.5 * this.JUMP_TIME, 2);
        this.JUMP_VELOCITY = this.JUMP_TIME * 0.5 * this.GRAVITY;
        this.JUMP_MAX = 2;  // Unitless, -1 indicates infinite
    },
    
    PlayerControl: function (userMoveKey) {
        // imma put key mapping stuff here later ig uess
        
        this.key = {
            left: game.input.keyboard.addKey(userMoveKey.left),
            right: game.input.keyboard.addKey(userMoveKey.right),
            up: game.input.keyboard.addKey(userMoveKey.up),
            down: game.input.keyboard.addKey(userMoveKey.down),
            jump: game.input.keyboard.addKey(userMoveKey.jump)
        };
        
        // addKeyCapture stops keypresses from being sent to browser, eg. arrow keys scroll the page. Doesn't do anything in chrome right now.
        for (key in userMoveKey) {
            game.input.keyboard.addKeyCapture(key);
        }
        
        this.update = function () {
            // If opposite keys are held down we don't want to move in either direction. So check that the opposite key isn't down.
            this.moveLeft = this.key.left.isDown && !this.key.right.isDown;
            this.moveRight = !this.key.left.isDown && this.key.right.isDown;
            this.moveUp = this.key.up.isDown && !this.key.down.isDown;
            this.moveDown = !this.key.up.isDown && this.key.down.isDown;
            
            this.moveJump = this.key.jump.isDown && !this.moveJumpPrev;
            this.moveJumpPrev = this.key.jump.isDown;
        }
        
    },
    
    CharacterControl: function (input, body, stat) {
        
        body.gravity.y = stat.GRAVITY;
        body.drag = stat.DRAG;
        
        // Give character all available jumps on spawn
        this.jumpsRemaining = stat.JUMP_MAX;
        
        this.update = function() {
            
            if(input.moveLeft) {
                body.acceleration.x = -this.boundedIncrement(stat.VELOCITY_MAX.x, stat.ACCELERATION_MAX.x, -body.velocity.x);
            } else if (input.moveRight) {
                body.acceleration.x = this.boundedIncrement(stat.VELOCITY_MAX.x, stat.ACCELERATION_MAX.x, body.velocity.x);
            } else {
                body.acceleration.x = 0;
            }
            
            if (body.touching.down) {
                this.jumpsRemaining = stat.JUMP_MAX;
            } else if (this.jumpsRemaining === stat.JUMP_MAX) {
                this.jumpsRemaining--;  // Remove a jump if character becomes airborne without jumping.
            }
            
            if (input.moveJump && this.jumpsRemaining != 0){
                body.velocity.y = -stat.JUMP_VELOCITY;
                this.jumpsRemaining--;
            }
        }
        
        // Adds increment to total until total === bound. Inputs and output are positive numbers.
        this.boundedIncrement = function(bound, increment, total) {
            if (bound >= total + increment * game.time.physicsElapsed)
                return increment;
            else if (bound > total)
                return (bound - total) / game.time.physicsElapsed;
            else
                return 1e-15;
        }
    },
};