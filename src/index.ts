export default abstract class ProxyToGate {
  constructor() {
    return new Proxy(this, {
      get: (parent, property) => {
        // handle exists method
        if (property in parent) {
          return parent[property as keyof typeof parent];
        }
        // handle unhandled promises
        if (property === 'then') {
          return new Promise((resolve) => resolve(parent));
        }
        // handle unhandled methods
        if (typeof parent.__call === 'function') {
          return parent.__call(property);
        }
        // missing implementation
        throw new Error('The "__call" method not implemented.');
      },
    });
  }

  /**
   * Proxy unhandled method and properties.
   */
  protected abstract __call(property: string | symbol): () => any;
}
