IDRegistry.genItemID("infinity_helmet");
IDRegistry.genItemID("infinity_chestplate");
IDRegistry.genItemID("infinity_leggings");
IDRegistry.genItemID("infinity_boots");

Item.createArmorItem("infinity_helmet", "item.avaritia:infinity_helmet.name", {name: "infinity_helmet", meta: 0}, {type: "helmet", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.HELMET, 1000);
Item.createArmorItem("infinity_chestplate", "item.avaritia:infinity_chestplate.name", {name: "infinity_chestplate", meta: 0}, {type: "chestplate", armor: 16, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.CHESTPLATE, 1000);
Item.createArmorItem("infinity_leggings", "item.avaritia:infinity_pants.name", {name: "infinity_leggings", meta: 0}, {type: "leggings", armor: 12, durability: 9999, texture: "armor/infinity_1.png"}).setEnchantability(EEnchantType.LEGGINGS, 1000);
Item.createArmorItem("infinity_boots", "item.avaritia:infinity_boots.name", {name: "infinity_boots", meta: 0}, {type: "boots", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.BOOTS, 1000);

Armor.registerOnTickListener(ItemID.infinity_helmet, (item, slot, player) => {
    Entity.addEffect(player, EPotionEffect.WATER_BREATHING, 1, 300, false, false);
    Entity.addEffect(player, EPotionEffect.NIGHT_VISION, 1, 300, false, false);
    const actor = new PlayerActor(player);
    if(actor.getHunger() < 20) actor.setHunger(20);
    if(actor.getSaturation() < 20) actor.setSaturation(20);
});

Network.addClientPacket("avaritia.toggleflying", (data: any) => {
    Player.setFlyingEnabled(data.bool);
});
Armor.registerOnTakeOnListener(ItemID.infinity_chestplate, (item, slot, player) => {
    Network.getClientForPlayer(player).send("avaritia.toggleflying", { bool: true });
});
Armor.registerOnTakeOffListener(ItemID.infinity_chestplate, (item, slot, player) => {
    Network.getClientForPlayer(player).send("avaritia.toggleflying", { bool: false });
});
Armor.registerOnTickListener(ItemID.infinity_chestplate, (item, slot, player) => {
    // TODO remove harmful effects (native) 
});
Armor.registerOnTickListener(ItemID.infinity_leggings, (item, slot, player) => {
    Entity.addEffect(player, EPotionEffect.FIRE_RESISTANCE, 1, 300, false, false);
});

((func) => {
    Armor.registerOnHurtListener(ItemID.infinity_helmet, func);
    Armor.registerOnHurtListener(ItemID.infinity_chestplate, func);
    Armor.registerOnHurtListener(ItemID.infinity_leggings, func);
    Armor.registerOnHurtListener(ItemID.infinity_boots, func)
})((item: ItemInstance, slot: number, player: number) => { if(check_armor(player)) Game.prevent(); });

AVA_STUFF.push(ItemID.infinity_helmet, ItemID.infinity_chestplate, ItemID.infinity_leggings, ItemID.infinity_boots);
cosmic_rarity(ItemID.infinity_helmet);
cosmic_rarity(ItemID.infinity_chestplate);
cosmic_rarity(ItemID.infinity_leggings);
cosmic_rarity(ItemID.infinity_boots);
undestroyable_item("infinity_helmet");
undestroyable_item("infinity_chestplate");
undestroyable_item("infinity_leggings");
undestroyable_item("infinity_boots");