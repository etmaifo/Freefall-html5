var loadState = {
    
    preload: function() {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#333333' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        document.body.style.backgroundColor = '#333333';
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        
        game.load.image('player', 'assets/img/blue_block.png');
        game.load.image('block', 'assets/img/orange_block.png');          
        game.load.image('background', 'assets/img/grid.png');
        game.load.image('title', 'assets/img/gametitle.png');
        game.load.image('instructions', 'assets/img/howtoplay.png');
        game.load.image('overlay', 'assets/img/overlay.png');
        
        game.load.bitmapFont('square', 'assets/fonts/square.png', 'assets/fonts/square.fnt');
    },
    
    create: function() {
        game.state.start('menu');
    }
};