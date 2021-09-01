IDRegistry.genItemID("infinity_chestplate");
Item.createArmorItem("infinity_chestplate", "item.avaritia:infinity_chestplate.name", {name: "infinity_chestplate", meta: 0}, {type: "chestplate", armor: 16, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.CHESTPLATE, 1000);
AVA_STUFF.push(ItemID.infinity_chestplate);
Rarity.cosmic(ItemID.infinity_chestplate);
undestroyable_item("infinity_chestplate");

interface WingsData {
    isWearingChestplate: boolean,
    renderer: ActorRenderer,
    attachable: AttachableRender,
    mesh: RenderMesh
}
const WINGS_DATA: {[player: number]: WingsData} = {};

var isWearingChestplateClient: boolean = false;
var lastFlyingClient: boolean = false;

Callback.addCallback("ServerPlayerLoaded", player => {
    const mesh = new RenderMesh();
    const renderer = new ActorRenderer().addPart("body").endPart().addPart("wings", "body", mesh).endPart();
    renderer.setTexture("render/infinity_wings.png");
    const attachable = new AttachableRender(player).setRenderer(renderer);
    WINGS_DATA[player] = { isWearingChestplate: false, renderer, attachable, mesh }
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
    const __obj = WINGS_DATA[client.getPlayerUid()];
    if(data.bool) {
        if(!__obj || !__obj.isWearingChestplate) return;
        __obj.mesh.clear();
        __obj.mesh.importFromFile(`${__dir__}/assets/models/wings.obj`, "obj", null);
    } else {
        if(!__obj) return;
        __obj.mesh.clear();
    }
});

Callback.addCallback("LocalTick", () => {
    if(World.getThreadTime() % PLAYER_FLYING_CHECK_INTERVAL == 0) {
        if(Player.getFlying() == lastFlyingClient) return;
        lastFlyingClient = Player.getFlying();
        if(isWearingChestplateClient) {
            Network.sendToServer("avaritia.togglewings", { bool: lastFlyingClient });
        }
    }
});

Armor.registerOnTakeOnListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: true });
    client.send("avaritia.chestplate", { bool: true });
    WINGS_DATA[player].isWearingChestplate = true;
});

Armor.registerOnTakeOffListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: false });
    client.send("avaritia.chestplate", { bool: false });
    WINGS_DATA[player].isWearingChestplate = false;
});

Armor.registerOnTickListener(ItemID.infinity_chestplate, (item, slot, player) => {
    // TODO remove harmful effects with native
});

Armor.registerOnHurtListener(ItemID.infinity_chestplate, (item, slot, player) => Entity.getType(player) == EEntityType.PLAYER && Game.prevent());