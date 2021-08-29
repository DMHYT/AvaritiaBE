IDRegistry.genItemID("infinity_helmet");
IDRegistry.genItemID("infinity_chestplate");
IDRegistry.genItemID("infinity_leggings");
IDRegistry.genItemID("infinity_boots");

Item.createArmorItem("infinity_helmet", "item.avaritia:infinity_helmet.name", {name: "infinity_helmet", meta: 0}, {type: "helmet", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.HELMET, 1000);
Item.createArmorItem("infinity_chestplate", "item.avaritia:infinity_chestplate.name", {name: "infinity_chestplate", meta: 0}, {type: "chestplate", armor: 16, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.CHESTPLATE, 1000);
Item.createArmorItem("infinity_leggings", "item.avaritia:infinity_pants.name", {name: "infinity_leggings", meta: 0}, {type: "leggings", armor: 12, durability: 9999, texture: "armor/infinity_1.png"}).setEnchantability(EEnchantType.LEGGINGS, 1000);
Item.createArmorItem("infinity_boots", "item.avaritia:infinity_boots.name", {name: "infinity_boots", meta: 0}, {type: "boots", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.BOOTS, 1000);

namespace InfinityArmor {

    interface WingsData { isWearingChestplate: boolean, renderer: ActorRenderer, attachable: AttachableRender }
    interface EyeData { isWearingHelmet: boolean, renderer: ActorRenderer, attachable: AttachableRender, mesh: RenderMesh }
    export const WINGS_DATA: {[player: number]: WingsData} = {};
    export const EYE_DATA: {[player: number]: EyeData} = {};
    export var isWearingChestplateClient: boolean = false;
    export const EYE_COLOR_RANDOM = new java.util.Random();

    export function showWings(_player: number): void {
        const __obj = WINGS_DATA[_player];
        if(!__obj || !__obj.isWearingChestplate) return;
        __obj.renderer = new ActorRenderer();
        __obj.attachable = new AttachableRender(_player);
        const mesh = new RenderMesh();
        mesh.importFromFile(`${__dir__}/assets/models/wings.obj`, "obj", null);
        __obj.renderer.addPart("wings", "body", mesh).endPart();
        __obj.renderer.setTexture("infinity_wings");
        __obj.attachable.setRenderer(__obj.renderer);
    }

    export function hideWings(_player: number): void {
        const __obj = WINGS_DATA[_player];
        if(!__obj || !__obj.isWearingChestplate) return;
        __obj.renderer.getPart("wings").clear();
        __obj.renderer.getPart("body").clear();
        __obj.attachable.destroy();
        // __obj.attachable.setRenderer(__obj.renderer);
    }

}

Callback.addCallback("ServerPlayerLoaded", (player_) => {
    InfinityArmor.WINGS_DATA[player_] = {
        isWearingChestplate: false,
        renderer: new ActorRenderer(),
        attachable: new AttachableRender(player_)
    }
    const mesh = new RenderMesh();
    mesh.importFromFile(`${__dir__}/assets/models/eyes.obj`, "obj", null);
    InfinityArmor.EYE_DATA[player_] = {
        isWearingHelmet: false,
        renderer: new ActorRenderer(),
        attachable: new AttachableRender(player_),
        mesh: mesh
    }
});

// --- CHESTPLATE --- //

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
    if(World.getThreadTime() % PLAYER_FLYING_CHECK_INTERVAL == 0) {
        if(Player.getFlying() == lastFlyingClient) return;
        lastFlyingClient = Player.getFlying();
        InfinityArmor.isWearingChestplateClient && Network.sendToServer("avaritia.togglewings", { bool: lastFlyingClient });
    }
});

Armor.registerOnTakeOnListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: true });
    client.send("avaritia.chestplate", { bool: true });
    InfinityArmor.WINGS_DATA[player].isWearingChestplate = true;
});
Armor.registerOnTakeOffListener(ItemID.infinity_chestplate, (item, slot, player) => {
    const client = Network.getClientForPlayer(player);
    client.send("avaritia.toggleflying", { bool: false });
    client.send("avaritia.chestplate", { bool: false });
    InfinityArmor.WINGS_DATA[player].isWearingChestplate = false;
});
Armor.registerOnTickListener(ItemID.infinity_chestplate, (item, slot, player) => {
    // TODO remove harmful effects (native) 
});

// --- --- --- --- //

// --- HELMET --- //

Callback.addCallback("ServerPlayerTick", (playerUid, isDead) => {
    if(isDead) return;
    if(World.getThreadTime() % EYE_COLOR_UPDATE_FREQUENCY == 0) {
        const __obj = InfinityArmor.EYE_DATA[playerUid];
        if(!__obj || !__obj.isWearingHelmet) return;
        const frame = Math.round(World.getThreadTime() / 3);
        InfinityArmor.EYE_COLOR_RANDOM.setSeed(frame * 1723609);
        const o = InfinityArmor.EYE_COLOR_RANDOM.nextFloat() * 6.0;
        const col = hsv2rgb(o, 1.0, 1.0);
        __obj.mesh.setColor(col[0], col[1], col[2], 1);
        __obj.renderer.addPart("head").endPart().addPart("eyes", "head", __obj.mesh).endPart();
        __obj.renderer.setTexture("pixel");
        __obj.attachable.setRenderer(__obj.renderer);
    }
});
Armor.registerOnTakeOnListener(ItemID.infinity_helmet, (item, slot, player) => {
    InfinityArmor.EYE_DATA[player].isWearingHelmet = true;
});
Armor.registerOnTakeOffListener(ItemID.infinity_helmet, (item, slot, player) => {
    const __obj = InfinityArmor.EYE_DATA[player];
    __obj.isWearingHelmet = false;
    __obj.renderer.getPart("eyes").clear();
    __obj.renderer.getPart("head").clear();
});
Armor.registerOnTickListener(ItemID.infinity_helmet, (item, slot, player) => {
    if(World.getThreadTime() % 20 == 0) {
        Entity.addEffect(player, EPotionEffect.WATER_BREATHING, 1, 400, false, false);
        Entity.addEffect(player, EPotionEffect.NIGHT_VISION, 1, 400, false, false);
        const actor = new PlayerActor(player);
        if(actor.getHunger() < 20) actor.setHunger(20);
        if(actor.getSaturation() < 20) actor.setSaturation(20);
    }
});

// --- --- --- --- //

Armor.registerOnTickListener(ItemID.infinity_leggings, (item, slot, player) => {
    World.getThreadTime() % 20 == 0 &&
    Entity.addEffect(player, EPotionEffect.FIRE_RESISTANCE, 1, 400, false, false);
});

Armor.registerOnHurtListener(ItemID.infinity_chestplate, () => Game.prevent());

Callback.addCallback("EntityHurt", (attacker, entity) => Entity.getType(entity) == EEntityType.PLAYER && check_armor(entity) && Game.prevent());
Callback.addCallback("EntityDeath", (entity) => Entity.getType(entity) == EEntityType.PLAYER && check_armor(entity) && Game.prevent());

AVA_STUFF.push(ItemID.infinity_helmet, ItemID.infinity_chestplate, ItemID.infinity_leggings, ItemID.infinity_boots);
Rarity.cosmic(ItemID.infinity_helmet);
Rarity.cosmic(ItemID.infinity_chestplate);
Rarity.cosmic(ItemID.infinity_leggings);
Rarity.cosmic(ItemID.infinity_boots);
undestroyable_item("infinity_helmet");
undestroyable_item("infinity_chestplate");
undestroyable_item("infinity_leggings");
undestroyable_item("infinity_boots");