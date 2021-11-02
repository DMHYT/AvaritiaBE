IDRegistry.genItemID("infinity_helmet");
Item.createArmorItem("infinity_helmet", "item.avaritia:infinity_helmet.name", {name: "infinity_helmet", meta: 0}, {type: "helmet", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.HELMET, 1000);
AVA_STUFF.push(ItemID.infinity_helmet);
Rarity.cosmic(ItemID.infinity_helmet);
undestroyable_item("infinity_helmet");

interface EyeData {
    isWearingHelmet: boolean,
    renderer: ActorRenderer,
    attachable: AttachableRender,
    mesh: RenderMesh
}
const EYE_DATA: {[player: number]: EyeData} = {};
const EYE_COLOR_RANDOM = new java.util.Random();
const EYE_MESH = new RenderMesh(`${__dir__}/resources/res/models/eyes.obj`, "obj", { invertV: false, noRebuild: true, translate: [0, 7/16, -1/16], scale: [1.25, 1.25, 1.25] });

Network.addClientPacket("avaritia.eyedata.client", (data: { player: number }) => {
    const mesh = new RenderMesh();
    const renderer = new ActorRenderer().addPart("head").endPart().addPart("eyes", "head", mesh).endPart();
    renderer.setTexture("render/pixel.png");
    renderer.setMaterial("avaritia_coloring");
    const attachable = new AttachableRender(data.player).setRenderer(renderer);
    EYE_DATA[data.player] = { isWearingHelmet: new PlayerActor(data.player).getArmor(0).id == ItemID.infinity_helmet, renderer, attachable, mesh }
});
Network.addClientPacket("avaritia.toggleeyes.client", (data: { player: number, bool: boolean }) => {
    const __obj = WINGS_DATA[data.player];
    if(data.bool) {
        if(!__obj || !__obj.isWearingChestplate) return;
        __obj.mesh.clear();
        __obj.mesh.addMesh(WINGS_MESH);
    } else {
        if(!__obj) return;
        __obj.mesh.clear();
    }
});
Network.addClientPacket("avaritia.iswearinghelmet.client", (data: { player: number, bool: boolean }) => EYE_DATA[data.player].isWearingHelmet = data.bool);

Callback.addCallback("ServerPlayerLoaded", player => {
    Network.sendToAllClients("avaritia.eyedata.client", { player });
    const client = Network.getClientForPlayer(player);
    Object.keys(EYE_DATA)
        .map(parseInt)
        .filter(value => value != player)
        .forEach(pl => client.send("avaritia.eyedata.client", { player: pl }));
});

Armor.registerOnTakeOnListener(ItemID.infinity_helmet, (item, slot, player) => {
    EYE_DATA[player].isWearingHelmet = true;
    Network.sendToAllClients("avaritia.iswearinghelmet.client", { player, bool: true });
    Network.sendToAllClients("avaritia.toggleeyes.client", { player, bool: true });
});

Armor.registerOnTakeOffListener(ItemID.infinity_helmet, (item, slot, player) => {
    EYE_DATA[player].isWearingHelmet = false;
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
        players = players.filter(p => EYE_DATA[p].isWearingHelmet);
        if(players.length == 0) return;
        EYE_COLOR_RANDOM.setSeed(Math.round(World.getThreadTime() / 3) * 1723609);
        players.forEach(pl => {
            const rgb = hsv2rgb(EYE_COLOR_RANDOM.nextFloat() * 6.0, 1.0, 1.0);
            EYE_DATA[pl].renderer.getUniformSet()
                .setUniformValue("Avaritia", "R", rgb[0])
                .setUniformValue("Avaritia", "G", rgb[1])
                .setUniformValue("Avaritia", "B", rgb[2]);
        });
    }
});

Armor.registerOnTickListener(ItemID.infinity_helmet, (item, slot, player) => {
    if(World.getThreadTime() % 20 == 0) {
        Entity.addEffect(player, EPotionEffect.WATER_BREATHING, 1, 400, false, false);
        Entity.addEffect(player, EPotionEffect.NIGHT_VISION, 1, 400, false, false);
        const actor = new PlayerActor(player);
        actor.getHunger() < 20 && actor.setHunger(20);
        actor.getSaturation() < 20 && actor.setSaturation(20);
    }
});