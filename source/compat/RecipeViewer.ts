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
    interface CompressorRecipePattern extends RecipePattern { requiredAmount: number }
    class CompressorRecipe extends api.RecipeType {
        constructor() {
            super(Translation.translate("tile.avaritia:neutronium_compressor.name"), BlockID.neutronium_compressor, {
                drawing: [ { type: "bitmap", x: 200, y: 155.5, scale: 6, bitmap: "avaritia.compressor_rv" } ],
                elements: {
                    input0: { type: "slot", x: 200, y: 179.5, bitmap: "_default_slot_empty", isTransparentBackground: true, size: 108 },
                    output0: { type: "slot", x: 665, y: 179.5, bitmap: "_default_slot_empty", isTransparentBackground: true, size: 108 },
                    arrow: { type: "scale",  x: 344, y: 183.5, bitmap: "avaritia.compressor_arrow", direction: 0, value: 1, scale: 6},
                    singularity: { type: "scale", x: 512, y: 183.5, bitmap: "avaritia.compressor_singularity", direction: 1, value: 1, scale: 6 },
                    textAmount: { type: "text", x: 500, y: 320.5, width: 600, height: 120, font: { alignment: UI.Font.ALIGN_CENTER, color: Color.BLACK, size: 40 } }
                } as {[key: string]: Partial<UI.UISlotElement | UI.UIScaleElement | UI.UITextElement>}
            });
        }
        public getAllList(): CompressorRecipePattern[] {
            const result = [] as CompressorRecipePattern[];
            for(let i in Singularity.recipes) {
                const r = Singularity.recipes[i];
                result.push({
                    input: [ { id: parseInt(i), count: 1, data: r.countdata[1]} ],
                    output: [ { id: r.id, count: 1, data: 0 } ],
                    requiredAmount: r.countdata[0]
                });
            }
            return result;
        }
        public onOpen(elements: HashMap<string, UI.Element>, recipe: CompressorRecipePattern): void {
            (elements.get("textAmount") as UI.Element).setBinding("text", JavaString.format(Translation.translate("avaritia.rv.compressor.amount"), [JavaInt.valueOf(recipe.requiredAmount)]));
        }
    }
    api.RecipeTypeRegistry.register("avaritia_extreme_shaped", new ExtremeCraftingShapedRecipe());
    api.RecipeTypeRegistry.register("avaritia_extreme_shapeless", new ExtremeCraftingShapelessRecipe());
    api.RecipeTypeRegistry.register("avaritia_compressor", new CompressorRecipe());
});