import  HEADERS from "./headers.js";
import LINKS from "./links.js";

(function Module(context, HEADERS, LINKS) {

  class Render {
    /**
     * @param {HTMLElement} rootEle
     * @param {Object<string, string} Headers
     * @param {Object<string, string[]>} Links
     */
    constructor(rootEle, Headers, Links) {
      this._rootEle = rootEle;
      this._headers = Headers;
      this._links = Links;
      this._headerTag = "H3";
      this._linkTag = "A";
      /**@type {HTMLElement | undefined} */
      this.lastTarget = undefined;
    }

    /**
     * @returns {HTMLElement}
     */
    _createElement(tag, id, classNames = undefined) {
      let ele = context.createElement(tag);
      ele.id = id;
      if (classNames && Array.isArray(classNames)) {
        ele.classList.add(...classNames);
      }
      return ele;
    }

    _addEventListner() {
      this._rootEle.addEventListener("click", (event) => {
        const { target } = event;
        if (target.tagName === this._headerTag && this._content) {
          if (
            this.lastTarget &&
            this.lastTarget.classList.contains("clicked")
          ) {
            this.lastTarget.classList.remove("clicked");
          }
          this.lastTarget = target;
          target.classList.add("clicked");
          if (this._content.childElementCount === 0) {
            console.log("targt", target.id, target.tagName);
            this._appendElementsOfHeader(
              this._content,
              this._links[target.innerText]
            );
          } else if (
            this._content.firstElementChild.id !== `${target.innerText}_links`
          ) {
            this._content.removeChild(this._content.firstElementChild);
            this._appendElementsOfHeader(
              this._content,
              this._links[target.innerText]
            );
          }
        }
      });
    }

    _createHeaderElement(headerTitle, id, classNames = undefined) {
      let ele = context.createElement(this._headerTag.toLowerCase());
      ele.innerText = headerTitle;
      ele.id = id;
      if (classNames && Array.isArray(classNames)) {
        ele.classList.add(...classNames);
      }
      return ele;
    }

    _createSubHeaderElement(subHeaderTitle) {
      let ele = context.createElement("h4");
      ele.innerText = subHeaderTitle;
      return ele;
    }

    _createLinkTag(linkTitle, linkURL) {
      let ele = context.createElement(this._linkTag.toLowerCase());
      ele.innerText = linkTitle;
      ele.href = linkURL;
      return ele;
    }

    /**
     *
     * @param { HTMLElement } target
     * @param  {Array<{title, url}> } links
     */
    _appendElementsOfHeader(target, links) {
      let linksFragment = context.createDocumentFragment();
      let ul = this._createElement("ul", `${this.lastTarget.innerText}_links`);
      links.forEach((link) => {
        let li = this._createElement("ul", "link");
        li.appendChild(this._createLinkTag(link.title, link.url));
        ul.appendChild(li);
      });
      linksFragment.append(ul);
      target.appendChild(linksFragment);
    }

    renderHeaders() {
      let headerDocumentFragment = context.createDocumentFragment();
      let div = this._createElement("div", "headers", ["headers"]);
      Object.keys(this._headers).forEach((key) => {
        const title = this._headers[key];
        div.appendChild(this._createHeaderElement(title, key, ["header"]));
      });
      headerDocumentFragment.appendChild(div);
      return headerDocumentFragment;
    }

    render() {
      this._addEventListner();
      this._rootEle.appendChild(this.renderHeaders());
      this._content = this._createElement("div", "content", ["links"]);
      this._rootEle.appendChild(this._content);
    }
  }

  const root = context.getElementById("root");
  const site = new Render(root, HEADERS, LINKS);
  site.render();
})(document, HEADERS, LINKS);
