//
// Texture Picker
//

window.onload = function() {
	// Handle Texture Picker
	const $picker = document.querySelector('#texture-picker');
	const $hidePicker = document.querySelector('#hidePicker');
	const $header = document.querySelector('header');
	
	$picker.onclick = function(e) {
		const textureName = e.target.id;
		if (textureName && textureName != 'texture-picker' && textureName != 'hidePicker') {
			$header.setAttribute('class', `texture-${textureName}`);
		}
	}

	$hidePicker.onclick = function () {
		$picker.style['display'] = 'none';	
	}
}

window.onscroll = function(){}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}