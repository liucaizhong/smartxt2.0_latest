'use strict';

var effect;
$(document).ready(function () {});

function effectLining() {
	var text = document.getElementById('effecttext');

	if (!effect) {
		effect = lining(text);
	} else {
		effect.relining(true);
	}
}