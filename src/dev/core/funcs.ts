const addShaped = (id: number, count: number, data: number, mask: string[], keys: (string | number)[]) => Recipes.addShaped({ id, count, data }, mask, keys);
const addShapeless = (id: number, count: number, data: number, ingredients: [number, number][]) => Recipes.addShapeless({ id, count, data }, ingredients.map(el => { return { id: el[0], data: el[1] } }));

type SoundPacket = { x: number, y: number, z: number, sound: string, volume: number, pitch: number };
Network.addClientPacket("avaritia.sound", (data: SoundPacket) => World.playSound(data.x, data.y, data.z, data.sound, data.volume, data.pitch));
const playSound = (x: number, y: number, z: number, dimension: number, sound: string, volume: number, pitch: number) =>
    new NetworkConnectedClientList()
        .setupDistancePolicy(x, y, z, dimension, 64)
        .send("avaritia.sound", { x, y, z, sound, volume, pitch });

const check_armor = (player: number) =>
    Entity.getArmorSlot(player, 0).id == ItemID.infinity_helmet &&
    Entity.getArmorSlot(player, 1).id == ItemID.infinity_chestplate &&
    Entity.getArmorSlot(player, 2).id == ItemID.infinity_leggings &&
    Entity.getArmorSlot(player, 3).id == ItemID.infinity_boots;

const INFINITY_TOOLS: number[] = [];
Callback.addCallback("PostLoaded", () => INFINITY_TOOLS.push(
    ItemID.infinity_sword,
    ItemID.infinity_axe,
    ItemID.infinity_pickaxe,
    ItemID.infinity_hammer,
    ItemID.infinity_shovel,
    ItemID.infinity_destroyer,
    ItemID.infinity_hoe,
    ItemID.infinity_helmet,
    ItemID.infinity_chestplate,
    ItemID.infinity_leggings,
    ItemID.infinity_boots,
    ItemID.infinity_bow
));

const addTooltip = (id: number, key: string) => Item.registerNameOverrideFunction(id, (item, name) => {
    const translatedTooltip = Translation.translate(key);
    if(translatedTooltip == key) return name;
    return `${name}\n§o§7${Translation.translate(key)}`
});

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


const CONNECTED_PLAYERS: number[] = [];
Network.addClientPacket("avaritia.connectedplayersupdate", (data: { player: number, connect: boolean }) => data.connect ? !~CONNECTED_PLAYERS.indexOf(data.player) && CONNECTED_PLAYERS.push(data.player) : CONNECTED_PLAYERS.splice(CONNECTED_PLAYERS.indexOf(data.player), 1));
Callback.addCallback("ServerPlayerLoaded", player => {
    Network.sendToAllClients("avaritia.connectedplayersupdate", { player, connect: true });
    const players = Network.getConnectedPlayers();
    const client = Network.getClientForPlayer(player);
    for(let i in players) client.send("avaritia.connectedplayersupdate", { player: players[i], connect: true });
});
Callback.addCallback("ServerPlayerLeft", player => Network.sendToAllClients("avaritia.connectedplayersupdate", { player, connect: false }));
Callback.addCallback("LevelLeft", () => CONNECTED_PLAYERS.splice(0, CONNECTED_PLAYERS.length));


const queuedActions: (() => void)[] = [];
var isLevelDisplayed: boolean = false;
const ensureWorldLoaded = (action: () => void) => isLevelDisplayed ? action() : queuedActions.push(action);
Callback.addCallback("LevelDisplayed", () => {
    isLevelDisplayed = true;
    debug_enabled = __config__.getBool("debug");
    debug_enabled && Logger.Log(`The level has been displayed, executing ${queuedActions.length} queued tasks...`, "AVARITIA DEBUG");
    queuedActions.forEach(action => action());
    queuedActions.splice(0, queuedActions.length);
});
Callback.addCallback("LevelLeft", () => isLevelDisplayed = false);

ensureWorldLoaded(() => {
    MAX_GAPING_VOID_VIEW_DISTANCE = __config__.getInteger("max_gaping_void_view_distance");
    VOID_PARTICLES_PER_TICK = __config__.getInteger("void_particles_per_tick");
    COLLECTOR_PROCESS_TIME = __config__.getInteger("collector_process_time");
    BORING_FOOD = __config__.getBool("boring_food");
    EYE_COLOR_UPDATE_FREQUENCY = __config__.getInteger("eye_color_update_frequency");
    EYE_COLOR_RANDOM_SEED_CHANGING = __config__.getBool("eye_color_random_seed_changing");
});


const actionsOnGuiChanged: (() => void)[] = [];
var isInGame: boolean = false;
const ensurePlayerInGame = (action: () => void) => isInGame ? action() : actionsOnGuiChanged.push(action);
Callback.addCallback("NativeGuiChanged", screen => {
    if(screen == "hud_screen" || screen == "in_game_play_screen") {
        isInGame = true;
        debug_enabled && Logger.Log(`The player is in game, executing ${actionsOnGuiChanged.length} queued tasks...`, "AVARITIA DEBUG");
        actionsOnGuiChanged.forEach(action => action());
        actionsOnGuiChanged.splice(0, actionsOnGuiChanged.length);
    } else isInGame = false;
});