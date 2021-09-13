package ua.vsdum.avaritia;

import java.util.HashMap;

import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.runtime.Callback;

public class Avaritia {
    
    public static void boot(HashMap<?, ?> something)
    {
        Logger.debug("Avaritia", "Loading java side...");
    }

    public static void onPlayerJump(long uid)
    {
        Callback.invokeAPICallback("PlayerJump", new Object[]{ Long.valueOf(uid) });
    }

}
