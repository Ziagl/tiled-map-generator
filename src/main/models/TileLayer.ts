export class TileLayer {
    public data: number[];
    public height: number;
    public id: number;
    public name: string;
    public opacity: number;
    public type: string;
    public visible: boolean;
    public width: number;
    public x: number;
    public y: number;

    constructor() {
        this.data = [];
        this.height = 0;
        this.id = 1;
        this.name = "";
        this.opacity = 1;
        this.type = "tilelayer";
        this.visible = true;
        this.width = 0;
        this.x = 0;
        this.y = 0;
    }
}