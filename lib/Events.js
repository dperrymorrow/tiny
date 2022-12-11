import Dom from "./dom.js";
import { isFunction } from "./utils.js";

export default class Events extends Dom {
  addHandler($el) {
    const [trigger, handler] = $el.dataset.on.split("->");
    try {
      const fn = this.#getHandler(handler);
      // const args = $el.dataset.args ? this.#findArgs($el)
      $el.addEventListener(trigger, (event) => {
        const args = [event, ...this.#getArgs($el)];
        fn.call(this.component, ...args);
      });
    } catch (err) {
      console.error(err, $el, this.component);
    }
  }

  #getArgs($el) {
    return $el.dataset.args
      ? $el.dataset.args.split(",").map((str) => this.findValue(str))
      : [];
  }

  #getHandler(fnName) {
    const fn = this.component[fnName];
    if (!fn || !isFunction(fn))
      throw new Error(`${fnName} not found in component`);
    return fn;
  }
}
