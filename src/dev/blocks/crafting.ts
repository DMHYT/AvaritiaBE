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

    export const workbench_obj = new (class extends RecipeTE.Workbench<string> {
        public _recipes: RecipeTE.Recipe<string>[];
        constructor() { super({ columns: 9, rows: 9 }) }
    })();

    const checkIfRecipeNameDoesNotExist = (recipeName: string) => { if(workbench_obj._recipes.findIndex(recipe => recipe.data == recipeName) !== -1) throw new java.lang.IllegalArgumentException(`Extreme crafting recipe with name ${recipeName} already exists, skipping...`); }

    export function addShaped(recipeName: string, result: ItemInstance, mask: string[], keys: (string | number)[], func?: RecipeTE.CraftFunction): void {
        checkIfRecipeNameDoesNotExist(recipeName);
        if(keys.length % 3 != 0) throw new java.lang.IllegalArgumentException("Key array in extreme crafting table shaped recipe must be like [char, number, number, ...]");
        const ingredients: RecipeTE.IngredientsList = {};
        for(let i=0; i<keys.length; i+=3) {
            if(typeof keys[i] === "string" && typeof keys[i + 1] === "number" && typeof keys[i + 2] === "number")
                ingredients[keys[i]] = {id: keys[i + 1] as number, data: keys[i + 2] as number};
            else throw new java.lang.IllegalArgumentException();
        }
        workbench_obj.addShapeRecipe(result, mask, ingredients, recipeName, func);
    }

    export function addShapeless(recipeName: string, result: ItemInstance, items: [number, number][], func?: RecipeTE.CraftFunction): void {
        checkIfRecipeNameDoesNotExist(recipeName);
        if(items.length > 81) throw new java.lang.IllegalArgumentException("Extreme crafting table has only 81 slots!");
        const counts: {[key: string]: number} = {};
        items.forEach(element => {
            const key = `${element[0]}:${element[1]}`;
            if(!counts[key]) counts[key] = 1; else counts[key]++;
        });
        const uniqueIngredients: RecipeTE.RecipeItem[] = [];
        for(let key in counts) {
            const count = counts[key];
            const iddata = key.split(":");
            const id = parseInt(iddata[0]);
            const data = parseInt(iddata[1]);
            uniqueIngredients.push({ id, count, data });
        }
        workbench_obj.addRecipe(result, uniqueIngredients, recipeName, func);
    }

    export function remove(recipeName: string): void {
        const index = workbench_obj._recipes.findIndex(recipe => recipe.data == recipeName);
        if(index !== -1) workbench_obj._recipes.splice(index, 1);
    }

    export function getAllSeparately(): { shaped: RecipePattern[], shapeless: RecipePattern[] } {
        const all = { shaped: [] as RecipePattern[], shapeless: [] as RecipePattern[] };
        workbench_obj._recipes.forEach(recinst => {
            const output = { id: recinst.result.id, count: recinst.result.count, data: recinst.result.data } as ItemInstance;
            isGivenRecipeShapeless(recinst) ? 
            all.shapeless.push({
                output: [ output ],
                input: getListForShapelessRecipe(recinst)
            }) : all.shaped.push({
                output: [ output ],
                input: getListForShapedRecipe(recinst)
            });
        });
        return all;
    }

    function isGivenRecipeShapeless(recipe: RecipeTE.Recipe): boolean {
        for(let key in recipe.ingredients) {
            if(key.length > 1) return true;
        } return false;
    }

    function getListForShapelessRecipe(recipe: RecipeTE.Recipe): ItemInstance[] {
        const items = [] as ItemInstance[];
        for(let key in recipe.ingredients) {
            const ingr = recipe.ingredients[key];
            const data = parseInt(key.split(":")[1]);
            for(let i = 0; i < ingr.count; ++i) {
                items.push({ id: ingr.id, count: 1, data });
            }
        }
        return items;
    }

    function getListForShapedRecipe(recipe: RecipeTE.Recipe): ItemInstance[] {
        const items = [] as ItemInstance[];
        [ ...recipe.mask ]
            .map(str => str.length < 9 ? `${str}${" ".repeat(9).substr(str.length)}` : str)
            .forEach(str => {
                for(let j = 0; j < str.length; j++) {
                    const ingredient = recipe.ingredients[str[j]];
                    if(ingredient) items.push({ id: ingredient.id, count: 1, data: ingredient.data ?? -1 });
                    else items.push({ id: 0, count: 0, data: 0 });
                }
            });
        return items;
    }

}

const GUI_EXTREME_CRAFTING = new UI.Window({
    location: { width: 1000, height: UI.getScreenHeight(), x: 0, y: 0, scrollX: 1000, scrollY: 600 },
    drawing: [
        {type: "background", color: Color.argb(90, 0, 0, 0)},
        {type: "bitmap", x: 262, y: 40, scale: 2, bitmap: "avaritia.extreme_crafting"}
    ],
    elements: (() => {
        const elements = {
            textHeader: {type: "text", x: 500, y: 0, font: { alignment: UI.Font.ALIGN_CENTER }, text: Translation.translate("tile.avaritia:extreme_crafting_table.name")},
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