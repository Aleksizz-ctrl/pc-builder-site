'use strict';

// Keep the form and readable FAQ available if the CDN cannot be reached.
if (typeof window.jQuery === 'function') {
    window.jQuery(function ($) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const duration = () => reducedMotion.matches ? 0 : 220;
        const $questions = $('.faq-question'); // Class selector.

        $questions.attr('aria-expanded', 'false');
        $('.faq-answer').hide();
        $questions.on('click', function () {
            const $question = $(this);
            const $item = $question.parent();
            const open = $question.attr('aria-expanded') !== 'true';
            const $others = $item.siblings('.faq-item');

            $others.children('[data-faq-question]').attr('aria-expanded', 'false'); // Attribute selector.
            $others.children('.faq-answer').stop(true, true).slideUp(duration());
            $question.attr('aria-expanded', String(open));
            const $answer = $item.children('.faq-answer').stop(true, true);
            if (open) $answer.slideDown(duration());
            else $answer.slideUp(duration());
        });

        if ($('#back-to-top').length) return; // ID selector; do not create duplicates.
        const $top = $('<button>', {
            id: 'back-to-top',
            type: 'button',
            class: 'back-to-top',
            text: '↑ Top',
            'aria-label': 'Back to top'
        }).appendTo('body');
        let visible = false;

        function updateBackToTop() {
            const shouldShow = $(window).scrollTop() > 300;
            if (shouldShow === visible) return;
            visible = shouldShow;
            if (visible) $top.stop(true, true).fadeIn(duration());
            else $top.stop(true, true).fadeOut(duration());
        }

        $(window).on('scroll', updateBackToTop);
        $top.on('click', function () {
            // Move keyboard focus before the focused floating button disappears.
            const main = document.querySelector('#main-content');
            if (main) {
                if (!main.hasAttribute('tabindex')) {
                    main.setAttribute('tabindex', '-1');
                    main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
                }
                main.focus({ preventScroll: true });
            }
            $('html, body').stop(true).animate({ scrollTop: 0 }, reducedMotion.matches ? 0 : 450);
        });
        updateBackToTop();
    });
}
