#include <stl/vector>
#include <stl/string>

#ifndef AVARITIA_RECOVERED_HPP
#define AVARITIA_RECOVERED_HPP


class HashedString {
    public:
    char filler[20];
    const char* c_str() const;
};

class Item {
    public:
    char filler1[90];
    int16_t id;
    char filler2[12];
    HashedString nameId;
};

class MobEffect {
    public:
    bool isHarmful() const;
    static MobEffect* getById(int);
};

class MobEffectInstance {
    public:
    int getId() const;
};

class ActorUniqueID {
    public:
    long long id;
};

class MoveInputHandler {
    public:
    char filler1[4]; // 4 bytes
    float movingLeft; // 8 bytes
    float movingForward; // 12 bytes
};

class BlockPos {
    public:
    BlockPos(float, float, float);
    BlockPos(double, double, double);
};

class Vec3 {
    public:
    float x, y, z;
    Vec3(BlockPos const&);
};

class BreathableComponent {
    public:
    short getMaxAirSupply() const;
    void setAirSupply(short);
};

class ItemStackBase {
    public:
    Item* getItem() const;
};

class ItemStack : public ItemStackBase {
    public:
};

enum ArmorSlot {
    helmet, chestplate, leggings, boots
};

class Actor {
    public:
    char filler1[372];
    bool onGround;
    ActorUniqueID* getUniqueID() const;
    virtual bool isInWater() const;
    virtual bool isOnFire() const;
    virtual void setOnFire(int) const;
    virtual ItemStack* getArmor(ArmorSlot) const;
    std::__ndk1::vector<MobEffectInstance>& getAllEffects() const;
    void removeEffect(int);
    bool isSneaking() const;
    template<typename COMPONENT>
    COMPONENT* tryGetComponent();
    static Actor* wrap(long long);
};

class Mob : public Actor {
    public:
    virtual void setOnFire(int) const;
};

class Player : public Mob {
    public:
    virtual bool isLocalPlayer() const;
};

class LocalPlayer : public Player {
    public:
    virtual bool isLocalPlayer() const;
    MoveInputHandler& getMoveInputHandler();
    bool isFlying() const;
};

class AbstractArrow {
    public:
    virtual void shoot(Vec3 const&, float, float, Vec3 const&);
    void setBaseDamage(float);
    void setIsCreative(bool);
    void setIsPlayerOwned(bool);
    float getBaseDamage();
};

class Arrow : public Actor, public AbstractArrow {
    public:
    virtual void shoot(Vec3 const&, float, float, Vec3 const&);
    void setEnchantFlame(int);
    void setCritical(bool);
    void setEnchantPunch(int);
};

class Level {
    public:
    Actor* fetchEntity(ActorUniqueID, bool) const;
};

namespace GlobalContext {
    Level* getLevel();
    LocalPlayer* getLocalPlayer();
}


#endif //AVARITIA_RECOVERED_HPP