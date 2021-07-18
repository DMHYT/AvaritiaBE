IDRegistry.genBlockID("neutronium_compressor");
Block.createBlock("neutronium_compressor", [{name: "tile.avaritia:neutronium_compressor.name", texture: [["machine_side", 0], ["compressor_top", 0], ["machine_side", 0], ["compressor_active", 0], ["machine_side", 0]], inCreative: true}], {sound: "metal", destroytime: 20});
ToolAPI.registerBlockMaterial(BlockID.neutronium_compressor, "stone", 3, false);
AVA_STUFF.push(BlockID.neutronium_compressor);