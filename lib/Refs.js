import Dom from "./dom.js";

export default class Refs extends Dom {
  register($el) {
    const ref = $el.dataset.ref;
    const refs = this.component.refs;

    if (!refs[ref]) refs[ref] = $el;
    else if (Array.isArray(refs[ref])) refs[ref].push($el);
    else refs[ref] = [refs[ref], $el];
  }
}
