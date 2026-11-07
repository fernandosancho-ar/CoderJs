//// datos.js: carga de datos desde data.json (fetch) y persistencia en el localStorage

//// Keys con las que se guardan los datos en el localStorage
const claveStorage = "socios-gimnasio";
const claveCuotas = "cuotas-gimnasio";

//// Archivo JSON que emula la base de datos inicial (socios con su historial de pagos, valores y conceptos de abono)
const rutaDatos = "./data/data.json";

//// Demora simulada de la carga
const demoraSimulada = 800;

//// Función para convertir los datos de un socio (del JSON o del localStorage) en un objeto Socio.
//// Los valores por defecto cubren datos guardados con una versión anterior, que no tenían autorización ni pagos
function crearSocio({ id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago, ultimoMesPago, autorizacion = null, pagos = [] }) {
    return new Socio(id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago, ultimoMesPago, autorizacion, pagos);
}

//// Función para leer un dato del localStorage. Si está dañado, lo descarta y devuelve null
function leerDelStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave));
    } catch (error) {
        localStorage.removeItem(clave);
        notificar("Algunos datos guardados estaban dañados y se descartaron.", "aviso");
        return null;
    }
}

//// Función para guardar el array de socios en el localStorage
function guardarSocios() {
    localStorage.setItem(claveStorage, JSON.stringify(socios));
}

//// Función para guardar los valores de abono en el localStorage
function guardarPrecios() {
    localStorage.setItem(claveCuotas, JSON.stringify(precios));
}

//// Función que devuelve una promesa que se resuelve después de x milisegundos
function esperar(milisegundos) {
    return new Promise((resolve) => setTimeout(resolve, milisegundos));
}

//// Función para traer los datos iniciales desde el archivo JSON con fetch
async function obtenerDatosIniciales() {
    await esperar(demoraSimulada);
    const respuesta = await fetch(rutaDatos);
    if (!respuesta.ok) {
        throw new Error(`No se encontró el archivo ${rutaDatos} (error ${respuesta.status}).`);
    }
    const datos = await respuesta.json();
    if (datos.socios === undefined || datos.abonos === undefined || datos.conceptosAbono === undefined) {
        throw new Error(`El archivo ${rutaDatos} no tiene el formato esperado.`);
    }
    return datos;
}

//// Función para cargar los datos: trae data.json y, si hay cambios guardados en el localStorage, usa esos.
async function cargarDatos() {
    datosCargados = false;
    mostrarCargando();
    try {
        const datos = await obtenerDatosIniciales();
        const sociosGuardados = leerDelStorage(claveStorage);
        const preciosGuardados = leerDelStorage(claveCuotas);
        socios = (sociosGuardados ?? datos.socios).map(crearSocio);
        precios = { ...datos.abonos, ...preciosGuardados };
        conceptosAbono = datos.conceptosAbono;
        guardarSocios();
        guardarPrecios();
        datosCargados = true;
        aplicarFiltros();
        if (sociosGuardados === null) {
            notificar(`Se cargaron ${socios.length} socios desde ${rutaDatos}.`, "info");
        }
        return true;
    } catch (error) {
        mostrarErrorCarga(error);
        const resultado = await Swal.fire({
            title: "No se pudieron cargar los datos",
            html: `Revisá tu conexión o que el archivo json exista y volvé a intentar.<p class="nota-swal">${error.message}</p>`,
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Reintentar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: colorPrincipal,
            cancelButtonColor: colorCancelar,
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        if (resultado.isConfirmed) {
            return await cargarDatos();
        }
        notificar("No hay datos cargados. Podés volver a intentarlo con el botón Restaurar DB.", "aviso");
        return false;
    } finally {
        contenido.classList.remove("cargando");
    }
}

//// Función para restaurar la base de datos desde data.json, previa confirmación
async function restaurarBaseDeDatos() {
    const confirmado = await confirmar({
        titulo: "¿Restaurar la base de datos?",
        html: `Se van a borrar <strong>todos los cambios guardados</strong> (altas, bajas, pagos, aptos y valores de abono) y se vuelven a cargar los datos de <code>${rutaDatos}</code>.`,
        icono: "warning",
        textoConfirmar: "Sí, restaurar",
        peligro: true
    });
    if (!confirmado) {
        return;
    }
    salirDeEdicion();
    localStorage.clear();
    await cargarDatos();
}