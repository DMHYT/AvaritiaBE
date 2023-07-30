/// <reference path="core-engine.d.ts" />
/** Custom function which you can specify in shaped and shapeless recipes */
declare interface ExtremeCraftFunction {
    (container: ItemContainer): void;
}
/** Avaritia shared ModAPI object */
declare interface AvaritiaAPI {
    /**
     * Creates new shaped recipe in extreme crafting table.
     * Same params as in `Recipe.addShaped` InnerCore method, 
     * but with 9x9 possible grid.
     */
    addExtremeShapedRecipe(recipeName: string, result: ItemInstance, mask: string[], keys: (string | number)[], func?: ExtremeCraftFunction): void;
    /**
     * Creates new shapeless recipe in extreme crafting table.
     * Almost same params as in `Recipe.addShapeless` InnerCore method, 
     * but with possible maximum of 81 ingredients.
     * @param items array of arrays, containing id and data respectively of each ingredient
     */
    addExtremeShapelessRecipe(recipeName: string, result: ItemInstance, items: [number, number][], func?: ExtremeCraftFunction): void;
    /**
     * Removes extreme crafting table recipe by the name,
     * which is passed as the first parameter in
     * `addExtremeShapedRecipe` and `addExtremeShapelessRecipe` methods.
     */
    removeExtremeRecipe(recipeName: string): void;
    /**
     * Creates new item that can be produced in neutronium compressor from given material count
     * @param outputId numeric id of the result item
     * @param inputId numeric id of the material
     * @param inputCount material item count to craft 1 result item
     * @param inputData material data or -1 to ignore data
     * @param specific if false, material count will be increased
     * when having some simplifying mods, like IC2 and TConstruct.
     * If true, material count will always be of the value you specified.
     */
    addCompressorRecipe(outputId: number, inputId: number, inputCount: number, inputData: number, specific: boolean): void;
    /** Removes neutronium compressor recipe by given input material ID */
    removeCompressorRecipe(inputId: number): void;
    /**
     * Registers a new singularity item (you don't have to call `IDRegistry.genItemID` and `Item.createItem` before).
     * The texture colors of your new singularity must be specified in `"<your mod's resource directory>/singularities.json"`,
     * as an array of two strings with lowercase HEX representation of the colors. Example:
     * ```json
     * {
     *      "iron": ["#e6e7e8", "#7f7f7f"]
     * }
     * ```
     * The name ID of your singularity will be `"singularity_<key>"`, and the unlocalized name will be
     * `"item.singularity.<key>.name"`.
     * @param materialId numeric ID of the material item, from which your singularity will be created in the neutronium compressor.
     * Can be null if you're going to specify the recipe later using the `addCompressorRecipe` method.
     * @param materialCount amount of the material item, from which your singularity will be created in the neutronium compressor.
     * Can be null if you're going to specify the recipe later using the `addCompressorRecipe` method.
     * @param materialData data of the material item, from which your singularity will be created in the neutronium compressor.
     * Can be null if you're going to specify the recipe later using the `addCompressorRecipe` method.
     */
    registerSingularity(key: string, materialId: Nullable<number>, materialCount: Nullable<number>, materialData: Nullable<number>): void;
    /** @returns some non-exported variable, module or function from the mod, if you need it */
    requireGlobal(something: string): any;
}
declare namespace ModAPI {
    /** Callback to use Avaritia shared ModAPI */
    function addAPICallback(apiName: "AvaritiaAPI", func: (api: AvaritiaAPI) => void): void;
}