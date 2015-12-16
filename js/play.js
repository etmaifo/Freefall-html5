var playState = {
    create: function() {        
        this.blocksize = 64;
        this.cursor = game.input.keyboard.createCursorKeys();     
        
        this.createWorld();
        
        this.player = game.add.sprite(game.world.centerX, 64*2, 'player');        
        
        this.player.scale.setTo(2, 2);
        game.physics.arcade.enable(this.player);
        this.player.collideWorldBounds = true;
        this.player.receivePoint = false;
        
        this.blocks = game.add.group();
        this.blocks.enableBody = true;
        
        this.scoreLabel = game.add.text(game.world.centerX, 64, '0', {font: '70px square', fill: '#808081', bold: 'true'});
        this.scoreLabel.anchor.setTo(0.5, 0.5);
        
        this.level = 2;
        this.score = 0;
        this.level_speed = 8;
        
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
        this.showOverlay();
    },
    
    showOverlay: function() {
        var xpos = 0;
        var x = game.input.mousePointer.x;
        if (x > game.world.centerX) {
            xpos = game.world.centerX;
        }
        
        var overlay = game.add.sprite(xpos, 0, 'overlay'); 
        overlay.scale.setTo(2, 2);
        overlay.alpha = 0.5;
        var overlayTween = game.add.tween(overlay).to({alpha: 0}, 300);
        overlayTween.onComplete.add(overlay.kill, this);
        overlayTween.start();    
    },
    
    givePoint: function() {
        for (var i = 0; i<this.blocks.children.length; i++) {
            if (this.blocks.children[0].givePoint){
                self.score += 1;
                this.blocks.children[0].givePoint = false;
                break;
            }
        }
    },
    
    moveBlocks: function() {
        var block;
        for (var i = 0; i<this.blocks.children.length; i++) {
            block = this.blocks.children[i];
            block.y -= this.level_speed;
            if (block.bottom < this.player.top && block.givePoint) {
                this.player.receivePoint = true;
                block.givePoint = false;
            }
            if (this.blocks.children[i].bottom < 0) {
                this.blocks.children[i].kill();
            }
        }
    },

    updatePoints: function() {
        if (this.player.receivePoint && this.player.alive) {
            this.score += 1;
            this.player.receivePoint = false;
        }
    },
    
    updateLevel: function() {
        if (this.score < 10) {
            this.level_speed = 10;
        }
        else if (this.score < 50) {
            this.level = 3;
        }
        else if (this.score < 100) {
            this.level_speed = 12;
        }
        else if (this.score < 130) {
            this.level = 4;
        }
        else if (this.score < 150) {
            this.level_speed = 14;
        }
        else if (this.score < 200){
            this.level = 5;
        }
        else if (this.score < 500){
            this.level_speed = 16;
        }
        else if (this.score < 550){
            this.level_speed = 18;
        }
        else if (this.score < 600){
            this.level_speed = 20;
        }
        else if (this.score < 1001){
            this.level_speed = 22;
        }
    },
    
    update: function() {        
        game.physics.arcade.overlap(this.player, this.asteroids, this.playerDie, null, this);  
        game.physics.arcade.overlap(this.player, this.blocks, this.killPlayer, null, this);
        
        this.moveBlocks();
        this.scoreLabel.setText(this.score);
        this.updateLevel();
        this.updatePoints();
    },

    
    createObstacle: function() {
        var randomNumbers = [0, 1, 2, 3, 4, 5];
        var position = Math.floor(Math.random() * 6);
        
        for (var i=0; i<this.level; i++) {
            var mult = Math.floor(Math.random() * 6);
            var block = game.add.sprite(mult * 64, game.world.height, 'block');
            block.scale.setTo(2, 2);
            block.givePoint = true;
            randomNumbers.pop(mult);
            this.blocks.add(block);
        }
    },
    
    killPlayer: function() {
        this.player.kill();
        
        this.emitter.x = this.player.x + this.player.width/2;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 3500, null, 15);
        game.time.events.add(3500, this.gameOver, this);
    },
    
    gameOver: function() {
      game.state.start('menu');  
    },
    
    createWorld: function() {
        this.bg = game.add.sprite(0, 0, 'background').scale.setTo(1, 1);     
        
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('player');        
        this.emitter.setYSpeed(-500, -300);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setRotation(0, 0);
        //this.emitter.setScale(0.25, 0.25, 0.25, 0.25);
        this.emitter.gravity = 800;
    },
};