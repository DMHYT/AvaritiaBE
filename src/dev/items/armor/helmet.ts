IDRegistry.genItemID("infinity_helmet");
Item.createArmorItem("infinity_helmet", "item.avaritia:infinity_helmet.name", {name: "infinity_helmet", meta: 0}, {type: "helmet", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.HELMET, 1000);
AVA_STUFF.push(ItemID.infinity_helmet);
Rarity.cosmic(ItemID.infinity_helmet);
undestroyableItem(ItemID.infinity_helmet);


interface EyeData {
    isWearingHelmet: boolean,
    renderer: ActorRenderer,
    attachable: AttachableRender,
    mesh: RenderMesh
}
const EYE_DATA: {[player: number]: EyeData} = {};
const EYE_COLOR_RANDOM = new Random();
const EYE_MESH = new RenderMesh();
EYE_MESH.importFromFile(`${__dir__}/resources/res/models/eyes.obj`, "obj", null);
EYE_MESH.translate(0, 29/64, 7/32);
EYE_MESH.scale(1.2, 1.2, 1.2);
const initEyesObject = (player: number) => {
    const mesh = new RenderMesh();
    const renderer = new ActorRenderer("helmet");
    renderer.getPart("head").clear();
    renderer.addPart("eyes", "head", mesh).endPart();
    const attachable = new AttachableRender(player)
        .setMaterial("avaritia_coloring")
        .setRenderer(renderer);
    EYE_DATA[player] = { isWearingHelmet: false, renderer, attachable, mesh };
}
const toggleEyes = (player: number, bool: boolean) => {
    EYE_DATA[player] ?? initEyesObject(player);
    EYE_DATA[player].mesh.clear();
    if(bool && EYE_DATA[player].isWearingHelmet) EYE_DATA[player].mesh.addMesh(EYE_MESH);
}


Network.addClientPacket("avaritia.iswearinghelmet.client", (data: { player: number, bool: boolean }) => {
    EYE_DATA[data.player] ?? initEyesObject(data.player);
    EYE_DATA[data.player].isWearingHelmet = data.bool;
    toggleEyes(data.player, data.bool);
});


Callback.addCallback("ServerPlayerLoaded", player => {
    Network.sendToAllClients("avaritia.iswearinghelmet.client", { player, bool: new PlayerActor(player).getArmor(EArmorType.HELMET).id == ItemID.infinity_helmet });
    const client = Network.getClientForPlayer(player);
    const players = Network.getConnectedPlayers();
    for(let i in players)
        client.send("avaritia.iswearinghelmet.client", { player: players[i], bool: new PlayerActor(players[i]).getArmor(EArmorType.HELMET).id == ItemID.infinity_helmet });
});


Armor.registerOnTakeOnListener(ItemID.infinity_helmet, (item, slot, player) => Network.sendToAllClients("avaritia.iswearinghelmet.client", { player, bool: true }));
Armor.registerOnTakeOffListener(ItemID.infinity_helmet, (item, slot, player) => Network.sendToAllClients("avaritia.iswearinghelmet.client", { player, bool: false }));


Callback.addCallback("LocalTick", () => {
    if(World.getThreadTime() % EYE_COLOR_UPDATE_FREQUENCY == 0) {
        EYE_COLOR_RANDOM_SEED_CHANGING && EYE_COLOR_RANDOM.setSeed(Math.round(World.getThreadTime() / 3) * 1723609);
        CONNECTED_PLAYERS
            .filter(pl => 
                EYE_DATA[pl] &&
                EYE_DATA[pl].isWearingHelmet && (
                pl == Player.get() || (
                Entity.getDimension(pl) == Player.getDimension() &&
                Entity.getDistanceToEntity(Player.get(), pl) <= 64)))
            .forEach(pl => {
                const rgb = hsv2rgb(EYE_COLOR_RANDOM.nextFloat() * 6.0, 1.0, 1.0);
                EYE_DATA[pl].attachable.getUniformSet()
                    .setUniformValue("Avaritia", "COLOR_R", rgb[0])
                    .setUniformValue("Avaritia", "COLOR_G", rgb[1])
                    .setUniformValue("Avaritia", "COLOR_B", rgb[2]);
            });
    }
});


Callback.addCallback("LevelLeft", () => Object.keys(EYE_DATA).forEach(k => delete EYE_DATA[k]));


Network.addClientPacket("avaritia.playerdisconnect.helmet", (data: { player: number }) => delete EYE_DATA[data.player]);
Callback.addCallback("ServerPlayerLeft", player => Network.sendToAllClients("avaritia.playerdisconnect.helmet", { player }));


Armor.registerOnTickListener(ItemID.infinity_helmet, (item, slot, player) => {
    const actor = new KEX.Player(player);
    actor.setAirSupply(actor.getMaxAirSupply());
    if(World.getThreadTime() % 20 == 0) {
        Entity.addEffect(player, EPotionEffect.NIGHT_VISION, 1, 300, false, false);
        actor.getHunger() < 20 && actor.setHunger(20);
        actor.getSaturation() < 20 && actor.setSaturation(20);
    }
});