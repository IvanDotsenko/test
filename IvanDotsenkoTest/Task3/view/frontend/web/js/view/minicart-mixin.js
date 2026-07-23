define([
    'jquery',
    'Magento_Customer/js/customer-data'
], function ($, customerData) {
    'use strict';

    return function (Minicart) {
        return Minicart.extend({
            initialize: function () {
                var self = this;
                this._super();

                /*
                // Listen to AJAX add to cart event
                $(document).on('ajax:addToCart', function () {
                    self.openMinicart();
                });
                */

                // Listen to cart customerData changes
                var cartData = customerData.get('cart');
                var previousCount = cartData().summary_count || 0;

                cartData.subscribe(function (updatedCart) {
                    var newCount = updatedCart.summary_count || 0;
                    if (newCount > previousCount) {
                        self.openMinicart();
                    }
                    previousCount = newCount;
                });
            },

            /**
             * Open minicart dropdown dialog
             */
            openMinicart: function () {
                var $minicart = $('[data-block="minicart"]');
                if ($minicart.length && typeof $minicart.dropdownDialog === 'function') {
                    $minicart.dropdownDialog('open');
                }
            }
        });
    };
});
