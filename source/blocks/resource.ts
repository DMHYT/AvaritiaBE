["neutronium", "infinity", "crystal_matrix"].forEach(key => {
    const id = `${key}_block`;
    IDRegistry.genBlockID(id);
    Block.createBlock(id, [{name: `tile.avaritia:block_resource.${key}.name.name`, texture: [[key, 0]], inCreative: true}], {sound: 'metal', destroytime: 50, explosionres: 2000});
    ToolAPI.registerBlockMaterial(BlockID[id], "stone", 3, false);
    AVA_STUFF.push(BlockID[id]);
});
Callback.addCallback("PostLoaded", () => {
    ["neutronium", "infinity", "crystal_matrix"].forEach(key => {
        const block = BlockID[`${key}_block`];
        const ingot = ItemID[`${key}_ingot`];
        addShaped(block, 1, 0, ["mmm", "mmm", "mmm"], ['m', ingot, 0]);
        addShapeless(ingot, 9, 0, [[block, 0]]);
    });
});