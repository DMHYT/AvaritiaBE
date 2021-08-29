namespace MatterCluster {

    export const capacity = 4096;
    
    export var nextId: number = 0;
    export var data: {[key: number]: ItemInstance[]} = {};

    export function makeClusters(list: ItemInstance[]): ItemInstance[] {
        let returnData: ItemInstance[] = [], 
            cloned: ItemInstance[] = [].concat(list);
        while(cloned.length != 0) returnData.push(makeCluster(cloned));
        return returnData;
    }

    export function makeCluster(list: ItemInstance[]): ItemInstance {
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
        return {id: ItemID.matter_cluster, count: 1, data: 0, extra: extra};
    }

    export function deconstructCluster(player: number): void {
        let item = Entity.getCarriedItem(player),
            pos = Entity.getPosition(player);
        if(item.extra != null){
            let list = MatterCluster.data[item.extra.getInt("cluster_id")];
            for(let i in list) dropItemRandom(list[i], BlockSource.getDefaultForActor(player), Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z));
            delete MatterCluster.data[item.extra.getInt("cluster_id")];
        } else Network.getClientForPlayer(player).sendMessage("This matter cluster item was obtained illegally! It doesn\'t contain any items inside!");
        Entity.setCarriedItem(player, 0, 0, 0, null);
    }

}

Saver.addSavesScope(
"AvaritiaMatterClusters", 
(scope: any) => {
    MatterCluster.nextId = scope?.nextId ?? 0;
    MatterCluster.data = scope?.data ?? {};
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
    name += `\n${EColor.DARK_GRAY}${Translation.translate("tooltip.matter_cluster.desc")}`;
    return name; // what the hell is this bug
});
Item.registerIconOverrideFunction(ItemID.matter_cluster, (item) => {
    return { name: `matter_cluster_${item.extra != null && item.extra.getInt("item_count") == MatterCluster.capacity ? "full" : "empty"}`, meta: 0 };
});
Item.registerUseFunction(ItemID.matter_cluster, (coords, item, block, player) => Entity.getSneaking(player) && MatterCluster.deconstructCluster(player));
Item.registerNoTargetUseFunction(ItemID.matter_cluster, (item, player) => Entity.getSneaking(player) && MatterCluster.deconstructCluster(player));