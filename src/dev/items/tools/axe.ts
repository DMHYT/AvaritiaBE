IDRegistry.genItemID("infinity_axe");
Item.createItem("infinity_axe", "item.avaritia:infinity_axe.name", {name: "infinity_axe", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_AXE", {level: 32, durability: 9999, efficiency: 9999, damage: 20});
ToolLib.setTool(ItemID.infinity_axe, "INFINITY_AXE", ToolType.axe);
Item.setEnchantType(ItemID.infinity_axe, EEnchantType.AXE, 200);

const destroy_trees = (coords: Callback.ItemUseCoordinates, region: BlockSource, item: ItemInstance) => {
    const toollevel = ToolAPI.getToolLevel(item.id);
    const enchantdata = ToolAPI.getEnchantExtraData(item.extra);
    const blocks_map: string[] = [`${coords.x}:${coords.y}:${coords.z}`];
    const sides = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
    const check = (c: Vector, r: BlockSource) => sides.forEach(side => {
        const id = r.getBlockId(c.x + side[0], c.y + side[1], c.z + side[2]);
        if(id == VanillaBlockID.log || id == VanillaBlockID.log2 || id == VanillaBlockID.leaves || id == VanillaBlockID.leaves2) {
            if(!~blocks_map.indexOf(`${c.x + side[0]}:${c.y + side[1]}:${c.z + side[2]}`)) {
                blocks_map.push(`${c.x + side[0]}:${c.y + side[1]}:${c.z + side[2]}`)
                check({ x: c.x + side[0], y: c.y + side[1], z: c.z + side[2] }, region);
            }
        }
    });
    check(coords, region);
    blocks_map.forEach(str => {
        const splitted: number[] = str.split(":").map(parseInt);
        const vec: Vector = { x: splitted[0], y: splitted[1], z: splitted[2] };
        const state = region.getBlock(vec.x, vec.y, vec.z);
        const func = Block.getDropFunction(state.id);
        if(!func) return;
        const drops = func(coords, state.id, state.data, toollevel, enchantdata, item, region);
        if(Array.isArray(drops)) drops.forEach(drop => dropItemRandom(itemInstanceFromArray(drop), region, vec.x, vec.y, vec.z));
        region.setBlock(vec.x, vec.y, vec.z, 0, 0);
    });
}

const destroy_nature = (coords: Callback.ItemUseCoordinates, region: BlockSource, item: ItemInstance) => {
    const drops: ItemInstance[] = [];
    const toollevel = ToolAPI.getToolLevel(item.id);
    const enchantdata = ToolAPI.getEnchantExtraData(item.extra);
    for(let xx=coords.x-13; xx<coords.x+13; xx++) {
        for(let yy=coords.y-3; yy<coords.y+23; yy++) {
            for(let zz=coords.z-13; zz<coords.z+13; zz++) {
                const state = region.getBlock(xx, yy, zz);
                if(state.id == 0) continue;
                if(state.id == VanillaBlockID.grass || state.id == VanillaBlockID.podzol){
                    region.setBlock(xx, yy, zz, VanillaBlockID.dirt, 0);
                    continue;
                }
                if(!!~["wood", "plant", "fibre"].indexOf(ToolAPI.getBlockMaterialName(state.id))) {
                    const func = Block.getDropFunction(state.id);
                    if(!func) continue;
                    const drop = func(coords, state.id, state.data, toollevel, enchantdata, item, region);
                    if(Array.isArray(drop)) drop.forEach(item => drops.push(itemInstanceFromArray(item)));
                    region.setBlock(xx, yy, zz, 0, 0);
                }
            }
        }
    }     
    MatterCluster.makeClusters(drops).forEach(cluster => dropItemRandom(cluster, region, coords.x, coords.y, coords.z));
}

Callback.addCallback("PlayerAttack", (attacker) => {
    const item = Entity.getCarriedItem(attacker);
    if(item.data > 0 && item.id == ItemID.infinity_axe) {
        Entity.setCarriedItem(attacker, item.id, item.count, 0, item.extra);
    }
});
Callback.addCallback("DestroyBlock", (coords, block, player) => {
    const item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_axe && (block.id == VanillaBlockID.log || block.id == VanillaBlockID.log2)) {
        destroy_trees(coords, BlockSource.getDefaultForActor(player), item);
        if(item.data > 0)
            Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
    }
});

Item.registerUseFunction(ItemID.infinity_axe, (coords, item, block, player) => {
    if(Entity.getSneaking(player))
        destroy_nature(coords, BlockSource.getDefaultForActor(player), item);
    else (ToolType.axe as any).defaultUseItem(coords, item, block, player);
    if(item.data > 0)
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
});
Item.registerNoTargetUseFunction(ItemID.infinity_axe, (item, player) => {
    if(Entity.getSneaking(player)) {
        const pos = Entity.getPosition(player);
        destroy_nature({ ...pos, relative: pos, side: 0 }, BlockSource.getDefaultForActor(player), item);
    }
});

AVA_STUFF.push(ItemID.infinity_axe);
INFINITY_TOOLS.push(ItemID.infinity_axe);
Rarity.cosmic(ItemID.infinity_axe);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_axe);