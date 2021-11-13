#ifndef INNERCORE_IDCONVERSION_H
#define INNERCORE_IDCONVERSION_H


namespace IdConversion {
    enum Scope {
        ITEM, BLOCK
    };
    int dynamicToStatic(int dynamicId, IdConversion::Scope scope);
    int staticToDynamic(int staticId, IdConversion::Scope scope);
}


#endif //INNERCORE_IDCONVERSION_H