class TextInfo{

    static infos = []
    timer = 0;
    velocity = 0;
    constructor(x, y, text, fontSize, color)
    {
        this.x = x;
        this.y = y;
        this.groundHeight = y+20;
        this.ground
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
    }
    update()
    {
        this.timer++;
        this.velocity+=0.4;
        this.y+=this.velocity;
        if(this.y>this.groundHeight)
        {
            this.velocity/=-1.5;
            this.y = this.groundHeight;
        }
        if(this.timer>60)
        {
            TextInfo.deleteInfo(this);
        }
    }
    render(ctx)
    {
        ctx.fillStyle = this.color;
        ctx.font = this.fontSize+'px game';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, Math.floor(this.x), Math.floor(this.y));
    }
    static addInfo(info)
    {
        TextInfo.infos.push(info);
    }
    static deleteInfo(info)
    {
        TextInfo.infos.splice(TextInfo.infos.indexOf(info), 1);
    }
    static clear()
    {
        TextInfo.infos = [];
    }
}
export default TextInfo;