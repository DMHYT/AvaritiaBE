((args: string[]) => {
    for(let i in args){
        let id = args[i];
        IDRegistry.genBlockID(`${id}_block`);
        Block.createBlock(`${id}_block`, [{name: `tile.avaritia:block_resource.${id}.name.name`, texture: [[id, 0]], inCreative: true}], {sound: "metal", destroytime: 50, explosionres: 2000});
        ToolAPI.registerBlockMaterial(BlockID[`${id}_block`], "stone", 3, false);
        AVA_STUFF.push(BlockID[`${id}_block`]);
    }
    Callback.addCallback("PostLoaded", () => {
        for(let i in args){
            let key = args[i];
            addShaped(BlockID[`${key}_block`], 1, 0, ["mmm", "mmm", "mmm"], ['m', ItemID[`${key}_ingot`], 0]);
            addShapeless(ItemID[`${key}_ingot`], 9, 0, [[BlockID[`${key}_block`], 0]]);
        }
    });
})(["neutronium", "infinity", "crystal_matrix"]);