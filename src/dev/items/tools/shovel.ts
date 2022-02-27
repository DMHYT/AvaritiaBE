IDRegistry.genItemID("infinity_shovel");
Item.createItem("infinity_shovel", "item.avaritia:infinity_shovel.name", {name: "infinity_shovel", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_SHOVEL", {level: 32, durability: 9999, efficiency: 9999, damage: 7});
ToolLib.setTool(ItemID.infinity_shovel, "INFINITY_SHOVEL", ToolType.shovel, ItemID.infinity_shovel);
Item.setEnchantType(ItemID.infinity_shovel, EEnchantType.SHOVEL, 200);

const shovel_use_func = (item: ItemInstance, player: number, destroyer: boolean) => {
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
ToolLib.setTool(ItemID.infinity_destroyer, "INFINITY_SHOVEL", ToolType.shovel, ItemID.infinity_destroyer);
Item.setEnchantType(ItemID.infinity_destroyer, EEnchantType.SHOVEL, 200);

Item.registerUseFunction(ItemID.infinity_destroyer, (coords, item, block, player) => {
    if(Entity.getSneaking(player)){
        const region = BlockSource.getDefaultForActor(player);
        const drops: ItemInstance[] = [];
        const toollevel = ToolAPI.getToolLevel(item.id);
        const enchantdata = ToolAPI.getEnchantExtraData(item.extra);
        for(let xx=coords.x-8; xx<coords.x+8; xx++) {
            for(let yy=coords.y-8; yy<coords.y+8; yy++) {
                for(let zz=coords.z-8; zz<coords.z+8; zz++) {
                    const state = region.getBlock(xx, yy, zz);
                    if(state.id == 0) continue;
                    if(ToolAPI.getBlockMaterialName(state.id) != "dirt") continue;
                    const func = Block.getDropFunction(state.id);
                    if(!func) continue;
                    const drop = func(coords, state.id, state.data, toollevel, enchantdata, item, region);
                    if(Array.isArray(drop)) drop.forEach(d => drops.push(itemInstanceFromArray(d)));
                    region.setBlock(xx, yy, zz, 0, 0);
                }
            }
        }
        MatterCluster.makeClusters(drops).forEach(cluster => dropItemRandom(cluster, region, coords.x, coords.y, coords.z));
    }
});
Item.registerNoTargetUseFunction(ItemID.infinity_destroyer, (item, player) => shovel_use_func(item, player, false));

IAHelper.makeAdvancedAnim(ItemID.infinity_shovel, "infinity_shovel", 1, INFINITY_ITEM_FRAMES);

AVA_STUFF.push(ItemID.infinity_shovel);
Rarity.cosmic(ItemID.infinity_shovel);
Rarity.cosmic(ItemID.infinity_destroyer);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_shovel);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_destroyer);