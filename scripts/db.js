var dataBase,
	indexedDB = window.indexedDB;
function startDB () {
	//se conecta a la DB pasando Nombre y Version de esta
	dataBase = indexedDB.open('recordatorios', 1);

	//Este evento se ejecuta solo una vez (cuando se crea la DB) asi que define bien los datos antes de ejecutarlo
	//En caso de no hacerlo puedes cambiar la version de la DB
	dataBase.onupgradeneeded = function (e) {
		var active = dataBase.result,
			options = {
			keyPath: 'id',
			autoIncrement: true
		},
			object = active.createObjectStore('homeworks', options);

		object.createIndex('by_title', 'title', {unique: true});
		object.createIndex('by_id', 'id', {unique: true});

		alert('DB creada');
	}

	dataBase.onsuccess = function (e) {
		//Añade los elementos a la lista 
		loadAll();
	}

	dataBase.onerror = function (e) {
		console.log('Erroa al conectar con DB');
	}
}

function add (title, info) {
	var active = dataBase.result,
		data = active.transaction(['homeworks'], 'readwrite'),
		object = data.objectStore('homeworks');

	var request = object.put({
		title: title,
		info: info,
		date: new Date()
	});

	request.onerror = function (e) {
		console.log(e);
	}

	data.oncomplete = function (e) {
		console.log('Agregado ',e);
		loadAll();
	}
}

function loadAll () {
	var active = dataBase.result,
		data = active.transaction(['homeworks'], 'readwrite'),
		object = data.objectStore('homeworks'),
		elements = [];

	object.openCursor().onsuccess = function (e) {
		var result = e.target.result;
		console.log(result);

		if (result === null) {
			return;
		}

		elements.push(result.value);
		result.continue();
	};

	data.oncomplete = function (e) {
		var list = '';
		for (var key in elements) {
			list += '<li><div class="collapsible-header"><i class="mdi-navigation-chevron-right"></i>'+elements[key].title+
					' <i class="mdi-navigation-close right"></i><span class="right">'+elements[key].date.toLocaleDateString()
					+'</span></div><div class="collapsible-body"><p>'+elements[key].info+'</p></div></li>';
		}
		elements = [];
		$('#list-tareas').html(list);
	}

}

function deleteElement (id) {
	var active = dataBase.result,
		data = active.transaction(['homeworks'], 'readwrite'),
		object = data.objectStore('homeworks');
}
