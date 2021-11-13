IDRegistry.genItemID("infinity_boots");
Item.createArmorItem("infinity_boots", "item.avaritia:infinity_boots.name", {name: "infinity_boots", meta: 0}, {type: "boots", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.BOOTS, 1000);
AVA_STUFF.push(ItemID.infinity_boots);
Rarity.cosmic(ItemID.infinity_boots);
undestroyable_item("infinity_boots");