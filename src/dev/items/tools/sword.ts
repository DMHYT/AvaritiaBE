IDRegistry.genItemID("infinity_sword");
ToolAPI.addToolMaterial("INFINITY_SWORD", { level: 32, durability: 9999, efficiency: 9999, damage: -4, enchantability: 200 });
Item.createSwordItem("infinity_sword", "item.avaritia:infinity_sword.name", { name: "infinity_sword", meta: 0 }, { stack: 1, tier: "INFINITY_SWORD" });
Callback.addCallback("PlayerAttack", (player, victim) => {
    let item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_sword){
        if(Entity.getType(victim) == EEntityType.PLAYER && check_armor(victim)) return Game.prevent();
        Entity.damageEntity(victim, Entity.getHealth(victim) + 1, 0, {attacker: player, bool1: false});
    }
});
IAHelper.makeAdvancedAnim(ItemID.infinity_sword, "infinity_sword", 1, INFINITY_ITEM_FRAMES);
AVA_STUFF.push(ItemID.infinity_sword);
Rarity.cosmic(ItemID.infinity_sword);
undestroyableItem(ItemID.infinity_sword);