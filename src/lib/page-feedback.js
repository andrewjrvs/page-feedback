var PageFeedback = (function(_super, passedTemplate, passesStyle) {
    var settings = {
        "selector" : 'page-feedback',
        "selectors": {
            "container" : '.feedback-container'
            , "input" : '#pageFeedback'
        }
        , "classes" : {
            "dirty" : 'dirty'
            , "sent" : 'eventSent'
        } 
        , "events" : {
            "submit" : 'page-feedback-DataSubmit'
        }
        , "attributes":  {
            "active" : 'activated'
        }
        , "defaultClearTimeoutSeconds": 10
    };

    var kCode = {
        "enter" : 13
    };

    var _internal = {
        "regex" : {
            "whitespace" : /^\s*$/ig
        }
        , "__container" : null
        , "__input": null
    }

    var matches = function(el, selector) {
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    };

    Object.setPrototypeOf(PageFeedback, _super);
    function __() { this.constructor = PageFeedback; }
    PageFeedback.prototype = (__.prototype = _super.prototype, new __());

    //#region <!-- dom getters -->
    function getContainer(el) {
        return _internal.__container || el && (_internal.__container = el.querySelector(settings.selectors.container));
    }

    function getInput(el) {
        return _internal.__input || el && (_internal.__input = el.querySelector(settings.selectors.input));
    }

    function getShadowDom(el) {
        return el.shadowRoot;
    }
    //#endregion

    //#region <!-- sys Events -->

    function markAs(el, cls, set) {
        var elContainer = getContainer(getShadowDom(el))
            , action = 'add'
        ;
        action = (typeof set === "boolean" ? set : true) ? action : 'remove';
        elContainer && elContainer.classList[action](cls);
    }

    function disableElement(el, set) {
        set = typeof set === "boolean" ? set : true
        if (set) {
            el.setAttribute('disabled', 'disabled');
        } else {
            el.removeAttribute('disabled');
        }
    }

    function clearInput(el) {
        (getInput(getShadowDom(this)) || {}).value = '';
    }

    function triggerSubmitEvent (el, data) {
        markAs(el, settings.classes.sent, true);
        markAs(el, settings.classes.dirty, false);
        disableElement(getInput(getShadowDom(this)), true);
        var submitEvent = new CustomEvent(settings.events.submit, {
            bubbles: true,
            cancelable: true,
            detail: data            
          });
        el.dispatchEvent(submitEvent);
        el.revertTimeoutind = setTimeout(el.reset.bind(el), el.revertDelayMiliSeconds);
    }

    //#endregion

    //#region <!-- User Events -->
    function onKeyup(e) {
        if (e.which === kCode.enter) {
            triggerSubmitEvent(this, e.target.value);
        }
    }

    function onClick(e) {
        if (matches(e.target, '[submit], [submit] *')) {
            var elInput = getInput(getShadowDom(this));
            triggerSubmitEvent(this, elInput ? elInput.value : null);
        }
    }

    function onInput(e) {
        var elInput = getInput(getShadowDom(this));
        markAs(this, settings.classes.dirty, !_internal.regex.whitespace.test(elInput.value));
    }
    //#endregion

    function PageFeedback() {
        var _this = _super.call(this) || this;
        var shadowRoot = _this.attachShadow({ mode: 'open' });
        
        attachEvents.call(_this, shadowRoot);
        attachStyles.call(_this, shadowRoot);
        attachTemplate.call(_this, shadowRoot);
        
        return _this;
    }

    //#region <!-- setup shaddow dom -->

    /** attaches the events to the dom */
    function attachEvents(sDom) {
        sDom.addEventListener('click', onClick.bind(this), false);
        sDom.addEventListener('input', onInput.bind(this), false);
        sDom.addEventListener('keyup', onKeyup.bind(this), false);
    }//end function

    /** Attaches the style to the dom */
    function attachStyles(sDom) {
        var style = document.createElement('style');
        style.textContent = passesStyle;
        sDom.appendChild(style);
    }//end function

    /** attaches the page to the shadow dom */
    function attachTemplate(sDom) { 
        var span = document.createElement('span');
        span.innerHTML = passedTemplate;
        sDom.appendChild(span.firstElementChild.cloneNode(true));
    }//end function

    //#endregion

    //#region <!-- dom connections -->
    PageFeedback.observedAttributes = ['locked', 'disabled', 'revert-after']; 

    PageFeedback.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
        if (name === 'revert-after') {
            this.revertDelayMiliSeconds = (parseInt(newValue, 10) || settings.defaultClearTimeoutSeconds) * 1000;
        }
        
    }
    
    PageFeedback.prototype.connectedCallback = function() {
        this.setAttribute('activated', '');
        this.revertDelayMiliSeconds = settings.defaultClearTimeoutSeconds * 1000;
        this.revertTimeoutind = 0;
        if (this.hasAttribute('revert-after')) {
            this.revertDelayMiliSeconds = (parseInt(this.getAttribute('revert-after'), 10) || settings.defaultClearTimeoutSeconds) * 1000;;
        }
    }

    PageFeedback.prototype.disconnectedCallback = function () {
        this.removeAttribute('activated');
    }

    //#endregion
    
    PageFeedback.prototype.reset = function () {
        clearTimeout(this.revertTimeoutind);
        markAs(this, settings.classes.dirty, false);
        markAs(this, settings.classes.sent, false);
        disableElement(getInput(getShadowDom(this)), false);
        // clear the input
        clearInput(this);
    }

    // Attach the 'named' items;
    PageFeedback.selector = settings.selector;
    PageFeedback.eventName = settings.events.submit;
    return PageFeedback;
})(HTMLElement, page, style);

window.customElements.define(PageFeedback.selector, PageFeedback);