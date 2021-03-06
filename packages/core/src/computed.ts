export interface ComputedParams<T>{
    expression?: string | ((val: T) => T);
}

const genComputedKey = (key: string) => `$$computed_${key}`;

export function getComputedInnerValue(target: any, key: string) {
    return Reflect.get(target, genComputedKey(key));
}

export function setComputedInnerValue<T>(target: any, key: string, value: T) {
    Reflect.set(target, genComputedKey(key), value);
}

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
                        newVal = this[expression] && this[expression](val);
                    } else {
                        newVal = expression.call(this, val);
                    }
                }
                return newVal || val;
            }
        });
    };
}

export default computed;