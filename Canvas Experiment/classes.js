// SPRITE CLASS

class Sprite
{
    constructor(position, imageSrc, width, height, )
    {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.width = width;
        this.image.height = height;
    }

    draw() 
    {
        c.drawImage(this.image,
            this.position.x,
            this.position.y, 
            this.image.width, 
            this.image.height);
    }

    update()
    {
        this.draw();
    }

}

class Fighter
{

    constructor(position, velocity, height, width, color, offset, downBoxOffset, direction = 'right')
    {
        this.position = position;
        this.velocity = velocity;
        this.startAttack = true;
        this.attackAnimation = false;
        this.height = height;
        this.lastKey;
        this.jump = true;
        this.width = width;
        this.direction = direction;
        
        // Image display
        this.image = new Image();
        this.image.width = 100;
        this.image.height = 100;
        this.image.src = "./Images/Keki/Kiki-Left.png.png";

        this.color = color;
        this.canAttack = 3;
        this.isAttacking = false;
        this.downAttack = false;
        this.attackBox = {
            position: 
            {
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50,
            offset: offset
        }
        this.downBox = {
            position:
            {
                x: this.position.x,
                y: this.position.y
            },
            width: 50,
            height: 50,
            offset: downBoxOffset
        }
        this.health = 100;
        this.leftWall = false;
        this.rightWall = false;
    }

    draw() 
    {
        c.fillStyle = this.color;
        c.drawImage(this.image,
            this.position.x,
            this.position.y, 
            this.image.width, 
            this.image.height);

        if(this.attackAnimation)
        {
            // Attack box
            if(this.direction == 'left')
            {
                this.image.src = "./Images/Kiki/KikiAttack-Left.png";
                if(this.startAttack)
                {
                    this.position.x -= 100;
                    this.attackBox.offset.x += 100;
                    this.startAttack = false;
                }
            }
            else
            {
                this.image.src = "./Images/Kiki/KikiAttack-Right.png";
                if(this.startAttack)
                {
                    //this.position.x -= 100;
                    //this.attackBox.offset.x -= 100;
                    this.startAttack = false;
                }
            }
            this.image.width = 200;
            
        }
        else
        {
            if(this.direction == 'left')
            {
                this.image.src = "./Images/Kiki/Kiki-Left.png.png";
                if(!this.startAttack)
                {
                    this.position.x += 100;
                    this.attackBox.offset.x -= 100;
                }
            }
            else
            {
                this.image.src = "./Images/Kiki/Kiki-Right.png";
                if(!this.startAttack)
                {
                    //this.position.x += 100;
                    //this.attackBox.offset.x += 100;
                }
            }
            this.image.width = 100;

            this.startAttack = true;
        }

        if(this.downAttack)
        {
            c.fillStyle = 'green';
            c.fillRect(this.downBox.position.x, this.downBox.position.y, this.downBox.width, this.downBox.height);
        }
        
    }

    update()
    {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.attackBox.position.y = this.position.y;
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;

        this.downBox.position.y = this.position.y + this.downBox.offset.y;
        this.downBox.position.x = this.position.x + this.downBox.offset.x;

        if(this.position.y + this.velocity.y + this.height >= canvas.height - 95)
        {
            this.velocity.y = 0;
            this.jump = true;
        }
        else
        {
            this.velocity.y += gravity;
        }

        if(this.position.x + this.velocity.x + this.width >= canvas.width)
        {
            this.velocity.x = 0;
            this.rightWall = true;
        }

        if(this.position.x + this.velocity.x <= 0)
        {
            this.velocity.x = 0;
            this.leftWall = true;
        }
    }

    attack()
    {
        if(this.canAttack >= 1)
        {
            this.isAttacking = true;
            this.attackAnimation = true;
            this.canAttack -= 1;
            setTimeout(() => {this.isAttacking = false; this.attackAnimation = false;}, 100);
            setTimeout(() => {this.canAttack += 1}, 1500);
        }
        else{
         
        }
    }
}
