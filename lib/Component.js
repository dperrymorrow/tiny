import Observer from "./observer.js";
import Patch from "./Patch.js";
import Looper from "./looper.js";
import DomObserver from "./DomObserver.js";
import { randomHash } from "./utils.js";

export default class Component {
  refs = {};
  debug = true;
  data = {};

  constructor(props = {}) {
    this.componentId = randomHash();
    this.renderId = randomHash();

    this.name = this.constructor.name;
    this.template = document.querySelector(
      `template[data-component=${this.name}]`
    ).innerHTML;
    // TODO: make a poj first, make props and data observable
    this.props = Observer(props, this.onChange.bind(this));
    this.patcher = new Patch(this);
    this.looper = new Looper(this);
  }

  trace(...args) {
    if (this.debug) console.log(...args);
  }

  onChange({ path, action }) {
    // TODO: need to debounce this
    this.renderId = randomHash();

    console.log(this.refs);

    this.trace("change:", path);

    path = path.replace(".length", "");
    const target = this.patcher.findValue(path);

    // console.log("renamed to", path, target);

    if (Array.isArray(target)) {
      console.log("updating loops");
      this.looper.onArrayUpdate(path);
    } else {
      this.patcher.patch(this.$root, path);
    }
  }

  render($target) {
    this.data = Observer(this.data, this.onChange.bind(this));
    this.$root = $target;

    this.observer = new DomObserver(this);
    this.observer.listen();

    this.$root.innerHTML = this.template;

    // TODO: pretty sure we want all this going through the observer
    this.looper.loop();
    this.patcher.patch();
  }
}
