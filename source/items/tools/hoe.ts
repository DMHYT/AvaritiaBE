IDRegistry.genItemID("infinity_hoe");
Item.createItem("infinity_hoe", "item.avaritia:infinity_hoe.name", {name: "infinity_hoe", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_HOE", {level: 32, durability: 9999, efficiency: 9999, damage: 20});
ToolLib.setTool(ItemID.infinity_hoe, "INFINITY_HOE", {});
Item.setEnchantType(ItemID.infinity_hoe, EEnchantType.HOE, 200);

Callback.addCallback("PlayerAttack", (attacker) => {
    let item = Entity.getCarriedItem(attacker);
    if(item.id == ItemID.infinity_hoe && item.data > 0)
        Entity.setCarriedItem(attacker, item.id, item.count, 0, item.extra);
});
Callback.addCallback("DestroyBlock", (coords, block, player) => {
    let item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_hoe && item.data > 0)
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
});

Item.registerUseFunction(ItemID.infinity_hoe, (coords, item, block, player) => {
    const region = BlockSource.getDefaultForActor(player);
    if((block.id == 2 || block.id == 3) && coords.side == 1){
        playSound(coords.x, coords.y, coords.z, region.getDimension(), "step.gravel", 1, 0.8);
        if(Entity.getSneaking(player))
            region.setBlock(coords.x, coords.y, coords.z, VanillaBlockID.farmland, 0);
        else for(let xx=coords.x-13; xx<coords.x+13; xx++)
                for(let zz=coords.z-13; zz<coords.z+13; zz++){
                    const id = region.getBlockId(xx, coords.y, zz);
                    if(id == 2 || id == 3){
                        region.setBlock(xx, coords.y, zz, VanillaBlockID.farmland, 0);
                        continue;
                    } else if(id == 0 || World.canTileBeReplaced(id, region.getBlockData(xx, coords.y, zz))){
                        const up = region.getBlock(xx, coords.y + 1, zz);
                        if(World.canTileBeReplaced(up.id, up.data))
                            region.destroyBlock(xx, coords.y + 1, zz, true);
                        region.setBlock(coords.x, coords.y, coords.z, VanillaBlockID.farmland, 0);
                    }
                }
    }
    if(item.data > 0)
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
});

IAHelper.makeAdvancedAnim(ItemID.infinity_hoe, "infinity_hoe", 1, INFINITY_ITEM_FRAMES);

AVA_STUFF.push(ItemID.infinity_hoe);
Rarity.cosmic(ItemID.infinity_hoe);
undestroyable_item("infinity_hoe");