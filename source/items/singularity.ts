namespace Singularity {

    type SingularityData = { id: number, countdata: [number, number] };
    
    export const recipes: {[key: number]: SingularityData} = {};
    export const singularities: number[] = [];

    export function registerRecipeFor(singularity: number, materialId: number, materialCount: number, materialData: number): void {
        if(recipes[materialId]) return Logger.Log(`An error occured while creating singularity recipe. Another recipe has already been registered for the material ${Item.getName(materialId, materialData)}`, "Avaritia WARNING");
        recipes[materialId] = { id: singularity, countdata: [materialCount, materialData] };
    }
    
    export function registerSingularity(key: string, materialId: Nullable<number>, materialCount: Nullable<number>, materialData: Nullable<number>): void {
        if(!FileTools.ReadJSON(`${__dir__}/assets/singularities.json`)[key]) return Logger.Log(`No textures were generated for singularity \'${key}\', please specify two layer colors in \'assets/singularities.json\'`, "Avaritia ERROR");
        const id = `singularity_${key}`;
        IDRegistry.genItemID(id);
        Item.createItem(id, `item.singularity.${key}.name`, {name: id, meta: 0}, {stack: 64});
        IAHelper.makeCommonAnim(ItemID[id], id, 1, 6);
        AVA_STUFF.push(ItemID[id]);
        singularities.push(ItemID[id]);
        if(materialId != null && materialCount != null && materialData != null) registerRecipeFor(ItemID[id], materialId, materialCount, materialData);
    }

}

((args: [string, Nullable<number>, Nullable<number>, Nullable<number>][]) => {
    for(let i in args)
        Singularity.registerSingularity(args[i][0], args[i][1], args[i][2], args[i][3]);
})([
    ["iron", VanillaBlockID.iron_block, 400, 0],
    ["gold", VanillaBlockID.gold_block, 200, 0],
    ["lapis", VanillaBlockID.lapis_block, 200, 0],
    ["redstone", VanillaBlockID.redstone_block, 500, 0],
    ["quartz", VanillaBlockID.quartz_block, 200, 0],
    ["copper", null, null, null],
    ["tin", null, null, null],
    ["lead", null, null, null],
    ["silver", null, null, null],
    ["nickel", null, null, null],
    ["diamond", VanillaBlockID.diamond_block, 300, 0],
    ["emerald", VanillaBlockID.emerald_block, 200, 0],
    ["fluxed", null, null, null],
    ["platinum", null, null, null],
    ["iridium", null, null, null]
]);