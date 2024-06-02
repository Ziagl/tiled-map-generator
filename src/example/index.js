// this example shows how to generate a map
// to run it you need current version of Node.js
// command: node index.js
// output is a new map.json file that can be opened with Tiled (https://www.mapeditor.org/)
// the folder should contain one Tiled map file with name example.json (example given)
const fs = require('fs');
const tmg = require('@ziagl/tiled-map-generator');

// generate a new map
let generator = new tmg.Generator();
generator.generateMap(tmg.MapType.CONTINENTS_ISLANDS, tmg.MapSize.TINY);

// convert this map into a 2d array
let converter = new tmg.Converter();

// store it in a new json file based on example.json
const data = fs.readFileSync('example.json', 'utf8');
const [map, rows, columns] = generator.exportMap();
const result = converter.convertToTiled(map, rows, columns, data);
fs.writeFileSync('map.json', result, 'utf-8', (err) => {
    if (err) {
        console.error('Error while writing map file:', err);
    }
});

// print out map as debug output on console
console.log(generator.print());