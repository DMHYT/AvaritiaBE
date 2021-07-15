IDRegistry.genItemID("endest_pearl");
Item.createThrowableItem("endest_pearl", "item.avaritia:endest_pearl.name", {name: "endest_pearl", meta: 0}, {stack: 64});
Item.registerNameOverrideFunction(ItemID.endest_pearl, (item, name) => `${EColor.AQUA}${name}`);

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

}

const summon_gaping_void = (coords: Vector, region: BlockSource) => {


    // const render = new Render();
    // render.getPart("head").addPart("gaping_void");
    // const mesh = new RenderMesh();
    // mesh.importFromFile("GapingVoid.obj", "obj", null);
    // render.getPart("gaping_void").setMesh(mesh);
}

Item.registerThrowableFunction(ItemID.endest_pearl, (proj, item, target) => {
    const coords = target.coords ?? Entity.getPosition(target.entity);
    summon_gaping_void(coords, BlockSource.getDefaultForActor(proj));
    Entity.remove(proj);
});

IAHelper.makeAdvancedAnim(ItemID.endest_pearl, "endest_pearl", 1, [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 4, 3, 3, 2, 1, 1]);

AVA_STUFF.push(ItemID.endest_pearl);