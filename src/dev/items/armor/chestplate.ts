IDRegistry.genItemID("infinity_chestplate");
Item.createArmorItem("infinity_chestplate", "item.avaritia:infinity_chestplate.name", {name: "infinity_chestplate", meta: 0}, {type: "chestplate", armor: 16, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.CHESTPLATE, 1000);
AVA_STUFF.push(ItemID.infinity_chestplate);
Rarity.cosmic(ItemID.infinity_chestplate);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_chestplate);

interface WingsData {
    isWearingChestplate: boolean,
    renderer: ActorRenderer,
    attachable: AttachableRender
}
const WINGS_DATA: {[player: number]: WingsData} = {};

var isWearingChestplateClient: boolean = false;
var lastFlyingClient: boolean = false;

Network.addClientPacket("avaritia.wingsdata.client", (data: { player: number }) => {
    const renderer = new ActorRenderer()
        .addPart("body")
        .endPart()
        .addPart("wings", "body")
        .setTextureSize(128, 32)
        .setTexture("render/wings.png")
        .endPart();
    const attachable = new AttachableRender(data.player).setRenderer(renderer);
    WINGS_DATA[data.player] = { isWearingChestplate: new PlayerActor(data.player).getArmor(1).id == ItemID.infinity_chestplate, renderer, attachable }
});

Network.addClientPacket("avaritia.togglewings.client", (data: { player: number, bool: boolean }) => {
    const __obj = WINGS_DATA[data.player];
    if(data.bool) {
        if(!__obj || !__obj.isWearingChestplate || !AvaritiaFuncs.nativeIsPlayerFlying()) return;
        __obj.renderer.getPart("wings")
            .clear()
            .addBox(-28, -10, 3.015, 56, 30, 0, 0, 0, 0)
            .endPart();
    } else {
        if(!__obj) return;
        __obj.renderer.getPart("wings").clear();
    }
});

Network.addClientPacket("avaritia.iswearingchestplate.client", (data: { player: number, bool: boolean }) => WINGS_DATA[data.player].isWearingChestplate = data.bool);

Callback.addCallback("ServerPlayerLoaded", player => {
    Network.sendToAllClients("avaritia.wingsdata.client", { player });
    const client = Network.getClientForPlayer(player);
    Network.getConnectedPlayers()
        .filter(value => value != player)
        .forEach(pl => client.send("avaritia.wingsdata.client", { player: pl }));
});

Network.addClientPacket("avaritia.toggleflying", (data: { bool: boolean }) => {
    if(new PlayerActor(Player.get()).getGameMode() != 1) {
        Player.setFlyingEnabled(data.bool);
    }
});
Network.addClientPacket("avaritia.chestplate", (data: { bool: boolean }) => {
    isWearingChestplateClient = data.bool;
});
Network.addServerPacket("avaritia.togglewings", (client, data: { bool: boolean }) => {
    Network.sendToAllClients("avaritia.togglewings.client", { player: client.getPlayerUid(), bool: data.bool });
});

Callback.addCallback("LocalTick", () => {
    if(Player.getFlying() == lastFlyingClient) return;
    lastFlyingClient = Player.getFlying();
    if(isWearingChestplateClient) {
        Network.sendToServer("avaritia.togglewings", { bool: lastFlyingClient });
    }
});

Armor.registerOnTakeOnListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: true });
    client.send("avaritia.chestplate", { bool: true });
    Network.sendToAllClients("avaritia.iswearingchestplate.client", { player, bool: true });
    Network.sendToAllClients("avaritia.togglewings.client", { player, bool: true });
});

Armor.registerOnTakeOffListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: false });
    client.send("avaritia.chestplate", { bool: false });
    Network.sendToAllClients("avaritia.iswearingchestplate.client", { player, bool: false });
    Network.sendToAllClients("avaritia.togglewings.client", { player, bool: false });
});

Armor.registerOnTickListener(ItemID.infinity_chestplate, (item, slot, player) => {
    AvaritiaFuncs.nativeRemoveHarmfulEffectsFrom(player);
});

Armor.registerOnHurtListener(ItemID.infinity_chestplate, (item, slot, player) => {
    Entity.getType(player) == EEntityType.PLAYER && Game.prevent();
    item.data > 0 && Entity.setArmorSlot(player, slot, item.id, item.count, 0, item.extra);
});