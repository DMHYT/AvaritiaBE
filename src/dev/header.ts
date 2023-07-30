/*
 █████╗ ██╗   ██╗ █████╗ ██████╗ ██╗████████╗██╗ █████╗   ██████╗ ███████╗
██╔══██╗██║   ██║██╔══██╗██╔══██╗██║╚══██╔══╝██║██╔══██╗  ██╔══██╗██╔════╝
███████║╚██╗ ██╔╝███████║██████╔╝██║   ██║   ██║███████║  ██████╦╝█████╗  
██╔══██║ ╚████╔╝ ██╔══██║██╔══██╗██║   ██║   ██║██╔══██║  ██╔══██╗██╔══╝  
██║  ██║  ╚██╔╝  ██║  ██║██║  ██║██║   ██║   ██║██║  ██║  ██████╦╝███████╗
╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝  ╚═════╝ ╚══════╝
*/

// © dsdekhm 2022
// YouTube DMH (Russian) - https://www.youtube.com/channel/UCdQKuakM3rnuGV_1VA6XUKQ
// YouTube vstannumdum (English) - https://www.youtube.com/channel/UCXHpQ_SQ8VPigIvbbzHWWdA
// My VK - https://www.vk.com/vstannumdum
// Report bugs in VK Public - https://www.vk.com/dmhmods

IMPORT("ItemAnimHelper");
IMPORT("RecipeTileEntity");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");

declare var KEX: KEXAPI;

const Color = android.graphics.Color;
const JString = java.lang.String;
const Integer = java.lang.Integer;
const Random = java.util.Random;
const File = java.io.File;
type HashMap<K, V> = java.util.HashMap<K, V>;
type UIElement = com.zhekasmirnov.innercore.api.mod.ui.elements.UIElement;

var debug_enabled: boolean = __config__.getBool("debug");
var MAX_GAPING_VOID_VIEW_DISTANCE: number = __config__.getInteger("max_gaping_void_view_distance");
var VOID_PARTICLES_PER_TICK: number = __config__.getInteger("void_particles_per_tick");
var COLLECTOR_PROCESS_TIME: number = __config__.getInteger("collector_process_time");
var BORING_FOOD: boolean = __config__.getBool("boring_food");
var EYE_COLOR_UPDATE_FREQUENCY: number = __config__.getInteger("eye_color_update_frequency");
var EYE_COLOR_RANDOM_SEED_CHANGING: boolean = __config__.getBool("eye_color_random_seed_changing");

const rand = new Random();

const AVA_STUFF: number[] = [];

const EntityArrow = WRAP_JAVA("vsdum.avaritia.NativeArrow");
type EntityArrow = vsdum.avaritia.NativeArrow;

const INFINITY_ITEM_FRAMES = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1];