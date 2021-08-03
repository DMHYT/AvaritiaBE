IDRegistry.genBlockID("compressed_crafting_table");
IDRegistry.genBlockID("double_compressed_crafting_table");
IDRegistry.genBlockID("extreme_crafting_table");

Block.createBlock("compressed_crafting_table", [{name: "tile.avaritia.compressed_crafting_table.name", texture: [["compressed_crafting_table", 0]], inCreative: true}], {destroytime: 4, sound: "wood"});
Block.createBlock("double_compressed_crafting_table", [{name: "tile.avaritia.double_compressed_crafting_table.name", texture: [["double_compressed_crafting_table", 0]], inCreative: true}], {destroytime: 20, sound: "wood"});
Block.createBlock("extreme_crafting_table", [{name: "tile.extreme_crafting_table.name", texture: [["extreme_crafting_table_side", 0], ["extreme_crafting_table_top", 0], ["extreme_crafting_table_side", 0]], inCreative: true}], {destroytime: 50, explosionres: 2000, sound: "glass"});

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

    export const workbench_obj = new RecipeTE.Workbench({columns: 9, rows: 9});

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

}

/**
 * WIDTH - 404.6
 * HEIGHT - 435.2
 */
const GUI_EXTREME_CRAFTING = new UI.Window({
    location: { width: 1000, height: UI.getScreenHeight(), x: 0, y: 0 },
    drawing: [
        {type: "background", color: android.graphics.Color.argb(90, 0, 0, 0)},
        {type: "bitmap", x: 297.7 /* + 0.5 + 0.2 */, y: 12.4 /* + 0.5 - 0.1 */, scale: 1.7, bitmap: "avaritia.extreme_crafting"}
    ],
    elements: (() => {
        const elements = {
            slotResult: {type: "slot", x: 646.7, y: 139.4, size: 45, visual: !false},
            close: {type: "closeButton", x: 650, y: 12, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 2.8}
        } as UI.ElementSet;
        for(let i=0; i<81; i++) elements[`slotInput${i}`] = {type: "slot", x: 315.7 + (i % 9) * 30.5, y: 11 + Math.floor(i / 9) * 30.5, size: 30.5, visual: !false};
        for(let i=9; i<36; i++) elements[`slotInv${i}`] = {type: "invSlot", x: 361.7 + (i % 9) * 30.5, y: 261 + Math.floor(i / 9) * 30.5, size: 30.5, index: i};
        for(let i=0; i<9; i++) elements[`slotInv${i}`] = {type: "invSlot", x: 361.7 + i * 30.5, y: 392, size: 30.5, index: i}
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