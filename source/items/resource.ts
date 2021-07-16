((args: string[]) => {
    for(let i in args){
        let id = args[i];
        IDRegistry.genItemID(id);
        Item.createItem(id, `item.resource.${id}.name`, {name: id, meta: 0}, {stack: 64});
        AVA_STUFF.push(ItemID[id]);
    }
})(["diamond_lattice", "crystal_matrix_ingot", "neutron_pile", "neutron_nugget", "neutronium_ingot", "infinity_catalyst", "infinity_ingot", "record_fragment"]);

Rarity.uncommon(ItemID.diamond_lattice);
Rarity.rare(ItemID.crystal_matrix_ingot);
Rarity.uncommon(ItemID.neutron_pile);
Rarity.uncommon(ItemID.neutron_nugget);
Rarity.rare(ItemID.neutronium_ingot);
Rarity.epic(ItemID.infinity_catalyst);
Rarity.cosmic(ItemID.infinity_ingot);
Rarity.cosmic(ItemID.record_fragment);

IAHelper.makeCommonAnim(ItemID.neutronium_ingot, "neutronium_ingot", 3, 3);
IAHelper.makeAdvancedAnim(ItemID.infinity_catalyst, "infinity_catalyst", 1, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 4, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1]);
IAHelper.makeAdvancedAnim(ItemID.infinity_ingot, "infinity_ingot", 1, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 4, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1]);

Callback.addCallback("PostLoaded", () => {
    addShaped(ItemID.diamond_lattice, 1, 0, ["d d", " d ", "d d"], ['d', VanillaItemID.diamond, 0]);
    addShaped(ItemID.crystal_matrix_ingot, 1, 0, ["lsl", "lsl"], ['l', ItemID.diamond_lattice, 0, 's', VanillaItemID.nether_star, 0]);
    addShaped(ItemID.neutron_nugget, 1, 0, ["ppp", "ppp", "ppp"], ['p', ItemID.neutron_pile, 0]);
    addShaped(ItemID.neutronium_ingot, 1, 0, ["nnn", "nnn", "nnn"], ['n', ItemID.neutron_nugget, 0]);
    addShapeless(ItemID.neutron_nugget, 9, 0, [[ItemID.neutronium_ingot, 0]]);
    addShapeless(ItemID.neutron_pile, 9, 0, [[ItemID.neutron_nugget, 0]]);
    ((args: number[]) => {
        for(let i in args) addShapeless(ItemID.record_fragment, 8, 0, [[args[i], 0]]);
    })([500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 759]);
});