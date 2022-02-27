IDRegistry.genItemID("infinity_chestplate");
Item.createArmorItem("infinity_chestplate", "item.avaritia:infinity_chestplate.name", {name: "infinity_chestplate", meta: 0}, {type: "chestplate", armor: 16, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.CHESTPLATE, 1000);
AVA_STUFF.push(ItemID.infinity_chestplate);
Rarity.cosmic(ItemID.infinity_chestplate);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_chestplate);


Network.addClientPacket("avaritia.toggleflying", 
    (data: { bool: boolean }) => 
        ensureWorldLoaded(() => 
            ensurePlayerInGame(() => {
                if(new PlayerActor(Player.get()).getGameMode() != 1)
                    Player.setFlyingEnabled(data.bool);
            })));


var gm: number = 1;
Callback.addCallback("PlayerGameModeChanged", mode => {
    if(mode != 1 && isWearingChestplateClient)
        ensureWorldLoaded(() => ensurePlayerInGame(() => Player.setFlyingEnabled(true)));
    if(mode != gm) gm = mode;
});


const FLYING_MAP: {[player: number]: boolean} = {};
Network.addServerPacket("avaritia.flyingupdate.server", (client, data: { bool: boolean }) => Network.sendToAllClients("avaritia.flyingupdate.client", { player: client.getPlayerUid(), bool: data.bool }));
Network.addClientPacket("avaritia.flyingupdate.client", (data: { player: number, bool: boolean }) => {
    WINGS_DATA[data.player] ?? initWingsObject(data.player);
    FLYING_MAP[data.player] = data.bool;
    toggleWings(data.player, data.bool);
});
Network.addClientPacket("avaritia.firstflyingrequest", () => {
    lastFlyingClient = AvaritiaFuncs.nativeIsPlayerFlying();
    Network.sendToServer("avaritia.flyingupdate.server", { bool: lastFlyingClient });
    Network.sendToServer("avaritia.chestplatedatarequest.server", {});
});
Network.addClientPacket("avaritia.iswearingchestplate.client", (data: { player: number, bool: boolean }) => {
    WINGS_DATA[data.player] ?? initWingsObject(data.player);
    ensureWorldLoaded(() => WINGS_DATA[data.player].isWearingChestplate = data.bool);
    typeof FLYING_MAP[data.player] !== "undefined" && toggleWings(data.player, FLYING_MAP[data.player]);
});


interface WingsData {
    isWearingChestplate: boolean,
    renderer: ActorRenderer,
    attachable: AttachableRender
}
const WINGS_DATA: {[player: number]: WingsData} = {};
const initWingsObject = (player: number) => ensureWorldLoaded(() => {
    const renderer = new ActorRenderer()
        .addPart("body")
        .endPart()
        .addPart("wings", "body")
        .setTextureSize(128, 32)
        .setTexture("render/wings.png")
        .endPart();
    const attachable = new AttachableRender(player).setRenderer(renderer);
    WINGS_DATA[player] = { isWearingChestplate: false, renderer, attachable };
});
const toggleWings = (player: number, bool: boolean) => ensureWorldLoaded(() => {
    if(bool && WINGS_DATA[player].isWearingChestplate) {
        WINGS_DATA[player].renderer.getPart("wings")
            .clear()
            .addBox(-28, -10, 3.015, 56, 30, 0, 0, 0, 0)
            .endPart();
    } else WINGS_DATA[player].renderer.getPart("wings").clear();
});


Callback.addCallback("ServerPlayerLoaded", player => Network.getClientForPlayer(player).send("avaritia.firstflyingrequest", {}));
Network.addServerPacket("avaritia.chestplatedatarequest.server", client => {
    const players = Network.getConnectedPlayers();
    for(let i in players)
        client.send("avaritia.iswearingchestplate.client", { player: players[i], bool: new PlayerActor(players[i]).getArmor(EArmorType.CHESTPLATE).id == ItemID.infinity_chestplate });
});


var isWearingChestplateClient: boolean = false;
Network.addClientPacket("avaritia.chestplate", (data: { bool: boolean }) => isWearingChestplateClient = data.bool);


Armor.registerOnTakeOnListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: true });
    client.send("avaritia.chestplate", { bool: true });
    Network.sendToAllClients("avaritia.iswearingchestplate.client", { player, bool: true });
});
Armor.registerOnTakeOffListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: false });
    client.send("avaritia.chestplate", { bool: false });
    Network.sendToAllClients("avaritia.iswearingchestplate.client", { player, bool: false });
});


var lastFlyingClient: boolean = false;
Callback.addCallback("LocalTick", () => {
    const flying = Player.getFlying();
    if(lastFlyingClient == flying) return;
    lastFlyingClient = flying;
    Network.sendToServer("avaritia.flyingupdate.server", { bool: flying });
});


Callback.addCallback("LevelLeft", () => {
    Object.keys(FLYING_MAP).forEach(k => delete FLYING_MAP[k]);
    Object.keys(WINGS_DATA).forEach(k => delete WINGS_DATA[k]);
    isWearingChestplateClient = false;
    lastFlyingClient = false;
});

Network.addClientPacket("avaritia.playerdisconnect.chestplate", (data: { player: number }) => {
    delete FLYING_MAP[data.player];
    delete WINGS_DATA[data.player];
});
Callback.addCallback("ServerPlayerLeft", player => Network.sendToAllClients("avaritia.playerdisconnect.chestplate", { player }));


Armor.registerOnTickListener(ItemID.infinity_chestplate, (item, slot, player) => AvaritiaFuncs.nativeRemoveHarmfulEffectsFrom(player));