IDRegistry.genBlockID("neutron_collector");
Block.createBlockWithRotation("neutron_collector", [{name: "tile.avaritia:neutron_collector.name", texture: [["machine_side", 0], ["collector_top", 0], ["machine_side", 0], ["collector_active", 0], ["machine_side", 0]], inCreative: true}], {sound: "metal", destroytime: 20});
ToolAPI.registerBlockMaterial(BlockID.neutron_collector, "stone", 3, false);
AVA_STUFF.push(BlockID.neutron_collector);