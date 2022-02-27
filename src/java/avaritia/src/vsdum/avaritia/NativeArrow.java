package vsdum.avaritia;

public class NativeArrow {
    
    private static native boolean nativeIsArrowEntity(long entity);
    private static native void nativeSetPower(long uid, int power);
    private static native void nativeSetIsCritical(long uid, boolean critical);
    private static native void nativeSetKnockbackStrength(long uid, int strength);
    private static native void nativeSetFire(long uid, int flame);
    private static native void nativeSetIsCreative(long uid, boolean creative);
    private static native void nativeSetOwner(long uid, long owner);
    private static native long nativeGetOwner(long uid);
    private static native void nativeShoot(long uid, float pitch, float yaw, float velocity, float inaccuracy, long shooter);

    private final long uid;

    public NativeArrow(long entity)
    {
        this.uid = entity;
        if(!nativeIsArrowEntity(entity))
            throw new IllegalArgumentException("Given entity is not arrow!");
    }

    public void setPower(int power)
    {
        nativeSetPower(this.uid, power);
    }

    public void setIsCritical(boolean crit)
    {
        nativeSetIsCritical(this.uid, crit);
    }

    public void setKnockbackStrength(int strength)
    {
        nativeSetKnockbackStrength(this.uid, strength);
    }

    public void setFire(int ticks)
    {
        nativeSetFire(this.uid, ticks);
    }

    public void setIsCreative(boolean creative)
    {
        nativeSetIsCreative(this.uid, creative);
    }

    public void setOwner(long owner)
    {
        nativeSetOwner(this.uid, owner);
    }

    public long getOwner()
    {
        return nativeGetOwner(this.uid);
    }

    public void shoot(float yaw, float pitch, float velocity, float inaccuracy, long shooter)
    {
        nativeShoot(this.uid, pitch, yaw, velocity, inaccuracy, shooter);
    }
    
}
