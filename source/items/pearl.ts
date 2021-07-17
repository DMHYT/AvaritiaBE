IDRegistry.genItemID("endest_pearl");
Item.createThrowableItem("endest_pearl", "item.avaritia:endest_pearl.name", {name: "endest_pearl", meta: 0}, {stack: 16});
Rarity.rare(ItemID.endest_pearl);

type GapingVoidParticlesPacket = { size: number, x: number, y: number, z: number };
Network.addClientPacket("avaritia.gapingvoidparticles", (data: GapingVoidParticlesPacket) => {
    const particlespeed = 4.5;
    for(let i=0; i<50; i++){
        const particlePos = new Vector3(0, 0, data.size)
            .rotate(rand.nextFloat() * 180.0, new Vector3(0, 1, 0))
            .rotate(rand.nextFloat() * 360.0, new Vector3(1, 0, 0));
        const velocity = particlePos.copy().normalize().multiplyXYZ(particlespeed);
        particlePos.add(data.x, data.y, data.z);
        Particles.addParticle(EParticleType.PORTAL, particlePos.x, particlePos.y, particlePos.z, velocity.x, velocity.y, velocity.z);
    }
});
namespace GapingVoid {

    export const maxLifetime = 186;
    export const collapse = .95;
    export const suckRange = 20.0;
    
    export const SUCK_PREDICATE = (input: number) => {
        if(!Entity.isExist(input)) return false;
        if(Entity.getType(input) == EEntityType.PLAYER){
            if(new PlayerActor(input).getGameMode() == 1) return false;
        }
        return true;
    }

    export const OMNOM_PREDICATE = (input: number) => {
        if(!Entity.isExist(input)) return false;
        if(Entity.getType(input) == EEntityType.PLAYER){
            if(new PlayerActor(input).getGameMode() == 1) return false;
        } else if(Entity.getType(input) == EEntityType.ITEM && !!~INFINITY_TOOLS.indexOf(Entity.getDroppedItem(input).id)) return false;
        return true;
    }

    export function summonServerSide(coords: Vector, region: BlockSource): void {
        Updatable.addUpdatable({
            age: 0,
            update(){
                if(this.age >= maxLifetime){
                    region.explode(coords.x, coords.y, coords.z, 6, true);
                    this.remove = true;
                } else if(this.age == 0)
                    playSound(coords.x, coords.y, coords.z, region.getDimension(), "mob.endermen.stare", 8, 1);
                this.age++;
                const pos = new Vector3(coords.x, coords.y, coords.z);
                const size = getVoidScale(this.age) * 0.5 - 0.2;
                new NetworkConnectedClientList()
                    .setupDistancePolicy(coords.x, coords.y, coords.z, region.getDimension(), 64)
                    .send("avaritia.gapingvoidparticles", { ...coords, size: size } as GapingVoidParticlesPacket);
                let aabb = new Cuboid6().add(pos).expandXYZ(suckRange).aabb();
                const sucked = filterArray<number>(region.listEntitiesInAABB(aabb[0], aabb[1], aabb[2], aabb[3], aabb[4], aabb[5], -1, true), SUCK_PREDICATE);
                const radius = getVoidScale(this.age) * 0.5;
                for(let i in sucked){
                    const suckee = sucked[i];
                    const suckeePos = Entity.getPosition(suckee);
                    const dx = coords.x - suckeePos.x;
                    const dy = coords.y - suckeePos.y;
                    const dz = coords.z - suckeePos.z;
                    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    const lenn = len / suckRange;
                    if(len <= suckRange){
                        const strength = Math.pow(1 - lenn, 2);
                        const power = .075 * radius;
                        Entity.addVelocity(suckee, 
                            (dx / len) * strength * power,
                            (dy / len) * strength * power,
                            (dz / len) * strength * power);
                    }
                }
                const nomrange = radius * .95;
                aabb = new Cuboid6().add(pos).expandXYZ(nomrange).aabb();
                const nommed = filterArray<number>(region.listEntitiesInAABB(aabb[0], aabb[1], aabb[2], aabb[3], aabb[4], aabb[5], -1, true), OMNOM_PREDICATE);
                for(let i in nommed){
                    const nommee = nommed[i];
                    const nomedPos = Vector3.fromEntity(nommee);
                    const len = pos.copy().subtract(nomedPos.x, nomedPos.y, nomedPos.z).mag();
                    if(len <= nomrange)
                        Entity.damageEntity(nommee, 3, 12); // 12 - void damage
                }
                if(this.age % 10 == 0){
                    const posFloor = pos.copy().floor();
                    const blockrange = Math.round(nomrange);
                    for(let y = -blockrange; y <= blockrange; y++)
                        for(let z = -blockrange; z <= blockrange; z++)
                            for(let x = -blockrange; x <= blockrange; x++){
                                const pos2 = new Vector3(x, y, z);
                                const rPos = posFloor.copy().add(pos2.x, pos2.y, pos2.z);
                                if(rPos.y < 0 || rPos.y > 255) continue;
                                const dist = pos2.mag();
                                const bid = region.getBlockId(rPos.x, rPos.y, rPos.z);
                                if(dist <= nomrange && bid != 0){
                                    if(Block.getExplosionResistance(bid) <= 10)
                                        region.destroyBlock(rPos.x, rPos.y, rPos.z, Math.random() <= .9);
                                }
                            }
                }
            }
        } as any);
    }

    export function summonClientSide(coords: Vector, region: BlockSource): void {
        const particlespeed = 4.5;
        runOnClientThread(() => {
            const mesh = new RenderMesh();
            mesh.importFromFile(`${__dir__}/assets/models/gaping_void.obj`, "obj", null);
            mesh.setColor( ...getVoidColor(0, 1) );
            const anim = new Animation.Base(coords.x, coords.y, coords.z);
            anim.describe({ mesh: mesh });
            let age = 0;
            anim.loadCustom(() => {
                if(age >= maxLifetime){
                    anim.destroy();
                    this.remove = true;
                    return;
                }
                age++;
                const scale = getVoidScale(age);
                for(let i = 0; i < __config__.getNumber("void_particles_per_tick").intValue(); i++){
                    const particlePos = new Vector3(0, 0, scale * 0.5 - 0.2)
                        .rotate(rand.nextFloat() * 180.0, new Vector3(0, 1, 0))
                        .rotate(rand.nextFloat() * 360.0, new Vector3(1, 0, 0));
                    const velocity = particlePos.copy().normalize().multiplyXYZ(particlespeed);
                    Particles.addParticle(Native.ParticleType.portal, particlePos.x, particlePos.y, particlePos.z, -velocity.x, -velocity.y, -velocity.z);
                }
                // const fullfadedist = .6 * scale;
                // const fadedist = fullfadedist + 1.5;
                mesh.scale(scale, scale, scale);
                mesh.setColor( ...getVoidColor(age, 1) );
                anim.describe({ mesh: mesh });
                anim.refresh();
            });
        });
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
        f = Math.max(f, 1 - (life * 30));
        f = Math.round(f * 255);
        return [f, f, f, Math.round(alpha * 255)];
    }

}

type GapingVoidClientPacket = { coords: Vector, dimension: number };
Network.addClientPacket("avaritia.gapingvoidclient", (data: GapingVoidClientPacket) => {
    GapingVoid.summonClientSide(data.coords, BlockSource.getDefaultForDimension(data.dimension)); 
});

const summon_gaping_void = (coords: Vector, region: BlockSource) => {
    GapingVoid.summonServerSide(coords, region);
    const iter = new NetworkConnectedClientList()
        .setupDistancePolicy(coords.x, coords.y, coords.z, region.getDimension(), __config__.getNumber("max_gaping_void_view_distance").intValue())
        .iterator();
    while(iter.hasNext())
        iter.next().send("avaritia.gapingvoidclient", { coords: coords, dimension: region.getDimension() } as GapingVoidClientPacket);
}

Item.registerThrowableFunction(ItemID.endest_pearl, (proj, item, target) => {
    const coords = target.coords ?? Entity.getPosition(target.entity);
    summon_gaping_void(coords, BlockSource.getDefaultForActor(proj));
    Entity.remove(proj);
});

IAHelper.makeAdvancedAnim(ItemID.endest_pearl, "endest_pearl", 1, [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 4, 3, 3, 2, 1, 1]);

AVA_STUFF.push(ItemID.endest_pearl);