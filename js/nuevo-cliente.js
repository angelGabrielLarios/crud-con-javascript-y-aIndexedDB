
/* crear la iffe */
(() =>{

    /* crear la variable indefinda DB */
    let DB

    /* seleccionar el formulario */
    const formulario = document.getElementById('formulario-agregar')
    

    document.addEventListener('DOMContentLoaded', event => {

        /* al cargar la pagina realizar lo siguiente .... */
        document.getElementById('nombre').focus()

        /* conectar la base de datos crm2 */
        conectarBD()

        /* asignar un evento al formulario */
        formulario.addEventListener('submit', validarCliente)
    })


    function conectarBD() {
        /* abrir la conexion con el metodo open('nombreBase', version) */

        const abrirConexion = indexedDB.open('crm2', 1)

        /* asignar el evento onesuccees */
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result
        }

        /* asignar el evento onerror */

        abrirConexion.onerror = function() {
            console.error('Hubo un error')
        }
        
    }


    function agregarClienteIndexedDB(cliente) {
        /* crear la transaction*/
        const transaction = DB.transaction(['crm2'], 'readwrite')

        /* obtener el objectStore */
        const objectStore = transaction.objectStore('crm2')

        /* añadir el objecto al base de datos */
        objectStore.add(cliente)


        /* si la transaccion se realizo correctamente */
        transaction.oncomplete = function() {

            /* muestra un mensaje en consola */
            console.log('cliente agregado correctamente')

            /* muestra un mensaje en  */
            mostrarAlert('Cliente agregado correctamente', 'success')
            
            setTimeout(() => {
                /* te cambia de pagina */
                location.href = 'index.html'
            }, 3000);

        }

        /* si la transaccion se presento un error */
        transaction.onerror = function() {
            console.log('Hubo un error')
        }
    }


    function validarCliente(event) {
        /* prevenir el evento */
        event.preventDefault()

        /* seleccionar los valor de los input del formulario */
        const nombre = document.getElementById('nombre').value.trim()
        const email = document.getElementById('email').value.trim()
        const telefono = document.getElementById('telefono').value.trim()
        const empresa = document.getElementById('empresa').value.trim()

        if([nombre, email, telefono, empresa].includes('')) {
            console.log('Campos no validos')
            mostrarAlert('Todos los campos son obligatorios de contestar', 'danger')
            return
        }

        const cliente = {
            nombre, 
            email, 
            telefono, 
            empresa,
            id: Date.now()
        }
        agregarClienteIndexedDB(cliente)
    }

    function mostrarAlert(mensaje, tipo) {

        const alertaExiste = document.querySelector('.alerta-custom')
        if(alertaExiste) return

        const templateAlert = 
        `
        <div class="alert alert-${tipo} p-2 mt-3 text-center alerta-custom">
            ${mensaje}
        </div>
        `
        formulario.insertAdjacentHTML('beforeend', templateAlert)

        setTimeout(() => {
            const alertaHTMl = document.querySelector('.alerta-custom')
            alertaHTMl.remove()
        }, 3000);
    }

})();