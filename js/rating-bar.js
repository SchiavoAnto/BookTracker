class RatingBar extends HTMLElement {
    #rootElement;
    #buttons;
    #lastClickedButtonIdx = -1;
    value = 0;

    static get observedAttributes() {
        return ["value"];
    }
    
    constructor() {
        super();

        // Icons from tabler.io/icons
        // Tabler Icons are available under MIT License.
        // Copyright (c) 2018-2026
        // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
        // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        const template = Object.assign(document.createElement("template"), { innerHTML: `
            <style>
                #rating-bar {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
                }
                
                #rating-bar > button {
                    aspect-ratio: 1;
                    padding: 0;
                    background-image: url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2224%22%20height=%2224%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22orange%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20class=%22icon%20icon-tabler%20icons-tabler-outline%20icon-tabler-star%22%3E%3Cpath%20stroke=%22none%22%20d=%22M0%200h24v24H0z%22%20fill=%22none%22%20/%3E%3Cpath%20d=%22M12%2017.75l-6.172%203.245l1.179%20-6.873l-5%20-4.867l6.9%20-1l3.086%20-6.253l3.086%206.253l6.9%201l-5%204.867l1.179%206.873l-6.158%20-3.245%22%20/%3E%3C/svg%3E');
                    background-size: 100%;
                    background-position: 50% 50%;
                    background-repeat: no-repeat;
                    appearance: none;
                    border: none;
                    background-color: transparent;
                    position: relative;
                }
                
                #rating-bar > button[state='half'] {
                    background-image: url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2224%22%20height=%2224%22%20viewBox=%2200%200%2024%2024%22%20fill=%22orange%22%20class=%22icon%20icon-tabler%20icons-tabler-filled%20icon-tabler-star-half%22%3E%3Cpath%20stroke=%22none%22%20d=%22M0%200h24v24H0z%22%20fill=%22none%22%20/%3E%3Cpath%20d=%22M12%201a.993%20.993%200%200%201%20.823%20.443l.067%20.116l2.852%205.781l6.38%20.925c.741%20.108%201.08%20.94%20.703%201.526l-.07%20.095l-.078%20.086l-4.624%204.499l1.09%206.355a1.001%201.001%200%200%201%20-1.249%201.135l-.101%20-.035l-.101%20-.046l-5.693%20-3l-5.706%203c-.105%20.055%20-.212%20.09%20-.32%20.106l-.106%20.01a1.003%201.003%200%200%201%20-1.038%20-1.06l.013%20-.11l1.09%20-6.355l-4.623%20-4.5a1.001%201.001%200%200%201%20.328%20-1.647l.113%20-.036l.114%20-.023l6.379%20-.925l2.853%20-5.78a.968%20.968%200%200%201%20.904%20-.56zm0%203.274v12.476a1%201%200%200%201%20.239%20.029l.115%20.036l.112%20.05l4.363%202.299l-.836%20-4.873a1%201%200%200%201%20.136%20-.696l.07%20-.099l.082%20-.09l3.546%20-3.453l-4.891%20-.708a1%201%200%200%201%20-.62%20-.344l-.073%20-.097l-.06%20-.106l-2.183%20-4.424z%22%20/%3E%3C/svg%3E');
                }
                
                #rating-bar > button[state='full'] {
                    background-image: url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2224%22%20height=%2224%22%20viewBox=%220%200%2024%2024%22%20fill=%22orange%22%20class=%22icon%20icon-tabler%20icons-tabler-filled%20icon-tabler-star%22%3E%3Cpath%20stroke=%22none%22%20d=%22M0%200h24v24H0z%22%20fill=%22none%22%20/%3E%3Cpath%20d=%22M8.243%207.34l-6.38%20.925l-.113%20.023a1%201%200%200%200%20-.44%201.684l4.622%204.499l-1.09%206.355l-.013%20.11a1%201%200%200%200%201.464%20.944l5.706%20-3l5.693%203l.1%20.046a1%201%200%200%200%201.352%20-1.1l-1.091%20-6.355l4.624%20-4.5l.078%20-.085a1%201%200%200%200%20-.633%20-1.62l-6.38%20-.926l-2.852%20-5.78a1%201%200%200%200%20-1.794%200l-2.853%205.78z%22%20/%3E%3C/svg%3E');
                }
            </style>
            <div id="rating-bar">
                <button></button>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
            </div>
        `});

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(document.importNode(template.content, true));

        this.#rootElement = this.shadowRoot.getElementById("rating-bar");
    }

    connectedCallback() {
        this.#buttons = Array.from(this.#rootElement.querySelectorAll("button"));
        for (let i = 0; i < this.#buttons.length; i++) {
            this.#buttons[i].addEventListener("click", () => {
                this.#updateRating(i);
            });
        }

        this.#updateInitialRating(parseFloat(this.getAttribute("value") ?? "0"));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "value":
                this.#updateInitialRating(parseFloat(newValue ?? "0"));
                break;
            default:
                break;
        }
    }

    #updateInitialRating(initial) {
        const floored = Math.floor(initial);
        const frac = initial - Math.floor(initial);
        for (let i = 0; i < floored; i++) {
            this.#buttons[i].setAttribute("state", "full");
        }
        if (frac > 0) {
            this.#buttons[floored].setAttribute("state", "half");
        }
        this.#computeRating();
    }

    #updateRating(index, clickedState = undefined) {
        if (index == 0) {
            const clicked = this.#buttons[index];
            const currentState = clicked.getAttribute("state");
            if (currentState === "half") {
                clicked.removeAttribute("state");
                this.#computeRating();
                this.dispatchEvent(new RatingBarChangeEvent(this.value));
                return;
            }
        }

        if (index == this.#lastClickedButtonIdx) {
            const clicked = this.#buttons[index];
            const currentState = clicked.getAttribute("state");
            if (currentState === "full") {
                clicked.setAttribute("state", clickedState ?? "half");
                this.#computeRating();
                this.dispatchEvent(new RatingBarChangeEvent(this.value));
                return;
            }
        }
        
        for (const button of this.#buttons) {
            button.removeAttribute("state");
        }
        for (let i = 0; i <= index; i++) {
            this.#buttons[i].setAttribute("state", "full");
        }
        this.#lastClickedButtonIdx = index;
    
        this.#computeRating();
        this.dispatchEvent(new RatingBarChangeEvent(this.value));
    }

    #computeRating() {
        this.value = 0;
        for (const button of this.#buttons) {
            if (button.getAttribute("state") === "full") {
                this.value++;
            } else if (button.getAttribute("state") === "half") {
                this.value += 0.5;
            }
        }
    }
}

/**
 * A class representing the event for when the rating is changed.
 */
class RatingBarChangeEvent extends Event {
    /**
     * The value of the rating.
     * @type {number}
     */
    value;
    
    constructor(value) {
        super("value-change");
        this.value = value;
    }
}

window.customElements.define("rating-bar", RatingBar);