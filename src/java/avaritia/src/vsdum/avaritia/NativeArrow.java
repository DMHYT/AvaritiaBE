package vsdum.avaritia;

public class NativeArrow {
    
    private static native long nativeGetForEntity(long entity);
    private static native void nativeSetDamage(long ptr, float damage);
    private static native void nativeSetIsCritical(long ptr, boolean critical);
    private static native void nativeSetKnockbackStrength(long ptr, int strength);
    private static native void nativeSetFire(long ptr, int flame);
    private static native void nativeShoot(long ptr, float x, float y, float z, float pitch, float yaw, float ax, float ay, float az);
    private static native float nativeGetDamage(long ptr);

    private final long pointer;

    public final long getPointer()
    {
        return this.pointer;
    }

    public NativeArrow(long entity)
    {
        this.pointer = nativeGetForEntity(entity);
        if(this.pointer == 0L) throw new IllegalArgumentException("Given entity is not arrow!");
    }

    public void setDamage(float damage)
    {
        nativeSetDamage(this.pointer, damage);
    }

    public void setIsCritical(boolean crit)
    {
        nativeSetIsCritical(this.pointer, crit);
    }

    public void setKnockbackStrength(int strength)
    {
        nativeSetKnockbackStrength(this.pointer, strength);
    }

    public void setFire(int ticks)
    {
        nativeSetFire(this.pointer, ticks);
    }

    public void shoot(float x, float y, float z, float pitch, float yaw, float ax, float ay, float az)
    {
        nativeShoot(this.pointer, x, y, z, pitch, yaw, ax, ay, az);
    }

    public float getDamage()
    {
        return nativeGetDamage(this.pointer);
    }
    
}
