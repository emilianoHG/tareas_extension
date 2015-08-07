var dataBase,
	indexedDB = window.indexedDB;
function startDB () {
	//se conecta a la DB pasando Nombre y Version de esta
	dataBase = indexedDB.open('recordatorios', 1);

	//Este evento se ejecuta solo una vez (cuando se crea la DB) asi que define bien los datos antes de ejecutarlo
	//En caso de no hacerlo puedes eliminar la DB con "indexedDB.deleteDatabase('recordatorios')"
	dataBase.onupgradeneeded = function (e) {
		var active = dataBase.result,
			options = {
			keyPath: 'id',
			autoIncrement: true
		},

		object = active.createObjectStore('homeworks', options);

		//Creamos los indices
		object.createIndex('by_title', 'title', {unique: true});
		object.createIndex('by_id', 'id', {unique: true});
	}

	dataBase.onsuccess = function (e) {
		//Añade los elementos a la lista 
		loadAll(function () {
			controles();
		});
	}

	dataBase.onerror = function (e) {
		console.log('Erroa al conectar con DB');
	}
}

function add (title, info) {
	var active = dataBase.result,
		data = active.transaction(['homeworks'], 'readwrite'),
		object = data.objectStore('homeworks');

	//Se define la estructurs de los objetos
	//El objeto "Date" devuelve la fecha actual.
	var request = object.put({
		title: title,
		info: info,
		date: new Date()
	});

	//En caso de error, lo imprimimos por consola
	request.onerror = function (e) {
		console.log(e);
	}

	data.oncomplete = function (e) {
		console.log('Agregado ',e);
		//Cargamos los elementos de la DB
		loadAll(function () {
			controles();
		});
	}
}

function loadAll (callback) {
	var active = dataBase.result,
		data = active.transaction(['homeworks'], 'readwrite'),
		object = data.objectStore('homeworks'),
		elements = [];

	//Recorremos nuestro almacen de objetos
	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;

		if (result === null) {
			return; //Si no hay mas elementos retornamos
		}

		//Los añadimos a nuestra variable "elements"
		elements.push(result.value);
		result.continue();
	};

	data.oncomplete = function (e) {
		var list = '';
		/*
			Comenzamos  a añadir los elementos a una lista, por eso el codigo HTML de abajo.
			Esto puede ser modificado, pero como uso materializecss las clases y estructura es importante.
		*/
		for (var key in elements) {
			list += '<li><div class="collapsible-header">'+
						'<i class="mdi-navigation-chevron-right"></i>'+
							elements[key].title+
					' <i class="mdi-navigation-close right close" data-id="'+
							elements[key].id+'"></i><span class="right">'+
							elements[key].date.toLocaleDateString()
					+'</span></div><div class="collapsible-body"><p>'+
						elements[key].info+'</p></div></li>';
		}
		elements = [];
		$('#list-tareas').html(list);
		
		//Llamamos al callback para cargar los controles u otras funciones
		callback();
	}

}
function deleteElement (id) {
	var active = dataBase.result,
		data = active.transaction(['homeworks'], 'readwrite'),
		object = data.objectStore('homeworks');

	//Eliminamos el objeto por su id
	var eliminando = object.delete(id);

	//Verificamos que se haya eliminado con exito
	eliminando.onsuccess = function () {
		//Cargamos los elementos que no se eliminaron
		loadAll(function () {
			controles();	
		});
	}
}
