IDRegistry.genItemID("infinity_boots");
Item.createArmorItem("infinity_boots", "item.avaritia:infinity_boots.name", {name: "infinity_boots", meta: 0}, {type: "boots", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.BOOTS, 1000);
AVA_STUFF.push(ItemID.infinity_boots);
Rarity.cosmic(ItemID.infinity_boots);
undestroyable_item("infinity_boots");

const FLYING_MAP: {[key: number]: boolean} = {};
Network.addServerPacket("avaritia.isflying.server", (client, data: { bool: boolean }) => FLYING_MAP[client.getPlayerUid()] = data.bool);

Armor.registerOnTickListener(ItemID.infinity_boots, (item, slot, player) => {
    const flying = FLYING_MAP[player];
    const swimming = AvaritiaNative.isActorInWater(player);
    if(flying || swimming) {
        const sneaking = Entity.getSneaking(player);
        const speed = .15 * (flying ? 1.1 : 1.0) * (sneaking ? 0.1 : 1.0);
        const vel = Entity.getVelocity(player);
        if(vel.x > 0 || vel.y > 0 || vel.z > 0) {
            AvaritiaNative.moveActorRelative(player, 0, 0, 1, speed);
        } else if(vel.x < 0 || vel.y < 0 || vel.z < 0) {
            AvaritiaNative.moveActorRelative(player, 0, 0, 1, -speed * .3);
        }
        if(vel.x != 0 || vel.y != 0 || vel.z != 0) {
            AvaritiaNative.moveActorRelative(player, 1, 0, 0, speed * .5 * java.lang.Math.signum(vel.x != 0 ? vel.x : vel.y != 0 ? vel.y : vel.z));
        }
    }
});

Callback.addCallback("PlayerJump", (player) => {
    if(Entity.getArmorSlot(player, 3).id == ItemID.infinity_boots) {
        Entity.addVelocity(player, 0, .4, 0);
    }
});