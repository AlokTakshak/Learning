import HEADERS from "./headers.js";
import LINKS from "./links.js";

(function Module(global, context, HEADERS, LINKS) {
  class Render {
    LEARN_RES_TARGET = "learn_res_target";

    /**
     * @param {HTMLElement} rootEle root element where we want to attatch headers and content
     * @param {Object<string, string} Headers an object containing headers
     * @param {Object<string, string[]>} Links an Object have headers as key and  value as array of links
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
     * @param {string} tag name of tag which need to be created
     * @param {string} id id for the tag to be created
     * @param {Array<string> | undefined} classNames class to be added
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
        if (
          target.classList.contains("responsive-header") &&
          target.tagName === this._headerTag
        ) {
          const headers = context.getElementsByTagName(
            this._headerTag.toLocaleLowerCase()
          );
          Object.keys(headers).forEach((key) => {
            headers[key].classList.remove("responsive-header");
          });
        }
        if (target.tagName === this._headerTag && this._content) {
          if (
            this.lastTarget &&
            this.lastTarget.classList.contains("clicked")
          ) {
            this.lastTarget.classList.remove("clicked");
          }
          this.lastTarget = target;
          global.sessionStorage.setItem(
            this.LEARN_RES_TARGET,
            this.lastTarget.innerText
          );
          target.classList.add("clicked");
          if (this._content.childElementCount === 0) {
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
        if (target.classList.contains("fa-bars")) {
          console.log("clicked on menu");
          const headers = context.getElementsByTagName(
            this._headerTag.toLocaleLowerCase()
          );
          Object.keys(headers).forEach((key) => {
            if (headers[key].classList.contains("responsive-header")) {
              headers[key].classList.remove("responsive-header");
            } else {
              headers[key].classList.add("responsive-header");
            }
          });
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
      if (
        global.sessionStorage.getItem(this.LEARN_RES_TARGET) === headerTitle
      ) {
        ele.classList.add("clicked");
        this.lastTarget = ele;
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
     * creates links for corresponding taget and add them to content section
     * @param { HTMLElement } target
     * @param  {Array<{title, url}> } links
     */
    _appendElementsOfHeader(target, links) {
      let linksFragment = context.createDocumentFragment();
      let ul = this._createElement("ol", `${this.lastTarget.innerText}_links`);
      links.forEach((link, index) => {
        let li = this._createElement(
          "li",
          "link",
          index % 2 === 0 ? ["highlighted"] : ""
        );
        li.appendChild(this._createLinkTag(link.title, link.url));
        ul.appendChild(li);
      });
      linksFragment.append(ul);
      target.appendChild(linksFragment);
    }

    /**
     * @param {HTMLElement} ele
     */
    _attachMenu(ele) {
      let i = this._createElement("i", "menu-icon", ["fa", "fa-bars"]);
      let a = this._createElement("a", "menu", ["menu"]);
      a.appendChild(i);
      ele.appendChild(a);
    }

    // renders the Headers Element inside the DOM
    renderHeaders() {
      let headerDocumentFragment = context.createDocumentFragment();
      let div = this._createElement("div", "headers", ["headers"]);
      Object.keys(this._headers).forEach((key) => {
        const title = this._headers[key];
        div.appendChild(this._createHeaderElement(title, key, ["header"]));
      });
      this._attachMenu(div);
      headerDocumentFragment.appendChild(div);
      return headerDocumentFragment;
    }

    // renders the elements based on headers and links file and add event handlers
    render() {
      this._addEventListner();
      this._rootEle.appendChild(this.renderHeaders());
      this._content = this._createElement("div", "content", ["links"]);
      this._rootEle.appendChild(this._content);
      if (global.sessionStorage.getItem(this.LEARN_RES_TARGET)) {
        this._appendElementsOfHeader(
          this._content,
          this._links[global.sessionStorage.getItem(this.LEARN_RES_TARGET)]
        );
      }
    }
  }

  const root = context.getElementById("root");
  const site = new Render(root, HEADERS, LINKS);
  site.render();
})(window, document, HEADERS, LINKS);
