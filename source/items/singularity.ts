namespace Singularity {

    type SingularityData = { id: number, countdata: [number, number] };
    
    export const recipes: {[key: number]: SingularityData} = {};
    export const singularities: number[] = [];

    function genTexture(id: string, color1: [number, number, number], color2: [number, number, number]): void {
        TextureWorker.createTextureWithOverlaysModDir({
            bitmap: { width: 16, height: 96 },
            overlays: [
                { path: "assets/texture_source/", name: "singularity_back", color: color1 },
                { path: "assets/texture_source/", name: "singularity_front", color: color2 }
            ],
            result: { path: "assets/animated_items/", name: id }
        });
        IAHelper.convertTexture("assets/animated_items/", id, "assets/items-opaque/", id);
    }

    export function registerRecipeFor(singularity: number, materialId: number, materialCount: number, materialData: number): void {
        if(recipes[materialId]) return Logger.Log(`An error occured while creating singularity recipe. Another recipe has already been registered for the material ${Item.getName(materialId, materialData)}`, "Avaritia WARNING");
        recipes[materialId] = { id: singularity, countdata: [materialCount, materialData] };
    }
    
    export function registerSingularity(key: string, materialId: Nullable<number>, materialCount: Nullable<number>, materialData: Nullable<number>, color1: [number, number, number], color2: [number, number, number]): void {
        const id = `singularity_${key}`;
        genTexture(id, color1, color2);
        IDRegistry.genItemID(id);
        Item.createItem(id, `item.singularity.${key}.name`, {name: id, meta: 0}, {stack: 64});
        // IAHelper.makeCommonAnim(ItemID[id], id, 1, 6);
        AVA_STUFF.push(ItemID[id]);
        singularities.push(ItemID[id]);
        if(materialId != null && materialCount != null && materialData != null) registerRecipeFor(ItemID[id], materialId, materialCount, materialData);
    }

}

((args: [string, Nullable<number>, Nullable<number>, Nullable<number>, string, string][]) => {
    const toRGB = (int: number) => [ (int >> 16) & 255, (int >> 8) & 255, int & 255 ] as [number, number, number];
    for(let i in args){
        let entry = args[i],
            rgb1 = toRGB(android.graphics.Color.parseColor(entry[4])),
            rgb2 = toRGB(android.graphics.Color.parseColor(entry[5]));
        Singularity.registerSingularity(entry[0], entry[1], entry[2], entry[3], rgb1, rgb2)
    }
})([
    ["iron", VanillaBlockID.iron_block, 400, 0, "#e6e7e8", "#7f7f7f"],
    ["gold", VanillaBlockID.gold_block, 200, 0, "#e8ef23", "#dba213"],
    ["lapis", VanillaBlockID.lapis_block, 200, 0, "#5a82e2", "#224baf"],
    ["redstone", VanillaBlockID.redstone_block, 500, 0, "#df0000", "#900000"],
    ["quartz", VanillaBlockID.quartz_block, 200, 0, "#ffffff", "#94867d"],
    ["copper", null, null, null, "#e47200", "#89511a"],
    ["tin", null, null, null, "#a5c7de", "#9ba9b2"],
    ["lead", null, null, null, "#444072", "#3e3d4e"],
    ["silver", null, null, null, "#c0c0c0", "#d5d5d5"],
    ["nickel", null, null, null, "#dee187", "#c4c698"],
    ["diamond", VanillaBlockID.diamond_block, 300, 0, "#45aca5", "#8fcdc9"],
    ["emerald", VanillaBlockID.emerald_block, 200, 0, "#5cbe34", "#8cd170"],
    ["fluxed", null, null, null, "#d62306", "#fffc95"],
    ["platinum", null, null, null, "#00bfff", "#5a82e2"],
    ["iridium", null, null, null, "#e6e6fa", "#e6e6fa"]
]);