package vsdum.avaritia;

import java.util.HashMap;

import com.zhekasmirnov.horizon.runtime.logger.Logger;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Entity;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Player;
import com.zhekasmirnov.innercore.api.runtime.Callback;

public class Avaritia {

    private static native void initJNI();
    public static native void nativeSetUndestroyableItem(int id);
    public static native void nativeRemoveHarmfulEffectsFrom(long entity);
    public static native void nativeSetFullAirSupply(long entity);
    public static native boolean nativeIsPlayerInWater();
    public static native boolean nativeIsPlayerFlying();
    public static native boolean nativeIsPlayerOnGround();
    public static native boolean nativeIsPlayerSneaking();
    public static native float nativeGetPlayerMoveForward();
    public static native boolean nativeIsPlayerUsingItem();

    public static void moveActorRelative(float strafe, float up, float forward, float friction)
    {
        float lsq = strafe * strafe + up * up + forward * forward;
        if(lsq >= 1.0e-4f)
        {
            lsq = (float) Math.sqrt(lsq);
            if(lsq < 1.0f) lsq = 1.0f;
            lsq = friction / lsq;
            strafe *= lsq;
            up *= lsq;
            forward *= lsq;
            double yaw = Entity.getYaw(Player.get()) * 0.017453292;
            float yawsin = (float) Math.sin(yaw);
            float yawcos = (float) Math.cos(yaw);
            float addX = strafe * yawcos - forward * yawsin;
            float addZ = forward * yawcos + strafe * yawsin;
            float[] vel = Entity.getVelocity(Player.get());
            Entity.setVelocity(Player.get(), vel[0] + addX, vel[1] + up, vel[2] + addZ);
        }
    }

    public static void boot(HashMap<?, ?> something)
    {
        initJNI();
        Logger.debug("Avaritia", "Loading java...");
    }

    public static void onPlayerJump(long uid)
    {
        Callback.invokeAPICallback("PlayerJump", new Object[]{ Long.valueOf(uid) });
    }

    public static void onPlayerGameModeChanged(int mode)
    {
        Callback.invokeAPICallback("PlayerGameModeChanged", new Object[]{ Integer.valueOf(mode) });
    }

}
