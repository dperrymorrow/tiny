import Dom from "./Dom.js";

const attrMap = {
  text: ($el, value) => ($el.innerText = value),
  value: ($el, value) => ($el.value = value),
  checked: ($el, value) =>
    value ? $el.setAttribute("checked", true) : $el.removeAttribute("checked"),
};

export default class Patch extends Dom {
  patch($root = this.component.$root, target = null) {
    const selector = target ? `*[data-bind^="${target}"]` : `*[data-bind]`;
    const $bindings = $root.querySelectorAll(selector);

    $bindings.forEach(($el) => {
      const [path, attr = "text"] = $el.dataset.bind.split("->");
      let value = this.#findBinding($el);

      // this.component.trace("patching:", $el);
      attrMap[attr]($el, value);
    });
  }

  #findBinding($el) {
    const [path] = $el.dataset.bind.split("->");
    try {
      return this.findValue(path);
    } catch (err) {
      console.warn(`"${path}" not found in data`, $el);
      return "";
    }
  }
}
