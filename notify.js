(function(root, factory){

    if (typeof define === 'function' && define.amd){
        // AMD environment
        define('notify', [], function(){
            factory(root, window.document);
            return root.Notify;
        });
    } else {
        // Browser environment
        factory(root, window.document);
    }

}(this, function(w, d) {

    'use strict';

    function Notify(title, options) {

        var i;

        this.title = typeof title === 'string' ? title : null;

        this.options = {
            iconPath: '',
            body: '',
            tag: '',
            notifyShow: null,
            notifyClose: null,
            notifyClick: null,
            permissionDenied: null
        };

        this.permission = null;


        if (!window.Notification) {
            return;
        }

        if (!this.title) {
            throw new Error('Notify(): first arg (title) must be a string.');
        }

        //User defined options for notification content
        if (typeof options === 'object') {

            for (i in options) {
                if (options.hasOwnProperty(i)) {
                    this.options[i] = options[i];
                }
            }

            //callback when notification is displayed
            if (typeof this.options.notifyShow === 'function') {
                this.onShowCallback = this.options.notifyShow;
            }

            //callback when notification is closed
            if (typeof this.options.notifyClose === 'function') {
                this.onCloseCallback = this.options.notifyClose;
            }

            //callback when notification is clicked
            if (typeof this.options.notifyClick === 'function') {
                this.onClickCallback = this.options.notifyClick;
            }

            //callback when notification is clicked
            if (typeof this.options.permissionDenied === 'function') {
                this.onPermissionDeniedCallback = this.options.permissionDenied;
            }
        }

        this.myNotify = new Notification(this.title, { 
            'body': this.options.body,
            'tag' : this.options.tag,
        });
    }

    Notify.prototype.requestPermission = function () {
        var that = this;
        window.Notification.requestPermission(function (perm) {
            that.permission = perm;
            switch (that.permission) {
            case 'granted':
                that.showNotification();
                break;
            case 'denied':
                that.onPermissionDenied();
                break;
            }
        });
    };

    Notify.prototype.show = function () {
        if (!window.Notification) { return; }
        if (this.permission === 'granted') {
            this.showNotification();
        } else {
            this.requestPermission();
        }
    };

    Notify.prototype.showNotification = function () {
        this.myNotify.addEventListener('show', this, false);
        this.myNotify.addEventListener('close', this, false);
        this.myNotify.addEventListener('click', this, false);
        this.myNotify.show();
    };

    Notify.prototype.onShowNotification = function (e) {
        if (this.onShowCallback) {
            this.onShowCallback();
        }
    };

    Notify.prototype.onCloseNotification = function (e) {
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
        this.removeEvents();
    };

    Notify.prototype.onClickNotification = function (e) {
        if (this.onClickCallback) {
            this.onClickCallback();
        }
        this.removeEvents();
    };

    Notify.prototype.onPermissionDenied = function (e) {
        if (this.onPermissionDeniedCallback) {
            this.onPermissionDeniedCallback();
        }
        this.removeEvents();
    };

    Notify.prototype.removeEvents = function () {
        this.myNotify.removeEventListener('show', this, false);
        this.myNotify.removeEventListener('close', this, false);
        this.myNotify.removeEventListener('click', this, false);
    };

    Notify.prototype.handleEvent = function (e) {
        switch (e.type) {
        case 'show': this.onShowNotification(e); break;
        case 'close': this.onCloseNotification(e); break;
        case 'click': this.onClickNotification(e); break;
        }
    };

    window.Notify = Notify;

}));
