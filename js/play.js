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
        this.blocks.createMultiple(6, 'block');

        this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);  
        
        game.time.events.loop(1500, this.addBlock, this);
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
        this.left.onDown.add(this.moveLeft, this);
        this.right.onDown.add(this.moveRight, this);        
    },
    
    moveBlock: function() {
    },
    
    update: function() {        
        game.physics.arcade.overlap(this.player, this.asteroids, this.playerDie, null, this);  
        game.physics.arcade.overlap(this.player, this.blocks, this.playerDie, null, this);
        
        this.movePlayer();
        this.moveBlock();
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
        block.body.velocity.y = -32 * 3;
    },
    
    createWorld: function() {
        this.bg = game.add.sprite(0, 0, 'background').scale.setTo(1, 1);        
    },
};