IDRegistry.genItemID("infinity_boots");
Item.createArmorItem("infinity_boots", "item.avaritia:infinity_boots.name", {name: "infinity_boots", meta: 0}, {type: "boots", armor: 6, durability: 9999, texture: "armor/infinity_0.png"}).setEnchantability(EEnchantType.BOOTS, 1000);
AVA_STUFF.push(ItemID.infinity_boots);
Rarity.cosmic(ItemID.infinity_boots);
undestroyableItem(ItemID.infinity_boots);

let isWearingBootsClient: boolean = false;
Network.addClientPacket("avaritia.iswearingboots.client", (data: { bool: boolean }) => isWearingBootsClient = data.bool);
Armor.registerOnTakeOnListener(ItemID.infinity_boots, (item, slot, player) => Network.getClientForPlayer(player).send("avaritia.iswearingboots.client", { bool: true }));
Armor.registerOnTakeOffListener(ItemID.infinity_boots, (item, slot, player) => Network.getClientForPlayer(player).send("avaritia.iswearingboots.client", { bool: false }));

Callback.addCallback("LocalTick", () => {
    if(isWearingBootsClient) {
        const player = KEX.GlobalContext.getLocalPlayer();
        const flying = player.isFlying();
        const swimming = player.isInWater();
        if(player.isOnGround() || flying || swimming) {
            const sneaking = player.isSneaking();
            const speed = .15 * (flying ? 1.1 : 1.0) * (sneaking ? .1 : 1.0);
            const mih = player.getMoveInputHandler();
            const moveForward = mih.getMovingForward();
            const moveStrafing = mih.getMovingBackward();
            if(moveForward > .0) {
                player.moveRelative(.0, .0, 1.0, speed);
            } else if(moveForward < .0) {
                player.moveRelative(.0, .0, 1.0, -speed * .3);
            }
            if(moveStrafing != .0) {
                player.moveRelative(1.0, .0, .0, speed * .5 * java.lang.Math.signum(moveStrafing));
            }
        }
    }
});

Network.addClientPacket("avaritia.bootsjumpboost", () => Entity.addVelocity(Player.get(), 0, .4, 0));

Callback.addCallback("PlayerJump", (player) => {
    if(Entity.getArmorSlot(player, 3).id == ItemID.infinity_boots) {
        Network.getClientForPlayer(player)
            ?.send("avaritia.bootsjumpboost", {});
    }
});