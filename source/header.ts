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

const __loaded_mods = {
    Thaumcraft: false,
    TConstruct: false,
    HydCraft: false,
    ThermalExpansion: false,
    TSteelworks: false,
    IC2: false,
    ThaumicTinkerer: false,
    technom: false,
    magicalcrops: false,
    AgriCraft: false,
    MineFactoryReloaded: false,
    BigReactors: false,
    EE3: false,
    ProjectE: false,
    Botania: false,
    ExtraUtilities: false,
    appliedenergistics2: false,
    ImmersiveEngineering: false,
    Mekanism: false,
    Torcherino: false,
    DraconicEvolution: false
};

ModAPI.addAPICallback("TConAPI", function(api) {
    __loaded_mods.TConstruct = true;
});
ModAPI.addAPICallback("ICore", function(api) {
    __loaded_mods.IC2 = true;
});
ModAPI.addAPICallback("BotaniaAPI", function(api) {
    __loaded_mods.Botania = true;
});

IMPORT("ItemAnimHelper");
IMPORT("ToolLib");
IMPORT("RecipeTileEntity");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");

const Color = android.graphics.Color;
const JavaString = java.lang.String;
const JavaInt = java.lang.Integer;
type HashMap<K, V> = java.util.HashMap<K, V>;

const debug_enabled = __config__.getBool("debug");
const MAX_GAPING_VOID_VIEW_DISTANCE = __config__.getNumber("max_gaping_void_view_distance").intValue();
const VOID_PARTICLES_PER_TICK = __config__.getNumber("void_particles_per_tick").intValue();
const COLLECTOR_PROCESS_TIME = __config__.getNumber("collector_process_time").intValue();
const BORING_FOOD = __config__.getBool("boring_food");
const EYE_COLOR_UPDATE_FREQUENCY = __config__.getNumber("eye_color_update_frequency").intValue();
const PLAYER_FLYING_CHECK_INTERVAL = __config__.getNumber("player_flying_check_for_wings_interval").intValue()

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
            return `${rarity}${name}`;
        });
    }

    export function uncommon(id: number) { makeRarity(id, EColor.GREEN) }
    export function rare(id: number) { makeRarity(id, EColor.AQUA) }
    export function epic(id: number) { makeRarity(id, EColor.LIGHT_PURPLE) }
    export function cosmic(id: number) { makeRarity(id, EColor.RED) }
    
}

const addTooltip = (id: number, key: string) => Item.registerNameOverrideFunction(id, (item, name) => `${name}\n${EColor.ITALIC}${EColor.GRAY}${Translation.translate(key)}`);

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

const undestroyable_item = (id: string) => {
    const item = Item.getItemById(id);
    if(item != null){
        item.setProperties(JSON.stringify({ "minecraft:explodable": false, /* TODO fire res */ }));
        debug_enabled && Logger.Log(`Successfully applied undestroyability to item \'${id}\'`, "Avaritia DEBUG");
    }
}

const INFINITY_ITEM_FRAMES = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1];

if (!Array.prototype.filter){
    Array.prototype.filter = function(fun/*, thisArg*/) {
        if (this === void 0 || this === null) throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) 
            i in t && fun.call(thisArg, t[i], i, t) && res.push(t[i]);
        return res;
    }
    Logger.Log("Created polyfill for Array.prototype.filter", "Avaritia DEBUG");
}

const hsv2rgb = (h: number, s: number, v: number) => {
    let m: number, n: number, f: number, i: number,
        hsv: [number, number, number] = [h, s, v], 
        rgb: [number, number, number] = [null, null, null];
    if(hsv[0] == -1) {
        rgb[0] = rgb[1] = rgb[2] = hsv[2];
        return rgb;
    }
    i = Math.floor(hsv[0]);
    f = hsv[0] - i;
    if(i % 2 == 0) f = 1 - f;
    m = hsv[2] * (1 - hsv[1]);
    n = hsv[2] * (1 - hsv[1] * f);
    switch(i) {
        case 6: case 0: rgb[0] = hsv[2], rgb[1] = n, rgb[2] = m; break;
        case 1: rgb[0] = n, rgb[1] = hsv[2], rgb[2] = m; break;
        case 2: rgb[0] = m, rgb[1] = hsv[2], rgb[2] = n; break;
        case 3: rgb[0] = m, rgb[1] = n, rgb[2] = hsv[2]; break;
        case 4: rgb[0] = n, rgb[1] = m, rgb[2] = hsv[2]; break;
        case 5: rgb[0] = hsv[2], rgb[1] = m, rgb[2] = n; break;
    }
    return rgb;
}