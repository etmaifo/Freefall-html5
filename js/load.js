var loadState = {
    
    preload: function() {
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#333333' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        
        document.body.style.backgroundColor = '#333333';
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        
        game.load.image('player', 'assets/blue_block.png');
        game.load.image('block', 'assets/orange_block.png');          
        game.load.image('background', 'assets/grid.png');
        game.load.image('title', 'assets/gametitle.png');
        game.load.image('instructions', 'assets/howtoplay.png');
    },
    
    create: function() {
        game.state.start('menu');
    }
};