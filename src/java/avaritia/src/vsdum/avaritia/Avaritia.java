package vsdum.avaritia;

import java.util.HashMap;

import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.runtime.Callback;

public class Avaritia {

    private static native void initJNI();
    public static native void nativeMoveActorRelative(long entity, float f1, float f2, float f3, float f4);
    public static native boolean nativeIsActorInWater(long entity);
    public static native void nativeRemoveHarmfulEffectsFrom(long entity);
    
    public static void boot(HashMap<?, ?> something)
    {
        initJNI();
        Logger.debug("Avaritia", "Loading java...");
    }

    public static void onPlayerJump(long uid)
    {
        Callback.invokeAPICallback("PlayerJump", new Object[]{ Long.valueOf(uid) });
    }

}
