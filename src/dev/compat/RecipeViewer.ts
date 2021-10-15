ModAPI.addAPICallback("RecipeViewer", RecipeViewer => {
    var SubUI: SubUI;
    var target: ViewInfo;
    try {
        SubUI = RecipeViewer.requireGlobal("SubUI");
        target = SubUI.getTarget();
    } catch(e) {}
    const button_win = (key: string | string[]) => new UI.Window({
        location: {x: 872, y: UI.getScreenHeight() - 96, width: 64, height: 64},
        elements: {
            button: {
                type: "button",
                x: 0, y: 0, scale: 62.5,
                bitmap: "default_button_up", bitmap2: "default_button_down",
                clicker: {
                    onClick: () => {
                        if(typeof key === "string") {
                            RecipeViewer.RecipeTypeRegistry.openRecipePage(key);
                        } else {
                            if(typeof SubUI !== "undefined") {
                                key.forEach(type => {
                                    if(!RecipeViewer.RecipeTypeRegistry.isExist(type) || target && target.mode === 2 && target.recipe === type) return;
                                    if(RecipeViewer.RecipeTypeRegistry.get(type).getAllList().length > 0)
                                        SubUI.cache.push({ mode: 2, recipe: type, tray: [type] });
                                });
                                SubUI.page = 0;
                                SubUI.updateWindow();
                                SubUI.window.open();
                            } else RecipeViewer.RecipeTypeRegistry.openRecipePage(key[0]);
                        }
                    }
                } 
            },
            text: {
                type: "text",
                x: 300, y: 120, z: 1,
                text: "R",
                font: { color: Color.WHITE, size: 600, shadow: .5 }
            }
        }
    })
    const addButtonTo = (gui: UI.Window, key: string | string[]) => gui.addAdjacentWindow(button_win(key));
    Callback.addCallback("LevelPreLoaded", () => {
        const all_workbench = ExtremeCraftingTable.getAllSeparately();
        // RECIPE VIEWER WINDOW SIZE: X - 1000, Y - 567
        const extreme_contents: RecipeContents = {
            drawing: [
                {type: "bitmap", x: 217.5, y: 40, bitmap: "avaritia.extreme_rv", scale: 3}
            ],
            elements: (() => {
                const elements: {[key: string]: UI.UISlotElement} = { output0: { type: "slot", x: 704.5, y: 246, size: 78, bitmap: "_default_slot_empty"} }
                for(let i=0; i<81; i++) elements[`input${i}`] = { type: "slot", x: 219.5 + (i % 9) * 54, y: 42 + Math.floor(i / 9) * 54, size: 54, bitmap: "_default_slot_empty"};
                return elements;
            })()
        }
        class ExtremeCraftingShapedRecipe extends RecipeViewer.RecipeType {
            constructor() {
                super(Translation.translate("crafting.extreme"), BlockID.extreme_crafting_table, extreme_contents)
            }
            getAllList(): RecipePattern[] {
                return all_workbench.shaped;
            }
        }
        class ExtremeCraftingShapelessRecipe extends RecipeViewer.RecipeType {
            constructor() {
                super(Translation.translate("crafting.extreme.shapeless"), BlockID.extreme_crafting_table, extreme_contents)
            }
            getAllList(): RecipePattern[] {
                return all_workbench.shapeless;
            }
        }
        interface CompressorRecipePattern extends RecipePattern { requiredAmount: number }
        class CompressorRecipe extends RecipeViewer.RecipeType {
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
            public onOpen(elements: HashMap<string, UIElement>, recipe: CompressorRecipePattern): void {
                (elements.get("textAmount") as UIElement).setBinding<string>("text", JString.format(Translation.translate("avaritia.rv.compressor.amount"), [Integer.valueOf(recipe.requiredAmount)]));
            }
        }
        RecipeViewer.RecipeTypeRegistry.register("avaritia_extreme_shaped", new ExtremeCraftingShapedRecipe());
        RecipeViewer.RecipeTypeRegistry.register("avaritia_extreme_shapeless", new ExtremeCraftingShapelessRecipe());
        RecipeViewer.RecipeTypeRegistry.register("avaritia_compressor", new CompressorRecipe());
        addButtonTo(GUI_EXTREME_CRAFTING, ["avaritia_extreme_shaped", "avaritia_extreme_shapeless"]);
        addButtonTo(GUI_COMPRESSOR, "avaritia_compressor");
    });
});