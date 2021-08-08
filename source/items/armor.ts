IDRegistry.genItemID("infinity_helmet");
IDRegistry.genItemID("infinity_chestplate");
IDRegistry.genItemID("infinity_leggings");
IDRegistry.genItemID("infinity_boots");

Item.createArmorItem("infinity_helmet", "item.avaritia:infinity_helmet.name", {name: "infinity_helmet", meta: 0}, {type: "helmet", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.HELMET, 1000);
Item.createArmorItem("infinity_chestplate", "item.avaritia:infinity_chestplate.name", {name: "infinity_chestplate", meta: 0}, {type: "chestplate", armor: 16, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.CHESTPLATE, 1000);
Item.createArmorItem("infinity_leggings", "item.avaritia:infinity_pants.name", {name: "infinity_leggings", meta: 0}, {type: "leggings", armor: 12, durability: 9999, texture: "armor/infinity_1.png"}).setEnchantability(EEnchantType.LEGGINGS, 1000);
Item.createArmorItem("infinity_boots", "item.avaritia:infinity_boots.name", {name: "infinity_boots", meta: 0}, {type: "boots", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.BOOTS, 1000);

namespace InfinityArmor {

    interface WingsData { isWearingChestplate: boolean, renderer?: ActorRenderer, attachable?: AttachableRender }
    export const WINGS_DATA: {[player: number]: WingsData} = {};
    export var isWearingChestplateClient: boolean = false;
    const wing_mesh = new RenderMesh();
    wing_mesh.addVertex(0, 1.875, 0, 0, 0);
    wing_mesh.addVertex(3.5, 1.875, 0, 56, 0);
    wing_mesh.addVertex(0, 0, 0, 0, 30);
    wing_mesh.addVertex(3.5, 0, 0, 56, 30);
    wing_mesh.setBlockTexture("infinity_wings", 0);

    export function showWings(_player: number): void {
        const __obj = WINGS_DATA[_player];
        if(!__obj || !__obj.isWearingChestplate) return;
        __obj.renderer = new ActorRenderer();
        __obj.attachable = new AttachableRender(_player);
        __obj.renderer.addPart("body").endPart().addPart("wings", "body", wing_mesh).endPart();
        __obj.attachable.setRenderer(__obj.renderer);
    }

    export function hideWings(_player: number): void {
        const __obj = WINGS_DATA[_player];
        if(!__obj && !__obj.isWearingChestplate) return;
        __obj.attachable.destroy();
        delete WINGS_DATA[_player];   
    }

}

Network.addClientPacket("avaritia.toggleflying", (data: { bool: boolean }) => {
    if(new PlayerActor(Player.get()).getGameMode() != 1)
        Player.setFlyingEnabled(data.bool);
});
Network.addClientPacket("avaritia.chestplate", (data: { bool: boolean }) => {
    InfinityArmor.isWearingChestplateClient = data.bool;
});
Network.addServerPacket("avaritia.togglewings", (client, data: { bool: boolean }) => {
    data.bool ? InfinityArmor.showWings(client.getPlayerUid()) : InfinityArmor.hideWings(client.getPlayerUid());
});

var lastFlyingClient: boolean = false;
Callback.addCallback("LocalTick", () => {
    if(Player.getFlying() == lastFlyingClient) return;
    lastFlyingClient = Player.getFlying();
    InfinityArmor.isWearingChestplateClient && Network.sendToServer("avaritia.togglewings", { bool: lastFlyingClient });
});

Armor.registerOnTakeOnListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: true });
    client.send("avaritia.chestplate", { bool: true });
    const __obj = InfinityArmor.WINGS_DATA[player];
    if(!__obj) return InfinityArmor.WINGS_DATA[player] = { isWearingChestplate: true };
    __obj.isWearingChestplate = true;
});
Armor.registerOnTakeOffListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: false });
    client.send("avaritia.chestplate", { bool: false });
    const __obj = InfinityArmor.WINGS_DATA[player];
    if(!__obj) return InfinityArmor.WINGS_DATA[player] = { isWearingChestplate: false };
    __obj.isWearingChestplate = false;
});
Armor.registerOnTickListener(ItemID.infinity_chestplate, (item, slot, player) => {
    // TODO remove harmful effects (native) 
});


Armor.registerOnTickListener(ItemID.infinity_helmet, (item, slot, player) => {
    Entity.addEffect(player, EPotionEffect.WATER_BREATHING, 1, 300, false, false);
    Entity.addEffect(player, EPotionEffect.NIGHT_VISION, 1, 300, false, false);
    const actor = new PlayerActor(player);
    if(actor.getHunger() < 20) actor.setHunger(20);
    if(actor.getSaturation() < 20) actor.setSaturation(20);
});
Armor.registerOnTickListener(ItemID.infinity_leggings, (item, slot, player) => {
    Entity.addEffect(player, EPotionEffect.FIRE_RESISTANCE, 1, 300, false, false);
});

((func) => {
    Armor.registerOnHurtListener(ItemID.infinity_helmet, func);
    Armor.registerOnHurtListener(ItemID.infinity_chestplate, func);
    Armor.registerOnHurtListener(ItemID.infinity_leggings, func);
    Armor.registerOnHurtListener(ItemID.infinity_boots, func)
})((item: ItemInstance, slot: number, player: number) => check_armor(player) && Game.prevent());

Callback.addCallback("EntityHurt", (attacker, entity) => Entity.getType(entity) == EEntityType.PLAYER && check_armor(entity) && Game.prevent() );

AVA_STUFF.push(ItemID.infinity_helmet, ItemID.infinity_chestplate, ItemID.infinity_leggings, ItemID.infinity_boots);
Rarity.cosmic(ItemID.infinity_helmet);
Rarity.cosmic(ItemID.infinity_chestplate);
Rarity.cosmic(ItemID.infinity_leggings);
Rarity.cosmic(ItemID.infinity_boots);
undestroyable_item("infinity_helmet");
undestroyable_item("infinity_chestplate");
undestroyable_item("infinity_leggings");
undestroyable_item("infinity_boots");