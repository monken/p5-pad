Ext.ns('Ext.ux');

/**
 * @class Ext.ux.JSONP
 * @author Tom DuPont
 * @version 2.0
 */
Ext.ux.JSONP = {
    // Private Properties
    /**
     * @private
     * @property
     * @type Array
     */
    queue : [],
    /**
     * @private
     * @property
     * @type Ext.util.DelayedTask
     */
    timer : null,
    /**
     * @private
     * @property
     * @type Boolean
     */
    isActive : false,

    // Public
    /**
     * @public
     * @method
     * @param {Object} options
     */
    request : function(options) {
        if (!options || Ext.isEmpty(options.url)) {
            return;
        }

        var request = new Ext.ux.JsonpRequest(options);
        this.queue.push(request);

        this.processQueue();
    },
    /**
     * @public
     * @method
     * @param {Object} json
     */
    callback : function(json) {
        this.timer.cancel();
        this.isActive = false;

        var request = this.queue.shift();
        request.processResponse(json);
        Ext.destroy(request);

        this.processQueue();
    },

    // Private
    /**
     * @private
     * @method
     */
    processQueue : function() {
        if (this.isActive || this.queue.length == 0) {
            return;
        }

        var request = this.queue[0];
        request.begin();

        if (!this.timer) {
            this.timer = new Ext.util.DelayedTask(this.callback, this);
        }
        var timeout = request.timeout || 30000;
        this.timer.delay(timeout);
        this.isActive = true;
    }
};

/**
 * @class Ext.ux.JsonpRequest
 * @author Tom DuPont
 * @version 2.0
 * @extends Ext.util.Observable
 */
Ext.ux.JsonpRequest = Ext.extend(Ext.util.Observable, {
        // Overrides
        /**
         * @constructor
         * @param {Object} options
         */
        constructor : function(options) {
            Ext.apply(this, options);
            this.params[this.callbackKey] = 'Ext.ux.JSONP.callback';
            this.script = document.createElement('script');
            this.script.type = 'text/javascript';

            if (options.isRawJSON) {
                if (Ext.isIE) {
                    Ext.fly(this.script).on({
                            readystatechange : this.onReadyStateChange,
                            scope : this
                        });
                } else {
                    Ext.fly(this.script).on({
                            load : this.onLoad,
                            scope : this
                        });
                }
            }
        },

        // Properties
        /**
         * @public
         * @property
         * @config {String} url
         * @type String
         */
        url : null,
        /**
         * @public
         * @property
         * @config {Function} success
         * @type Function
         */
        success : null,
        /**
         * @public
         * @property
         * @config {Function} failure
         * @type Function
         */
        failure : null,
        /**
         * @public
         * @property
         * @config {Function} callback
         * @type Function
         */
        callback : null,
        /**
         * @public
         * @property
         * @config {Object} scope
         * @type Object
         */
        scope : null,
        /**
         * @public
         * @property
         * @config {Object} params
         * @type Object
         */
        params : {},
        /**
         * @public
         * @property
         * @config {String} callbackKey
         * @type String
         */
        callbackKey : 'jsoncallback',
        /**
         * @private
         * @property
         * @type HTMLElement
         */
        script : null,
        /**
         * @public
         * @property
         * @config {Number} timeout
         * @type Number
         */
        timeout : 10000,

        // Public Methods
        /**
         * @public
         * @method
         * @param {Object} json
         */
        processResponse : function(json) {
            if (this.callback) {
                this.callback.apply(this.scope);
            }
            if (json) {
                if (this.success) {
                    this.success.apply(this.scope, [json]);
                }
            } else {
                if (this.failure) {
                    this.failure.apply(this.scope);
                }
            }
        },
        /**
         * @public
         * @method
         */
        begin : function() {
            var params = Ext.urlEncode(this.params);
            this.script.src = this.url + '?' + params;
            document.getElementsByTagName('head')[0].appendChild(this.script);
        },
        /**
         * @public
         * @method
         */
        destroy : function() {
            Ext.fly(this.script).removeAllListeners();
            document.getElementsByTagName('head')[0].removeChild(this.script);
        },

        // Handlers
        /**
         * @private
         * @method
         */
        onReadyStateChange : function() {
            if (this.script.readyState == 'complete') {
                this.onLoad();
            }
        },
        /**
         * @private
         * @method
         */
        onLoad : function() {
            var json = this.script.innerHTML;
            var data = json.length ? Ext.decode(json) : null;

            Ext.ux.JSONP.callback(data);
        }
    });
