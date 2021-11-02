#include <stl/vector>

#ifndef AVARITIA_RECOVERED_HPP
#define AVARITIA_RECOVERED_HPP

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

class Actor {
    public:
    ActorUniqueID* getUniqueID() const;
    void moveRelative(float, float, float, float);
    virtual bool isInWater() const;
    std::__ndk1::vector<MobEffectInstance> getAllEffects() const;
    void removeEffect(int);
    static Actor* wrap(long long);
};
class Mob : public Actor {public:};
class Player : public Mob {public:};
class LocalPlayer : public Player {public:};

class BlockPos {
    public:
    BlockPos(float, float, float);
    BlockPos(double, double, double);
};

class Vec3 {
    public:
    Vec3(BlockPos const&);
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