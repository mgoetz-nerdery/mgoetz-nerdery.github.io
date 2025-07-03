class FlippableCard extends HTMLElement {
  constructor() {
    super();

    const template = document.getElementById('card-template');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  sendFlipEvent() {
    this.dispatchEvent(new CustomEvent('card-flip'));
  }

  connectedCallback() {
    this.addEventListener('click', this.sendFlipEvent);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.sendFlipEvent);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-flipped') {
      if (oldValue && !newValue) {
        this.shadowRoot.querySelector('button').classList.remove('flipped');
      } else if (newValue && !oldValue) {
        this.shadowRoot.querySelector('button').classList.add('flipped');
      }
    }
  }

  static get observedAttributes() {
    return ['data-flipped'];
  }
}

if (!customElements.get('flippable-card')) {
  customElements.define('flippable-card', FlippableCard);
}

