const canvas = document.getElementById('c');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = .7;

// ENEMY AND PLAYER SPRITES

const background = new Sprite(
    {
        x: 0,
        y: 0
    },
    './Images/background.png',
    1024,
    576
);

const shop = new Sprite(
    {
        x: 720,
        y: 163
    },
    './Images/shop/Shop1.png',
    295,
    320
);

const player = new Fighter({
    x: 40,
    y: 0
},

{
    x: 0, 
    y: 0
},

100, 100, 'red',

{
    x: 50,
    y: 0
},

{
    x: 25,
    y: 100
});


const enemy = new Fighter({
    x: 940,
    y: 100
},

{
    x: 0, 
    y: 0
},

100, 100, 'blue',

{
    x: -50,
    y: 0
},

{
    x: 25,
    y: 100
});

// KEY TRACKING

let cpuActive = false;
let cpuDecision = true;
let cpuDecisionTime = 500;

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft:
    {
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    }
}

let lastKey;

decreaseTimer();

let finished = false;

let shopFrames = [/*"./Images/shop/Shop1.png",*/ "./Images/shop/Shop2.png", "./Images/shop/Shop3.png", "./Images/shop/Shop5.png", "./Images/shop/Shop6.png"];
let shopFrame = 0;
let shopState = "ready";

enemy.lastKey = '';

function restart()
{
    player.position.x = 0;
    enemy.position.x = canvas.width - 100;

    player.health = 100;
    enemy.health = 100;
    document.getElementById("Enemy Health").style.width = 100 + "%";
    document.getElementById("Player Health").style.width = 100 + "%";

    document.getElementById('text').innerHTML = '';

    
    if(!resetTimer())
    {
        decreaseTimer();
    }
    else
    {
        alert('Not decreasing timer');
    }

    finished = false;

    cpuActive = false;
}

// GAME ANIMATION LOOP

function animate()
{
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();

    // Animate the shop
    if(shopFrame < shopFrames.length && shopState == "ready")
    {
        shopState = "not ready";
        //alert("sups");
        setTimeout(() => {shop.image.src = shopFrames[shopFrame]; shopFrame++; shopState = "ready"}, 150);
    }
    else if(shopState == "ready")
    {
        setTimeout(() => {shopFrame = 0; shop.image.src = shopFrames[shopFrame]; shopFrame++; shopState == "ready"}, 150);   
    }

    player.update();
    enemy.update();

    // CPU routine
    if(cpuActive && cpuDecision)
    {

        let rand = Math.random();
        let attackDistance = Math.random() * 100 + 30;
        let jumpDistance = Math.random() * 150 + 30;
        
        if(rand > .2)
        {
            if(player.position.x < enemy.position.x)
            {
                enemy.lastKey = 'ArrowLeft';
                keys.ArrowLeft.pressed = true;
                keys.ArrowRight.pressed = false;
            }
            else if(player.position.x > enemy.position.x)
            {
                enemy.lastKey = 'ArrowRight';
                keys.ArrowRight.pressed = true;
                keys.ArrowLeft.pressed = false;
            }
        }
        else
        {
            if(player.position.x < enemy.position.x)
            {
                enemy.lastKey = 'ArrowRight';
                keys.ArrowRight.pressed = true;
                keys.ArrowLeft.pressed = false;
                cpuDecisionTime = 500;
            }
            else if(player.position.x > enemy.position.x)
            {
                enemy.lastKey = 'ArrowLeft';
                keys.ArrowLeft.pressed = true;
                keys.ArrowRight.pressed = false;
                cpuDecisionTime = 500;
            }
        }

        if(Math.abs(player.position.x - enemy.position.x) <= attackDistance)
        {
            enemy.attack();
            cpuDecisionTime = 200;
        }

        if(Math.abs(player.position.x - enemy.position.x) <= jumpDistance)
        {
            if(enemy.jump)
            {
                enemy.velocity.y = -20;
                enemy.jump = false;
                setTimeout(() => {enemy.downAttack = true; setTimeout(() => {enemy.downAttack = false;}, 500)}, 100);
            }
        }

        cpuDecision = false;
        window.setTimeout(() => {cpuDecision = true;}, cpuDecisionTime)
    }

    /* If no directional input is recieved, the
    player's velocity will stay at zero, making the
    player stop if the keys are let go of.*/

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if(keys.a.pressed && player.lastKey === 'a' && !player.leftWall)
    {
        player.velocity.x = -5;
        player.attackBox.offset.x = -50;
        player.direction = 'left';
        //player.image.src = "./Images/Kenji/Kenji-Left.png"
        player.rightWall = false;
    }
    else if(keys.d.pressed && player.lastKey === 'd' && !player.rightWall){
        player.velocity.x = 5;
        player.attackBox.offset.x = 50;
        player.direction = 'right';
        //player.image.src = "./Images/Kenji/Kenji-Right.png"
        player.leftWall = false;
    }

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && !enemy.leftWall)
    {
        enemy.velocity.x = -5;
        enemy.attackBox.offset.x = -50;
        enemy.direction = 'left';
        //enemy.image.src = "./Images/Kenji/Kenji-Left.png"
        enemy.rightWall = false;
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && !enemy.rightWall)
    {
        enemy.velocity.x = 5;
        enemy.attackBox.offset.x = 50;
        enemy.direction = 'right';
        //alert('Going right');
        //enemy.image.src = "./Images/Kenji/Kenji-Right.png"
        enemy.leftWall = false;
    }
    // Detect collision

    if((rectangularCollision({rectangle1: player.attackBox, rectangle2: enemy}) || rectangularCollision({rectangle1: player.downBox, rectangle2: enemy})) && (player.isAttacking || player.downAttack))
    {
        enemy.color = 'white';
        enemy.health -= 5;
        player.isAttacking = false;
        //player.attackAnimation = false;
        player.downAttack = false;
        document.getElementById("Enemy Health").style.width = enemy.health + "%";
        if(enemy.health <= 0 && !finished)
        {
            document.getElementById('text').innerHTML = 'RED WINS!';
            document.getElementById('text').style.display = 'flex';
            document.getElementById('text').style.color = 'red';
            finished = true;
        }
    }
    else
    {
        enemy.color = 'blue';
    }

    if((rectangularCollision({rectangle1: enemy.downBox, rectangle2: player}) || rectangularCollision({rectangle1: enemy.attackBox, rectangle2: player})) && (enemy.isAttacking || enemy.downAttack))
    {
        player.color = 'white';
        enemy.isAttacking = false;
        enemy.downAttack = false;
        //enemy.attackAnimation = false;
        player.health -= 5;
        document.getElementById("Player Health").style.width = player.health + "%";

        if(player.health <= 0 && !finished)
        {
            document.getElementById('text').innerHTML = 'BLUE WINS!';
            document.getElementById('text').style.display = 'flex';
            document.getElementById('text').style.color = 'blue';
            finished = true;
        }
    }
    else
    {
        player.color = 'red';
    }
}

animate();

// CONTROLS

let musicStarted = false;

function playMusic() {
    let audio = new Audio("BgMusic.mp3");
    audio.play()
    musicStarted = true;
    window.setTimeout(playMusic, 138000);
 }

window.addEventListener('keydown', (event) => {

    if(!musicStarted)
    {
        playMusic();
    }

    switch (event.key)
    {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;

        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        
        case 'w':
            if(player.jump)
            {
                player.velocity.y = -20;
                player.jump = false;
                setTimeout(() => {player.downAttack = true; setTimeout(() => {player.downAttack = false;}, 500)}, 100);
            }
        break;

        case 's':
            player.attack();
            break;

        case 'ArrowRight':
            if(!cpuActive)
            {
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
            }
            break;

        case 'ArrowLeft':
            if(!cpuActive)
            {
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
            }
            break;
        
        case 'ArrowUp':
            if(enemy.jump && !cpuActive)
            {
                enemy.velocity.y = -20;
                enemy.jump = false;
                setTimeout(() => {enemy.downAttack = true; setTimeout(() => {enemy.downAttack = false;}, 500)}, 100);
            }
        break;

        case 'ArrowDown':
            if(!cpuActive)
            {
                enemy.attack();
            }
            break;
        
        case 'c':
            cpuActive = true;
            alert("CPU Activated");
            break;
        
        case 'r':
            {
                restart();
            }
            break;
    }
});

window.addEventListener('keyup', (event) => {

    switch (event.key)
    {
        case 'd':
            keys.d.pressed = false;
            break;
        
        case 'a':
            keys.a.pressed = false;
            break;   
    }

    switch (event.key)
    {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});