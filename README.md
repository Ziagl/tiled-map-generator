# tiled-map-generator
A map generator for Tiled Map Editor files.

```typescript
const fs = require('fs');
const tmg = require('@ziagl/tiled-map-generator');

// generate a new map
let generator = new tmg.Generator();
generator.generateMap(tmg.MapType.CONTINENTS_ISLANDS, tmg.MapSize.TINY);
const [map, rows, columns] = generator.exportMap();

// convert this map into a 2d array
let converter = new tmg.Converter();

// option 1: store it in a new json file based on example.json
const data = fs.readFileSync('example.json', 'utf8');
const result = converter.convertToTiled(map, rows, columns, data);

// option 2: create a new json string without template
const result = converter.generateTiledJson(map, rows, columns, 'tileset.png', 32, 34, 416, 34, 13, 13, "#ffffff");

fs.writeFileSync('map.json', result, 'utf-8', (err) => {
    if (err) {
        console.error('Error while writing map file:', err);
    }
});

// print out map as debug output on console
console.log(generator.print());
```