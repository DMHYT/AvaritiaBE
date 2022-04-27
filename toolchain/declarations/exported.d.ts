/// <reference path="core-engine.d.ts" />

declare module vsdum {
    export module avaritia {
        export class NativeArrow extends java.lang.Object {
            static class: java.lang.Class<NativeArrow>;
            constructor(arrowEntity: number);
            setPower(power: number): void;
            setIsCritical(crit: boolean): void;
            setKnockbackStrength(strength: number): void;
            setFire(flameLevel: number): void;
            setIsCreative(creative: boolean): void;
            setOwner(owner: number): void;
            getOwner(): number;
            shoot(yaw: number, pitch: number, power: number, inaccuracy: number, shooter: number): void;
        }
    }
}
declare function WRAP_JAVA(clazz: "vsdum.avaritia.NativeArrow"): typeof vsdum.avaritia.NativeArrow;