IDRegistry.genItemID("infinity_axe");
ToolAPI.addToolMaterial("INFINITY_AXE", { level: 32, durability: 9999, efficiency: 9999, damage: 20, enchantability: 200 });
Item.createAxeItem("infinity_axe", "item.avaritia:infinity_axe.name", { name: "infinity_axe", meta: 0 }, { stack: 1, tier: "INFINITY_AXE" });

const destroy_trees = (coords: Callback.ItemUseCoordinates, region: BlockSource, item: ItemInstance, player: number) => {
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
    region.setDestroyParticlesEnabled(false);
    blocks_map.forEach(str => {
        const splitted: number[] = str.split(":").map(Number);
        const vec: Vector = { x: splitted[0], y: splitted[1], z: splitted[2] };
        region.destroyBlock(vec.x, vec.y, vec.z, true);
    });
    region.setDestroyParticlesEnabled(true);
}

const destroy_nature = (coords: Callback.ItemUseCoordinates, region: BlockSource, item: ItemInstance, player: number) => {
    const drops: ItemInstance[] = [];
    const materialsToDestroy = ["wood", "plant", "fibre"];
    region.setDestroyParticlesEnabled(false);
    for(let xx=coords.x-13; xx<coords.x+13; xx++) {
        for(let yy=coords.y-3; yy<coords.y+23; yy++) {
            for(let zz=coords.z-13; zz<coords.z+13; zz++) {
                const state = region.getBlock(xx, yy, zz);
                if(state.id == 0) continue;
                if(state.id == VanillaBlockID.grass || state.id == VanillaBlockID.podzol){
                    region.setBlock(xx, yy, zz, VanillaBlockID.dirt, 0);
                    continue;
                }
                const materialName = ToolAPI.getBlockMaterialName(state.id);
                if(materialName != null)
                if(!!~materialsToDestroy.indexOf(materialName)) {
                    const drop = region.breakBlockForJsResult(xx, yy, zz, 0, item).items;
                    if(Array.isArray(drop)) drop.forEach(item => drops.push(item));
                }
            }
        }
    }
    region.setDestroyParticlesEnabled(true);
    MatterCluster.makeClusters(drops).forEach(cluster => dropItemRandom(cluster, region, coords.x, coords.y, coords.z));
}

Callback.addCallback("DestroyBlock", (coords, block, player) => {
    const item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_axe && (block.id == VanillaBlockID.log || block.id == VanillaBlockID.log2)) {
        destroy_trees(coords, BlockSource.getDefaultForActor(player), item, player);
    }
});

Item.registerUseFunction(ItemID.infinity_axe, (coords, item, block, player) => {
    if(Entity.getSneaking(player))
        destroy_nature(coords, BlockSource.getDefaultForActor(player), item, player);
});
Item.registerNoTargetUseFunction(ItemID.infinity_axe, (item, player) => {
    if(Entity.getSneaking(player)) {
        const pos = Entity.getPosition(player);
        destroy_nature({ ...pos, relative: pos, side: 0 }, BlockSource.getDefaultForActor(player), item, player);
    }
});

AVA_STUFF.push(ItemID.infinity_axe);
Rarity.cosmic(ItemID.infinity_axe);
undestroyableItem(ItemID.infinity_axe);