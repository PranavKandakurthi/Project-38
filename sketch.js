var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var highScore = 0;

function preload(){
  trex_running =   loadImage("wow.png");
  trex_collided = loadImage("fow.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("f.jpg");
  
  obstacle1 = loadImage("unt.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,150,20,50);
  
  trex.addImage("running", trex_running);
  trex.addImage("collided", trex_collided);
  trex.scale = 0.1;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(90,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(220,100);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,160,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, 240,50);
  text("HighScore : "+ highScore, -200,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/40);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 130) {
      trex.velocityY = -12;
    }
    
    camera.position.x = trex.x;
    camera.position.y = trex.y;
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    //spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeImage("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,5,5);
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.2;
    obstacle.velocityX = -(6 + 3*score/100);

    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeImage("running",trex_running);
  
  if(highScore < score ){
    highScore = score;
  }
  
  score = 0;
  
}