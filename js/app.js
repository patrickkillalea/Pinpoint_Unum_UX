(function ($) {
	'use strict';

	var
	container = null,
	chart = null,

	setElementsHeight = function () {
		var leftCol = container.find('.left-col'),
			rightCol = 	container.find('.right-col'),
			elH;

		if (!leftCol.length || !rightCol.length) return;

		leftCol.height('auto');
		rightCol.height('auto');

		elH = Math.max(leftCol.height(), rightCol.height(), $(window).height() - 100);

		leftCol.height(elH);
		rightCol.height(elH);
	},


	toggleTable = function () {
		var btn = $(this),
			header = btn.closest('.xtable');

		header.toggleClass('inactive', !header.hasClass('inactive'));
	},

	init = function () {
		container = $('.container-fluid');
		container.on('click', '.open-close', toggleTable);

		setElementsHeight();
	};

	$(document).ready(init);
})(jQuery);