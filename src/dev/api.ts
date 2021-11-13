ModAPI.registerAPI("AvaritiaAPI", {
    addExtremeShapedRecipe: (result: ItemInstance, mask: string[], keys: (string | number)[], func?: RecipeTE.CraftFunction) => ExtremeCraftingTable.addShaped(result, mask, keys, func),
    addExtremeShapelessRecipe: (result: ItemInstance, items: [number, number][], func?: RecipeTE.CraftFunction) => ExtremeCraftingTable.addShapeless(result, items, func),
    addCompressorRecipe: (outputId: number, inputId: number, inputCount: number, inputData: number, specific: boolean) => Singularity.registerRecipeFor(outputId, inputId, inputCount, inputData, specific),
    requireGlobal: (command: string) => eval(command)
});