import Dom from "./Dom.js";
import { nextTick } from "./utils.js";

const selectors = {
  loop: "*[data-loop]",
};

export default class Looper extends Dom {
  wrapTemplate($el) {
    Array.from($el.querySelectorAll(selectors.loop)).forEach(($child) => {
      this.wrapTemplate($child);
    });

    if ($el.dataset.loop.includes("{")) $el.dataset.nested = true;
    $el.innerHTML = `<template>${$el.innerHTML}</template>`;
  }

  loop() {
    const $loops = this.#findLoops(this.component.$root);

    $loops.forEach(($el) => {
      this.wrapTemplate($el);
    });

    $loops.forEach(($el) => {
      // if it has a wildcard, do not
      if (!$el.dataset.nested) this.#buildTemplate($el);
    });
  }

  onArrayUpdate(path) {
    const $els = this.#findLoops(this.component.$root, path);
    $els.forEach(($el) => {
      if (!$el.dataset.nested) this.#buildTemplate($el);
    });
  }

  clearAllChildren($container) {
    Array.from($container.children).forEach(($el) => {
      if ($el.nodeName !== "TEMPLATE") $el.remove();
    });
  }

  #buildTemplate($el) {
    const path = $el.dataset.loop;
    const arr = this.#findLoopArr($el);
    // its cause you are pulling it from the shadow again, not updated there...
    const html = $el.querySelector("template").innerHTML;

    // mark as rendered this cycle
    this.markAsRendered($el);
    this.clearAllChildren($el);

    $el.innerHTML += arr.reduce((contents, item, index) => {
      const replaced = (contents += html.replaceAll(
        `${path}.{index}`,
        `${path}.${index}`
      ));

      return replaced;
    }, "");

    this.addIndexes($el);
    this.component.patcher.patch($el);
    this.#findLoops($el).forEach(this.#buildTemplate.bind(this));
  }

  #findLoops($container, path = null) {
    const selector = path ? `*[data-loop="${path}"]` : "*[data-loop]";

    return Array.from($container.querySelectorAll(selector)).filter(
      ($tpl) => $tpl.dataset.render !== this.component.renderId
    );
  }

  #findLoopArr($el) {
    const path = $el.dataset.loop;
    try {
      return this.findValue(path);
    } catch (err) {
      console.error(`"${path}" not found in data`, $el);
      return "";
    }
  }
}
