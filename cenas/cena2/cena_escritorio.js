// Importa os módulos necessários
import Animacao from '../../player/animation.js'; // Importa um módulo de gerenciamento de animações
import Player from '../../player/player.js'; // Importa a classe Player
import Camera from '../../player/camera.js'; // Importa a classe Camera
import Controls from '../../player/controles.js'; // Importa a classe Controls

export default class SceneOffice extends Phaser.Scene {
    constructor() {
        super({
            key: "SceneOffice"
        })
    }
    preload() {

        this.load.image('tile_escritorio_ground', './assets/mapas/escritorio/escritorio base(ground).png');
        this.load.image('tile_escritorio_corredor', './assets/mapas/escritorio/corredor.png');
        this.load.image('tile_escritorio_começo', './assets/mapas/escritorio/corredor_Meta.png')
        this.load.image('tile_escritorio_final', './assets/mapas/escritorio/office_design_final.png')
        
        this.load.tilemapTiledJSON('map_escritorio', './assets/mapas/escritorio/mapaEscritórioFinal.json');
        this.load.spritesheet("tyler", "./assets/sprites_personagens/assets_tyler/tyler_armor.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("vanessa", "./assets/sprites_personagens/assets_vanessa/vanessa_lado.png", { frameWidth: 32, frameHeight: 32 });

    }

    create() {
        this.concreteFootsteps = this.sound.add("concreteFootsteps", { loop: true });
        // Trasição de fade in para quando a cena iniciar
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.criarMapa();
        this.criarPersonagem();
        
        this.control.create();
        
        this.passar = 10;
    }

    criarMapa() {
        this.map = this.make.tilemap({ key: 'map_escritorio' });
        this.tilesetEscritorio = this.map.addTilesetImage('escritorio', 'tile_escritorio_final');
        this.tilesetGroundEscritorio = this.map.addTilesetImage('ground', 'tile_escritorio_ground');
        this.tilesetCorredor = this.map.addTilesetImage('corredor', 'tile_escritorio_começo');
        this.tilesetCorredorMeta = this.map.addTilesetImage('corredorMeta', 'tile_escritorio_final');

        this.ground = this.map.createLayer('ground', this.tilesetGroundEscritorio, 0, 0);
        this.objectsCollider = this.map.createLayer('escritorio', this.tilesetEscriotrio, 0, 0);
        this.objectsCollider = this.map.createLayer('corredor', this.tilesetCorredor, 0, 0)
        this.objectsCollider = this.map.createLayer('corredorMeta', this.tilesetCorredorMeta, 0, 0)
        this.aboveObjects = this.map.createLayer('escritorio', this.tilesetEscriotrio, 0, 0);

        this.ground.setCollisionByProperty({ collider: true });
        this.objectsCollider.setCollisionByProperty({ collider: true });
        

    }

    criarPersonagem() {
        // Encontra o ponto de spawn do jogador no mapa
        const spawnPoint = this.map.findObject(
            "player",
            (objects) => objects.name === "spawnPoint"
        );

        // Cria o jogador, câmera e controles
        this.tyler = new Player(this, spawnPoint.x, spawnPoint.y, 'tyler');
        this.camera = new Camera(this, this.tyler, this.map);
        this.control = new Controls(this, this.tyler);

        this.physics.add.collider(this.tyler, this.ground);
        this.physics.add.collider(this.tyler, this.objectCollider);
        
        // Cria as animações utilizando o Animacao
        Animacao.createAnimations(this, 'tyler');

        // Cria a câmera do jogador
        this.playerCamera = new Camera(this, this.tyler, this.map);


    }

    update() {

        if ((this.tyler.body.velocity.x !== 0 || this.tyler.body.velocity.y !== 0) && !this.concreteFootsteps.isPlaying) {
            this.concreteFootsteps.play(); // Reproduz o som dos passos
        } else if (this.tyler.body.velocity.x === 0 && this.tyler.body.velocity.y === 0 && this.concreteFootsteps.isPlaying) {
            this.concreteFootsteps.stop(); // Para o som dos passos se o jogador não estiver se movendo
        }
        
        
    }

}