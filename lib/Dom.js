export default class Dom {
  constructor(component) {
    this.component = component;
  }

  markAsRendered($el) {
    $el.setAttribute("data-render-id", this.component.renderId);
  }

  findValue(path) {
    return path.split(".").reduce((point, seg) => {
      const target = point[seg];
      if (target === undefined) throw new Error(`${path} was not found`);
      return target;
    }, this.component.data);
  }

  addIndexes($container) {
    Array.from($container.children).forEach(
      ($el, index) => ($el.dataset.index = index)
    );
  }
}
