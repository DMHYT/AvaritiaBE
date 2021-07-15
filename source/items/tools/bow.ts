IDRegistry.genItemID("infinity_bow");
Item.createItem("infinity_bow", "item.avaritia:infinity_bow.name", {name: "infinity_bow_idle", meta: 0}, {stack: 1});
Item.setToolRender(ItemID.infinity_bow, true);
Item.setMaxUseDuration(ItemID.infinity_bow, 13);
Item.setUseAnimation(ItemID.infinity_bow, EItemAnimation.BOW);
Item.setEnchantType(ItemID.infinity_bow, EEnchantType.BOW, 1);

type BowData = { timer: number };
const BOW_DATA: {[key: number]: BowData} = {};
var CURRENT_BOW_ICON_CLIENT_SIDE: number = 0;

const check_arrow = (player: number) => {
    const actor = new PlayerActor(player);
    for(let i=0; i<36; ++i){
        if(actor.getInventorySlot(i).id == VanillaItemID.arrow) return i;
    }
    return -1;
}

const infinity_bow_shoot = (item: ItemInstance, ticks: number, player: number) => {
    let actor = new PlayerActor(player),
        j = 13 - ticks,
        flag = actor.getGameMode() == 1 || (item.extra != null && item.extra.isEnchanted() && item.extra.getEnchantLevel(EEnchantment.INFINITY) > 0),
        inventoryArrow = check_arrow(player);
    if(flag || inventoryArrow != -1){
        let f = j / 13;
        f = (f * f + f * 2) / 3;
        if(f < .1) return;
        if(f > 1) f = 1;
        let lookAngle = Entity.getLookAngle(player),
            pos = Entity.getPosition(player),
            velocity = { x: -Math.sin(lookAngle.yaw) * Math.cos(lookAngle.pitch), y: Math.sin(lookAngle.pitch), z: Math.cos(lookAngle.yaw) * Math.cos(lookAngle.pitch) },
            region = BlockSource.getDefaultForActor(player),
            arrow = region.spawnEntity(pos.x + (velocity.x * .5), pos.y + (velocity.y * .5), pos.z + (velocity.z * .5), EEntityType.ARROW);
        Entity.setSkin(arrow, "entity/heavenarrow");
        let tag = Entity.getCompoundTag(arrow);
        tag.putByte("AVARITIA_HEAVEN_ARROW", 1);
        // TODO put player uuid as shooting entity
        tag.putDouble("damage", 60);
        if(f == 1) tag.putByte("crit", 1);
        if(item.extra != null && item.extra.isEnchanted()){
            let power = item.extra.getEnchantLevel(EEnchantment.POWER);
            if(power > 0) tag.putDouble("damage", 61 + power);
            // TODO make punch
            if(item.extra.getEnchantLevel(EEnchantment.FLAME) > 0) tag.putShort("Fire", 100);
        }
        if(flag) tag.putByte("pickup", 2);
        else {
            let slot = actor.getInventorySlot(inventoryArrow);
            actor.setInventorySlot(inventoryArrow, slot.id, slot.count - 1, slot.data, slot.extra);
        }
        Entity.setCompoundTag(arrow, tag);
        Entity.setVelocity(arrow, velocity.x * 1, velocity.y * 1 + 0.2, velocity.z * 1);
        playSound(pos.x, pos.y, pos.z, Entity.getDimension(player), "random.bow", 1, 1 / (rand.nextFloat() * 0.4 + 1.2) + f * 0.5);
    }
}

const summon_arrow_rain = (coords: Vector, region: BlockSource) => {
    for(let i=0; i<35; i++){
        let angle = rand.nextDouble() * 2 * Math.PI,
            dist = rand.nextGaussian() * 0.75,
            x = Math.sin(angle) * dist + coords.x,
            z = Math.cos(angle) * dist + coords.z,
            y = coords.y + 25,
            dangle = rand.nextDouble() * 2 * Math.PI,
            ddist = rand.nextDouble() * 0.35,
            dx = Math.sin(dangle) * ddist,
            dz = Math.cos(dangle) * ddist,
            arrow = region.spawnEntity(x, y, z, EEntityType.ARROW);
        Entity.setSkin(arrow, "entity/heavenarrow");
        Entity.addVelocity(arrow, dx, -(rand.nextDouble() * 1.85 + 0.15), dz);
        Entity.setLookAngle(arrow, 0, 0);
        let tag = Entity.getCompoundTag(arrow);
        tag.putDouble("damage", 60);
        tag.putByte("crit", 1);
        Entity.setCompoundTag(arrow, tag);
    }
}

Item.registerNoTargetUseFunction(ItemID.infinity_bow, (item, player) => {
    BOW_DATA[player] = { timer: 0 };
    Updatable.addUpdatable({
        timer: 0,
        update(){
            if(this.timer == 72000 || !BOW_DATA[player]) this.remove = true;
            this.timer++;
            BOW_DATA[player].timer = this.timer;
        }
    } as any);
});
Item.registerUsingCompleteFunction(ItemID.infinity_bow, (item, player) => {
    if(BOW_DATA[player]) delete BOW_DATA[player];
    infinity_bow_shoot(item, 13, player);
});
Item.registerUsingReleasedFunction(ItemID.infinity_bow, (item, ticks, player) => {
    if(BOW_DATA[player]) delete BOW_DATA[player];
    infinity_bow_shoot(item, ticks, player);
});

Callback.addCallback("ProjectileHit", (projectile, item, target) => {
    if(Entity.getType(projectile) == EEntityType.ARROW){
        let tag = Entity.getCompoundTag(projectile);
        if(tag.contains("AVARITIA_HEAVEN_ARROW") && target.entity == -1 && target.coords != null){
            summon_arrow_rain(target.coords, BlockSource.getDefaultForActor(projectile));
        }
    }
});

IAHelper.itemAnims.infinity_bow = { meta: 0, timer: 0, frameIndex: 0 };
((interval: number, frames: number[]) => {
    let obj = IAHelper.itemAnims.infinity_bow;
    Callback.addCallback("LocalTick", () => {
        if(obj.timer + 1 == interval){
            if(obj.frameIndex < frames.length) obj.frameIndex++;
            else obj.frameIndex = 0;
            obj.meta = frames[obj.frameIndex]
        }
        if(obj.timer < interval) obj.timer++;
        else obj.timer = 0;
    });
})(1, INFINITY_ITEM_FRAMES);

Item.registerIconOverrideFunction(ItemID.infinity_bow, (item) => {
    let name = "infinity_bow_idle";
    // TODO
    return { name: name, data: IAHelper.itemAnims.infinity_bow.meta }
});

AVA_STUFF.push(ItemID.infinity_bow);
cosmic_rarity(ItemID.infinity_bow);
undestroyable_item(ItemID.infinity_bow);