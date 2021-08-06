IDRegistry.genBlockID("neutron_collector");
Block.createBlockWithRotation("neutron_collector", [{name: "tile.avaritia:neutron_collector.name", texture: [["avaritia_machine_side", 0], ["collector_top", 0], ["avaritia_machine_side", 0], ["collector_active", 0], ["avaritia_machine_side", 0], ["avaritia_machine_side", 0]], inCreative: true}], {sound: "metal", destroytime: 20});
ToolAPI.registerBlockMaterial(BlockID.neutron_collector, "stone", 3, false);
AVA_STUFF.push(BlockID.neutron_collector);

/**
 * DRAWING: X = 279.5, Y = (UI.getScreenHeight() - 415) / 2, scale = 2.5
 * offset in paint.net - 52.5
 */
const GUI_COLLECTOR = new UI.Window({
    location: {x: 0, y: 0, width: 1000, height: UI.getScreenHeight()},
    drawing: [
        {type: "background", color: android.graphics.Color.argb(90, 0, 0, 0)},
        {type: "bitmap", x: 279.5, y: (UI.getScreenHeight() - 415) / 2, scale: 2.5, bitmap: "avaritia.collector"}
    ],
    elements: (() => {
        const offset = (UI.getScreenHeight() - 415) / 2;
        const font = {alignment: UI.Font.ALIGN_CENTER};
        const elems = {
            textInventory: {type: "text", x: 365, y: offset + 193, font: font, text: Translation.translate("avaritia.inventory")},
            textHeader: {type: "text", x: 500, y: offset + 20, font: font, text: Translation.translate("container.neutronium_compressor")},
            slotOutput: {type: "slot", x: 476.5, y: offset + 74, size: 47, isValid: () => false, visual: false, bitmap: "_default_slot_empty", isTransparentBackground: true},
            textProgress: {type: "text", x: 500, y: offset + 150, font: font, text: "Progress: 0.0%"},
            closeButton: {type: "closeButton", x: 666.5, y: offset + 9, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 3}
        } as UI.ElementSet;
        for(let i=9; i<36; i++) elems[`slotInv${i}`] = {type: "invSlot", x: 296.5 + (i % 9) * 45, y: offset + 207 + Math.floor((i - 9) / 9) * 45, index: i, size: 47}
        for(let i=0; i<9; i++) elems[`slotInv${i}`] = {type: "invSlot", x: 296.5 + i * 45, y: offset + 352, index: i, size: 47}
        return elems;
    })()
});
GUI_COLLECTOR.setInventoryNeeded(true);
GUI_COLLECTOR.setCloseOnBackPressed(true);

type CollectorTEDefaultValues = { progress: number }
class CollectorTileEntity extends TEImpl<CollectorTEDefaultValues> {

    public readonly useNetworkItemContainer = true;
    public defaultValues = { progress: 0 };

    public getScreenByName() { return GUI_COLLECTOR };

    public tick() {
        StorageInterface.checkHoppers(this);
        const slot = this.container.getSlot("slotOutput");
        if(slot.id == 0 || (slot.id == ItemID.neutron_pile && slot.count < Item.getMaxStack(ItemID.neutron_pile))) {
            if(++this.data.progress >= COLLECTOR_PROCESS_TIME) {
                this.container.setSlot("slotOutput", ItemID.neutron_pile, slot.count + 1, slot.data, slot.extra);
                this.data.progress = 0;
                this.container.setText("textProgress", "Progress: 0.0%");
                this.container.sendChanges();
                return;
            }
            this.container.setText("textProgress", `Progress: ${(this.data.progress / COLLECTOR_PROCESS_TIME * 100).toFixed(1)}%`);
            this.container.sendChanges();
        }
    }

    public click(id: number, count: number, data: number, coords: Callback.ItemUseCoordinates, player: number) {
        if(!Entity.getSneaking(player)) {
            Game.prevent();
            this.container.openFor(Network.getClientForPlayer(player), "main");
        }
    }

}

TileEntity.registerPrototype(BlockID.neutron_collector, new CollectorTileEntity());
StorageInterface.createInterface(BlockID.neutron_collector, {
    slots: { slotOutput: { input: false, output: true } },
    getOutputSlots: () => ["slotOutput"]
});
VanillaSlots.registerForTile(BlockID.neutron_collector);