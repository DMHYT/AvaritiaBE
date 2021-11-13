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
IMPORT("RecipeTileEntity");
IMPORT("StorageInterface");
IMPORT("VanillaSlots");

const Color = android.graphics.Color;
const JString = java.lang.String;
const Integer = java.lang.Integer;
type HashMap<K, V> = java.util.HashMap<K, V>;
type UIElement = com.zhekasmirnov.innercore.api.mod.ui.elements.UIElement;
type IWindow = com.zhekasmirnov.innercore.api.mod.ui.window.IWindow;

const debug_enabled = __config__.getBool("debug");
const MAX_GAPING_VOID_VIEW_DISTANCE = __config__.getInteger("max_gaping_void_view_distance");
const VOID_PARTICLES_PER_TICK = __config__.getInteger("void_particles_per_tick");
const COLLECTOR_PROCESS_TIME = __config__.getInteger("collector_process_time");
const BORING_FOOD = __config__.getBool("boring_food");
const EYE_COLOR_UPDATE_FREQUENCY = __config__.getInteger("eye_color_update_frequency");

const rand = new java.util.Random();

const AVA_STUFF: number[] = [];

const EntityArrow = WRAP_JAVA("vsdum.avaritia.NativeArrow");
const AvaritiaFuncs = WRAP_JAVA("vsdum.avaritia.Avaritia");

const INFINITY_ITEM_FRAMES = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1];