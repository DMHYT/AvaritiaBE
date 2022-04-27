namespace MatterCluster {

    export const capacity = 4096;
    
    export var nextId: number = 0;
    export var data: {[key: number]: ItemInstance[]} = {};

    function areItemInstancesEqual(i1: ItemInstance, i2: ItemInstance): boolean {
        if(i1.id == i2.id && i1.data == i2.data)
            return i1.extra == null && i2.extra == null;
        return false;
    }

    function compressItemsList(list: ItemInstance[]): ItemInstance[] {
        const result: ItemInstance[] = [];
        list.forEach(item => {
            const found = result.find(element => areItemInstancesEqual(element, item));
            if(typeof found === "undefined") result.push(item);
            else found.count += item.count;
        });
        return result;
    }

    export function makeClusters(list: ItemInstance[]): ItemInstance[] {
        let returnData: ItemInstance[] = [],
            cloned: ItemInstance[] = compressItemsList(list);
        while(cloned.length != 0) returnData.push(_makeCluster(cloned));
        return returnData;
    }

    function _makeCluster(list: ItemInstance[]): ItemInstance {
        let count: number = 0,
            following: ItemInstance[] = [];
        while(count < capacity && list.length > 0){
            let stack = list.pop();
            if(count + stack.count > capacity){
                let toPut = capacity - count;
                list.push({ ...stack, count: stack.count - toPut });
                following.push({ ...stack, count: toPut });
                break;
            } else {
                count += stack.count;
                following.push(stack);
            }
        }
        data[nextId] = following;
        const extra = new ItemExtraData();
        extra.putInt("cluster_id", nextId++);
        extra.putInt("item_count", count);
        return { id: ItemID.matter_cluster, count: 1, data: 0, extra: extra };
    }

    export function makeCluster(list: ItemInstance[]): ItemInstance {
        return _makeCluster(compressItemsList(list));
    }

    function dropByStacks(item: ItemInstance, region: BlockSource, x: number, y: number, z: number): void {
        const stackSize = Item.getMaxStack(item.id);
        while(item.count != 0) {
            const toDrop = Math.min(stackSize, item.count);
            item.count -= toDrop;
            dropItemRandom({ ...item, count: toDrop }, region, x, y, z);
        }
    }

    export function deconstructCluster(player: number): void {
        let item = Entity.getCarriedItem(player),
            pos = Entity.getPosition(player);
        if(item.extra != null){
            const clusterId = item.extra.getInt("cluster_id");
            const region = BlockSource.getDefaultForActor(player),
                dropX = Math.floor(pos.x),
                dropY = Math.floor(pos.y),
                dropZ = Math.floor(pos.z);
            MatterCluster.data[clusterId].forEach(drop => dropByStacks(drop, region, dropX, dropY, dropZ));
            delete MatterCluster.data[clusterId];
        } else Network.getClientForPlayer(player).sendMessage("This matter cluster item was obtained illegally! It doesn\'t contain any items inside!");
        Entity.setCarriedItem(player, 0, 0, 0, null);
    }

}

Saver.addSavesScope(
"AvaritiaMatterClusters", 
(scope: { nextId: number, data: {[key: number]: ItemInstance[]} }) => {
    if(typeof scope !== "undefined" && typeof scope.nextId === "number" && typeof scope.data !== "undefined") {
        MatterCluster.nextId = scope.nextId || 0;
        MatterCluster.data = JSON.parse(JSON.stringify(scope.data)) || {};
    }
},
() => {
    return {
        nextId: MatterCluster.nextId,
        data: MatterCluster.data
    }
}
);

IDRegistry.genItemID("matter_cluster");
Item.createItem("matter_cluster", "item.avaritia:matter_cluster.name", {name: "matter_cluster_empty", meta: 0}, {stack: 1, isTech: true});
Item.registerNameOverrideFunction(ItemID.matter_cluster, (item, name) => {
    if(item.extra == null) return "BROKEN MATTER CLUSTER";
    name = Translation.translate(`item.avaritia:matter_cluster${item.extra.getInt("item_count") == MatterCluster.capacity ? ".full" : ""}.name`);
    name += `\n§7${item.extra.getInt("item_count")}/4096 ${Translation.translate("tooltip.matter_cluster.counter")}`;
    name += `\n\n§8${Translation.translate("tooltip.matter_cluster.desc")}`;
    return name;
});
Item.registerIconOverrideFunction(ItemID.matter_cluster, item => {
    return { name: `matter_cluster_${item.extra != null && item.extra.getInt("item_count") == MatterCluster.capacity ? "full" : "empty"}`, meta: 0 };
});
Item.registerUseFunction(ItemID.matter_cluster, (coords, item, block, player) => Entity.getSneaking(player) && MatterCluster.deconstructCluster(player));
Item.registerNoTargetUseFunction(ItemID.matter_cluster, (item, player) => Entity.getSneaking(player) && MatterCluster.deconstructCluster(player));