ModAPI.addAPICallback("RecipeViewer", (api) => {
    const all_workbench = ExtremeCraftingTable.getAllSeparately();
    // RECIPE VIEWER WINDOW SIZE: X - 1000, Y - 567
    const extreme_contents: RecipeContents = {
        drawing: [
            {type: "bitmap", x: 217.5, y: 40, bitmap: "avaritia.extreme_rv", scale: 3}
        ],
        elements: (() => {
            const elements: {[key: string]: Partial<UI.UISlotElement>} = { output0: { x: 704.5, y: 246, size: 78, bitmap: "_default_slot_empty", isTransparentBackground: true } }
            for(let i=0; i<81; i++) elements[`input${i}`] = { x: 219.5 + (i % 9) * 54, y: 42 + Math.floor(i / 9) * 54, size: 54, bitmap: "_default_slot_empty", isTransparentBackground: true };
            return elements;
        })()
    }
    class ExtremeCraftingShapedRecipe extends api.RecipeType {
        constructor() {
            super(Translation.translate("crafting.extreme"), BlockID.extreme_crafting_table, extreme_contents)
        }
        getAllList(): RecipePattern[] {
            return all_workbench.shaped;
        }
    }
    class ExtremeCraftingShapelessRecipe extends api.RecipeType {
        constructor() {
            super(Translation.translate("crafting.extreme.shapeless"), BlockID.extreme_crafting_table, extreme_contents)
        }
        getAllList(): RecipePattern[] {
            return all_workbench.shapeless;
        }
    }
    api.RecipeTypeRegistry.register("avaritia_extreme_shaped", new ExtremeCraftingShapedRecipe());
    api.RecipeTypeRegistry.register("avaritia_extreme_shapeless", new ExtremeCraftingShapelessRecipe());
});