var loadState = {

	preload: function () {
        game.renderer.renderSession.roundPixels = true;
        
		// Add a loading label 
		var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// Add a progress bar
		var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		game.load.setPreloadSprite(progressBar);

		// Load all assets
		game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
        game.load.spritesheet('demoman', 'assets/Demoman/Demoman.png', 32, 32);
        game.load.image('bg', 'assets/Maps/jarvest.png');
        
		// ...
	},

	create: function() { 
		game.state.start('menu');
	}
};