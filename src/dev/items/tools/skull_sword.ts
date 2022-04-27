IDRegistry.genItemID("skullfire_sword");
Item.createSwordItem("skullfire_sword", "item.avaritia:skullfire_sword.name", { name: "skull_sword", meta: 0 }, { stack: 1, tier: "diamond" });
addTooltip(ItemID.skullfire_sword, "tooltip.skullfire_sword.desc");
Rarity.epic(ItemID.skullfire_sword);
IAHelper.makeAdvancedAnim(ItemID.skullfire_sword, "skull_sword", 1, [0, 0, 0, 1, 1, 2, 2, 3, 2, 2, 1, 1]);
AVA_STUFF.push(ItemID.skullfire_sword);
undestroyableItem(ItemID.skullfire_sword);

(() => {
    type OnDropCallback = vsdum.kex.modules.OnDropCallback;
    const skullCallback: OnDropCallback = (drops, context) => {
        const player = context.getKillerPlayer();
        if(player != null && player.getCarriedItem().id == ItemID.skullfire_sword) {
            if(drops.isEmpty()) drops.addItem(397, 1, 1);
            else {
                let skulls: number = 0;
                for(let i = 0; i < drops.size(); ++i) {
                    const item: ItemInstance = drops.get(i);
                    if(item.id == 397) {
                        if(item.data == 1) skulls++;
                        else if(item.data == 0) {
                            item.data = 1;
                            drops.markChanged();
                            skulls++;
                        }
                    }
                }
                if(skulls == 0) drops.addItem(397, 1, 1);
            }
        }
    }
    KEX.LootModule.addOnDropCallbackFor("entities/skeleton", skullCallback);
    KEX.LootModule.addOnDropCallbackFor("entities/wither_skeleton", skullCallback);
})();