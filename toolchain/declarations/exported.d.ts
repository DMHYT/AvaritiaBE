/// <reference path="android.d.ts" />

declare namespace Callback {
    interface PlayerJumpFunction {
        (player: number): void;
    }
    function addCallback(callbackName: "PlayerJump", func: PlayerJumpFunction): void;
}

declare class ____NativeArrow {
    public getPointer(): number;
    public constructor(arrowEntity: number);
    public setDamage(damage: number): void;
    public setIsCritical(crit: boolean): void;
    public setKnockbackStrength(strength: number): void;
    public setFire(flameLevel: number): void;
    public shoot(x: number, y: number, z: number, pitch: number, yaw: number, ax: number, ay: number, az: number): void;
    public getDamage(): number;
}
declare function WRAP_JAVA(clazz: "vsdum.avaritia.NativeArrow"): typeof ____NativeArrow;

declare interface AvaritiaMainClass {
    nativeSetUndestroyableItem(id: number): void;
    nativeRemoveHarmfulEffectsFrom(entity: number): void;
    nativeSetFullAirSupply(entity: number): void;
    nativeIsPlayerInWater(): boolean;
    nativeIsPlayerFlying(): boolean;
    nativeIsPlayerOnGround(): boolean;
    nativeIsPlayerSneaking(): boolean;
    moveActorRelative(strafe: number, up: number, forward: number, friction: number): void;
    nativeGetPlayerMoveForward(): number;
}
declare function WRAP_JAVA(clazz: "vsdum.avaritia.Avaritia"): AvaritiaMainClass;