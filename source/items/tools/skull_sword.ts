IDRegistry.genItemID("skullfire_sword");
Item.createItem("skullfire_sword", "item.avaritia:skullfire_sword.name", {name: "skull_sword", meta: 0}, {stack: 1});
ToolLib.setTool(ItemID.skullfire_sword, "diamond", ToolType.sword);
addTooltip(ItemID.skullfire_sword, "tooltip.skullfire_sword.desc");
Rarity.epic(ItemID.skullfire_sword);
Callback.addCallback("EntityDeath", (victim, attacker, type) => {
    if(Entity.getCarriedItem(attacker).id == ItemID.skullfire_sword){
        const type = Entity.getType(victim);
        if(type == EEntityType.SKELETON || type == EEntityType.WHITHER_SKELETON){
            const pos = Entity.getPosition(victim);
            BlockSource.getDefaultForActor(attacker).spawnDroppedItem(pos.x, pos.y, pos.z, VanillaBlockID.skull, 1, 1, null);
        }
    }
});
IAHelper.makeAdvancedAnim(ItemID.skullfire_sword, "skull_sword", 1, [0, 0, 0, 1, 1, 2, 2, 3, 2, 2, 1, 1]);
AVA_STUFF.push(ItemID.skullfire_sword);
undestroyable_item("skullfire_sword");