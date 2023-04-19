import fs from "fs";
import { Packr } from "msgpackr";

const recipes = fs.readFileSync("public/recipes.json");
console.log(`read public/recipes.json (${Math.floor(recipes.byteLength / 1024)} KiB)`);
const packed = new Packr({ useRecords: true, bundleStrings: true }).pack(JSON.parse(recipes));
fs.writeFileSync("public/recipes.msgpack", packed);
console.log(`wrote public/recipes.msgpack (${Math.floor(packed.byteLength / 1024)} KiB)`);
