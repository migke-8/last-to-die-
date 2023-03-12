export class Rectangle{

    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    intersects(rect)
    {
        if(rect.x<this.x+this.width&&rect.x+rect.width>this.x)
        {
            if(rect.y<this.y+this.height&&rect.y+rect.height>this.y)
            {
                return true;
            }
        }
        return false;
    }
}

export class Entity{

    constructor(rect)
    {
        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
    }
    update()
    {

    }
    render(ctx)
    {

    }
    move(xa, ya)
    {
        this.x+=xa;
        this.y+=ya;
    }
    static get GRAVITY()
    {
        return Entity._GRAVITY;
    }
}
export const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 240;
canvas.height = 240;
export const ctx = canvas.getContext('2d');
export let binaryCanvas = document.createElement('canvas');
binaryCanvas.width = canvas.width;
binaryCanvas.height = canvas.height;
export let binaryCtx = binaryCanvas.getContext('2d');
let str = '';
for(let i = 0;i<40*24;i++)
{
    if(Math.random()<0.3)
    {
        str+= '1';
    }
    else
    {
        str+= '0';
    }
}
function drawNumbers(ctx)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, binaryCanvas.width, binaryCanvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '16px game';
    for(let i = 0;i<24;i++)
    {
        ctx.fillText(str.substring(i*40, i*40+40), 0, 10+i*10)
    }
}
drawNumbers(binaryCtx);