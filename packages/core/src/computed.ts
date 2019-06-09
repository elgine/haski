export interface ComputedParams<T>{
    expression?: string | ((key: string, val: T) => T);
}

const genComputedKey = (key: string) => `$$computed_${key}`;

export const isComputed = (target: any, key: string) => {
    return Reflect.has(target, genComputedKey(key));
};

function computed<T>({ expression }: ComputedParams<T>) {
    return function(target: any, propertyKey: string|Symbol, descriptor?: PropertyDescriptor) {
        let key = typeof propertyKey === 'string' ? propertyKey : propertyKey.toString();
        let computedKey = genComputedKey(key);
        Object.defineProperty(target, key, {
            configurable: descriptor && descriptor.configurable,
            enumerable: descriptor && descriptor.enumerable,
            set(val: T) {
                Reflect.set(this, computedKey, val);
            },
            get() {
                let val = Reflect.get(this, computedKey);
                let newVal = val;
                if (expression) {
                    if (typeof expression === 'string') {
                        newVal = this[expression] && this[expression](key, val);
                    } else {
                        newVal = expression.call(this, key, val);
                    }
                }
                return newVal || val;
            }
        });
    };
}

export default computed;