var menuState = {
    
    create: function() {
        game.add.image(0, 0, 'background');
        game.add.image(0, 0, 'title');
        this.bg = game.add.sprite(0, 0, 'background');
        this.bg.scale.setTo(1, 1);
        this.logo = game.add.sprite(0, 0, 'title');
        this.logo.anchor.setTo(0.5, 0.5);
        this.logo.x = game.world.centerX;
        this.logo.y = -10;
        
        this.instructions = game.add.sprite(0, 0, 'instructions');
        this.instructions.scale.setTo(2, 2);
        this.instructions.anchor.setTo(0, 0.5);
        this.instructions.x = game.world.width;
        this.instructions.y = game.world.height - this.instructions.height;
        
        var tween = game.add.tween(this.logo);
        tween.to({y: 50}, 500).easing(Phaser.Easing.Bounce.Out);
        tween.start();
        
        var instructionsTween = game.add.tween(this.instructions);
        instructionsTween.to({x: 60}, 500);
        instructionsTween.start();
        
        //var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        //upKey.onDown.addOnce(this.outro, this);
        game.input.onDown.add(this.outro, this);
    },
    
    outro: function() {
        var logoTween = game.add.tween(this.logo).to({y: -50}, 500).start();
        
        var instructionsTween = game.add.tween(this.instructions).to({x: -300}, 700);
        instructionsTween.onComplete.add(this.start, this);
        instructionsTween.start();
    },
    
    start: function() {
        game.state.start('play');
    }
};