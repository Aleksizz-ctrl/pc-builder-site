$(document).ready(function () {
    // Delegated click handler for all View Build buttons.
    $(document).on('click', '.view-build', function (event) {
        event.preventDefault();

        const button = $(this);
        const currentCard = button.closest('.col-md-4');
        const details = currentCard.find('.build-details');
        const isOpen = details.is(':visible');

        // Close the other cards in this row.
        currentCard.siblings().find('.build-details').slideUp();
        currentCard.siblings().find('.view-build').text('View Build');
        currentCard.siblings().find('.product-card').css('border', '2px solid transparent');

        // Toggle the selected card.
        details.slideToggle();
        if (isOpen) {
            button.text('View Build');
            currentCard.find('.product-card').css('border', '2px solid transparent');
        } else {
            button.text('Hide Build');
            currentCard.find('.product-card').css('border', '2px solid var(--accent-color)');
        }
    });
});
