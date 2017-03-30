(function(window) {
    'use strict';

    $(function() {
        /*
         * toastr插件配置
         * 
         * 确保其有效或进行检测。
         */
        if (typeof window.toastr !== 'undefined') {
            toastr.options = {
                closeButton: false,
                debug: false,
                newestOnTop: true,
                progressBar: false,
                positionClass: 'toast-top-right',
                preventDuplicates: false,
                onclick: null,
                showDuration: 300,
                hideDuration: 1000,
                timeOut: 3000,
                extendedTimeOut: 1000,
                showEasing: 'swing',
                hideEasing: 'linear',
                showMethod: 'fadeIn',
                hideMethod: 'fadeOut'
            };
        }
    });
})(window);