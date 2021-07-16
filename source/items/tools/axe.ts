IDRegistry.genItemID("infinity_axe");
Item.createItem("infinity_axe", "item.avaritia:infinity_axe.name", {name: "infinity_axe", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_AXE", {level: 32, durability: 9999, efficiency: 9999, damage: 20});
ToolLib.setTool(ItemID.infinity_axe, "INFINITY_AXE", ToolType.axe);
Item.setEnchantType(ItemID.infinity_axe, EEnchantType.AXE, 200);

const destroy_trees = (coords: Vector, region: BlockSource, item: ItemInstance) => {
    const blocks_map: string[] = [`${coords.x}:${coords.y}:${coords.z}`];
    const sides = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
    const check = (c: Vector, r: BlockSource) => {
        for(let i in sides){
            let id = r.getBlockId(c.x + sides[i][0], c.y + sides[i][1], c.z + sides[i][2]);
            if(id == VanillaBlockID.log || id == VanillaBlockID.log2 || id == VanillaBlockID.leaves || id == VanillaBlockID.leaves2){
                if(!~blocks_map.indexOf(`${c.x + sides[i][0]}:${c.y + sides[i][1]}:${c.z + sides[i][2]}`)){
                    blocks_map.push(`${c.x + sides[i][0]}:${c.y + sides[i][1]}:${c.z + sides[i][2]}`)
                    check({ x: c.x + sides[i][0], y: c.y + sides[i][1], z: c.z + sides[i][2] }, region);
                }
            }
        }
    }
    check(coords, region);
    for(let i in blocks_map){
        let carr = blocks_map[i].split(":"),
            cs: Vector = { x: parseInt(carr[0]), y: parseInt(carr[1]), z: parseInt(carr[2]) };
        let func = Block.getDropFunction(region.getBlockId(cs.x, cs.y, cs.z));
        if(!func) continue;
        let drops = func({ ...cs, side: 0, relative: { ...cs } }, region.getBlockId(cs.x, cs.y, cs.z), region.getBlockData(cs.x, cs.y, cs.z), ToolAPI.getToolLevel(item.id), ToolAPI.getEnchantExtraData(item.extra), item, region);
        for(let d in drops){
            region.setBlock(cs.x, cs.y, cs.z, 0, 0);
            dropItemRandom({ id: drops[d][0], count: drops[d][1], data: drops[d][2], extra: drops[d][3] ?? null }, region, cs.x, cs.y, cs.z);
        }
    }
}

const destroy_nature = (coords: Vector, item: ItemInstance, region: BlockSource) => {
    const drops: ItemInstance[] = [];
    for(let xx=coords.x-13; xx<coords.x+13; xx++)
        for(let yy=coords.y-3; yy<coords.y+23; yy++)
            for(let zz=coords.z-13; zz<coords.z+13; zz++){
                const state = region.getBlock(xx, yy, zz);
                if(state.id == 0) continue;
                if(state.id == VanillaBlockID.grass || state.id == VanillaBlockID.podzol){
                    region.setBlock(xx, yy, zz, VanillaBlockID.dirt, 0);
                    continue;
                }
                const func = Block.getDropFunction(state.id);
                if(!func) continue;
                const useCoords: Callback.ItemUseCoordinates = { x: xx, y: yy, z: zz, side: 0, relative: { x: xx, y: yy, z: zz } };
                const thisDrops = func(useCoords, state.id, state.data, ToolAPI.getToolLevel(item.id), ToolAPI.getEnchantExtraData(item.extra ?? null), item, region);
                for(let i in thisDrops)
                    drops.push({ id: thisDrops[i][0], count: thisDrops[i][1], data: thisDrops[i][2], extra: thisDrops[i][3] ?? null });
                region.setBlock(xx, yy, zz, 0, 0);
            }
    const clusters = MatterCluster.makeClusters(drops);
    for(let i in clusters) dropItemRandom(clusters[i], region, coords.x, coords.y, coords.z);
}

Callback.addCallback("DestroyBlock", (coords, block, player) => {
    let item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_axe && (block.id == VanillaBlockID.log || block.id == VanillaBlockID.log2))
        destroy_trees(coords, BlockSource.getDefaultForActor(player), item);
});
Item.registerUseFunction(ItemID.infinity_axe, (coords, item, block, player) => {
    if(Entity.getSneaking(player))
        destroy_nature(coords, item, BlockSource.getDefaultForActor(player));
});
Item.registerNoTargetUseFunction(ItemID.infinity_axe, (item, player) => {
    if(Entity.getSneaking(player))
        destroy_nature(Entity.getPosition(player), item, BlockSource.getDefaultForActor(player));
});

AVA_STUFF.push(ItemID.infinity_axe);
INFINITY_TOOLS.push(ItemID.infinity_axe);
cosmic_rarity(ItemID.infinity_axe);
undestroyable_item("infinity_axe");