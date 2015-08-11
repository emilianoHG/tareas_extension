var database;
$(document).ready(function () {
	//Cargamos la DB
	database = new DB();
	database.startDB();
	/*
		Si se usa materializecss para que funcione la lista se implementa el metodo de abajo
	*/
	$('.collapsible').collapsible({
      accordion : false
    });

});

function controles () {
	$('#btn-save').click(function () {
		//Obtenemos los valores de los campos de texto
		var title = $('#title').val(),
			info = $('#info').val();

		//Agregar datos
		if (title != '' && info != '') {
			database.add(title, info);
		};
		/*
			Limpiamos el contenido de los inputs
		*/
		$('#title').val('');
		$('#info').val('');
	});

	$('.close').click(function (e) {
		//Obtenemos el id del elemento que queremos borrar (se encuentrsa en el atributo 'data-id')
		//TIENE QUE SER DE TIPO: "NUMBER"
		var id = Number(e.target.getAttribute('data-id'));
		//Borramos el elemento pasando el id capturado
		database.deleteElement(id);
	});
}