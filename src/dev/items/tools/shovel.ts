IDRegistry.genItemID("infinity_shovel");
ToolAPI.addToolMaterial("INFINITY_SHOVEL", { level: 32, durability: 9999, efficiency: 9999, damage: 7, enchantability: 200 });
Item.createShovelItem("infinity_shovel", "item.avaritia:infinity_shovel.name", { name: "infinity_shovel", meta: 0 }, { stack: 1, tier: "INFINITY_SHOVEL" });

const shovel_use_func = (item: ItemInstance, player: number, destroyer: boolean) => {
    if(Entity.getSneaking(player))
        Entity.setCarriedItem(player, ItemID[`infinity_${destroyer ? "destroyer" : "shovel"}`], item.count, 0, item.extra);
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
Item.createShovelItem("infinity_destroyer", "item.avaritia:infinity_shovel.name", { name: "destroyer", meta: 0 }, { stack: 1, isTech: true, tier: "INFINITY_SHOVEL" });

Item.registerUseFunction(ItemID.infinity_destroyer, (coords, item, block, player) => {
    if(Entity.getSneaking(player)){
        const region = BlockSource.getDefaultForActor(player);
        const drops: ItemInstance[] = [];
        region.setDestroyParticlesEnabled(false);
        for(let xx=coords.x-8; xx<coords.x+8; xx++) {
            for(let yy=coords.y-8; yy<coords.y+8; yy++) {
                for(let zz=coords.z-8; zz<coords.z+8; zz++) {
                    const state = region.getBlock(xx, yy, zz);
                    if(state.id == 0) continue;
                    if(ToolAPI.getBlockMaterialName(state.id) != "dirt") continue;
                    const drop = region.breakBlockForJsResult(xx, yy, zz, 0, item).items;
                    if(Array.isArray(drop)) drop.forEach(d => drops.push(d));
                }
            }
        }
        region.setDestroyParticlesEnabled(true);
        MatterCluster.makeClusters(drops).forEach(cluster => dropItemRandom(cluster, region, coords.x, coords.y, coords.z));
    }
});
Item.registerNoTargetUseFunction(ItemID.infinity_destroyer, (item, player) => shovel_use_func(item, player, false));

IAHelper.makeAdvancedAnim(ItemID.infinity_shovel, "infinity_shovel", 1, INFINITY_ITEM_FRAMES);

AVA_STUFF.push(ItemID.infinity_shovel);
Rarity.cosmic(ItemID.infinity_shovel);
Rarity.cosmic(ItemID.infinity_destroyer);
undestroyableItem(ItemID.infinity_shovel);
undestroyableItem(ItemID.infinity_destroyer);