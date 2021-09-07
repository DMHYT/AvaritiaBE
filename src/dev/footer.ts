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
    'X', ItemID.crystal_matrix_ingot, 0, 
    'I', VanillaBlockID.iron_block, 0, 
    'Q', VanillaBlockID.quartz_block, 0, 
    'R', VanillaBlockID.redstone_block, 0
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
    'X', ItemID.crystal_matrix_ingot, 0,
    'N', ItemID.neutronium_ingot, 0,
    'I', VanillaBlockID.iron_block, 0,
    'H', VanillaBlockID.hopper, 0,
    'R', VanillaBlockID.redstone_block, 0,
    'O', BlockID.neutronium_block, 0
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_boots, count: 1, data: 0}, [
    " NNN NNN ",
    " NIN NIN ",
    " NIN NIN ",
    "NNIN NINN",
    "NIIN NIIN",
    "NNNN NNNN"
], [
    'I', ItemID.infinity_ingot, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'X', BlockID.crystal_matrix_block, 0,
    'N', ItemID.neutronium_ingot, 0
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_helmet, count: 1, data: 0}, [
    "  NNNNN  ",
    " NIIIIIN ",
    " N XIX N ",
    " NIIIIIN ",
    " NIIIIIN ",
    " NI I IN "
], [
    'I', ItemID.infinity_ingot, 0,
    'X', ItemID.infinity_catalyst, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'X', ItemID.infinity_catalyst, 0,
    'C', BlockID.crystal_matrix_block, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'X', BlockID.crystal_matrix_block, 0,
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
    'I', ItemID.infinity_ingot, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'C', BlockID.crystal_matrix_block, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'X', BlockID.infinity_block, 0,
    'N', ItemID.neutronium_ingot, 0
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
    'I', ItemID.infinity_ingot, 0,
    'X', ItemID.infinity_catalyst, 0,
    'C', ItemID.crystal_matrix_ingot, 0,
    'N', ItemID.neutronium_ingot, 0
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
        'I', ItemID.crystal_matrix_ingot, 0,
        'X', VanillaItemID.blaze_powder, 0,
        'B', VanillaItemID.bone, 0,
        'D', VanillaItemID.nether_star, 0,
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
    'E', VanillaBlockID.end_stone, 0,
    'P', VanillaItemID.ender_pearl, 0,
    'S', VanillaItemID.nether_star, 0,
    'N', ItemID.neutronium_ingot, 0
]);

ExtremeCraftingTable.addShaped({id: ItemID.infinity_ingot, count: 1, data: 0}, [
    "NNNNNNNNN",
    "NCXXCXXCN",
    "NXCCXCCXN",
    "NCXXCXXCN",
    "NNNNNNNNN"
], [
    'C', ItemID.crystal_matrix_ingot, 0,
    'N', ItemID.neutronium_ingot, 0,
    'X', ItemID.infinity_catalyst, 0
]);

if(BORING_FOOD || true) { // TODO make InTeReStInG food some day 0_0
    ExtremeCraftingTable.addShapeless({id: ItemID.ultimate_stew, count: 1, data: 0}, [
        [ItemID.neutron_pile, 0],
        [VanillaBlockID.wheat, 0],
        [VanillaItemID.carrot, 0],
        [VanillaItemID.potato, 0],
        [VanillaBlockID.beetroot, 0],
        [VanillaItemID.apple, 0],
        [VanillaItemID.melon, 0],
        [VanillaBlockID.pumpkin, 0],
        [VanillaBlockID.cactus, 0],
        [VanillaBlockID.red_mushroom, 0],
        [VanillaBlockID.brown_mushroom, 0]
    ]);
    ExtremeCraftingTable.addShapeless({id: ItemID.cosmic_meatballs, count: 1, data: 0}, [
        [ItemID.neutron_pile, 0],
        [VanillaItemID.beef, 0],
        [VanillaItemID.beef, 0],
        [VanillaItemID.chicken, 0],
        [VanillaItemID.chicken, 0],
        [VanillaItemID.porkchop, 0],
        [VanillaItemID.porkchop, 0],
        [VanillaItemID.rabbit, 0],
        [VanillaItemID.rabbit, 0],
        [VanillaItemID.cod, 0],
        [VanillaItemID.cod, 0]
        // Maybe make all fish from 1.13 update?
    ]);
}

Callback.addCallback("ModsLoaded", () => {
    const arr = [
        [ItemID.diamond_lattice, 0],
        [ItemID.crystal_matrix_ingot, 0],
        [ItemID.neutron_pile, 0],
        [ItemID.neutron_nugget, 0],
        [ItemID.neutronium_ingot, 0],
        [ItemID.ultimate_stew, 0],
        [ItemID.cosmic_meatballs, 0],
        [ItemID.endest_pearl, 0],
        [ItemID.record_fragment, 0],
        [ItemID.singularity_iron, 0],
        [ItemID.singularity_gold, 0],
        [ItemID.singularity_lapis, 0],
        [ItemID.singularity_redstone, 0],
        [ItemID.singularity_quartz, 0],
        [ItemID.singularity_diamond, 0],
        [ItemID.singularity_emerald, 0]
    ] as [number, number][];
    BlockID.blockCopper && (arr.push([ItemID.singularity_copper, 0]), Singularity.registerRecipeFor(ItemID.singularity_copper, BlockID.blockCopper, 400, 0, false)); // Added by IC2 and Forestry
    BlockID.blockTin && (arr.push([ItemID.singularity_tin, 0]), Singularity.registerRecipeFor(ItemID.singularity_tin, BlockID.blockTin, 400, 0, false)); // Added by IC2 and Forestry
    BlockID.blockLead && (arr.push([ItemID.singularity_lead, 0]), Singularity.registerRecipeFor(ItemID.singularity_lead, BlockID.blockLead, 300, 0, false)); // Added by IC2
    BlockID.blockSilver && (arr.push([ItemID.singularity_silver, 0]), Singularity.registerRecipeFor(ItemID.singularity_silver, BlockID.blockSilver, 300, 0, false)); // Added by IC2
    BlockID.blockNickel && (arr.push([ItemID.singularity_nickel, 0]), Singularity.registerRecipeFor(ItemID.singularity_nickel, BlockID.blockNickel, 400, 0, false)); // No EnderIO
    BlockID.blockElectrumFlux && (arr.push([ItemID.singularity_fluxed, 0]), Singularity.registerRecipeFor(ItemID.singularity_fluxed, BlockID.blockElectrumFlux, 100, 0, false)); // No EnderIO
    BlockID.blockEnderium && arr.push([BlockID.blockEnderium, 0]); // No EnderIO
    BlockID.blockSteel && arr.push([BlockID.blockSteel, 0]); // Added by IC2, no EnderIO
    BlockID.blockDarkSteel && arr.push([BlockID.blockDarkSteel, 0]); // No EnderIO
    BlockID.blockPlatinum && (arr.push([ItemID.singularity_platinum, 0]), Singularity.registerRecipeFor(ItemID.singularity_platinum, BlockID.blockPlatinum, 80, 0, false)); // No ThermalFoundation
    BlockID.blockIridium && (arr.push([ItemID.singularity_iridium, 0]), Singularity.registerRecipeFor(ItemID.singularity_iridium, BlockID.blockIridium, 80, 0, false)); // No MorePlanets (no Galacticraft LOL)
    ExtremeCraftingTable.addShapeless({id: ItemID.infinity_catalyst, count: 1, data: 0}, arr);
});