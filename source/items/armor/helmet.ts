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

Callback.addCallback("ServerPlayerLoaded", player => {
    const mesh = new RenderMesh();
    const renderer = new ActorRenderer().addPart("head").endPart().addPart("eyes", "head", mesh).endPart();
    renderer.setTexture("render/pixel.png");
    renderer.setMaterial("avaritia_infinity_eyes");
    const attachable = new AttachableRender(player).setRenderer(renderer);
    EYE_DATA[player] = { isWearingHelmet: new PlayerActor(player).getArmor(0).id == ItemID.infinity_helmet, renderer, attachable, mesh }
});

Armor.registerOnTakeOnListener(ItemID.infinity_helmet, (item, slot, player) => {
    const __obj = EYE_DATA[player];
    __obj.isWearingHelmet = true;
    if(__obj.mesh.getReadOnlyVertexData().vertices.length > 0) __obj.mesh.clear();
    __obj.mesh.importFromFile(`${__dir__}/assets/models/eyes.obj`, "obj", null);
    __obj.mesh.translate(0, 7/16, -1/16);
    __obj.mesh.scale(1.25, 1.25, 1.25);
});

Armor.registerOnTakeOffListener(ItemID.infinity_helmet, (item, slot, player) => {
    const __obj = EYE_DATA[player];
    __obj.isWearingHelmet = false;
    __obj.mesh.clear();
});

Callback.addCallback("ServerPlayerTick", (player, isDead) => {
    if(isDead) return;
    if(World.getThreadTime() % EYE_COLOR_UPDATE_FREQUENCY == 0) {
        const __obj = EYE_DATA[player];
        if(!__obj || !__obj.isWearingHelmet) return;
        EYE_COLOR_RANDOM.setSeed(Math.round(World.getThreadTime() / 3) * 1723609);
        const rgb = hsv2rgb(EYE_COLOR_RANDOM.nextFloat() * 6.0, 1.0, 1.0);
        const set = __obj.renderer.getUniformSet();
        set.setUniformValue("Avaritia", "R", rgb[0])
           .setUniformValue("Avaritia", "G", rgb[1])
           .setUniformValue("Avaritia", "B", rgb[2]);
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