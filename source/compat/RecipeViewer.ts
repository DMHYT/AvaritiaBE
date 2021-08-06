ModAPI.addAPICallback("RecipeViewer", (api) => {
    const all_workbench = ExtremeCraftingTable.getAllSeparately();
    class ExtremeCraftingShapedRecipe extends api.RecipeType {
        getAllList(): RecipePattern[] {
            return all_workbench.shaped;
        }
    }
    class ExtremeCraftingShapelessRecipe extends api.RecipeType {
        getAllList(): RecipePattern[] {
            return all_workbench.shapeless;
        }
    }
    const window_contents: RecipeContents = {
        drawing: [
            {type: "bitmap", x: 0, y: 0, bitmap: "avaritia.extreme_rv"}
        ],
        elements: {}
    }
    api.RecipeTypeRegistry.register("avaritia_extreme_shaped", new ExtremeCraftingShapedRecipe(Translation.translate("crafting.extreme"), BlockID.extreme_crafting_table, window_contents));
    api.RecipeTypeRegistry.register("avaritia_extreme_shapeless", new ExtremeCraftingShapelessRecipe(Translation.translate("crafting.extreme.shapeless"), BlockID.extreme_crafting_table, window_contents));
});