package ua.vsdum.avaritia;

import java.util.HashMap;
import java.util.Map;

import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.runtime.Callback;

public class Avaritia {

    private static final Map<Long, Boolean> onGroundMap = new HashMap<>();
    private static final Map<Long, Boolean> flyingMap = new HashMap<>();
    
    public static void boot(HashMap<?, ?> something)
    {
        Logger.debug("Avaritia", "Loading java side...");
    }

    public static void onPlayerJump(long uid)
    {
        Callback.invokeAPICallback("PlayerJump", new Object[]{ Long.valueOf(uid) });
    }

    public static void onPlayerOnGroundChanged(long player, boolean onGround)
    {
        onGroundMap.put(Long.valueOf(player), Boolean.valueOf(onGround));
    }

    public static void onPlayerFlyingChanged(long player, boolean flying)
    {
        flyingMap.put(Long.valueOf(player), Boolean.valueOf(flying));
    }

    public static void isPlayerOnGround(long player)
    {

    }

    static {
        
    }

}
