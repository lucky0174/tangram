export default function subscribeMixin (target) {

    var listeners = new Set();

    return Object.assign(target, {

        subscribe(listener) {
            listeners.add(listener);
        },

        unsubscribe(listener) {
            listeners.delete(listener);
        },

        unsubscribeAll() {
            listeners.clear();
        },

        trigger(event, ...data) {
            for (var listener of listeners) {
                if (typeof listener[event] === 'function') {
                    listener[event](...data);
                }
            }
        }

    });

}
