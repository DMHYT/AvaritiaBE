IDRegistry.genItemID("endest_pearl");
Item.createThrowableItem("endest_pearl", "item.avaritia:endest_pearl.name", {name: "endest_pearl", meta: 0}, {stack: 16});
Rarity.rare(ItemID.endest_pearl);

namespace GapingVoid {

    export const maxLifetime = 186;
    export const collapse = .95;
    export const suckRange = 20.0;

    export function SUCK_PREDICATE(input: number): boolean {
        if(!Entity.isExist(input)) return false;
        if(Entity.getType(input) == EEntityType.PLAYER) {
            return new PlayerActor(input).getGameMode() != 1;
        } else return true;
    }

    export function OMNOM_PREDICATE(input: number): boolean {
        if(!Entity.isExist(input)) return false;
        if(Entity.getType(input) == EEntityType.PLAYER) {
            return new PlayerActor(input).getGameMode() != 1;
        } else if(Entity.getType(input) == EEntityType.ITEM) {
            return !~INFINITY_TOOLS.indexOf(Entity.getDroppedItem(input).id);
        } else return true;
    }

    export function summonServerSide(coords: Vector, region: BlockSource): void {
        let age = 0;
        Updatable.addUpdatable({
            update() {
                if(age >= maxLifetime) {
                    region.explode(coords.x, coords.y, coords.z, 6, true);
                    this.remove = true;
                } else if(age == 0) {
                    playSound(coords.x, coords.y, coords.z, region.getDimension(), "mob.endermen.stare", 8, 1);
                }
                age++;
                const pos = new Vector3(coords.x, coords.y, coords.z);
                let aabb = new Cuboid6().add(pos).expandXYZ(suckRange).aabb();
                const radius = getVoidScale(age) * .5;
                region.listEntitiesInAABB(aabb[0], aabb[1], aabb[2], aabb[3], aabb[4], aabb[5], -1, true)
                    .filter(SUCK_PREDICATE)
                    .forEach(suckee => {
                        const suckeePos = Entity.getPosition(suckee);
                        const dx = coords.x - suckeePos.x;
                        const dy = coords.y - suckeePos.y;
                        const dz = coords.z - suckeePos.z;
                        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
                        const lenn = len / suckRange;
                        if(len <= suckRange) {
                            const strength = Math.pow(1 - lenn, 2);
                            const power = .075 * radius;
                            Entity.addVelocity(suckee, 
                                (dx / len) * strength * power,
                                (dy / len) * strength * power,
                                (dz / len) * strength * power);
                        }
                    });
                const nomrange = radius * .95;
                aabb = new Cuboid6().add(pos).expandXYZ(nomrange).aabb();
                region.listEntitiesInAABB(aabb[0], aabb[1], aabb[2], aabb[3], aabb[4], aabb[5], -1, true)
                    .filter(OMNOM_PREDICATE)
                    .forEach(nommee => {
                        const nomedPos = Vector3.fromEntity(nommee);
                        const len = pos.copy().subtract(nomedPos.x, nomedPos.y, nomedPos.z).mag();
                        if(len <= nomrange) {
                            Entity.damageEntity(nommee, 3, 12);
                        }
                    });
                if(age % 10 == 0) {
                    const posFloor = pos.copy().floor();
                    const blockrange = Math.round(nomrange);
                    for(let y = -blockrange; y <= blockrange; y++) {
                        for(let z = -blockrange; z <= blockrange; z++) {
                            for(let x = -blockrange; x <= blockrange; x++) {
                                const pos2 = new Vector3(x, y, z);
                                const rPos = posFloor.copy().add(pos2.x, pos2.y, pos2.z);
                                if(rPos.y < 0 || rPos.y > 255) continue;
                                const dist = pos2.mag();
                                const bid = region.getBlockId(rPos.x, rPos.y, rPos.z);
                                if(dist <= nomrange && bid != 0) {
                                    if(Block.getExplosionResistance(bid) <= 10) {
                                        region.destroyBlock(rPos.x, rPos.y, rPos.z, Math.random() <= .9);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    export function summonClientSide(coords: Vector): void {
        const particlespeed = 10;
        const mesh = new RenderMesh();
        mesh.importFromFile(`${__dir__}/resources/res/models/gaping_void.obj`, "obj", null);
        const anim = new Animation.Base(coords.x, coords.y, coords.z);
        anim.describe({ mesh: mesh, material: "avaritia_coloring", skin: "render/pixel.png" });
        let age = 0;
        anim.loadCustom(() => {
            if(age >= maxLifetime){
                anim.destroy();
                this.remove = true;
                return;
            }
            age++;
            const scale = getVoidScale(age) * 0.06 - 0.2;
            const size = getVoidScale(age) * 0.5 - 0.2;
            for(let i = 0; i < VOID_PARTICLES_PER_TICK; i++){
                const particlePos = new Vector3(coords.x, coords.y, coords.z + size)
                    .rotate(rand.nextFloat() * 180.0, new Vector3(0, 1, 0))
                    .rotate(rand.nextFloat() * 360.0, new Vector3(1, 0, 0));
                const velocity = particlePos.copy().normalize().multiplyXYZ(particlespeed);
                Particles.addParticle(EParticleType.PORTAL, particlePos.x, particlePos.y, particlePos.z, velocity.x, velocity.y, velocity.z);
            }
            anim.transform()
                .lock()
                .clear()
                .scale(scale, scale, scale)
                .unlock();
            const color = getVoidColor(age, 1);
            anim.getShaderUniforms()
                .setUniformValue("Avaritia", "COLOR_R", color[0])
                .setUniformValue("Avaritia", "COLOR_G", color[1])
                .setUniformValue("Avaritia", "COLOR_B", color[2]);
            anim.refresh();
        });
        anim.setIgnoreLightMode();
        anim.setInterpolationEnabled(true);
        const initial_scale = getVoidScale(0);
        anim.transform()
            .lock()
            .clear()
            .scale(initial_scale, initial_scale, initial_scale)
            .unlock();
        const initial_color = getVoidColor(0, 1);
        anim.getShaderUniforms()
            .setUniformValue("Avaritia", "COLOR_R", initial_color[0])
            .setUniformValue("Avaritia", "COLOR_G", initial_color[1])
            .setUniformValue("Avaritia", "COLOR_B", initial_color[2])
    }

    export function getVoidScale(age: number): number {
        const life = age / maxLifetime;
        let curve: number;
        if(life < collapse) curve = .005 + ease(1 - ((collapse - life) / collapse)) * .995;
        else curve = ease(1 - ((life - collapse) / (1 - collapse)));
        return 10.0 * curve;
    }

    function ease(d: number): number {
        const t = d - 1;
        return Math.sqrt(1 - t * t);
    }

    export function getVoidColor(age: number, alpha: number): [number, number, number, number] {
        const life = age / maxLifetime;
        let f = Math.max(0, (life - collapse) / (1 - collapse));
        f = Math.round(Math.max(f, 1 - (life * 30)));
        return [f, f, f, Math.round(alpha)];
    }

}

Network.addClientPacket("avaritia.gapingvoidclient", (data: { coords: Vector }) => GapingVoid.summonClientSide(data.coords));

const summon_gaping_void = (coords: Vector, region: BlockSource) => {
    GapingVoid.summonServerSide(coords, region);
    const iter = new NetworkConnectedClientList()
        .setupDistancePolicy(coords.x, coords.y, coords.z, region.getDimension(), MAX_GAPING_VOID_VIEW_DISTANCE)
        .iterator();
    while(iter.hasNext())
        iter.next().send("avaritia.gapingvoidclient", { coords });
}

Item.registerThrowableFunction(ItemID.endest_pearl, (proj, item, target) => {
    const coords = target.coords ?? Entity.getPosition(target.entity);
    summon_gaping_void(coords, BlockSource.getDefaultForActor(proj));
    Entity.remove(proj);
});

IAHelper.makeAdvancedAnim(ItemID.endest_pearl, "endest_pearl", 1, [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 4, 3, 3, 2, 1, 1]);

AVA_STUFF.push(ItemID.endest_pearl);