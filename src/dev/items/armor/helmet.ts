IDRegistry.genItemID("infinity_helmet");
Item.createArmorItem("infinity_helmet", "item.avaritia:infinity_helmet.name", {name: "infinity_helmet", meta: 0}, {type: "helmet", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.HELMET, 1000);
AVA_STUFF.push(ItemID.infinity_helmet);
Rarity.cosmic(ItemID.infinity_helmet);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_helmet);

interface EyeData {
    isWearingHelmet: boolean,
    renderer: ActorRenderer,
    attachable: AttachableRender,
    mesh: RenderMesh
}
const EYE_DATA: {[player: number]: EyeData} = {};
const EYE_COLOR_RANDOM = new java.util.Random();
const EYE_MESH = new RenderMesh();
EYE_MESH.importFromFile(`${__dir__}/resources/res/models/eyes.obj`, "obj", null);
EYE_MESH.translate(0, .4375, 0);
EYE_MESH.scale(1.2, 1.2, 1.2);

Network.addClientPacket("avaritia.eyedata.client", (data: { player: number }) => {
    const mesh = new RenderMesh();
    const renderer = new ActorRenderer("helmet");
    renderer.setMaterial("avaritia_coloring");
    renderer.getPart("head").clear();
    renderer.addPart("eyes", "head", mesh).endPart();
    const attachable = new AttachableRender(data.player).setRenderer(renderer).setMaterial("avaritia_coloring");
    EYE_DATA[data.player] = { isWearingHelmet: new PlayerActor(data.player).getArmor(0).id == ItemID.infinity_helmet, renderer, attachable, mesh }
});
Network.addClientPacket("avaritia.toggleeyes.client", (data: { player: number, bool: boolean }) => {
    const __obj = EYE_DATA[data.player];
    if(data.bool) {
        if(!__obj || !__obj.isWearingHelmet) return;
        __obj.mesh.clear();
        __obj.mesh.addMesh(EYE_MESH);
    } else {
        if(!__obj) return;
        __obj.mesh.clear();
    }
});
Network.addClientPacket("avaritia.iswearinghelmet.client", (data: { player: number, bool: boolean }) => EYE_DATA[data.player].isWearingHelmet = data.bool);

Callback.addCallback("ServerPlayerLoaded", player => {
    Network.sendToAllClients("avaritia.eyedata.client", { player });
    const client = Network.getClientForPlayer(player);
    Network.getConnectedPlayers()
        .filter(value => value != player)
        .forEach(pl => client.send("avaritia.eyedata.client", { player: pl }));
});

Armor.registerOnTakeOnListener(ItemID.infinity_helmet, (item, slot, player) => {
    Network.sendToAllClients("avaritia.iswearinghelmet.client", { player, bool: true });
    Network.sendToAllClients("avaritia.toggleeyes.client", { player, bool: true });
});

Armor.registerOnTakeOffListener(ItemID.infinity_helmet, (item, slot, player) => {
    Network.sendToAllClients("avaritia.iswearinghelmet.client", { player, bool: false });
    Network.sendToAllClients("avaritia.toggleeyes.client", { player, bool: false });
});

Callback.addCallback("LocalTick", () => {
    if(World.getThreadTime() % EYE_COLOR_UPDATE_FREQUENCY == 0) {
        const pos = Entity.getPosition(Player.get());
        const iter = new NetworkConnectedClientList()
            .setupDistancePolicy(pos.x, pos.y, pos.z, Player.getDimension(), 64)
            .iterator();
        if(!iter.hasNext()) return;
        let players: number[] = [];
        while(iter.hasNext()) players.push(iter.next().getPlayerUid());
        players = players.filter(p => EYE_DATA[p] && EYE_DATA[p].isWearingHelmet);
        if(players.length == 0) return;
        EYE_COLOR_RANDOM.setSeed(Math.round(World.getThreadTime() / 3) * 1723609);
        players.forEach(pl => {
            const rgb = hsv2rgb(EYE_COLOR_RANDOM.nextFloat() * 6.0, 1.0, 1.0);
            EYE_DATA[pl].attachable.getUniformSet()
                .setUniformValue("Avaritia", "COLOR_R", rgb[0])
                .setUniformValue("Avaritia", "COLOR_G", rgb[1])
                .setUniformValue("Avaritia", "COLOR_B", rgb[2]);
        });
    }
});

Armor.registerOnTickListener(ItemID.infinity_helmet, (item, slot, player) => {
    AvaritiaFuncs.nativeSetFullAirSupply(player);
    if(World.getThreadTime() % 20 == 0) {
        Entity.addEffect(player, EPotionEffect.NIGHT_VISION, 1, 300, false, false);
        const actor = new PlayerActor(player);
        actor.getHunger() < 20 && actor.setHunger(20);
        actor.getSaturation() < 20 && actor.setSaturation(20);
    }
});

undestroyableArmor(ItemID.infinity_helmet);