IDRegistry.genItemID("infinity_sword");
Item.createItem("infinity_sword", "item.avaritia:infinity_sword.name", {name: "infinity_sword", meta: 0}, {stack: 1});
ToolAPI.addToolMaterial("INFINITY_SWORD", {level: 32, durability: 9999, efficiency: 9999, damage: -4});
ToolLib.setTool(ItemID.infinity_sword, "INFINITY_SWORD", ToolType.sword);
Item.setEnchantType(ItemID.infinity_sword, EEnchantType.WEAPON, 200);
Callback.addCallback("PlayerAttack", (player, victim) => {
    let item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_sword){
        if(Entity.getType(victim) == EEntityType.PLAYER && check_armor(victim)) return Game.prevent();
        Entity.damageEntity(victim, Entity.getHealth(victim) + 1, 0, {attacker: player, bool1: false});
    }
});
Callback.addCallback("DestroyBlock", (coords, block, player) => {
    let item = Entity.getCarriedItem(player);
    if(item.id == ItemID.infinity_sword && item.data > 0)
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
});
IAHelper.makeAdvancedAnim(ItemID.infinity_sword, "infinity_sword", 1, INFINITY_ITEM_FRAMES);
AVA_STUFF.push(ItemID.infinity_sword);
Rarity.cosmic(ItemID.infinity_sword);
undestroyable_item("infinity_sword");