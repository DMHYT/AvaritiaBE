ModAPI.registerAPI("AvaritiaAPI", {
    addExtremeShapedRecipe: (recipeName: string, result: ItemInstance, mask: string[], keys: (string | number)[], func?: RecipeTE.CraftFunction) => ExtremeCraftingTable.addShaped(recipeName, result, mask, keys, func),
    addExtremeShapelessRecipe: (recipeName: string, result: ItemInstance, items: [number, number][], func?: RecipeTE.CraftFunction) => ExtremeCraftingTable.addShapeless(recipeName, result, items, func),
    removeExtremeRecipe: (recipeName: string) => ExtremeCraftingTable.remove(recipeName),
    addCompressorRecipe: (outputId: number, inputId: number, inputCount: number, inputData: number, specific: boolean) => Singularity.registerRecipeFor(outputId, inputId, inputCount, inputData, specific),
    removeCompressorRecipe: (inputId: number) => Singularity.removeRecipeFor(inputId),
    registerSingularity: (key: string, materialId: Nullable<number>, materialCount: Nullable<number>, materialData: Nullable<number>) => Singularity.registerSingularity(key, materialId, materialCount, materialData),
    requireGlobal: (command: string) => eval(command)
});