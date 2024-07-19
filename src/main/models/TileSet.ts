export class TileSet {
  public columns: number;
  public firstgid: number;
  public image: string;
  public imageheight: number;
  public imagewidth: number;
  public margin: number;
  public name: string;
  public spacing: number;
  public tilecount: number;
  public tileheight: number;
  public tilewidth: number;
  public transparentcolor: string;

  constructor() {
    this.columns = 0;
    this.firstgid = 1;
    this.image = '';
    this.imageheight = 0;
    this.imagewidth = 0;
    this.margin = 0;
    this.name = '';
    this.spacing = 0;
    this.tilecount = 0;
    this.tileheight = 0;
    this.tilewidth = 0;
    this.transparentcolor = '';
  }
}
