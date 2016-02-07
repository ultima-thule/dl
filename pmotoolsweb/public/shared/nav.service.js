// /shared/NavService.js
(function() {
    'use strict';

    angular
        .module('NavService', [])
        .service('navService', navService);

        function navService() {
            this.title = 'PMO Tools';

            this.setTitle = function(newTitle) {
                this.title = newTitle
            }
        };

})();
