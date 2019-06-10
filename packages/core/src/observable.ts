export interface ObservableParams<T>{
    setter?: (val: T, target: T) => T;
    equals?: (oldVal: T, newVal: T) => boolean;
    onDirty?: string | Function;
    onChange?: string | Function;
}

const genObservableKey = (key: string) => `$$observable_${key}`;

export function getObservableInnerValue(target: any, key: string) {
    return Reflect.get(target, genObservableKey(key));
}

export function setObservableInnerValue<T>(target: any, key: string, value: T) {
    Reflect.set(target, genObservableKey(key), value);
}

export const isObservable = (target: any, key: string) => {
    return Reflect.has(target, genObservableKey(key));
};

function observable<T>({ setter, equals, onDirty, onChange }: ObservableParams<T>) {
    const onValChanged = (ctx: any, key: string, oldVal: T, newVal: T) => {
        if (!onChange) return;
        if (typeof onChange === 'string') {
            ctx[onChange](key, oldVal, newVal);
        } else {
            onChange(key, oldVal, newVal);
        }
    };
    const onValDirty = (ctx: any, key: string) => {
        if (onDirty) {
            if (typeof onDirty === 'string') {
                ctx[onDirty](key);
            } else {
                onDirty(key);
            }
        }
    };
    return function(target: Object, propertyKey: string) {
        let key = genObservableKey(propertyKey);
        Object.defineProperty(target, propertyKey, {
            get() { return Reflect.get(this, key) },
            set(v: T) {
                let oldVal = Reflect.get(this, key);
                let newVal;
                let changed = false;
                if (typeof v === 'object') {
                    if (!equals || equals(v, oldVal)) return;
                    if (setter) {
                        newVal = setter(v, oldVal);
                        changed = true;
                    }
                } else if (oldVal !== v) {
                    newVal = v;
                    changed = true;
                }
                if (changed) {
                    Reflect.set(this, key, newVal);
                    onValDirty(this, propertyKey);
                    onValChanged(this, propertyKey, oldVal, newVal);
                }
            }
        });
    };
}

export default observable;