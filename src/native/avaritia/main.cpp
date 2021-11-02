#include <hook.h>
#include <logger.h>
#include <symbol.h>
#include <innercore_callbacks.h>
#include <nativejs.h>
#include <jni.h>
#include <stl/vector>
#include <innercore/vtable.h>
#include "recovered.hpp"


class AvaritiaModule : public Module {
	public:
	static jclass ava_class;
	AvaritiaModule(): Module("avaritia") {}
	virtual void initialize() {
		DLHandleManager::initializeHandle("libminecraftpe.so", "mcpe");
		HookManager::addCallback(SYMBOL("mcpe", "_ZN6Player14jumpFromGroundEv"), LAMBDA((Player* player), {
			if(ava_class != nullptr) {
				JavaCallbacks::invokeCallback(ava_class, "onPlayerJump", "(J)V", (jlong) (player->getUniqueID()->id));
			}
		}, ), HookManager::CALL | HookManager::LISTENER);
	}
};
jclass AvaritiaModule::ava_class = nullptr;


MAIN {
	Module* main_module = new AvaritiaModule();
}


extern "C" {

	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_initJNI
	(JNIEnv* env, jclass clazz) {
		AvaritiaModule::ava_class = (jclass) env->NewGlobalRef(clazz);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_nativeMoveActorRelative
	(JNIEnv*, jclass, jlong entity, jfloat f1, jfloat f2, jfloat f3, jfloat f4) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			actor->moveRelative(f1, f2, f3, f4);
		}
	}
	JNIEXPORT jboolean JNICALL Java_vsdum_avaritia_Avaritia_nativeIsActorInWater
	(JNIEnv*, jclass, jlong entity) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			VTABLE_FIND_OFFSET(Actor_isInWater, _ZTV5Actor, _ZNK5Actor9isInWaterEv)
			return VTABLE_CALL<bool>(Actor_isInWater, actor);
		}
		return false;
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_Avaritia_nativeRemoveHarmfulEffectsFrom
	(JNIEnv*, jclass, jlong entity) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			std::__ndk1::vector<MobEffectInstance> effects = actor->getAllEffects();
			for(MobEffectInstance& effect : effects) {
				int effectId = effect.getId();
				if(MobEffect::getById(effectId)->isHarmful()) {
					actor->removeEffect(effectId);
				}
			}
		}
	}
	
	JNIEXPORT jlong JNICALL Java_vsdum_avaritia_NativeArrow_nativeGetForEntity
	(JNIEnv*, jclass, jlong entity) {
		Actor* actor = Actor::wrap(entity);
		if(actor != nullptr) {
			Arrow* arrow = reinterpret_cast<Arrow*>(actor);
			if(arrow != nullptr) {
				return (jlong) arrow;
			}
		}
		return 0;
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetDamage
	(JNIEnv*, jclass, jlong ptr, jfloat damage) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setBaseDamage(damage);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetIsCritical
	(JNIEnv*, jclass, jlong ptr, jboolean critical) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setCritical(critical);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetKnockbackStrength
	(JNIEnv*, jclass, jlong ptr, jint strength) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setEnchantPunch(strength);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeSetFire
	(JNIEnv*, jclass, jlong ptr, jint flame) {
		Arrow* arrow = (Arrow*) ptr;
		arrow->setEnchantFlame(flame);
	}
	JNIEXPORT void JNICALL Java_vsdum_avaritia_NativeArrow_nativeShoot
	(JNIEnv*, jclass, jlong ptr, jfloat x, jfloat y, jfloat z, jfloat pitch, jfloat yaw, jfloat ax, jfloat ay, jfloat az) {
		Arrow* arrow = (Arrow*) ptr;
		Vec3 pos(BlockPos(x, y, z));
		Vec3 acceleration(BlockPos(ax, ay, az));
		arrow->shoot(pos, pitch, yaw, acceleration);
	}
	JNIEXPORT jfloat JNICALL Java_vsdum_avaritia_NativeArrow_nativeGetDamage
	(JNIEnv*, jclass, jlong ptr) {
		Arrow* arrow = (Arrow*) ptr;
		return arrow->getBaseDamage();
	}
	
}