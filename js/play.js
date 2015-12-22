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
        
        this.scoreLabel = game.add.text(game.world.centerX, 32, '0', {font: '50px Russo One', fill: '#808081', bold: 'true'});
        this.scoreLabel.anchor.setTo(0.5, 0.5);

        this.gameoverScreen = game.add.sprite(0, 0, 'gameover');
        this.gameoverScreen.y = -this.gameoverScreen.height
        
        this.level = 2;
        this.score = 0;
        this.best = 0;
        this.retries = 0;
        this.level_speed = 8;
        this.block_speed = -10;
        this.grade = 'F';
        
        game.input.onDown.add(this.movePlayer, this);
        //var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        //upKey.onDown.addOnce(this.outro, this);
        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        leftKey.onDown.add(this.moveLeft, this);

        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        rightKey.onDown.add(this.moveRight, this);
        
        this.createBlocks();
        this.spawn_blocks = false
        this.isGameOver = false;
        this.disable_overlay = false;

        if (!localStorage.getItem('hiScore')) {
            localStorage.setItem('hiScore', 0);
        }

        if (!localStorage.getItem('retries')) {
            localStorage.setItem('retries', 0);
        }

    },

    update: function() {        
        game.physics.arcade.overlap(this.player, this.asteroids, this.playerDie, null, this);  
        game.physics.arcade.overlap(this.player, this.blocks, this.killPlayer, null, this);
        
        if (!this.isGameOver)
            this.updateBlocks();

        if (this.spawn_blocks){
            this.createBlocks();
            this.spawn_blocks = false;
        }
        this.scoreLabel.setText(this.score);
        this.updateGrade();
        this.updateLevel();
        this.updatePoints();       

        if (this.score > localStorage.getItem('hiScore')) {
            localStorage.setItem('hiScore', this.score);
        }

        this.best = localStorage.getItem('hiScore');
        this.retries = localStorage.getItem('retries');

    },    
    
    createWorld: function() {
        this.bg = game.add.sprite(0, 0, 'background').scale.setTo(1, 1);     
        
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('player');        
        this.emitter.setYSpeed(-500, -300);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.setRotation(0, 0);
        this.emitter.gravity = 800;
    },

    createBlocks: function() {
        var randomNumbers = [0, 1, 2, 3, 4, 5];
        var position = Math.floor(Math.random() * 6);
        
        for (var i=0; i<this.level; i++) {
            var mult = randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
            var block = game.add.sprite(mult * 64, game.world.height, 'block');
            block.scale.setTo(2, 2);
            block.givePoint = true;
            randomNumbers.pop(mult);
            this.blocks.add(block);
        }
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
        if (!this.disable_overlay)
            this.showOverlay();
    },

    updateBlocks: function() {
        var block;

        for (var i = 0; i<this.blocks.children.length; i++) {
            block = this.blocks.children[i];
            block.y -= this.level_speed;

            if (block.bottom < this.player.top && block.givePoint) {
                this.player.receivePoint = true;
                block.givePoint = false;
            }

            if (block.bottom < 0) {
                block.kill()
                block.destroy(true);  
                this.blocks.remove(block);            
                this.spawn_blocks = true;
            }

            if (this.spawn_blocks) {
                this.blocks.removeAll();
            }
        }  
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
                this.score += 1;
                this.blocks.children[0].givePoint = false;
                i = this.blocks.children.length;
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
    
    killPlayer: function() {
        this.player.kill();
        
        this.emitter.x = this.player.x + this.player.width/2;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 3500, null, 15);
        game.time.events.add(3500, this.gameOver, this);
    },

    updateGrade: function() {
        var avg = this.score;

        if (avg <= 10)
            this.grade = 'F'
        else if (avg <= 25)
            this.grade = 'D'
        else if (avg <= 50)
            this.grade = 'C'
        else if (avg <= 75)
            this.grade = 'C+'
        else if (avg <= 100)
            this.grade = 'B-'
        else if (avg <= 120)
            this.grade = 'B'
        else if (avg <= 130)
            this.grade = 'B+'
        else if (avg <= 140)
            this.grade = 'A-'
        else if (avg > 140)
            this.grade = 'A'

    },
    
    gameOver: function() {
        this.blocks.removeAll();
        this.disable_overlay = true;

        var restartKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        restartKey.onDown.add(this.restartGame, this);

        var retry = game.add.button(32, 0, 'retry', this.restartGame);
        retry.scale.setTo(2, 2);
        retry.anchor.setTo(0.5, 0.5);
        retry.x = game.world.centerX;
        var retryTween = game.add.tween(retry).to({y: 500}, 500).start()

        var scoreText = game.add.text(32, 180 - game.world.height, 'Score', {font: '24px Russo One', fill: '#000000', bold: 'true'});
        var bestText = game.add.text(32, 220 - game.world.height, 'Best', {font: '24px Russo One', fill: '#000000', bold: 'true'});
        var retriesText = game.add.text(32, 260 - game.world.height, 'Retries', {font: '24px Russo One', fill: '#000000', bold: 'true'});

        game.add.tween(scoreText).to({y: 180}, 500).start();
        game.add.tween(bestText).to({y: 220}, 500).start();
        game.add.tween(retriesText).to({y: 260}, 500).start();

        var scoreValue = game.add.text(game.world.width - 40, 180 - game.world.height, this.score, {font: '24px Russo One', fill: '#CC3300', bold: 'true'});
        var bestValue = game.add.text(game.world.width - 40, 220 - game.world.height, this.best, {font: '24px Russo One', fill: '#CC3300', bold: 'true'});
        var retriesValue = game.add.text(game.world.width - 40, 260 - game.world.height, this.retries, {font: '24px Russo One', fill: '#CC3300', bold: 'true'});
        scoreValue.right = game.world.width - 32;
        bestValue.right = game.world.width - 32;
        retriesValue.right = game.world.width - 32;

        game.add.tween(scoreValue).to({y: 180}, 500).start();
        game.add.tween(bestValue).to({y: 220}, 500).start();
        game.add.tween(retriesValue).to({y: 260}, 500).start();

        var grade = game.add.text(0, 0, this.grade, {font: '84px Russo One', fill: '#CC3300', bold: 'true'});
        grade.anchor.setTo(0.5, 0.5);
        grade.scale.setTo(0, 0);
        grade.x = game.world.centerX;
        grade.y = -220;
        gradeAnimator = game.add.tween(grade.scale).to({x: 1, y: 1}, 1200).easing(Phaser.Easing.Bounce.Out).start();
        gradeTween = game.add.tween(grade).to({y: game.world.height - 220}, 500).start();

        game.add.tween(this.gameoverScreen).to({y: 0}, 700).start();
    },


    restartGame: function() {
        var retries = parseInt(localStorage.getItem('retries'));
        retries += 1;
        localStorage.setItem('retries', retries);
        game.state.start('menu');
    }
};
