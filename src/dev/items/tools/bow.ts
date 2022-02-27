IDRegistry.genItemID("infinity_bow");
Item.createItem("infinity_bow", "item.avaritia:infinity_bow.name", {name: "infinity_bow_idle", meta: 0}, {stack: 1});
Item.setToolRender(ItemID.infinity_bow, true);
Item.setMaxUseDuration(ItemID.infinity_bow, 72000);
Item.setUseAnimation(ItemID.infinity_bow, 4);
Item.setEnchantType(ItemID.infinity_bow, EEnchantType.BOW, 1);

type BowData = { timer: number };
var CURRENT_BOW_ICON_CLIENT_SIDE: number = 0;

namespace InfinityBow {

    export const HEAVEN_ARROWS_TEMP: {[key: number]: boolean} = {};
    // export const HEAVEN_SUBARROWS_TEMP: {[key: number]: boolean} = {};
    
    export function checkArrow(player: number): number {
        const actor = new PlayerActor(player);
        for(let i=0; i<36; ++i)
            if(actor.getInventorySlot(i).id == VanillaItemID.arrow)
                return i;
        return -1;
    }

    export function shoot(item: ItemInstance, ticks: number, player: number): void {
        const region = BlockSource.getDefaultForActor(player);
        const j = 13.0 - ticks;
        let f: number = j / 13.0;
        f = (f * f + f * 2.0) / 3.0;
        if(f < .1) return;
        if(f > 1.0) f = 1.0;
        const pos = Entity.getPosition(player);
        const arrowID = region.spawnEntity(pos.x, pos.y, pos.z, "minecraft", "arrow", "<>");
        const arrow = new EntityArrow(arrowID);
        arrow.setOwner(player);
        const look = Entity.getLookAngle(player);
        arrow.shoot(look.yaw / Math.PI * 180, look.pitch / Math.PI * 180, f * 3.0, 1.0, player);
        if(f == 1.0) arrow.setIsCritical(true);
        if(item.extra != null && item.extra.isEnchanted()) {
            const power = item.extra.getEnchantLevel(EEnchantment.POWER);
            if(power > 0) arrow.setPower(power);
            const punch = item.extra.getEnchantLevel(EEnchantment.PUNCH);
            if(punch > 0) arrow.setKnockbackStrength(punch);
            const flame = item.extra.getEnchantLevel(EEnchantment.FLAME);
            if(flame > 0) arrow.setFire(flame);
        }
        if((item.extra != null &&
            item.extra.isEnchanted() && 
            item.extra.getEnchantLevel(EEnchantment.INFINITY) > 0) || 
            new PlayerActor(player).getGameMode() == 1) {
                arrow.setIsCreative(true);
        }
        playSound(pos.x, pos.y, pos.z, Entity.getDimension(player), "random.bow", 1, 1 / (rand.nextFloat() * 0.4 + 1.2) + f * 0.5);
        HEAVEN_ARROWS_TEMP[arrowID] = true;
    }

    export function barrage(coords: Vector, region: BlockSource, parentArrow: EntityArrow): void {
        for(let i = 0; i < 10; i++) {
            const angle = rand.nextDouble() * 2 * Math.PI;
            const dist = rand.nextGaussian() * .5;
            const x = Math.sin(angle) * dist + coords.x;
            const z = Math.cos(angle) * dist + coords.z;
            const y = coords.y + 25.0;
            const dangle = rand.nextDouble() * 2 + Math.PI;
            const ddist = rand.nextDouble() * .35;
            const dx = Math.sin(dangle) * ddist;
            const dz = Math.cos(dangle) * ddist;
            const entity = region.spawnEntity(x, y, z, "minecraft", "arrow", "<>");
            Entity.setVelocity(entity, dx, -(rand.nextDouble() * 1.85 + .15), dz);
            const arrow = new EntityArrow(entity);
            arrow.setOwner(parentArrow.getOwner());
            arrow.setIsCritical(true);
            arrow.setIsCreative(true);
            // HEAVEN_SUBARROWS_TEMP[entity] = true;
        }
    }

}

Item.registerNoTargetUseFunction(ItemID.infinity_bow, (item, player) => {
    Updatable.addUpdatable({
        timer: 0,
        update(){
            if(this.timer == 72000) this.remove = true;
            this.timer++;
        }
    } as any);
});
Item.registerUsingReleasedFunction(ItemID.infinity_bow, (item, ticks, player) => InfinityBow.shoot(item, Math.min(7200 - ticks, 13), player));

Callback.addCallback("ProjectileHit", (projectile, item, target) => {
    if(Entity.getType(projectile) == EEntityType.ARROW) {
        if(InfinityBow.HEAVEN_ARROWS_TEMP[projectile]) {
            delete InfinityBow.HEAVEN_ARROWS_TEMP[projectile];
            if(target.entity == -1 && target.coords != null)
                InfinityBow.barrage(target.coords, BlockSource.getDefaultForActor(projectile), new EntityArrow(projectile));
            //else if(target.entity != -1 && target.coords == null)
                //Entity.damageEntity(target.entity, 20, 0, { attacker: projectile, bool1: false });
        }// else if(InfinityBow.HEAVEN_SUBARROWS_TEMP[projectile] && target.entity != -1 && target.coords == null) {
            //Entity.damageEntity(target.entity, 20, 0, { attacker: projectile, bool1: false });
       // }
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
    if(AvaritiaFuncs.nativeIsPlayerUsingItem()) {
        const progress = Math.min(72000 - new PlayerActor(Player.get()).getItemUseDuration(), 13) / 13;
        const meta = Math.max(Math.floor(progress * 3) - 1, 0);
        name = `infinity_bow_pull_${meta}`;
    }
    return { name: name, data: IAHelper.itemAnims.infinity_bow.meta }
});

AVA_STUFF.push(ItemID.infinity_bow);
Rarity.cosmic(ItemID.infinity_bow);
AvaritiaFuncs.nativeSetUndestroyableItem(ItemID.infinity_bow);