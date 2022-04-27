IDRegistry.genItemID("ultimate_stew");
IDRegistry.genItemID("cosmic_meatballs");

Item.createFoodItem("ultimate_stew", "item.avaritia:ultimate_stew.name", { name: "ultimate_stew", meta: 0 }, {
    stack: 64,
    food: 20,
    saturation_modifier: "normal",
    is_meat: false,
    effects: [
        {
            name: "regeneration",
            chance: 1.0,
            duration: 300,
            amplifier: 1
        }
    ]
} as Item.FoodParamsDescription);
Item.createFoodItem("cosmic_meatballs", "item.avaritia:cosmic_meatballs.name", { name: "cosmic_meatballs", meta: 0 }, {
    stack: 64,
    food: 20,
    saturation_modifier: "normal",
    is_meat: false,
    effects: [
        {
            name: "strength",
            chance: 1.0,
            duration: 300,
            amplifier: 1
        }
    ]
} as Item.FoodParamsDescription);

IAHelper.makeCommonAnim(ItemID.ultimate_stew, "ultimate_stew", 2, 28);
IAHelper.makeAdvancedAnim(ItemID.cosmic_meatballs, "cosmic_meatballs", 1, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1]);

AVA_STUFF.push(ItemID.ultimate_stew, ItemID.cosmic_meatballs);