var trex,ground,invground,ObstaclesGroup,CloudsGroup,count, PLAY,END, START,gameState,gameover,redo;
//img
var trex_start,trex_running,trex_collided,ground_img, obstacle1_img,obstacle2_img,obstacle3_img,obstacle4_img,obstacle5_img, obstacle6_img,cloud_img,gameover_img,redo_img;
//sound

function preload() {
  trex_start=loadAnimation("trex1.png");
  trex_running=loadAnimation("trex1.png","trex3.png",         "trex4.png");
  trex_collided= loadAnimation("trex_collided.png");
  ground_img= loadImage("ground2.png");
  cloud_img= loadImage("cloud.png");
  gameover_img=loadImage("gameover.png");
  redo_img=loadImage("redo.png");
  
  obstacle1_img= loadImage("obstacle1.png");
  obstacle2_img= loadImage("obstacle2.png");
  obstacle3_img= loadImage("obstacle3.png");
  obstacle4_img= loadImage("obstacle4.png");
  obstacle5_img= loadImage("obstacle5.png");
  obstacle6_img= loadImage("obstacle6.png"); 
}

function setup() {
  createCanvas(500, 400);
  
  trex = createSprite(50,350,20,20);
  trex.addAnimation("start",trex_start);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.5;
  
  ground = createSprite(250,370,500,1);
  ground.addImage("ground",ground_img);
  ground.velocityX=-5
  
  invground = createSprite(250,380,500,10);
  invground.visible= false;
  
  ObstaclesGroup= new Group();
  CloudsGroup= new Group();
  
  count=0
  gameover=createSprite(250,200,20,50);
  gameover.addImage("over",gameover_img);
  gameover.visible=false;
  gameover.scale=0.5
  
  redo = createSprite(250,250,20,50);
  redo.addImage("redo",redo_img);
  redo.visible=false
  redo.scale=0.5;
  
  PLAY = 1;
  END = 0;
  START = 2;
  gameState = START;

}


function draw() {
  background("white");
  
  
  textSize(22);
  text("Score: "+ count, 360, 40);
  
  edges = createEdgeSprites();
  trex.collide(invground);
  //Gravity
  trex.velocityY=trex.velocityY+1;

  
  
  if(gameState === START){
    //set text
    textSize(20);
    text("Press Space Bar to Play",150,200);
    trex.changeAnimation("start",trex_start); 
    gameover.visible=false;
    redo.visible=false;
    ground.velocityX=0;
  }
  
  if(keyDown("space")&& gameState === START){
    gameState=PLAY;
    trex.changeAnimation("running",trex_running)
  }
  
  if(gameState === PLAY){

    //move the ground
    ground.velocityX = -(6+count/100);
    //scoring
    count=count+Math.round(getFrameRate()/60);
    
    if(count % 100===0){
      //playSound("checkPoint.mp3");
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 350){
      trex.velocityY = -15;
     //playSound("jump.mp3");
    }
    
    //set text
    textFont("Georgia");
    textStyle(BOLD);
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      //playSound("die.mp3");
    }
      gameover.visible=false;
      redo.visible=false;
  }
  
    else if(gameState === END) {
    ground.velocityX = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    CloudsGroup.setLifetimeEach(-1);
    ObstaclesGroup.setLifetimeEach(-1);
    trex.velocityY=0;
    trex.changeAnimation("collided",trex_collided);
    
    if(mousePressedOver(redo)){
      reset();
    }
    
    gameover.visible=true;
    redo.visible=true;
  }
  
  drawSprites();
}

function spawnObstacles() {

  if(frameCount % 60 === 0) {
    var obstacle = createSprite(500,355,10,40);
    obstacle.velocityX = -(6+count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage("ob1",obstacle1_img);
        break;
        
        case 2: obstacle.addImage("ob2",obstacle2_img);
        break;
        
        case 3: obstacle.addImage("ob3",obstacle3_img);
        break;
        
        case 4: obstacle.addImage("ob4",obstacle4_img);
        break;
        
        case 5: obstacle.addImage("ob5",obstacle5_img);
        break;
        
        default: obstacle.addImage("ob5",obstacle6_img);
        break;
    }
    
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 90 ;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(500,320,40,10);
    cloud.y = random(280,320);
    cloud.addAnimation("cloud",cloud_img);
    cloud.scale = 0.5; 
    cloud.velocityX = -(3+count/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 166;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add (cloud);
  }
}

function reset(){
  gameState=START;
  trex.changeAnimation("start",trex_start);
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  count=0;
}