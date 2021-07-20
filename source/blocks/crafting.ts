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
        if(keys.length % 3 != 0) throw new java.lang.IllegalArgumentException();
        const ingredients: RecipeTE.IngredientsList = {};
        for(let i=0; i<keys.length; i+=3){
            if(typeof keys[i] === "string" && typeof keys[i + 1] === "number" && typeof keys[i + 2] === "number")
                ingredients[keys[i]] = {id: keys[i + 1] as number, data: keys[i + 2] as number};
            else throw new java.lang.IllegalArgumentException();
        }
        workbench_obj.addShapeRecipe(result, mask, ingredients, null, func);
    }

    export function addShapeless(result: ItemInstance, items: [number, number][], func?: RecipeTE.CraftFunction) {
        const ingredients: RecipeTE.RecipeItem[] = items.map(val => { return { id: val[0], data: val[1] } });
        workbench_obj.addRecipe(result, ingredients, null, func);
    }

}

const GUI_EXTREME_CRAFTING = new UI.Window({
    location: { width: 1000, height: UI.getScreenHeight(), x: 0, y: 0 },
    drawing: [
        {type: "background", color: android.graphics.Color.argb(90, 0, 0, 0)},
        {type: "bitmap", x: 321.5, y: (UI.getScreenHeight() - 384) / 2, scale: 1.5, bitmap: "avaritia.extreme_crafting"}
    ],
    elements: (() => {
        const elements = {} as UI.ElementSet;
        const offset = (UI.getScreenHeight() - 384) / 2;
        for(let i=0; i<81; i++) elements[`slotInput${i}`] = {type: "slot", x: 337.5 + (i % 9) * 27, y: offset + 10 + Math.floor(i / 9) * 27, size: 27, visual: false};
        elements.slotResult = {type: "slot", x: 628.5, y: offset + 112, size: 40, visual: false}
        for(let i=9; i<36; i++) elements[`slotInv${i}`] = {type: "invSlot", x: 377.5 + (i % 9) * 27, y: offset + 259 + Math.floor(i / 9) * 27, size: 27, index: i};
        for(let i=0; i<9; i++) elements[`slotInv${i}`] = {type: "invSlot", x: 377.5 + i * 27, y: offset + 346, size: 27, index: i}
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
VanillaSlots.registerForTile(BlockID.extreme_crafting_table);