//Environment
var ground,inv;
var sky;
var cloud,cloud_;
var stone,stone_;

//Collectables
var cube,cube_;
var atom,atom_;

//Players
var alien,alien_;
var rover,rover_,rover__;

//UI
var start,start_;
var rules,rules_;
var restart,restart_;
var settings,settings_;
var switch1,switch2,circleYes,circleNo;
var swicthBtn,switchPBtn,pause_,play_;
var up,down,up_,down_;

//Sounds
var click,jump,gmov;

//Cursor
var cursor,cursor_;

var ufo,ufo_,ufo$;
var stone$;
var block$;
var cloud$;

var next;
var node_;

var font;

var xp;
var cx;
var dt;
var sd;

var block=["0","1",'2',"3","4","5","6","7"];

var state="start";
var mode="collection";

var score=0,score$=0;

function preload(){
    cloud_=loadImage("Assets/Animations/Cloud.png");
    rover_=loadAnimation("Assets/Animations/Rover(1).png","Assets/Animations/Rover(2).png","Assets/Animations/Rover(3).png","Assets/Animations/Rover(4).png");
    start_=loadImage("Assets/UI/start.png");
    rules_=loadImage("Assets/UI/rules.png");
    settings_=loadImage("Assets/UI/settings.png");
    circleNo=loadImage("Assets/UI/circleNo.png");
    circleYes=loadImage("Assets/UI/circleYes.png");
    ufo_=loadImage("Assets/Animations/Ufo.png");
    rover__=loadImage("Assets/Animations/RoverDown.png");
    restart_=loadImage("Assets/UI/restart.png");
    pause_=loadImage("Assets/UI/pause.png");
    play_=loadImage("Assets/UI/Play.png");
    stone_=loadImage("Assets/Animations/rock.png");
    cube_=loadImage("Assets/Animations/cube.png");
    atom_=loadImage("Assets/Animations/atom.png");
    down_=loadImage("Assets/UI/down.png");
    up_=loadImage("Assets/UI/up.png");

    click=loadSound("Assets/Sounds/click.mp3");
    gmov=loadSound("Assets/Sounds/go.mp3");
    jump=loadSound("Assets/Sounds/jump.mp3");

    font=loadFont("Assets/Fonts/hck.ttf");

    //node_=loadImage("Assets/Misc/node.png");
    cursor_=loadImage("Assets/pointer.png");
}

function setup() {
    
    createCanvas(windowWidth,windowHeight);

    sky=createSprite(width/2,height/2,width*2,height);
    sky.shapeColor="aqua";

    ground=createSprite(width/2,height-50,width*2,100);
    ground.shapeColor="lightsalmon";

    rover=createSprite(200,height-50-ground.height-5,40,40);
    rover.addAnimation("rover",rover_);
    rover.addAnimation("rover_",rover__);
    rover.scale=0.3;
    //rover.debug=true;

    inv=createSprite(width/2,height-50-ground.height/2,width*2,10);
    inv.visible=false;

    start=createSprite(width/2,height/2,20,20);
    start.addAnimation("start",start_);

    rules=createSprite(start.position.x,start.position.y+70,20,20);
    rules.addAnimation("rules",rules_);

    settings=createSprite(start.position.x,start.position.y-70,20,20);
    settings.addAnimation("setttings",settings_);

    switch1=createSprite(width/2-50,height/2,10,10);
    switch1.addAnimation("sw1",circleYes);
    switch1.addAnimation("sw12",circleNo);
    switch1.scale=width/(width*2);
    switch1.visible=false;

    switch2=createSprite(width/2-50,switch1.y+30,10,10);
    switch2.addAnimation("sw22",circleNo);
    switch2.addAnimation("sw2",circleYes);
    switch2.scale=width/(width*2);
    switch2.visible=false;

    cube=createSprite(width+200,ground.y-ground.height,40,40);
    cube.addAnimation("cube",cube_);
    cube.scale=0.15;

    atom=createSprite(width+20,ground.y-ground.height,40,40);
    atom.addAnimation("atom",atom_);
    atom.scale=0.15;

    restart=createSprite(width/2,start.y-100,50,50);
    restart.addAnimation("restart",restart_);
    restart.scale=0.5;
    restart.depth=start.depth-1;

    switchBtn=createSprite(width/2-30,50,20,20);
    switchBtn.addAnimation("sw",pause_);

    switchPBtn=createSprite(width/2+30,50,20,20);
    switchPBtn.addAnimation("spw",play_);
    switchPBtn.visible=false;

    stone=createSprite(width+20,ground.y-0.5*ground.height-30,20,20);
    stone.velocityX=-4;
    stone.addAnimation("stone",stone_);
    stone.setCollider("rectangle",0,15,70,40);
    //stone.debug=true;
    stone.scale=0.75;
    stone.visible=false;

    down=createSprite(50,height-50,40,40);
    down.addAnimation("down",down_);
    down.scale=0.5;
    down.visible=false;

    up=createSprite(100,height-50,40,40);
    up.addAnimation("up",up_);
    up.scale=0.5;
    up.visible=false;

    cursor=createSprite(-10,-10,20,20);
    cursor.addAnimation("cursor",cursor_);

    xp=Math.round(rover.position.y);
    cx=600;
    dt=0;
    sd=0;

    ufo$=new Group();
    stone$=new Group();
    block$=new Group();
    cloud$=new Group();
    
    touches=[];

}

function draw() {
    background(220);

    textFont(font);

    drawSprites();

    fill("orange");
    ellipse(100,100,50,50);

    fill("black");
    textSize(15);

    cursor.x=mouseX+5;
    cursor.y=mouseY+5;

    noCursor();

    stone.collide(ground);

    if(rover.isTouching(inv)) {
        rover.position.y=inv.position.y-rover.height/2;
    }

    cursor.depth=down.depth+1;

    if(state=="start") {
        start.visible=!false;
        rules.visible=!false;
        settings.visible=!false;
        switch1.visible=false;
        switch2.visible=false;
        up.visible=false;
        down.visible=false;

        stone.x=width+20;
        
        dt=0;

        score$=0;

        frameCount=0;

        restart.visible=false;
        switchBtn.visible=false;

        score=0;

        if(touches.length>0) {
            if(touches[0].x<start.position.x+50&&touches[0].x>start.position.x-50) {
                if(touches[0].y<start.position.y+30&&touches[0].y>start.position.y-30) {
                    state="play";
                   
                    start.visible=false;
                    rules.visible=false;
                    settings.visible=false;
                    
                    alert("Get ready!");

                    click.play();
                }
            
                if(touches[0].y<rules.position.y+30&&touches[0].y>rules.position.y-30) {
                    try {
                        state="rules";
                   
                        start.visible=false;
                        rules.visible=false;
                        settings.visible=false;


                        click.play();
                    }
                    catch(err) {
                        alert(err);
                    }
                    finally {
                        state="rules";
                    }
                }
            
                if(touches[0].y<settings.position.y+30&&touches[0].y>settings.position.y-30) {
                    state="set";
                   
                    start.visible=false;
                    rules.visible=false;
                    settings.visible=false;
                    

                    click.play();
                }
            }
            else {
                touches=[];
            }
        }

        /*if(touches.length>0) {
            if(touches[0].x<start.position.x+50&&touches[0].x>start.position.x-50) {
                if(touches[0].y<start.position.y+30&&touches[0].y>start.position.y-30) {
                    state="play";
                   
                    start.visible=false;
                    rules.visible=false;
                    settings.visible=false;
                    click.play();
                }
                else {
                    touches=[];
                }
            }
            else {
                touches=[]
            }
        }*/

        if(mousePressedOver(start)) {
            state="play";
            start.visible=false;
            rules.visible=false;
            settings.visible=false;

            click.play();
        }
        if(mousePressedOver(rules)) {
            state="rules";
            start.visible=false;
            rules.visible=false;
            settings.visible=false;

            click.play();
        }
        if(mousePressedOver(settings)) {
            state="set";
            start.visible=false;
            rules.visible=false;
            settings.visible=false;

            click.play();
        }
    }
    else if(state=="set") {
        text("Mode - "+mode,switch1.x,switch1.y-30);

        switch1.visible=!false;
        switch2.visible=!false;

        switch(mode) {
            case "collection" : switch2.changeAnimation("sw2");
                                switch1.changeAnimation("sw12");
                                break;
            case "survival" : switch1.changeAnimation("sw1");
                            switch2.changeAnimation("sw22");
                            break;
        }

        text("Survival",switch1.x+20,switch1.y+5);
        text("Collection",switch2.x+20,switch2.y+5);
        
        if(touches.length>0) {
            if(touches[0].x<switch1.position.x+30&&touches[0].x>switch1.position.x-30) {
                if(touches[0].y<switch1.position.y+30&&touches[0].y>switch1.position.y-30) {
                    switch1.changeAnimation("sw1");
                    switch2.changeAnimation("sw22");
                    mode="survival";
                }
                if(touches[0].y<switch2.position.y+30&&touches[0].y>switch2.position.y-30) {
                    switch2.changeAnimation("sw2");
                    switch1.changeAnimation("sw12");
                    mode="collection";
                }
            }
            else {
                state="start";   
            }
        }


        if(mousePressedOver(switch1)) {
            switch1.changeAnimation("sw1");
            switch2.changeAnimation("sw22");
            mode="survival";
        }
        if(mousePressedOver(switch2)) {
            switch2.changeAnimation("sw2");
            switch1.changeAnimation("sw12");
            mode="collection";
        }

        text("(Press space/tap\nanywhere on the screen\nto continue...)",switch1.x,switch1.y+2*30+10);
        if(keyWentDown("space")){
            state="start";
        }
    }
    else if(state=="rules") {
        text("You are a satellite\nspecialist at NASA,\nand the probe HERMES,\nis being chased by an alien!\nIt's your task to save\nit! Avoid the stones and\nenemy UFO's to save it!\n(Although they won't affect\nyou in pause state.)\n(Press space or tap\nanywhere to continue)",50,50);
        if(keyWentDown("space")){
            dt=1;
            click.play();
        }
        if(touches.length>0) {
            dt=1;
        }
        if(dt==1) {
            state="rules2";
            touches=[];
        }
    }
    else if(state=="rules2") {
        dt=0;
        text("In collection mode-\nCollecting an atom is\nworth 5 points and\ncollecting a cube is\nworth 10 points.\nWhile collecting points,\nremember to dodge the UFO's\nand obstacles.\n(Press space or tap\nanywhere to continue)",50,50);
        if(keyWentDown("space")||touches.length>0){
            dt=10;
            click.play();
        }
        if(dt==10) {
            state="rules3";
            touches=[];
        }
    }
    else if(state=="rules3") {
        dt=0;
        text("In survival mode-\ncrossing a 'node' gives\n 1 point. All you have\nto do is to dodge\nthe UFO's and obstacles\n(Press space or tap\nanywhere to continue)",50,50);
        if(keyWentDown("space")||touches.length>0){
            click.play();
            dt=11;
        }
        if(dt==11) {
            state="rules4";
            touches=[];
        }
    }
    else if(state=="rules4") {
        dt=0;
        text("Controls-\nIn a computer/laptop, press\nspace to jump the rover\nand press the down key\nto make the rover duck below.\nIn a touchscreen device(not\ntouchscreen laptops),controls are provided\nat the bottom-left corner.\nAlternatively,you can use the touch\ncontrols on a laptop/computer.\n(Press space or tap\nanywhere to continue)",50,50);
        if(keyWentDown("space")||touches.length>0){
            dt=100;
            click.play();
        }
        if(dt==100) {
            state="start";
            touches=[];
        }
    }
    else if(state=="play") {

        sd=0;

        stone.visible=!false;
        stone.velocityY=4;
        stone.velocityX=-4;

        rover.visible=true;
        /*up.visible=true;
        down.visible=true;*/

        if(stone.x==0) {
            stone.x=width+400;
        }

        ufo$.setVelocityXEach(-6);
        
        text("Tap anywhere on the screen\nto jump...\nMode- " + mode, 20,height-50);

        switch (mode) {
            case "survival" : score+=0.01;
                            score$=Math.round(score);
                            cube.visible=false;
                            atom.visible=false;
                            break;
            case "collection" : cube.velocityX=-4;
                                atom.velocityX=-4;
                                if(rover.isTouching(cube)) {
                                    score+=10;
                                    score$=score;
                                    cube.x=width+Math.round(random(1000,1400));
                                    cube.y=Math.round(random(rover.y,height-300));
                                    jump.play();
                                }
                                if(rover.isTouching(atom)) {
                                    score+=5;
                                    score$=score;
                                    atom.x=width+Math.round(random(299,499));
                                    atom.y=Math.round(random(rover.y,height-300));
                                    jump.play();
                                }
                                cube.visible=true;
                                atom.visible=true;
                                break;
        }
        
        block[0].velocityX=-4;
        block[1].velocityX=-4;
        block[2].velocityX=-4;
        block[3].velocityX=-4;
        block[4].velocityX=-4;

        textSize(20);
        textFont(font);
        fill("black");
        text("Score- " + score$,width/2-30,100);

        switchBtn.visible=true;

        if(cube.x==0) {
            cube.x=width+Math.round(random(1000,1400));
            cube.y=Math.round(random(rover.y,height-300));
        }
        if(atom.x==0) {
            atom.x=width+Math.round(random(299,499));
            atom.y=Math.round(random(rover.y,height-300));
        }


        if(frameCount%100==0) {
            spawnStones();
        }
        if(frameCount%300==0) {
            spawnClouds();
        }
        if(frameCount%Math.round(cx)==0) {
            spawnEnemy();
        }

        if(touches.length>0) {
            if(touches[0].y<down.position.y+50&&touches[0].y>down.position.y-50) {
                if(touches[0].x<up.position.x+50&&touches[0].x>up.position.x-50) {
                    rover.velocityY=-6;
                    //alert("UP");
                }
            
                if(touches[0].x<down.position.x+50&&touches[0].x>down.position.x-50) {
                    rover.setCollider("rectangle",0,rover.height-30,270,150);
                    rover.changeAnimation("rover_");
                }
            }
            else if(touches[0].y<switchBtn.position.y+50&&touches[0].y>switchBtn.position.y-50) {
                if(touches[0].x<switchBtn.position.x+50&&touches[0].x>switchBtn.position.x-50) {
                    state="pause";
                }
            }
        }
        
            
        
        if(touches.length==1&&rover.position.y>height-300) {
               rover.position.y-=50;
               //alert("UP");
        }
        else if(touches.length==2) {
               rover.setCollider("rectangle",0,rover.height-30,270,150);
               rover.changeAnimation("rover_");
        }
        //rover.debug=true;
        rover.velocityY=2;
        
        if(rover.isTouching(inv)) {
            rover.position.y=inv.position.y-rover.height/2;
        }

        if(cx===100) {
            cx=500;
        }
    

        if((keyDown("space")||mousePressedOver(up))&&rover.position.y>height-300) {
            rover.velocityY=-6;
        }
        if(keyDown("down")||mousePressedOver(down)) {
            rover.setCollider("rectangle",0,rover.height-30,270,150);
            rover.changeAnimation("rover_");
        }
        else {
            rover.setCollider("rectangle",0,0,300,300);
            rover.changeAnimation("rover");
        }


        if(ufo$.isTouching(rover)||stone.isTouching(rover)) {
            console.log("end");
            state="end";
            ufo$.destroyEach();
            stone.x=width+400;
            stone.velocityX=0;
            rover.visible=false;

            gmov.play();
               
            textSize(30);
            textFont(font);
            fill("black");
            text("The End",width/2,height/2);
        }

        if(mousePressedOver(switchBtn)) {
            sd=1;
            click.play();
        }
        if(sd==1) {
            state="pause";
        }
    }
    else if(state=="pause") {

        sd=0;

        rover.velocityY=0;

        atom.velocityX=0;
        cube.velocityX=0;
        stone.velocityX=0;
        ufo$.setVelocityXEach(0);

        textSize(20);
        textFont(font);
        fill("black");
        text("Score- " + score$,width/2-30,100);

        restart.visible=true;
        switchPBtn.visible=true;
        switchBtn.visible=false;

        block[0].velocityX=0;
        block[1].velocityX=0;
        block[2].velocityX=0;
        block[3].velocityX=0;
        block[4].velocityX=0;

        block$.velocityXEach=0;
        block$.destroyEach();

        cloud$.velocityXEach=0;
        ufo$.velocityXEach=0;
        
        if(touches.length>0) {
            if(touches[0].y<switchPBtn.position.y+50&&touches[0].y>switchPBtn.position.y-50) {
                if(touches[0].x<switchPBtn.position.x+50&&touches[0].x>switchPBtn.position.x-50) {
                    switchPBtn.visible=!true;
                    switchBtn.visible=false;
                    restart.visible=false;

                    block[0].velocityX=-4;
                    block[1].velocityX=-4;
                    block[2].velocityX=-4;
                    block[3].velocityX=-4;
                    block[4].velocityX=-4;

                    click.play();

                    block$.velocityXEach=-4;

                    sd=2;
                    //alert("UP");
                }
            }
            else if(touches[0].y<restart.position.y+50&&touches[0].y>restart.position.y-50) {
                if(touches[0].x<restart.position.x+50&&touches[0].x>restart.position.x-50) {
                    state="start";
                    rover.visible=true;

                    cube.x=width+Math.round(random(1000,1400));
                    cube.y=Math.round(random(rover.y,height-300));

                    atom.x=width+Math.round(random(299,499));
                    atom.y=Math.round(random(rover.y,height-300));

                    score=0;

                    switchPBtn.visible=false;
                    restart.visible=false;
                    ufo$.destroyEach();

                    click.play();

                    frameCount=0;
                }
            }
        }

        if(mousePressedOver(restart)) {
            state="start";
            rover.visible=true;

            cube.x=width+Math.round(random(1000,1400));
            cube.y=Math.round(random(rover.y,height-300));

            atom.x=width+Math.round(random(299,499));
            atom.y=Math.round(random(rover.y,height-300));

            score=0;

            switchPBtn.visible=false;
            restart.visible=false;
            ufo$.destroyEach();

            click.play();

            frameCount=0;
        }

        if(mousePressedOver(switchPBtn)) {
            switchPBtn.visible=!true;
            switchBtn.visible=false;
            restart.visible=false;

            block[0].velocityX=-4;
            block[1].velocityX=-4;
            block[2].velocityX=-4;
            block[3].velocityX=-4;
            block[4].velocityX=-4;

            click.play();

            block$.velocityXEach=-4;

            sd=2;
        }
        if(sd==2) {
            touches=[];
            state="play";
            sd=0;
            //console.error("Critical, but unknown");
        }
        
    }
    else if(state=="end") {
        textSize(30);
        textFont(font);
        fill("black");
        text("The End",width/2-45,restart.y-40);

        restart.visible=!false;

        atom.visible=false;
        cube.visible=false;

        atom.velocityX=0;
        cube.velocityX=0;

        switchBtn.visible=false;

        if(mousePressedOver(restart)) {
            state="start";
            rover.visible=true;
            score=0;

            click.play();
        }
    }
}

function spawnStones() {
    block[0]=createSprite(width+20,ground.y-20-20,20,20);
    block[0].velocityX=-4;
    block[0].lifetime=Math.round(width/2)+2;
    block$.add(block[0]);

    block[1]=createSprite(width+20+20,ground.y-20,20,20);
    block[1].velocityX=-4;
    block[1].lifetime=Math.round(width/2)+2;
    block$.add(block[1]);

    block[2]=createSprite(width+20,ground.y,20,20);
    block[2].velocityX=-4;
    block[2].lifetime=Math.round(width/2)+2;
    block$.add(block[2]);

    block[3]=createSprite(width+20+20,ground.y+20,20,20);
    block[3].velocityX=-4;
    block[3].lifetime=Math.round(width/2)+2;
    block$.add(block[3]);

    block[4]=createSprite(width+20,ground.y+20+20,20,20);
    block[4].velocityX=-4;
    block[4].lifetime=Math.round(width/2)+2;
    block$.add(block[4]);

    up.depth=block[0].depth+1;
    up.depth=block[1].depth+1;
    up.depth=block[2].depth+1;
    up.depth=block[3].depth+1;
    up.depth=block[4].depth+1;

    down.depth=block[0].depth+1;
    down.depth=block[1].depth+1;
    down.depth=block[2].depth+1;
    down.depth=block[3].depth+1;
    down.depth=block[4].depth+1;
}

function spawnClouds() {
    cloud=createSprite(width+200,Math.round(random(10,height-height/2)),50,10);
    cloud.velocityX=-3;
    cloud.addAnimation("cloud",cloud_);
    cloud.scale=0.15;
    cloud.lifetime=Math.round(width)+170;
    cloud$.add(cloud);
}

function spawnEnemy() {
    ufo=createSprite(width+50,Math.round(random(xp-100,xp+20)),80,80);
    ufo.velocityX=-5;
    ufo.addAnimation("ufo",ufo_);
    ufo.scale=0.2;
    ufo.lifetime=Math.round(width/3)+15;

    //ufo.debug=true;

    ufo.setCollider("circle",0,0,200);

    ufo$.add(ufo);
    console.log(xp);
    cx-=4;
}
