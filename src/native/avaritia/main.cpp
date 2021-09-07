#include <hook.h>
#include <mod.h>
#include <logger.h>
#include <symbol.h>
#include <innercore_callbacks.h>
#include <nativejs.h>
#include "recovered.hpp"

using namespace HookManager;

jclass getMyJavaCallbackClass() {
	static jclass myCallbackClass = nullptr;
	if(myCallbackClass == nullptr) {
		JNIEnv* env;
		ATTACH_JAVA(env, JNI_VERSION) {
			jclass localClass = env->FindClass("ua/vsdum/avaritia/Avaritia");
			myCallbackClass = reinterpret_cast<jclass>(env->NewGlobalRef(localClass));
		}
	}
	return myCallbackClass;
}

class MainModule : public Module {
public:
	MainModule(const char* id): Module(id) {};

	virtual void initialize() {
		DLHandleManager::initializeHandle("libminecraftpe.so", "mcpe");
		addCallback(SYMBOL("mcpe", "_ZN6Player14jumpFromGroundEv"), LAMBDA((Player* player), {
			JavaCallbacks::invokeCallback(getMyJavaCallbackClass(), "onPlayerJump", "(J)V", (jlong) player->getUniqueID()->id);
		}, ), CALL | LISTENER);
    }
};

MAIN {
	Module* main_module = new MainModule("avaritia");
}

JS_MODULE_VERSION(AvaritiaNative, 1);
JS_EXPORT(AvaritiaNative, moveActorRelative, "V(LFFFF)", (JNIEnv*, long long entity, float f1, float f2, float f3, float f4) {
	ActorUniqueID uid(entity);
	Actor* actor = GlobalContext::getLevel()->fetchEntity(uid, true);
	if(actor != nullptr){ 
		actor->moveRelative(f1, f2, f3, f4);
	}
	return 0;
});
JS_EXPORT(AvaritiaNative, isActorInWater, "I(L)", (JNIEnv*, long long entity) {
	ActorUniqueID uid(entity);
	Actor* actor = GlobalContext::getLevel()->fetchEntity(uid, true);
	if(actor == nullptr) {
		return NativeJS::wrapIntegerResult(0);
	} else {
		bool inWater = actor->isInWater();
		return NativeJS::wrapIntegerResult(inWater ? 1 : 0);
	}
});

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