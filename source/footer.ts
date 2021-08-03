Item.addCreativeGroup("AVARITIA", Translation.translate("itemGroup.avaritia"), AVA_STUFF);

ExtremeCraftingTable.addShaped({id: BlockID.neutron_collector, count: 1, data: 0}, [
    "IIQQQQQII",
    "I QQQQQ I",
    "I  RRR  I",
    "X RRRRR X",
    "I RRXRR I",
    "X RRRRR X",
    "I  RRR  I",
    "I       I",
    "IIIXIXIII"
], [
    'X', ItemID.crystal_matrix_ingot, -1, 
    'I', VanillaBlockID.iron_block, -1, 
    'Q', VanillaBlockID.quartz_block, -1, 
    'R', VanillaBlockID.redstone_block, -1
]);

ExtremeCraftingTable.addShaped({id: BlockID.neutronium_compressor, count: 1, data: 0}, [
    "IIIHHHIII",
    "X N   N X",
    "I N   N I",
    "X N   N X",
    "RNN O NNR",
    "X N   N X",
    "I N   N I",
    "X N   N X",
    "IIIXIXIII"   
], [
    'X', ItemID.crystal_matrix_ingot, -1,
    'N', ItemID.neutronium_ingot, -1,
    'I', VanillaBlockID.iron_block, -1,
    'H', VanillaBlockID.hopper, -1,
    'R', VanillaBlockID.redstone_block, -1,
    'O', BlockID.neutronium_block, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_boots, count: 1, data: 0}, [
    " NNN NNN ",
    " NIN NIN ",
    " NIN NIN ",
    "NNIN NINN",
    "NIIN NIIN",
    "NNNN NNNN"
], [
    'I', ItemID.infinity_ingot, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_chestplate, count: 1, data: 0}, [
    " NN   NN ",
    "NNN   NNN",
    "NNN   NNN",
    " NIIIIIN ",
    " NIIXIIN ",
    " NIIIIIN ",
    " NIIIIIN ",
    " NIIIIIN ",
    "  NNNNN  "
], [
    'I', ItemID.infinity_ingot, -1,
    'X', BlockID.crystal_matrix_block, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_helmet, count: 1, data: 0}, [
    "  NNNNN  ",
    " NIIIIIN ",
    " N XIX N ",
    " NIIIIIN ",
    " NIIIIIN ",
    " NI I IN "
], [
    'I', ItemID.infinity_ingot, -1,
    'X', ItemID.infinity_catalyst, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_leggings, count: 1, data: 0}, [
    "NNNNNNNNN",
    "NIIIXIIIN",
    "NINNXNNIN",
    "NIN   NIN",
    "NCN   NCN",
    "NIN   NIN",
    "NIN   NIN",
    "NIN   NIN",
    "NNN   NNN",
], [
    'I', ItemID.infinity_ingot, -1,
    'X', ItemID.infinity_catalyst, -1,
    'C', BlockID.crystal_matrix_block, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_axe, count: 1, data: 0}, [
    "   I     ",
    "  IIIII  ",
    "   IIII  ",
    "     IN  ",
    "      N  ",
    "      N  ",
    "      N  ",
    "      N  ",
    "      N  "
], [
    'I', ItemID.infinity_ingot, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_bow, count: 1, data: 0}, [
    "   II    ",
    "  I W    ",
    " I  W    ",
    "I   W    ",
    "X   W    ",
    "I   W    ",
    " I  W    ",
    "  I W    ",
    "   II    "
], [
    'I', ItemID.infinity_ingot, -1,
    'X', BlockID.crystal_matrix_block, -1,
    'W', VanillaBlockID.wool, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_hoe, count: 1, data: 0}, [
    "     N   ",
    " IIIIII  ",
    "IIIIIII  ",
    "I    II  ",
    "     N   ",
    "     N   ",
    "     N   ",
    "     N   ",
    "     N   "
], [
    'I', ItemID.infinity_ingot, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_pickaxe, count: 1, data: 0}, [
    " IIIIIII ",
    "IIIICIIII",
    "II  N  II",
    "    N    ",
    "    N    ",
    "    N    ",
    "    N    ",
    "    N    ",
    "    N    "
], [
    'I', ItemID.infinity_ingot, -1,
    'C', BlockID.crystal_matrix_block, -1,
    'N', ItemID.neutronium_ingot, -1
], (container) => {
    const extra = new ItemExtraData();
    extra.addEnchant(EEnchantment.FORTUNE, 10);
    container.setSlot("slotResult", ItemID.infinity_pickaxe, 1, 0, extra);
    container.sendChanges();
});

ExtremeCraftingTable.addShaped({id: ItemID.infinity_shovel, count: 1, data: 0}, [
    "      III",
    "     IIXI",
    "      III",
    "     N I ",
    "    N    ",
    "   N     ",
    "  N      ",
    " N       ",
    "N        "
], [
    'I', ItemID.infinity_ingot, -1,
    'X', BlockID.infinity_block, -1,
    'N', ItemID.neutronium_ingot, -1
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_sword, count: 1, data: 0}, [
    "       II",
    "      III",
    "     III ",
    "    III  ",
    " C III   ",
    "  CII    ",
    "  NC     ",
    " N  C    ",
    "X        "
], [
    'I', ItemID.infinity_ingot, -1,
    'X', ItemID.infinity_catalyst, -1,
    'C', ItemID.crystal_matrix_ingot, -1,
    'N', ItemID.neutronium_ingot, -1
]);

for(let i=0; i<2; i++)
    ExtremeCraftingTable.addShaped({id: ItemID.skullfire_sword, count: 1, data: 0}, [
        "       IX",
        "      IXI",
        "     IXI ",
        "    IXI  ",
        " B IXI   ",
        "  BXI    ",
        "  WB     ",
        " W  B    ",
        "D        "
    ], [
        'I', ItemID.crystal_matrix_ingot, -1,
        'X', VanillaItemID.blaze_powder, -1,
        'B', VanillaItemID.bone, -1,
        'D', VanillaItemID.nether_star, -1,
        'W', VanillaBlockID[`log${i == 1 ? 2 : ""}`], -1
    ]);

ExtremeCraftingTable.addShaped({id: ItemID.endest_pearl, count: 1, data: 0}, [
    "   EEE   ",
    " EEPPPEE ",
    " EPPPPPE ",
    "EPPPNPPPE",
    "EPPNSNPPE",
    "EPPPNPPPE",
    " EPPPPPE ",
    " EEPPPEE ",
    "   EEE   "
], [
    'E', VanillaBlockID.end_stone, -1,
    'P', VanillaItemID.ender_pearl, -1,
    'S', VanillaItemID.nether_star, -1,
    'N', ItemID.neutronium_ingot, -1
]);

Callback.addCallback("ModsLoaded", () => {
    const arr = [
        [ItemID.diamond_lattice, -1],
        [ItemID.crystal_matrix_ingot, -1],
        [ItemID.neutron_pile, -1],
        [ItemID.neutron_nugget, -1],
        [ItemID.neutronium_ingot, -1],
        [ItemID.ultimate_stew, -1],
        [ItemID.cosmic_meatballs, -1],
        [ItemID.endest_pearl, -1],
        [ItemID.record_fragment, -1],
        [ItemID.singularity_iron, -1],
        [ItemID.singularity_gold, -1],
        [ItemID.singularity_lapis, -1],
        [ItemID.singularity_redstone, -1],
        [ItemID.singularity_quartz, -1],
        [ItemID.singularity_diamond, -1],
        [ItemID.singularity_emerald, -1]
    ] as [number, number][];
    BlockID.blockCopper && arr.push([ItemID.singularity_copper, -1]); // Added by IC2 and Forestry
    BlockID.blockTin && arr.push([ItemID.singularity_tin, -1]); // Added by IC2 and Forestry
    BlockID.blockLead && arr.push([ItemID.singularity_lead, -1]); // Added by IC2
    BlockID.blockSilver && arr.push([ItemID.singularity_silver, -1]); // Added by IC2
    BlockID.blockNickel && arr.push([ItemID.singularity_nickel, -1]); // No EnderIO
    BlockID.blockElectrumFlux && arr.push([ItemID.singularity_fluxed, -1]); // No EnderIO
    BlockID.blockEnderium && arr.push([BlockID.blockEnderium, -1]); // No EnderIO
    BlockID.blockSteel && arr.push([BlockID.blockSteel, -1]); // Added by IC2, no EnderIO
    BlockID.blockDarkSteel && arr.push([BlockID.blockDarkSteel, -1]); // No EnderIO
    BlockID.blockPlatinum && arr.push([ItemID.singularity_platinum, -1]); // No ThermalFoundation
    BlockID.blockIridium && arr.push([ItemID.singularity_iridium, -1]); // Not added by IC2
    ExtremeCraftingTable.addShapeless({id: ItemID.infinity_catalyst, count: 1, data: 0}, arr);
});