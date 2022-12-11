import { isElement, nextTick } from "./utils.js";
import Dom from "./Dom.js";
import Events from "./Events.js";
import Refs from "./Refs.js";

export default class DomObserver extends Dom {
  config = { attributes: true, childList: true, subtree: true };

  listen() {
    this.observer = new MutationObserver(this.handleChange.bind(this));
    this.observer.observe(this.component.$root, this.config);

    this.refs = new Refs(this.component);
    this.events = new Events(this.component);
  }

  handleChange(mutationList) {
    mutationList.forEach(({ addedNodes }) => {
      addedNodes.forEach(($node) => {
        if (isElement($node)) this.register($node);
      });
    });
  }

  register($node) {
    const dataset = $node.dataset || {};
    // wonder if we can just check if it has the prop
    if (dataset.renderId) return;
    this.markAsRendered($node);

    Object.keys(dataset).forEach((key) => {
      switch (key) {
        case "on":
          this.events.addHandler($node);
          break;
        case "ref":
          this.refs.register($node);
          break;
      }
    });
    // recursive
    Array.from($node.children).forEach(this.register.bind(this));
  }

  tearDown() {
    this.observer.disconnect();
  }
}
