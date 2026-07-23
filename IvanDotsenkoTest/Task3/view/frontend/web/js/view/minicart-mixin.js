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

                // Track previous item count in cart
                var cartData = customerData.get('cart');
                var previousCount = cartData().summary_count || 0;

                // Auto-open minicart when cart items count increases
                cartData.subscribe(function (updatedCart) {
                    var newCount = updatedCart.summary_count || 0;
                    if (newCount > previousCount) {
                        self.openMinicart();
                    }
                    previousCount = newCount;
                });

                // Auto-open minicart on AJAX add to cart action
                $(document).on('ajax:addToCart', function () {
                    self.openMinicart();
                });
            },

            /**
             * Open mini shopping cart dropdown dialog
             */
            openMinicart: function () {
                var $minicart = $('[data-block="minicart"]');
                var $dialog = $minicart.find('[data-role="dropdownDialog"]');

                if ($dialog.length && typeof $dialog.dropdownDialog === 'function') {
                    $dialog.dropdownDialog('open');
                } else if ($minicart.length) {
                    $minicart.find('.action.showcart').trigger('click');
                }
            }
        });
    };
});
