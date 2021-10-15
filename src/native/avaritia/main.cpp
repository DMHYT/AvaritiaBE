#include <hook.h>
#include <logger.h>
#include <symbol.h>
#include <innercore_callbacks.h>
#include <nativejs.h>
#include <jni.h>
#include "recovered.hpp"
#include "mod.hpp"


AvaritiaNativeModule::AvaritiaNativeModule(const char* id): Module(id) {};
void AvaritiaNativeModule::initialize() {
	DLHandleManager::initializeHandle("libminecraftpe.so", "mcpe");
	HookManager::addCallback(SYMBOL("mcpe", "_ZN6Player14jumpFromGroundEv"), LAMBDA((Player* player), {
		JNIEnv* env;
		ATTACH_JAVA(env, JNI_VERSION_1_4) {
			jclass clazz = env->FindClass("ua/vsdum/avaritia/Avaritia");
			jmethodID method = env->GetStaticMethodID(clazz, "onPlayerJump", "(J)V");
			env->CallStaticVoidMethod(clazz, method, (jlong) (player->getUniqueID()->id));
		}
	}, ), HookManager::CALL | HookManager::LISTENER);
}

MAIN {
	Module* main_module = new AvaritiaNativeModule("avaritia");
}

extern "C" {

JNIEXPORT void JNICALL Java_ua_vsdum_avaritia_Avaritia_nativeMoveActorRelative
(JNIEnv*, jclass, jlong entity, jfloat f1, jfloat f2, jfloat f3, jfloat f4) {
	ActorUniqueID uid(entity);
	Actor* actor = GlobalContext::getLevel()->fetchEntity(uid, true);
	if(actor != nullptr) {
		actor->moveRelative(f1, f2, f3, f4);
	} else {
		Logger::error("AVARITIA", "Fetched entity is nullptr!");
		Logger::flush();
	}
}

JNIEXPORT jboolean JNICALL Java_ua_vsdum_avaritia_Avaritia_nativeIsActorInWater
(JNIEnv*, jclass, jlong entity) {
	ActorUniqueID uid(entity);
	Actor* actor = GlobalContext::getLevel()->fetchEntity(uid, true);
	if(actor == nullptr) {
		Logger::error("AVARITIA", "Fetched entity is nullptr!");
		Logger::flush();
		return false;
	} else {
		return actor->isInWater();
	}
}

JNIEXPORT jlong JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeGetForEntity
(JNIEnv*, jclass, jlong entity) {
	ActorUniqueID uid(entity);
	Actor* actor = GlobalContext::getLevel()->fetchEntity(uid, true);
	if(actor != nullptr) {
		Arrow* arrow = dynamic_cast<Arrow*>(actor);
		if(arrow != nullptr) {
			return (jlong) arrow;
		}
	}
	return 0;
}

JNIEXPORT void JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeSetDamage
(JNIEnv*, jclass, jlong ptr, jfloat damage) {
	Arrow* arrow = (Arrow*) ptr;
	arrow->setBaseDamage(damage);
}

JNIEXPORT void JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeSetIsCritical
(JNIEnv*, jclass, jlong ptr, jboolean critical) {
	Arrow* arrow = (Arrow*) ptr;
	arrow->setCritical(critical);
}

JNIEXPORT void JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeSetKnockbackStrength
(JNIEnv*, jclass, jlong ptr, jint strength) {
	Arrow* arrow = (Arrow*) ptr;
	arrow->setEnchantPunch(strength);
}

JNIEXPORT void JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeSetFire
(JNIEnv*, jclass, jlong ptr, jint flame) {
	Arrow* arrow = (Arrow*) ptr;
	arrow->setEnchantFlame(flame);
}

JNIEXPORT void JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeShoot
(JNIEnv*, jclass, jlong ptr, jfloat x, jfloat y, jfloat z, jfloat pitch, jfloat yaw, jfloat ax, jfloat ay, jfloat az) {
	Arrow* arrow = (Arrow*) ptr;
	Vec3 pos(BlockPos(x, y, z));
	Vec3 acceleration(BlockPos(ax, ay, az));
	arrow->shoot(pos, pitch, yaw, acceleration);
}

JNIEXPORT jfloat JNICALL Java_ua_vsdum_avaritia_NativeArrow_nativeGetDamage
(JNIEnv*, jclass, jlong ptr) {
	Arrow* arrow = (Arrow*) ptr;
	return arrow->getBaseDamage();
}

}

// native js signature rules:
/* signature represents parameters and return type, RETURN_TYPE(PARAMETERS...) example: S(OI)
	return types:
		V - void      - return 0
		I - long int  - wrapIntegerResult
		F - double    - wrapDoubleResult
		S - string    - wrapStringResult
		O - object    - wrapObjectResult
	parameter types:
		I - int (4 bits) 
		L - long (8 bits)
		F - float (4 bits)
		D - double (8 bits)
		B - boolean (1 bit)
		C - char (1 bit)
	as seen, basic call functions cannot receive string and objects for sake of performance, so complex functions come in place
	in case of complex functions parameters are ignored
	JNIEnv* is always passed as first parameter
*/