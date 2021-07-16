IDRegistry.genItemID("infinity_pickaxe");
Item.createItem("infinity_pickaxe", "item.avaritia:infinity_pickaxe.name", {name: "infinity_pickaxe", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_PICKAXE", {level: 32, durability: 9999, efficiency: 9999, damage: 6});
ToolLib.setTool(ItemID.infinity_pickaxe, "INFINITY_PICKAXE", ToolType.pickaxe);
Item.setEnchantType(ItemID.infinity_pickaxe, EEnchantType.PICKAXE, 200);

const switch_between_pickaxe_and_hammer = (item: ItemInstance, player: number, hammer: boolean) => {
    item.extra ??= new ItemExtraData();
    if(item.extra.getEnchantLevel(EEnchantment.FORTUNE) < 10)
        item.extra.addEnchant(EEnchantment.FORTUNE, 10);
    item.data = 0;
    if(Entity.getSneaking(player))
        Entity.setCarriedItem(player, ItemID[`infinity_${hammer ? "hammer" : "pickaxe"}`], item.count, item.data, item.extra);
}

Item.registerUseFunction(ItemID.infinity_pickaxe, (coords, item, block, player) => switch_between_pickaxe_and_hammer(item, player, true));
Item.registerNoTargetUseFunction(ItemID.infinity_pickaxe, (item, player) => switch_between_pickaxe_and_hammer(item, player, true));

IDRegistry.genItemID("infinity_hammer");
Item.createItem("infinity_hammer", "item.avaritia:infinity_pickaxe.name", {name: "infinity_hammer", meta: 0}, {stack: 1, isTech: true});
ToolLib.setTool(ItemID.infinity_hammer, "INFINITY_PICKAXE", ToolType.pickaxe);
Item.setEnchantType(ItemID.infinity_hammer, EEnchantType.PICKAXE, 200);

Item.registerUseFunction(ItemID.infinity_hammer, (coords, item, block, player) => {
    if(Entity.getSneaking(player)){
        const region = BlockSource.getDefaultForActor(player);
        const drops: ItemInstance[] = [];
        for(let xx=coords.x-8; xx<coords.x+8; xx++)
            for(let yy=coords.y-8; yy<coords.y+8; yy++)
                for(let zz=coords.z-8; zz<coords.z+8; zz++){
                    const state = region.getBlock(xx, yy, zz);
                    if(state.id == 0) continue;
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
});
Item.registerNoTargetUseFunction(ItemID.infinity_hammer, (item, player) => switch_between_pickaxe_and_hammer(item, player, false));

Callback.addCallback("EntityHurt", (attacker, victim, damageValue, damageType, b1, b2) => {
    let stack = Entity.getCarriedItem(attacker);
    if(stack.id == ItemID.infinity_hammer){
        if(!(Entity.getType(victim) == EEntityType.PLAYER && check_armor(victim))){
            let angle = Entity.getLookAngle(attacker);
            Entity.addVelocity(victim, -Math.sin(angle.yaw) * 5, 2, Math.cos(angle.yaw) * 5);
        }
    }
});

IAHelper.makeAdvancedAnim(ItemID.infinity_pickaxe, "infinity_pickaxe", 1, INFINITY_ITEM_FRAMES);
IAHelper.makeAdvancedAnim(ItemID.infinity_hammer, "infinity_hammer", 1, INFINITY_ITEM_FRAMES);

AVA_STUFF.push(ItemID.infinity_pickaxe);
INFINITY_TOOLS.push(ItemID.infinity_pickaxe);
cosmic_rarity(ItemID.infinity_pickaxe);
cosmic_rarity(ItemID.infinity_hammer);
undestroyable_item("infinity_pickaxe");
undestroyable_item("infinity_hammer");