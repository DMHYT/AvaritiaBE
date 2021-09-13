IDRegistry.genItemID("infinity_leggings");
Item.createArmorItem("infinity_leggings", "item.avaritia:infinity_pants.name", {name: "infinity_leggings", meta: 0}, {type: "leggings", armor: 12, durability: 9999, texture: "armor/infinity_1.png"}).setEnchantability(EEnchantType.LEGGINGS, 1000);
AVA_STUFF.push(ItemID.infinity_leggings);
Rarity.cosmic(ItemID.infinity_leggings);
undestroyable_item("infinity_leggings");

Armor.registerOnTickListener(ItemID.infinity_leggings, (item, slot, player) => {
    if(World.getThreadTime() % 20 == 0) {
        Entity.addEffect(player, EPotionEffect.FIRE_RESISTANCE, 1, 400, false, false);
    }
});