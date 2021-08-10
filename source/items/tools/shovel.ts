IDRegistry.genItemID("infinity_shovel");
Item.createItem("infinity_shovel", "item.avaritia:infinity_shovel.name", {name: "infinity_shovel", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_SHOVEL", {level: 32, durability: 9999, efficiency: 9999, damage: 7});
ToolLib.setTool(ItemID.infinity_shovel, "INFINITY_SHOVEL", ToolType.shovel);
Item.setEnchantType(ItemID.infinity_shovel, EEnchantType.SHOVEL, 200);

const shovel_use_func = (item: ItemInstance, player: number, destroyer: boolean) => {
    item.data = 0;
    if(Entity.getSneaking(player))
        Entity.setCarriedItem(player, ItemID[`infinity_${destroyer ? "destroyer" : "shovel"}`], item.count, item.data, item.extra);
}

Item.registerUseFunction(ItemID.infinity_shovel, (coords, item, block, player) => {
    if(!Entity.getSneaking(player) && block.id == 2 && coords.side == 1){
        BlockSource.getDefaultForActor(player).setBlock(coords.x, coords.y, coords.z, VanillaBlockID.grass_path, 0);
        playSound(coords.x, coords.y, coords.z, Entity.getDimension(player), "step.grass", 0.5, 0.8);
    }
    shovel_use_func(item, player, true);
});
Item.registerNoTargetUseFunction(ItemID.infinity_shovel, (item, player) => {
    shovel_use_func(item, player, true);
});

IDRegistry.genItemID("infinity_destroyer");
Item.createItem("infinity_destroyer", "item.avaritia:infinity_shovel.name", {name: "destroyer", meta: 0}, {stack: 1, isTech: true});
ToolLib.setTool(ItemID.infinity_destroyer, "INFINITY_SHOVEL", ToolType.shovel);
Item.setEnchantType(ItemID.infinity_destroyer, EEnchantType.SHOVEL, 200);

Item.registerUseFunction(ItemID.infinity_destroyer, (coords, item, block, player) => {
    if(Entity.getSneaking(player)){
        const region = BlockSource.getDefaultForActor(player);
        const drops: ItemInstance[] = [];
        const toollevel = ToolAPI.getToolLevel(item.id);
        const enchantextra = ToolAPI.getEnchantExtraData(item.extra);
        for(let xx=coords.x-8; xx<coords.x+8; xx++)
            for(let yy=coords.y-8; yy<coords.y+8; yy++)
                for(let zz=coords.z-8; zz<coords.z+8; zz++){
                    const state = region.getBlock(xx, yy, zz);
                    if(state.id == 0) continue;
                    if(ToolAPI.getBlockMaterialName(state.id) != "dirt") continue;
                    const func = Block.getDropFunction(state.id);
                    if(!func) continue;
                    const useCoords: Callback.ItemUseCoordinates = { x: xx, y: yy, z: zz, side: 0, relative: { x: xx, y: yy, z: zz } };
                    const thisDrops = func(useCoords, state.id, state.data, toollevel, enchantextra, item, region);
                    for(let i in thisDrops)
                        drops.push({ id: thisDrops[i][0], count: thisDrops[i][1], data: thisDrops[i][2], extra: thisDrops[i][3] ?? null });
                    region.setBlock(xx, yy, zz, 0, 0);
                }
        const clusters = MatterCluster.makeClusters(drops);
        for(let i in clusters) dropItemRandom(clusters[i], region, coords.x, coords.y, coords.z);
    }
});
Item.registerNoTargetUseFunction(ItemID.infinity_destroyer, (item, player) => shovel_use_func(item, player, false));

Callback.addCallback("PlayerAttack", (attacker) => {
    let item = Entity.getCarriedItem(attacker);
    if((item.id == ItemID.infinity_shovel || item.id == ItemID.infinity_destroyer) && item.data > 0)
        Entity.setCarriedItem(attacker, item.id, item.count, 0, item.extra);
});
Callback.addCallback("DestroyBlock", (coords, block, player) => {
    let item = Entity.getCarriedItem(player);
    if((item.id == ItemID.infinity_shovel || item.id == ItemID.infinity_destroyer) && item.data > 0)
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
});

IAHelper.makeAdvancedAnim(ItemID.infinity_shovel, "infinity_shovel", 1, INFINITY_ITEM_FRAMES);

AVA_STUFF.push(ItemID.infinity_shovel);
Rarity.cosmic(ItemID.infinity_shovel);
Rarity.cosmic(ItemID.infinity_destroyer);
undestroyable_item("infinity_shovel");
undestroyable_item("infinity_destroyer");