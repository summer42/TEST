class Subscriber {
    constructor() {
        this.eventMap = {};
      }
    on(eventName, callBack) {
        this.eventMap[eventName] = callBack;
    }
    off(eventName) {
        this.eventMap[eventName] = function () {};
    }
    emit(eventName, data) {
        this.eventMap[eventName](data);
    }
}