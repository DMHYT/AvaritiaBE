/*
 █████╗ ██╗   ██╗ █████╗ ██████╗ ██╗████████╗██╗ █████╗   ██████╗ ███████╗
██╔══██╗██║   ██║██╔══██╗██╔══██╗██║╚══██╔══╝██║██╔══██╗  ██╔══██╗██╔════╝
███████║╚██╗ ██╔╝███████║██████╔╝██║   ██║   ██║███████║  ██████╦╝█████╗  
██╔══██║ ╚████╔╝ ██╔══██║██╔══██╗██║   ██║   ██║██╔══██║  ██╔══██╗██╔══╝  
██║  ██║  ╚██╔╝  ██║  ██║██║  ██║██║   ██║   ██║██║  ██║  ██████╦╝███████╗
╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝  ╚═════╝ ╚══════╝
*/

// © vsdum 2021
// YouTube DMH (Russian) - https://www.youtube.com/channel/UCdQKuakM3rnuGV_1VA6XUKQ
// YouTube vstannumdum (English) - https://www.youtube.com/channel/UCXHpQ_SQ8VPigIvbbzHWWdA
// My VK - https://www.vk.com/vstannumdum
// Report bugs in VK Public - https://www.vk.com/dmhmods

IMPORT("ItemAnimHelper");
IMPORT("ToolLib");

const rand = new java.util.Random();

const AVA_STUFF: number[] = [];

const addShaped = (id: number, count: number, data: number, mask: string[], keys: (string | number)[]) => Recipes.addShaped({id: id, count: count, data: data}, mask, keys);
const addShapeless = (id: number, count: number, data: number, ingredients: [number, number][]) => {
    let ingrobj = [];
    for(let i in ingredients) ingrobj.push({id: ingredients[i][0], data: ingredients[i][1]});
    Recipes.addShapeless({id: id, count: count, data: data}, ingrobj);
}

type SoundPacket = { x: number, y: number, z: number, sound: string, volume: number, pitch: number };
Network.addClientPacket("avaritia.sound", (data: SoundPacket) => World.playSound(data.x, data.y, data.z, data.sound, data.volume, data.pitch));
const playSound = (x: number, y: number, z: number, dimension: number, sound: string, volume: number, pitch: number) =>
    new NetworkConnectedClientList()
        .setupDistancePolicy(x, y, z, dimension, 64)
        .send("avaritia.sound", {x: x, y: y, z: z, sound: sound, volume: volume, pitch: pitch});

const check_armor = (player: number) =>
    Entity.getArmorSlot(player, 0).id == ItemID.infinity_helmet &&
    Entity.getArmorSlot(player, 1).id == ItemID.infinity_chestplate &&
    Entity.getArmorSlot(player, 2).id == ItemID.infinity_leggings &&
    Entity.getArmorSlot(player, 3).id == ItemID.infinity_boots;

const INFINITY_TOOLS: number[] = [];
Callback.addCallback("PlayerAttack", (attacker) => {
    let item = Entity.getCarriedItem(attacker);
    if(item.data > 0 && !!~INFINITY_TOOLS.indexOf(item.id)){
        Entity.setCarriedItem(attacker, item.id, item.count, 0, item.extra);
    }
});
Callback.addCallback("DestroyBlock", (coords, block, player) => {
    let item = Entity.getCarriedItem(player);
    if(item.data > 0 && !!~INFINITY_TOOLS.indexOf(item.id) && !Entity.getSneaking(player)){
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
    }
});
Callback.addCallback("ItemUse", (coords, item, block, isExternal, player) => {
    if(item.data > 0 && !!~INFINITY_TOOLS.indexOf(item.id) && !Entity.getSneaking(player)){
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
    }
});

namespace Rarity {

    function makeRarity(id: number, rarity: string): void {
        let _func = Item.nameOverrideFunctions[id];
        Item.registerNameOverrideFunction(id, (item, name, name2) => {
            if(_func) name = (_func(item, name, name2) ?? name) as string;
            // Fixing stupid bug, when russian 'в' letter appears at the beginning
            return `${rarity}${name}`.replace("в", "");
        });
    }

    export function uncommon(id: number) { makeRarity(id, EColor.GREEN) }
    export function rare(id: number) { makeRarity(id, EColor.AQUA) }
    export function epic(id: number) { makeRarity(id, EColor.LIGHT_PURPLE) }
    export function cosmic(id: number) { makeRarity(id, EColor.RED) }
    
}

const VALID_DIRECTIONS = [EBlockSide.DOWN, EBlockSide.UP, EBlockSide.NORTH, EBlockSide.SOUTH, EBlockSide.WEST, EBlockSide.EAST];
const getOffsets = (dir: number) => {
    switch(dir){
        case EBlockSide.DOWN: return [0, -1, 0];
        case EBlockSide.UP: return [0, 1, 0];
        case EBlockSide.NORTH: return [0, 0, -1];
        case EBlockSide.SOUTH: return [0, 0, 1];
        case EBlockSide.WEST: return [-1, 0, 0];
        case EBlockSide.EAST: return [1, 0, 0];
        default: throw new java.lang.IllegalArgumentException(`Invalid direction id ${dir} put in \'getOffsets\' function, it must be 0...5`);
    }
}

const dropItemRandom = (drop: ItemInstance, world: BlockSource, x: number, y: number, z: number) =>
    world.spawnDroppedItem(x + (rand.nextFloat() * .7 + .15), y + (rand.nextFloat() * .7 + .15), z + (rand.nextFloat() * .7 + .15), drop.id, drop.count, drop.data, drop.extra);

const undestroyable_item = (id: string) => Item.getItemById(id)?.setProperties(JSON.stringify({ "minecraft:explodable": false, /* TODO fire res */ }));

const INFINITY_ITEM_FRAMES = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1];

function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    const indexes: number[] = [];
    for(let i in arr)
        if(!predicate(arr[i]))
            indexes.push(parseInt(i));
    for(let i in indexes){
        arr.splice(indexes[i], 1);
        for(let i2 in indexes)
            indexes[i2]--;
    }
    return arr;
}