IDRegistry.genBlockID("neutronium_compressor");
Block.createBlockWithRotation("neutronium_compressor", [{name: "tile.avaritia:neutronium_compressor.name", texture: [["avaritia_machine_side", 0], ["compressor_top", 0], ["avaritia_machine_side", 0], ["compressor_active", 0], ["avaritia_machine_side", 0], ["avaritia_machine_side", 0]], inCreative: true}], {sound: "metal", destroytime: 20});
ToolAPI.registerBlockMaterial(BlockID.neutronium_compressor, "stone", 3, false);
AVA_STUFF.push(BlockID.neutronium_compressor);

/**
 * DRAWING: X = 279.5, Y = (UI.getScreenHeight() - 415) / 2, scale = 2.5
 * offset in paint.net - 52.5
 */
const GUI_COMPRESSOR = new UI.Window({
    location: { x: 0, y: 0, width: 1000, height: UI.getScreenHeight() },
    drawing: [
        {type: "background", color: Color.argb(90, 0, 0, 0)},
        {type: "bitmap", x: 279.5, y: (UI.getScreenHeight() - 415) / 2, scale: 2.5, bitmap: "avaritia.compressor"}
    ],
    elements: (() => {
        const offset = (UI.getScreenHeight() - 415) / 2;
        const font: UI.FontParams = { alignment: UI.Font.ALIGN_CENTER, color: Color.BLACK };
        const elems = {
            textInventory: {type: "text", x: 365, y: offset + 193, font: font, text: Translation.translate("avaritia.inventory")},
            textHeader: {type: "text", x: 500, y: offset + 5, font: font, text: Translation.translate("container.neutronium_compressor")},
            textAmount: {type: "text", x: 500, y: offset + 143, font: font, text: ""},
            textInput: {type: "text", x: 330, y: offset + 45, font: font, text: ""},
            textOutput: {type: "text", x: 670, y: offset + 45, font: font, text: ""},
            slotInput: {type: "slot", x: 373.5, y: offset + 84, size: 47, isValid: (id, count, data, container) => Singularity.isValidMaterial(id, data) && Singularity.getRecipeResult(id) == (container.getParent() as CompressorTileEntity).data.resultId, visual: false},
            slotOutput: {type: "slot", x: 569.5, y: offset + 84, size: 47, isValid: () => false, visual: false, bitmap: "_default_slot_empty", isTransparentBackground: true},
            slotInputVisual: {type: "slot", x: 306.5, y: offset + 84, size: 47, bitmap: "_default_slot_empty", isTransparentBackground: true, visual: true, maxStackSize: 1},
            slotOutputVisual: {type: "slot", x: 646.5, y: offset + 84, size: 47, bitmap: "_default_slot_empty", isTransparentBackground: true, visual: true, maxStackSize: 1},
            arrowScale: {type: "scale", x: 434.5, y: offset + 86, scale: 2.5, bitmap: "avaritia.compressor_arrow", direction: 0, value: 0},
            singularityScale: {type: "scale", x: 504.5, y: offset + 86, scale: 2.625, bitmap: "avaritia.compressor_singularity", direction: 1, value: 0},
            closeButton: {type: "closeButton", x: 666.5, y: offset + 9, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 3}
        } as UI.ElementSet;
        for(let i=9; i<36; i++) elems[`slotInv${i}`] = {type: "invSlot", x: 296.5 + (i % 9) * 45, y: offset + 207 + Math.floor((i - 9) / 9) * 45, index: i, size: 47}
        for(let i=0; i<9; i++) elems[`slotInv${i}`] = {type: "invSlot", x: 296.5 + i * 45, y: offset + 352, index: i, size: 47}
        return elems;
    })()
});
GUI_COMPRESSOR.setInventoryNeeded(true);
GUI_COMPRESSOR.setCloseOnBackPressed(true);

type CompressorTEDefaultValues = { put: number, toPut: number, isActive: boolean, resultId: Nullable<number> }
class CompressorTileEntity extends TileEntityImplementation<CompressorTEDefaultValues> {

    constructor() { super({ put: 0, toPut: 1, isActive: false, resultId: null }) }

    public getScreenByName() { return GUI_COMPRESSOR };

    private updateHints() {
        this.container.setText("textInput", "Input");
        this.container.setText("textOutput", "Output");
        const slot = this.container.getSlot("slotInput");
        if(slot.id == 0 && this.data.resultId !== null) {
            const material = Singularity.getMaterialForSingularity(this.data.resultId);
            material != -1 && this.container.setSlot("slotInputVisual", material, 1, 0, null);
        } else this.container.setSlot("slotInputVisual", slot.id, 1, slot.data, null);
        this.data.resultId !== null && this.container.setSlot("slotOutputVisual", this.data.resultId, 1, 0, null);
        this.container.setText("textAmount", `${this.data.put} / ${this.data.toPut}`);
        const progress = this.data.put / this.data.toPut;
        this.container.setScale("arrowScale", progress);
        this.container.setScale("singularityScale", progress);
        this.container.sendChanges();
    }

    private hideHints() {
        this.container.setText("textInput", "");
        this.container.setText("textOutput", "");
        this.container.clearSlot("slotInputVisual");
        this.container.clearSlot("slotOutputVisual");
        this.container.setText("textAmount", "");
        this.container.sendChanges();
    }

    private decreaseMaterial(slin: ItemContainerSlot, slout: ItemContainerSlot) {
        this.container.setSlot("slotInput", slin.id, slin.count - 1, slin.data, slin.extra);
        this.container.validateSlot("slotInput");
        this.data.put++;
        if(this.data.put == this.data.toPut) {
            this.container.setSlot("slotOutput", this.data.resultId, slout.count + 1, slout.data, slout.extra);
            this.data.put = 0;
            this.data.toPut = 1;
            this.data.isActive = false;
            this.data.resultId = null;
            this.hideHints();
        } else this.updateHints();
    }

    public tick() {
        StorageInterface.checkHoppers(this);
        const slin = this.container.getSlot("slotInput");
        const slout = this.container.getSlot("slotOutput");
        if(Singularity.isValidMaterial(slin.id, slin.data)) {
            if(this.data.isActive && this.data.resultId != null && Singularity.getRecipeResult(slin.id) == this.data.resultId && (slout.id == 0 || (slout.id == this.data.resultId && slout.count > 0 && slout.count < Item.getMaxStack(this.data.resultId))))
                return this.decreaseMaterial(slin, slout);
            if(!this.data.isActive && slin.id != 0 && slin.count > 0 && (slout.id == 0 || slout.id == Singularity.getRecipeResult(slin.id))) {
                this.data.isActive = true;
                this.data.toPut = Singularity.getRequiredMaterialCount(slin.id);
                this.data.resultId = Singularity.getRecipeResult(slin.id);
                this.decreaseMaterial(slin, slout);
            }
        }
    }

    public destroy() {
        this.container.clearSlot("slotInputVisual");
        this.container.clearSlot("slotOutputVisual");
        this.container.sendChanges();
        return false;
    }

    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number) {
        if(!Entity.getSneaking(player)) {
            Game.prevent();
            const progress = this.data.put / this.data.toPut;
            this.container.setScale("arrowScale", progress);
            this.container.setScale("singularityScale", progress);
            this.container.openFor(Network.getClientForPlayer(player), "main");
            this.container.sendChanges();
        }
    }

}

TileEntity.registerPrototype(BlockID.neutronium_compressor, new CompressorTileEntity());
StorageInterface.createInterface(BlockID.neutronium_compressor, {
    slots: {
        slotInput: { input: true, output: false, isValid: (item) => Singularity.isValidMaterial(item.id, item.data) },
        slotOutput: { input: false, output: true, isValid: () => false }
    },
    getInputSlots: () => ["slotInput"],
    getOutputSlots: () => ["slotOutput"]
});
VanillaSlots.registerForTile(BlockID.neutronium_compressor);