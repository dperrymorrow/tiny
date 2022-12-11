function buildProxy(poj, callback, tree = []) {
  const getPath = (prop) => tree.concat(prop).join(".");

  return new Proxy(poj, {
    get(target, prop) {
      const value = Reflect.get(...arguments);

      if (
        value &&
        typeof value === "object" &&
        ["Array", "Object"].includes(value.constructor.name)
      )
        return buildProxy(value, callback, tree.concat(prop));

      return value;
    },

    set(target, prop, value) {
      const ret = Reflect.set(...arguments);
      callback({
        action: "set",
        path: getPath(prop),
        target,
        newValue: value,
        previousValue: Reflect.get(...arguments),
      });
      return ret;
    },

    deleteProperty(target, prop) {
      const ret = Reflect.deleteProperty(...arguments);
      callback({ action: "delete", path: getPath(prop), target });
      return ret;
    },
  });
}

export default buildProxy;
