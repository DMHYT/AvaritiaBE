#include <mod.h>

#ifndef AVARITIA_MOD_HPP
#define AVARITIA_MOD_HPP


class AvaritiaNativeModule : public Module {
    public:
    AvaritiaNativeModule(const char* id);
    virtual void initialize();
};


#endif //AVARITIA_MOD_HPP