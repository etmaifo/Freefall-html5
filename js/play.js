var playState = {
    create: function() {        
        this.blocksize = 64;
        this.cursor = game.input.keyboard.createCursorKeys();     
        
        this.createWorld();
        
        this.player = game.add.sprite(game.world.centerX, 64, 'player');
        //this.block = game.add.sprite(game.world.centerX, 64, 'block');
        this.player.scale.setTo(2, 2);
        game.physics.arcade.enable(this.player);
        this.player.collideWorldBounds = true;
        
        this.blocks = game.add.group();
        this.blocks.enableBody = true;
        //this.blocks.createMultiple(6, 'block');
        
        this.level = 2;
        this.score = 0;
        this.level_speed = 6;
        
        game.input.onDown.add(this.movePlayer, this);
        
        game.time.events.loop(1500, this.createObstacle, this);
    },
    
    moveLeft: function() {
        if (this.player.x > 0)
            this.player.x -= 64;
    },    
    
    moveRight: function(){
        if (this.player.right < game.world.width)
            this.player.x += 64;
    },
    
    movePlayer: function() {
        var x = game.input.mousePointer.x;
        if (x < game.world.centerX){
            this.moveLeft();
        }
        else {
            this.moveRight();
        }        
    },
    
    moveBlocks: function() {
        for (var i = 0; i<this.blocks.children.length; i++) {
            this.blocks.children[i].y -= this.level_speed;
        }
    },
    
    update: function() {        
        game.physics.arcade.overlap(this.player, this.asteroids, this.playerDie, null, this);  
        game.physics.arcade.overlap(this.player, this.blocks, this.killPlayer, null, this);
        
        this.moveBlocks();
    },
    
    addBlock: function() {
        var block = this.blocks.getFirstDead();
        if (!block){
            return;
        }
        block.scale.setTo(2);
        block.reset(game.world.centerX, game.world.height - block.height);
        block.checkWorldBounds = true;
        block.outOfBoundsKill = true;
        block.body.velocity.y = -64 * this.level_speed;
    },
    
    createObstacle: function() {
        var randomNumbers = [0, 1, 2, 3, 4, 5];
        var position = Math.floor(Math.random() * 6);
        
        for (var i=0; i<this.level; i++) {
            var mult = Math.floor(Math.random() * 6);
            var block = game.add.sprite(mult * 64, game.world.height, 'block');
            block.scale.setTo(2, 2);
            randomNumbers.pop(mult);
            this.blocks.add(block);
        }
    },
    
    killPlayer: function() {
        console.log("Collision");
    },
    
    createWorld: function() {
        this.bg = game.add.sprite(0, 0, 'background').scale.setTo(1, 1);        
    },
};