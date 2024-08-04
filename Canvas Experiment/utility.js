function rectangularCollision({rectangle1, rectangle2})
{
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height);
}


// GAME TIMER

let timer = 30;
function decreaseTimer()
{   

    if(timer > 0)
    {
        timer--;
        document.getElementById('timer').innerHTML = timer;
        setTimeout(() => {decreaseTimer()}, 1000);
    }
    else if(player.health === enemy.health && !finished)
    {
        document.getElementById('text').innerHTML = 'TIE';
        document.getElementById('text').style.display = 'flex';
        document.getElementById('text').style.color = 'white';
        finished = true;
    }
    else if(player.health > enemy.health && !finished)
    {
        document.getElementById('text').innerHTML = 'RED WINS!';
        document.getElementById('text').style.display = 'flex';
        document.getElementById('text').style.color = 'red';
        finished = true;
    }
    else if(player.health < enemy.health && !finished)
    {
        document.getElementById('text').innerHTML = 'BLUE WINS!';
        document.getElementById('text').style.display = 'flex';
        document.getElementById('text').style.color = 'blue';
        finished = true;
    }
    
}

function resetTimer()
{
    let reset = timer > 0;
    timer = 30;
    return reset;
}
