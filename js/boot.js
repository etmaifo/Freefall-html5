var bootState = {
    
    preload: function(){
        game.load.image('progressBar', 'assets/progressBar.png');
    },
    
    create: function(){
        game.stage.backgroundColor = '#eeeeee';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        if (!game.device.desktop){
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            document.body.style.backgroundColor = '#ffffff';
            
            game.scale.minWidth = 250;
            game.scale.minHeight = 170;
            game.scale.maxWidth = 1000;
            game.scale.maxHeight = 680;
            
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            
            game.scale.setScreenSize(true);
        }
        game.state.start('load');
    }
};