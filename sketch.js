//Create variables here
var dog,happyDog,database,foodS=20,foodStock;

var bedImg,garImg,washImg,sadDog;
var feed,addbottle;
var gameState;
var lastTime,lastFeed=0;
var foodObj;

function preload()
{
	happyDog=loadImage("images/dogImg1.png");
  bedImg=loadImage("images/Bed Room.png");
  garImg=loadImage("images/Garden.png");
  sadDog=loadImage("images/Lazy.png");
}

function setup() {
 database=firebase.database(); 
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  database.ref('/').update({ Food : 20});
	createCanvas(800, 500);
  dog=createSprite(500,200,20,20);
  dog.addImage(loadImage("images/dogImg.png"));
  dog.scale=0.18;

  feed=createButton("Feed the Dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addbottle=createButton("Add Milk");
  addbottle.position(700,95);
  addbottle.mousePressed(addMilkBottle);

  foodObj=new Food(20);

  state=database.ref('gameState').on("value",(data)=>{
    gameState=data.val();
  });
  
}

function update(state)
{
  database.ref('/').update({
    gameState:state
  });
}

function draw() {  

  background(120);
  currentTime=hour();
  if(currentTime==(lastFeed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFeed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFeed+2) && currentTime<=(lastFeed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  if(gameState!="Hungry")
  {
    feed.hide();
    addbottle.hide();
    dog.remove();
    dog.addImage(happyDog);
  }else{
    feed.show();
    addbottle.show();
    dog.addImage(sadDog);
  }
  /*if(keyWentDown("UP_ARROW"))
  {
    writeStock(foodS);
  }*/
  lastTime=database.ref('LastFed/LastFed');
  lastTime.on("value",function(data)
  {
    lastFeed=data.val();
  });

  foodObj.display();

  drawSprites();
  fill("red");
  textSize(20);
  text("Food Left :"+ foodS,200,100);

  if(lastFeed>12)
  {
    text("Last Fed: "+(lastFeed-12)+" PM",200,400);
  }
  else if(lastFeed<=12)
  {
    text("Last Fed: "+(lastFeed)+" AM",200,400);
  }
  
}

function readStock(data)
{
  foodS=data.val();
}

/*function writeStock(x)
{
  if(x<=0)
  {
    x=0;
  }
  else
    x=x-1;
  database.ref('/').update({ Food : x});
}*/

function addMilkBottle()
{
  foodS++;
  database.ref('/').update(
    {
      Food:foodS
    }
  );
  time=hour();
  database.ref('LastFed').update(
    {
      LastFed:time
    }
  );
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  foodS--;
  if(foodS<=0)
  {
    foodS=0;
  }
  database.ref('/').update(
    {
      Food:foodS
    }
  );
  dog.addImage(happyDog);
  foodObj.deductFood();
}

