/* crear la iffe */
(() => {

    /* crear la variable DB */
    let DB

    /* crear la variable para leer el id, que no da el parametro del link de nuestra pagina */
    let idCliente

    /* seleccionar todo los campos del formulario*/
    const nombreInput = document.getElementById('nombre')
    const emailInput = document.getElementById('email')
    const telefonoInput = document.getElementById('telefono')
    const empresaInput = document.getElementById('empresa')

    /* seleccionar el formulario */
    const formulario = document.getElementById('formulario-editar')


    document.addEventListener('DOMContentLoaded', event => {

        /* posicionar el focus en el primer input */
        document.getElementById('nombre').focus()

        /* realizar la conexion a la base de datos */
        conectarBD()

        /* obtener el di */
        idCliente = parseFloat(new URLSearchParams(location.search).get('id'))
        
        
        /* definir el evento cuando se haga submit al formulario */
        formulario.addEventListener('submit', actualizarCliente)



        setTimeout(() => {
            obtenerUnCliente(idCliente)
        }, 1000);

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

    function actualizarCliente(event) {

        /* prevenir el evento */
        event.preventDefault()

        /*
        crera un arreglo, con todos los values de los inputs, y utilziar el metodo includes, para devolver
        un boolean, si existe un string vacion, osea que si el usuario contesto con un string vacio
         */
        const errorValidacion = [...document.querySelectorAll(`.form-control`)].map(element => element.value).includes('')
        
        if(errorValidacion) {
            mostrarAlert('Todos los campos son obligatorios', 'danger')
            return
        }

        const cliente = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: idCliente
        }

        /* actualizar al cliente */

        /* crear la transaccion */
        const transaction = DB.transaction(['crm2'], 'readwrite')

        /* obtener el objectStore */
        const objectStore = transaction.objectStore('crm2')

        /* utilizar el metodo put, para actualizar */
        const request = objectStore.put(cliente)

        /* asignar el evento onsucces */

        request.onsuccess = function() {
            /* mostrar la alerta */
            mostrarAlert('Cliente editado correctamente', 'success')
            
            /* cambiar de pagina despues de 3 segundos */

            setTimeout(() => {
                location.href = 'index.html'
            }, 3000);
        }

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

    function obtenerUnCliente(id) {
        /* crear la transaction */
        const transaction = DB.transaction(['crm2'], 'readwrite')

        /* utilizar el objectStore */
        const objectStore = transaction.objectStore('crm2')

        /* utlizar el metod get, para obtener el objto */
        const request = objectStore.get(id)

        request.onsuccess = function() {
            const cliente = request.result
            llenarFormularioEditar(cliente)
        }
    }

    


    function llenarFormularioEditar(cliente) {
        const {nombre, email, telefono, empresa} = cliente
        nombreInput.value = nombre
        emailInput.value = email
        telefonoInput.value = telefono
        empresaInput.value = empresa
    }
})();