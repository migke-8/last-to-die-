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
export const randomColors = ['white', '#9cc2c8', 'red', 'black','green', 'blue', '#cf7a9d', 'purple'];
