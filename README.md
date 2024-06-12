# tiled-map-generator
A map generator for Tiled Map Editor (https://www.mapeditor.org/) files.

## Sample of generated map inside Tiled Map Editor:

![Alt text](example_images/continents_islands-tiny.png?raw=true "Type: CONTINENTS_ISLANDS, Size: TINY")

## Sample code to create map

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

## All possible map types as example images:

![Alt text](example_images/archipelago-tiny.png?raw=true "Type: ARCHIPELAGO, Size: TINY")

![Alt text](example_images/continents-tiny.png?raw=true "Type: CONTINENTS, Size: TINY")

![Alt text](example_images/highland-tiny.png?raw=true "Type: HIGHLAND, Size: TINY")

![Alt text](example_images/inland_sea-tiny.png?raw=true "Type: INLAND_SEA, Size: TINY")

![Alt text](example_images/islands-tiny.png?raw=true "Type: ISLANDS, Size: TINY")

![Alt text](example_images/lakes-tiny.png?raw=true "Type: LAKES, Size: TINY")

![Alt text](example_images/small_continents-tiny.png?raw=true "Type: SMALL_CONTINENTS, Size: TINY")

![Alt text](example_images/super_continent-tiny.png?raw=true "Type: SUPER_CONTINENT, Size: TINY")