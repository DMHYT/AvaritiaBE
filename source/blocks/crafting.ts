IDRegistry.genBlockID("compressed_crafting_table");
IDRegistry.genBlockID("double_compressed_crafting_table");
IDRegistry.genBlockID("extreme_crafting_table");

Block.createBlock("compressed_crafting_table", [{name: "tile.avaritia.compressed_crafting_table.name", texture: [["compressed_crafting_table", 0]], inCreative: true}], {destroytime: 4, sound: "wood"});
Block.createBlock("double_compressed_crafting_table", [{name: "tile.avaritia.double_compressed_crafting_table.name", texture: [["double_compressed_crafting_table", 0]], inCreative: true}], {destroytime: 20, sound: "wood"});
Block.createBlock("extreme_crafting_table", [{name: "tile.extreme_crafting_table.name", texture: [["extreme_crafting_table_side", 0], ["extreme_crafting_table_top", 0], ["extreme_crafting_table_side", 0]], inCreative: true}], {destroytime: 50, explosionres: 2000, sound: "glass"});

ToolAPI.registerBlockMaterial(BlockID.compressed_crafting_table, "wood", 0, false);
ToolAPI.registerBlockMaterial(BlockID.double_compressed_crafting_table, "wood", 1, false);
ToolAPI.registerBlockMaterial(BlockID.extreme_crafting_table, "stone", 3, false);

AVA_STUFF.push(BlockID.compressed_crafting_table, BlockID.double_compressed_crafting_table, BlockID.extreme_crafting_table);

Callback.addCallback("PostLoaded", () => {
    addShaped(BlockID.compressed_crafting_table, 1, 0, ["ttt", "ttt", "ttt"], ['t', VanillaBlockID.crafting_table, 0]);
    addShaped(BlockID.double_compressed_crafting_table, 1, 0, ["ttt", "ttt", "ttt"], ['t', BlockID.compressed_crafting_table, 0]);
    addShaped(BlockID.extreme_crafting_table, 1, 0, ["iii", "iti", "iii"], ['i', ItemID.crystal_matrix_ingot, 0, 't', BlockID.double_compressed_crafting_table, 0]);
    addShapeless(VanillaBlockID.crafting_table, 9, 0, [[BlockID.compressed_crafting_table, 0]]);
    addShapeless(BlockID.compressed_crafting_table, 9, 0, [[BlockID.double_compressed_crafting_table, 0]]);
});