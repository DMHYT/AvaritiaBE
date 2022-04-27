namespace Gregorizer {

    export var modifier: number = 0;
    export var multiplier: number = 1;

    export function balance(): void {
        __loaded_mods.Thaumcraft && (modifier += 100);
        (__loaded_mods.TConstruct || __loaded_mods.HydCraft) && (modifier += 100);
        (__loaded_mods.ThermalExpansion || __loaded_mods.TSteelworks || __loaded_mods.IC2 || __loaded_mods.ThaumicTinkerer) && (modifier += 300);
        __loaded_mods.technom && (modifier += 600);
        __loaded_mods.magicalcrops && multiplier++;
        __loaded_mods.AgriCraft && multiplier++;
        __loaded_mods.MineFactoryReloaded && (multiplier += 9);
        __loaded_mods.BigReactors && (modifier += 100);
        __loaded_mods.EE3 && multiplier++;
        __loaded_mods.ProjectE && (multiplier += 3);
        __loaded_mods.Botania && (modifier += 50);
        __loaded_mods.ExtraUtilities && (modifier += 500);
        __loaded_mods.appliedenergistics2 && (modifier += 200);
        __loaded_mods.ImmersiveEngineering && (modifier += 300);
        __loaded_mods.Mekanism && (modifier += 500, multiplier++);
        __loaded_mods.Torcherino && (multiplier += 2);
        __loaded_mods.DraconicEvolution && (modifier += 300, multiplier++);
        if(debug_enabled) {
            const mods = Object.keys(__loaded_mods).filter(val => __loaded_mods[val]).length;
            Logger.Log(`Successfully performed Gregorizer.balance(), it has found ${mods} mods, that change quantity modifying values, and now modifier is ${modifier} and multiplier is ${multiplier}.`, "AVARITIA DEBUG");
        }
    }

    export function balanceCost(cost: number): number {
        return (cost + modifier) * multiplier;
    }

}

namespace Singularity {

    type SingularityData = { id: number, countdata: [number, number], specific: boolean };
    
    export const recipes: {[key: number]: SingularityData} = {};
    export const singularities: number[] = [];

    export function registerRecipeFor(singularity: number, materialId: number, materialCount: number, materialData: number, specific: boolean): void {
        if(recipes[materialId]) return debug_enabled && Logger.Log(`An error occured while creating singularity recipe. Another recipe has already been registered for the material ${Item.getName(materialId, materialData)}`, "AVARITIA WARNING");
        recipes[materialId] = { id: singularity, countdata: [materialCount, materialData], specific };
    }

    export const removeRecipeFor = (materialId: number) => recipes[materialId] && delete recipes[materialId];
    
    export function registerSingularity(key: string, materialId: Nullable<number>, materialCount: Nullable<number>, materialData: Nullable<number>): void {
        if(!FileTools.ReadJSON(`${__dir__}/resources/res/singularities.json`)[key]) return debug_enabled && Logger.Log(`No textures were generated for singularity \'${key}\', please specify two layer colors in \'resources/res/singularities.json\'`, "AVARITIA ERROR");
        const id = `singularity_${key}`;
        IDRegistry.genItemID(id);
        Item.createItem(id, `item.singularity.${key}.name`, {name: id, meta: 0}, {stack: 64});
        IAHelper.makeCommonAnim(ItemID[id], id, 1, 6);
        AVA_STUFF.push(ItemID[id]);
        singularities.push(ItemID[id]);
        materialId != null && materialCount != null && materialData != null &&
        registerRecipeFor(ItemID[id], materialId, materialCount, materialData, false);
    }
    
    export function isValidMaterial(id: number, data: number): boolean {
        return typeof recipes[id] !== "undefined" && (recipes[id].countdata[1] == data || recipes[id].countdata[1] == -1);
    }

    export function getRecipeResult(id: number): number {
        return recipes[id]?.id;
    }

    export function getRequiredMaterialCount(id: number): number {
        return recipes[id]?.countdata[0];
    }

    export function getRequiredMaterialData(id: number): number {
        return recipes[id]?.countdata[1];
    }

    export function getMaterialForSingularity(id: number): number {
        for(let key in recipes) {
            if(recipes[key].id == id) {
                debug_enabled && Logger.Log(`Found material ${Item.getName(parseInt(key), 0)} for singularity ${Item.getName(id, 0)}`, "AVARITIA DEBUG");
                return parseInt(key);
            } else {
                debug_enabled && Logger.Log(`Material for singularity ${Item.getName(id, 0)} was not found`, "AVARITIA ERROR");
            }
        }
        return -1;
    }

}

([
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
] as [string, Nullable<number>, Nullable<number>, Nullable<number>][])
.forEach(element => Singularity.registerSingularity(...element));