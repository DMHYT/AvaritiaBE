IDRegistry.genItemID("infinity_pickaxe");
ToolAPI.addToolMaterial("INFINITY_PICKAXE", { level: 32, durability: 9999, efficiency: 9999, damage: 6, enchantability: 200 });
Item.createPickaxeItem("infinity_pickaxe", "item.avaritia:infinity_pickaxe.name", { name: "infinity_pickaxe", meta: 0 }, { stack: 1, tier: "INFINITY_PICKAXE" });

const switch_between_pickaxe_and_hammer = (item: ItemInstance, player: number, hammer: boolean) => {
    item.extra ??= new ItemExtraData();
    if(item.extra.getEnchantLevel(EEnchantment.FORTUNE) < 10)
        item.extra.addEnchant(EEnchantment.FORTUNE, 10);
    item.data = 0;
    if(Entity.getSneaking(player))
        Entity.setCarriedItem(player, ItemID[`infinity_${hammer ? "hammer" : "pickaxe"}`], item.count, 0, item.extra);
}

Item.registerUseFunction(ItemID.infinity_pickaxe, (coords, item, block, player) => switch_between_pickaxe_and_hammer(item, player, true));
Item.registerNoTargetUseFunction(ItemID.infinity_pickaxe, (item, player) => switch_between_pickaxe_and_hammer(item, player, true));

IDRegistry.genItemID("infinity_hammer");
Item.createPickaxeItem("infinity_hammer", "item.avaritia:infinity_pickaxe.name", { name: "infinity_hammer", meta: 0 }, { stack: 1, isTech: true, tier: "INFINITY_PICKAXE" });

Item.registerUseFunction(ItemID.infinity_hammer, (coords, item, block, player) => {
    if(Entity.getSneaking(player)){
        const region = BlockSource.getDefaultForActor(player);
        const drops: ItemInstance[] = [];
        region.setDestroyParticlesEnabled(false);
        for(let xx=coords.x-8; xx<coords.x+8; xx++) {
            for(let yy=coords.y-8; yy<coords.y+8; yy++) {
                for(let zz=coords.z-8; zz<coords.z+8; zz++) {
                    const state = region.getBlock(xx, yy, zz);
                    if(state.id == 0) continue;
                    const drop = region.breakBlockForJsResult(xx, yy, zz, 0, item).items;
                    if(Array.isArray(drop)) drop.forEach(d => drops.push(d));
                }
            }
        }
        region.setDestroyParticlesEnabled(true);
        MatterCluster.makeClusters(drops).forEach(cluster => dropItemRandom(cluster, region, coords.x, coords.y, coords.z));
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
Rarity.cosmic(ItemID.infinity_pickaxe);
Rarity.cosmic(ItemID.infinity_hammer);
undestroyableItem(ItemID.infinity_pickaxe);
undestroyableItem(ItemID.infinity_hammer);