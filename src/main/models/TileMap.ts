import { TileLayer } from './TileLayer';
import { TileSet } from './TileSet';

export class TileMap {
  public compressionlevel: number;
  public height: number;
  public hexsidelength: number;
  public infinite: boolean;
  public layers: TileLayer[];
  public nextlayerid: number;
  public nextobjectid: number;
  public orientation: string;
  public renderorder: string;
  public staggeraxis: string;
  public staggerindex: string;
  public tiledversion: string;
  public tileheight: number;
  public tilesets: TileSet[];
  public tilewidth: number;
  public type: string;
  public version: string;
  public width: number;

  constructor() {
    this.compressionlevel = -1;
    this.height = 0;
    this.hexsidelength = 0;
    this.infinite = false;
    this.layers = [];
    this.nextlayerid = 2;
    this.nextobjectid = 1;
    this.orientation = 'hexagonal';
    this.renderorder = 'right-down';
    this.staggeraxis = 'y';
    this.staggerindex = 'odd';
    this.tiledversion = '1.11.0';
    this.tileheight = 0;
    this.tilesets = [];
    this.tilewidth = 0;
    this.type = 'map';
    this.version = '1.1';
    this.width = 0;
  }
}
