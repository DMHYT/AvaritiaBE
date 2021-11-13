const addShaped = (id: number, count: number, data: number, mask: string[], keys: (string | number)[]) => Recipes.addShaped({ id, count, data }, mask, keys);
const addShapeless = (id: number, count: number, data: number, ingredients: [number, number][]) => Recipes.addShapeless({ id, count, data }, ingredients.map(el => { return { id: el[0], data: el[1] } }));

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
    const item = Entity.getCarriedItem(attacker);
    if(item.data > 0 && !!~INFINITY_TOOLS.indexOf(item.id)){
        Entity.setCarriedItem(attacker, item.id, item.count, 0, item.extra);
    }
});
Callback.addCallback("DestroyBlock", (coords, block, player) => {
    const item = Entity.getCarriedItem(player);
    if(item.data > 0 && !!~INFINITY_TOOLS.indexOf(item.id) && !Entity.getSneaking(player)){
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
    }
});
Callback.addCallback("ItemUse", (coords, item, block, isExternal, player) => {
    if(item.data > 0 && !!~INFINITY_TOOLS.indexOf(item.id) && !Entity.getSneaking(player)){
        Entity.setCarriedItem(player, item.id, item.count, 0, item.extra);
    }
});

const addTooltip = (id: number, key: string) => Item.registerNameOverrideFunction(id, (item, name) => `${name}\n§o§7${Translation.translate(key)}`);

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

const itemInstanceFromArray = (arr: ItemInstanceArray) => ({ id: arr[0], count: arr[1], data: arr[2], extra: arr[3] ?? null } as ItemInstance);