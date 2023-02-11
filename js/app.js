/* 
crear una iffe, para mantener la variables privadas
*/

(() => {
    
    /* crear la variable indefinda DB */
    let DB

    /* seleccionar el tbody, donde se insertaran los datos */
    const listadoClientes = document.getElementById('lista-clientes')
    

    document.addEventListener('DOMContentLoaded', event => {
        crearDB()



        /* si existe la conexion */
        if(indexedDB.open('crm2', 1)) {
            /* ejecutar la siguiente funcion */
            obtenerClientes()
        }

        /* para eliminar */

        listadoClientes.addEventListener('click', event => {
            btnEliminar = event.target
            if(btnEliminar.classList.contains('link-eliminar')) {

                const confirmar = confirm('Esta seguro de elimiar cliente?')
                if(confirmar) {
                    const idEliminar = parseFloat(btnEliminar.dataset.id)
                    eliminarCliente(idEliminar)
                    btnEliminar.parentElement.parentElement.parentElement.remove()
                }
                
                
            }
        })

    })



    function crearDB() {
        
        /* utilizar el metodo indexed.open, para crear la base de datos */
        const crearDB = indexedDB.open('crm2', 1)

        /* asignar evento de onsucces */
        crearDB.onsuccess = function() {
            DB = crearDB.result
        }

        /* asignar evento de onerror */
        crearDB.onerror = function(event) {
            console.error('Hubo un error')
            console.dir(event)
        }

        /*  
        asignar el evento onupgradeneeded
        */
        crearDB.onupgradeneeded = function() {

            DB = crearDB.result

            /* crear el objectoStore */
            const objectStore = DB.createObjectStore('crm2', {
                keyPath: 'id',
                autoIncrement: true
            })

            /* crear los indices / columnas de nuestra base de datos */
            objectStore.createIndex('nombre', 'nombre', {
                unique: false
            })

            objectStore.createIndex('email', 'email', {
                unique: true
            })

            objectStore.createIndex('telefono', 'telefono', {
                unique: false
            })

            objectStore.createIndex('empresa', 'empresa', {
                unique: false
            })

            objectStore.createIndex('id', 'id', {
                unique: true
            })
        }
        
    }

    function obtenerClientes() {

        /* utilizar el metodo open */
        const abrirConexion = indexedDB.open('crm2', 1)

        /* asignar el evento de error */
        abrirConexion.onerror = function() {
            console.error('Hubo un error')
        }

        /* asignar el evento success */
        abrirConexion.onsuccess = function() {

            /* utilziar el atributo resul, que solo se puede utilizar adentro de un onsuccess */
            DB = abrirConexion.result

            /* utlizar el objecStore */
            const objectStore = DB.transaction('crm2').objectStore('crm2')


            /* define el cursor antes  */
            let templateStr = ``

            /* utilizar el cursor */

            objectStore.openCursor().onsuccess = function(event) {

                /* obtener el cursor de la propiedad event.target.result */
                const cursor = event.target.result

                /* crear el template strinf */
                

                /* validar si el cursor esta definido */
                if(cursor) {
                    
                    /* realizar una destructuracion */
                    const {nombre, email, telefono, empresa, id} = cursor.value
                    templateStr += 
                    `
                    <tr>
                        <td class="p-3">
                            <h5>${nombre}</h5>
                            <p>
                                ${email}
                            </p>
                        </td>

                        <td class="p-3 text-secondary">
                            ${telefono}
                        </td>
                        <td class="p-3 text-secondary">
                            ${empresa}
                        </td>
                        <td class="p-3">
                            <div class="acciones-links d-flex gap-4">
                                <a href="editar-cliente.html?id=${id}" class="text-decoration-none text-success link-editar" >Editar</a>
                                <a href="#" class="text-decoration-none text-danger link-eliminar" data-id=${id}>Eliminar</a>
                            </div>
                        </td>

                    </tr>
                    `
                    /* continue() => metodo que me salta al otro objecto del registros */
                    cursor.continue()
                }
                else {
                    listadoClientes.innerHTML = templateStr
                    templateStr = ''
                    console.log('no more data')
                }
            }
        }
    }

    function eliminarCliente(id) {
        /* crear la transaction */
        const transaction = DB.transaction(['crm2'], 'readwrite')

        /* obtener el objectStore */
        const objectoStore = transaction.objectStore('crm2')

        /* utilizar el metodo delete */

        const request = objectoStore.delete(id)
        
    }


})();