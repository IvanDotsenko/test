define([
    'jquery',
    'Magento_PageBuilder/js/events',
    'slick'
], function ($, events) {
    'use strict';

    /**
     * Extract slide count integer from CSS class list using a regular expression.
     * Class pattern: slider-{prefix}-{number} (e.g. slider-d-3, slider-t-2, slider-m-1)
     *
     * @param {string} className
     * @param {string} prefix - 'd' (desktop), 't' (tablet), 'm' (mobile)
     * @param {number} fallback
     * @return {number}
     */
    function getSlideCountByPrefix(className, prefix, fallback) {
        if (!className) {
            return fallback;
        }
        var regex = new RegExp('(?:^|\\s)slider-' + prefix + '-(\\d+)(?:\\s|$)');
        var match = className.match(regex);
        if (match && match[1]) {
            var val = parseInt(match[1], 10);
            return val > 0 ? val : fallback;
        }
        return fallback;
    }

    return function (originalWidget) {
        return function (config, sliderElement) {
            var $element = $(sliderElement);

            if ($element.hasClass('slick-initialized')) {
                $element.slick('unslick');
            }

            var className = $element.attr('class') || '';

            // Parse responsive settings from CSS classes:
            // Desktop: slider-d-{N} (default: 1)
            var desktop = getSlideCountByPrefix(className, 'd', 1);

            // Tablet: slider-t-{N} (fallback: desktop value)
            var tablet = getSlideCountByPrefix(className, 't', desktop);

            // Mobile: slider-m-{N} (default: 1)
            var mobile = getSlideCountByPrefix(className, 'm', 1);

            var isMultiSlide = desktop > 1 || tablet > 1 || mobile > 1;

            var slickConfig = {
                autoplay: $element.data('autoplay'),
                autoplaySpeed: $element.data('autoplay-speed') || 0,
                fade: isMultiSlide ? false : $element.data('fade'),
                infinite: $element.data('infinite-loop') !== undefined ? $element.data('infinite-loop') : true,
                arrows: $element.data('show-arrows'),
                dots: $element.data('show-dots'),
                slidesToShow: desktop,
                slidesToScroll: 1
            };

            if (isMultiSlide) {
                slickConfig.responsive = [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: tablet,
                            slidesToScroll: 1
                        }
                    },
                    {
                        breakpoint: 640,
                        settings: {
                            slidesToShow: mobile,
                            slidesToScroll: 1
                        }
                    }
                ];
            }

            $element.slick(slickConfig);

            // Redraw slide after content type gets redrawn
            events.on('contentType:redrawAfter', function (args) {
                if ($element.closest(args.element).length) {
                    $element.slick('setPosition');
                }
            });

            events.on('stage:viewportChangeAfter', $element.slick.bind($element, 'setPosition'));
        };
    };
});
