IDRegistry.genBlockID("compressed_crafting_table");
IDRegistry.genBlockID("double_compressed_crafting_table");
IDRegistry.genBlockID("extreme_crafting_table");

Block.createBlock("compressed_crafting_table", [{name: "tile.avaritia:compressed_crafting_table.name", texture: [["compressed_crafting_table", 0]], inCreative: true}], {destroytime: 4, sound: "wood"});
Block.createBlock("double_compressed_crafting_table", [{name: "tile.avaritia:double_compressed_crafting_table.name", texture: [["double_compressed_crafting_table", 0]], inCreative: true}], {destroytime: 20, sound: "wood"});
Block.createBlock("extreme_crafting_table", [{name: "tile.avaritia:extreme_crafting_table.name", texture: [["extreme_crafting_table_side", 0], ["extreme_crafting_table_top", 0], ["extreme_crafting_table_side", 0]], inCreative: true}], {destroytime: 50, explosionres: 2000, sound: "glass"});

ToolAPI.registerBlockMaterial(BlockID.compressed_crafting_table, "wood", 0, false);
ToolAPI.registerBlockMaterial(BlockID.double_compressed_crafting_table, "wood", 1, false);
ToolAPI.registerBlockMaterial(BlockID.extreme_crafting_table, "stone", 3, false);

AVA_STUFF.push(BlockID.compressed_crafting_table, BlockID.double_compressed_crafting_table, BlockID.extreme_crafting_table);

Callback.addCallback("PostLoaded", () => {
    addShaped(BlockID.compressed_crafting_table, 1, 0, ["ttt", "ttt", "ttt"], ['t', VanillaBlockID.crafting_table, 0]);
    addShaped(BlockID.double_compressed_crafting_table, 1, 0, ["ttt", "ttt", "ttt"], ['t', BlockID.compressed_crafting_table, 0]);
    addShaped(BlockID.extreme_crafting_table, 1, 0, ["iii", "iti", "iii"], ['i', ItemID.crystal_matrix_ingot, 0, 't', BlockID.double_compressed_crafting_table, 0]);
    addShapeless(VanillaBlockID.crafting_table, 9, 0, [[BlockID.compressed_crafting_table, 0]]);
    addShapeless(BlockID.compressed_crafting_table, 9, 0, [[BlockID.double_compressed_crafting_table, 0]]);
});

namespace ExtremeCraftingTable {

    class ExtremeRecipeTE extends RecipeTE.Workbench {
        public _recipes: RecipeTE.Recipe<any>[];
        constructor() {
            super({columns: 9, rows: 9});
        }
    }

    export const workbench_obj = new ExtremeRecipeTE();

    export function addShaped(result: ItemInstance, mask: string[], keys: (string | number)[], func?: RecipeTE.CraftFunction) {
        if(keys.length % 3 != 0) throw new java.lang.IllegalArgumentException("Key array in extreme crafting table shaped recipe must be like [char, number, number, ...]");
        const ingredients: RecipeTE.IngredientsList = {};
        for(let i=0; i<keys.length; i+=3){
            if(typeof keys[i] === "string" && typeof keys[i + 1] === "number" && typeof keys[i + 2] === "number")
                ingredients[keys[i]] = {id: keys[i + 1] as number, data: keys[i + 2] as number};
            else throw new java.lang.IllegalArgumentException();
        }
        workbench_obj.addShapeRecipe(result, mask, ingredients, null, func);
    }

    export function addShapeless(result: ItemInstance, items: [number, number][], func?: RecipeTE.CraftFunction) {
        if(items.length > 81) throw new java.lang.IllegalArgumentException("Extreme crafting table has only 81 slots!");
        const ingredients: RecipeTE.RecipeItem[] = items.map(val => { return { id: val[0], data: val[1] } });
        workbench_obj.addRecipe(result, ingredients, null, func);
    }

    export function getAllSeparately(): {shaped: RecipePattern[], shapeless: RecipePattern[]} {
        const all = { shaped: [] as RecipePattern[], shapeless: [] as RecipePattern[] };
        for(let i in workbench_obj._recipes) {
            const recinst = workbench_obj._recipes[i];
            const output = { id: recinst.result.id, count: recinst.result.count ?? 1, data: recinst.result.data ?? -1 } as ItemInstance;
            isGivenRecipeShapeless(recinst) ? 
            all.shaped.push({
                output: [ output ],
                input: getListForShapelessRecipe(recinst)
            }) : all.shaped.push({
                output: [ output ],
                input: getListForShapedRecipe(recinst)
            });
        }
        return all;
    }

    function isGivenRecipeShapeless(recipe: RecipeTE.Recipe): boolean {
        for(let key in recipe.ingredients) {
            if(key.length > 1) return true;
        } return false;
    }

    function getListForShapelessRecipe(recipe: RecipeTE.Recipe): ItemInstance[] {
        const items = [] as ItemInstance[];
        for(let key in recipe.ingredients) 
            for(let i=0; i<recipe.ingredients[key].count; i++) 
                items.push({ id: recipe.ingredients[key].id, count: 1, data: recipe.ingredients[key].data ?? -1 });
        return items;
    }

    function getListForShapedRecipe(recipe: RecipeTE.Recipe): ItemInstance[] {
        const items = [] as ItemInstance[];
        const mask = [ ...recipe.mask ].map((str) => str.length < 9 ? `${str}${"         ".substr(str.length)}` : str);
        for(let i in mask)
            for(let j=0; j<mask[i].length; j++) {
                const ingredient = recipe.ingredients[mask[i][j]];
                if(ingredient) items.push({ id: ingredient.id, count: 1, data: ingredient.data ?? -1 });
                else items.push({ id: 0, count: 0, data: 0 });
            }
        return items;
    }

}

const GUI_EXTREME_CRAFTING = new UI.Window({
    location: { width: 1000, height: 600, x: 0, y: 0, scrollX: 1000, scrollY: UI.getScreenHeight() },
    drawing: [
        {type: "background", color: android.graphics.Color.argb(90, 0, 0, 0)},
        {type: "bitmap", x: 262, y: 40, scale: 2, bitmap: "avaritia.extreme_crafting"}
    ],
    elements: (() => {
        const elements = {
            textHeader: {type: "text", x: 500, y: 20, font: { alignment: UI.Font.ALIGN_CENTER }, text: Translation.translate("tile.avaritia:extreme_crafting_table.name")},
            slotResult: {type: "slot", x: 680, y: 198, size: 36, isValid: () => false, visual: false, bitmap: "_default_slot_empty", isTransparentBackground: true},
            close: {type: "closeButton", x: 697, y: 51, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 2}
        } as UI.ElementSet;
        for(let i=0; i<81; i++) elements[`slotInput${i}`] = {type: "slot", x: 284 + (i % 9) * 36, y: 54 + Math.floor(i / 9) * 36, size: 36, visual: false};
        for(let i=9; i<36; i++) elements[`slotInv${i}`] = {type: "invSlot", x: 338 + (i % 9) * 36, y: 386 + Math.floor((i - 9) / 9) * 36, size: 36, index: i};
        for(let i=0; i<9; i++) elements[`slotInv${i}`] = {type: "invSlot", x: 338 + i * 36, y: 502, size: 36, index: i};
        return elements;
    })()
});
GUI_EXTREME_CRAFTING.setInventoryNeeded(true);
GUI_EXTREME_CRAFTING.setCloseOnBackPressed(true);

class TileExtremeCraftingTable extends RecipeTE.WorkbenchTileEntity {
    public getScreenName() { return "main" };
    public getScreenByName() { return GUI_EXTREME_CRAFTING };
    public getInputSlots() { return "slotInput" };
    public getOutputSlot() { return "slotResult" };
}

TileEntity.registerPrototype(BlockID.extreme_crafting_table, new TileExtremeCraftingTable(ExtremeCraftingTable.workbench_obj));