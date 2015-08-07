$(document).ready(function () {
	startDB();

	$('#btn-save').click(function () {
		var title = $('#title').val(),
			info = $('#info').val();

		//Agregar datos
		if (title != '' && info != '') {
			add(title, info);
		};

		$('#title').val('');
		$('#info').val('');
	});

	$('.collapsible').collapsible({
      accordion : false
    });

});