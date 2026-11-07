//// socios.js: clase Socio, manejo de fechas, reglas de cuota, apto y acceso, validaciones y filtros

//// Clase Socio
class Socio {
    constructor(id, nombre, apellido, fechaNacimiento, numDocumento, email, fechaAlta, fechaUltimoApto, fechaUltimoPago, ultimoMesPago, autorizacion, pagos) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.numDocumento = numDocumento;
        this.email = email;
        this.fechaAlta = fechaAlta;
        this.fechaUltimoApto = fechaUltimoApto;
        this.fechaUltimoPago = fechaUltimoPago;   
        this.ultimoMesPago = ultimoMesPago;       
        this.autorizacion = autorizacion;   // { nombre, apellido, numDocumento, email, fecha } o null
        this.pagos = pagos;                 // historial: [{ fecha, mes, categoria, conceptos, total }]
    }
}

//// Último día del mes para pagar la cuota sin perder el acceso
const diaLimitePago = 5;

const nombresMeses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

//// Convierte "DD/MM/AAAA" en un objeto
function textoAFecha(texto) {
    const [dia, mes, anio] = texto.split("/").map(Number);
    return new Date(anio, mes - 1, dia);
}

//// Convierte un objeto Date en "DD/MM/AAAA"
function fechaATexto(fecha) {
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}/${fecha.getFullYear()}`;
}

//// Verifica que el texto tenga formato DD/MM/AAAA y que la fecha exista (ej: rechaza 31/02/2020)
function esFechaValida(texto) {
    const partes = texto.split("/");
    if (partes.length !== 3) {
        return false;
    }
    const [dia, mes, anio] = partes;
    if (dia.length !== 2 || mes.length !== 2 || anio.length !== 4) {
        return false;
    }
    if (!esNumeroValido(dia) || !esNumeroValido(mes) || !esNumeroValido(anio)) {
        return false;
    }
    return fechaATexto(textoAFecha(texto)) === texto;
}

//// Devuelve la fecha de hoy sin hora
function fechaDeHoy() {
    const ahora = new Date();
    return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
}

//// Devuelve el nombre del mes de una fecha
function nombreMes(fecha) {
    return nombresMeses[fecha.getMonth()];
}

//// Convierte un mes "MM/AAAA" en un número para poder comparar y sumar meses
function mesANumero(textoMes) {
    const [mes, anio] = textoMes.split("/").map(Number);
    return anio * 12 + (mes - 1);
}

//// Convierte el número de mes en "MM/AAAA"
function numeroAMes(numero) {
    const mes = String((numero % 12) + 1).padStart(2, "0");
    return `${mes}/${Math.floor(numero / 12)}`;
}

//// Devuelve el número de mes de una fecha
function numeroDeMes(fecha) {
    return fecha.getFullYear() * 12 + fecha.getMonth();
}

//// Devuelve el nombre y año de un mes "MM/AAAA", por ejemplo "julio 2026"
function nombreMesCompleto(textoMes) {
    const [mes, anio] = textoMes.split("/").map(Number);
    return `${nombresMeses[mes - 1]} ${anio}`;
}

//// Formatea un monto en pesos
function formatearMonto(monto) {
    return "$" + monto.toLocaleString("es-AR");
}

//// Función para calcular la edad del socio
function calcularEdad(socio, fechaReferencia) {
    const nacimiento = textoAFecha(socio.fechaNacimiento);
    const edad = fechaReferencia.getFullYear() - nacimiento.getFullYear();
    const yaCumplio = fechaReferencia.getMonth() > nacimiento.getMonth() ||
        (fechaReferencia.getMonth() === nacimiento.getMonth() && fechaReferencia.getDate() >= nacimiento.getDate());
    return yaCumplio ? edad : edad - 1;
}

//// Función para saber si el socio cumple años
function cumpleAnios(socio, fechaReferencia) {
    const nacimiento = textoAFecha(socio.fechaNacimiento);
    return nacimiento.getDate() === fechaReferencia.getDate() &&
        nacimiento.getMonth() === fechaReferencia.getMonth();
}

//// Función que devuelve la fecha de vencimiento del apto
function vencimientoApto(socio) {
    if (socio.fechaUltimoApto === null) {
        return null;
    }
    const vencimiento = textoAFecha(socio.fechaUltimoApto);
    vencimiento.setFullYear(vencimiento.getFullYear() + 1);
    return vencimiento;
}

//// Función para saber si el apto está vencido o  nunca se presento
function aptoVencido(socio, fechaReferencia) {
    const vencimiento = vencimientoApto(socio);
    return vencimiento === null || fechaReferencia >= vencimiento;
}

//// Función para saber el estado de la cuota
function estadoCuota(socio, fechaReferencia) {
    if (socio.ultimoMesPago === null) {
        return "Moroso";
    }
    const mesActual = numeroDeMes(fechaReferencia);
    const mesPago = mesANumero(socio.ultimoMesPago);
    if (mesPago >= mesActual) {
        return "Al día";
    }
    if (mesPago === mesActual - 1 && fechaReferencia.getDate() <= diaLimitePago) {
        return "Pendiente";
    }
    return "Moroso";
}

//// Función para saber cuántas cuotas debe el socio, contando la del mes actual
function cuotasAdeudadas(socio, fechaReferencia) {
    if (socio.ultimoMesPago === null) {
        return 1;
    }
    return Math.max(0, numeroDeMes(fechaReferencia) - mesANumero(socio.ultimoMesPago));
}

//// Función para saber si el socio tiene que pagar reinscripción:
function requiereReinscripcion(socio, fechaReferencia) {
    return socio.ultimoMesPago !== null && cuotasAdeudadas(socio, fechaReferencia) >= 2;
}

//// Función para saber si el socio tiene que pagar inscripción: es su primer pago
function requiereInscripcion(socio) {
    return socio.ultimoMesPago === null;
}

//// Función para saber si el socio necesita la autorización de un adulto responsable (es menor de edad)
function requiereAutorizacion(socio, fechaReferencia) {
    return categoriaCuota(calcularEdad(socio, fechaReferencia)) === "Menor";
}

//// Función para saber si es un menor que todavía no tiene la autorización cargada
function autorizacionPendiente(socio, fechaReferencia) {
    return requiereAutorizacion(socio, fechaReferencia) && socio.autorizacion === null;
}

//// Función para saber si el socio puede ingresar al gimnasio
function tieneAcceso(socio, fechaReferencia) {
    return estadoCuota(socio, fechaReferencia) !== "Moroso" &&
        !aptoVencido(socio, fechaReferencia) &&
        !autorizacionPendiente(socio, fechaReferencia);
}

//// Función para verificar si un texto tiene solo letras y espacios
function esSoloLetras(texto) {
    let tieneLetra = false;
    for (const caracter of texto) {
        const esLetra = caracter.toLowerCase() !== caracter.toUpperCase();
        if (!esLetra && caracter !== " ") {
            return false;
        }
        if (esLetra) {
            tieneLetra = true;
        }
    }
    return tieneLetra;
}

//// Función para validar un texto
function esTextoValido(valor) {
    return valor !== "" && esSoloLetras(valor);
}

//// Función para validar un número
function esNumeroValido(valor) {
    if (valor === "") {
        return false;
    }
    for (const caracter of valor) {
        if (caracter === " " || isNaN(caracter)) {
            return false;
        }
    }
    return true;
}

//// Función para validar un email 
function esEmailValido(valor) {
    return valor !== "" && valor.includes("@") && valor.includes(".") && !valor.includes(" ");
}

//// Función para verificar si algún campo quedó vacío 
function hayCamposVacios(...valores) {
    return valores.some((valor) => valor === "");
}

//// Función para verificar si un documento ya está registrado 
function documentoExiste(socios, documento, idExcluido) {
    return socios.some(
        (socioRegistrado) => socioRegistrado.numDocumento === documento && socioRegistrado.id !== idExcluido
    );
}

//// Función para verificar si un email ya está registrado 
function emailExiste(socios, email, idExcluido) {
    return socios.some(
        (socioRegistrado) => socioRegistrado.email === email && socioRegistrado.id !== idExcluido
    );
}

//// Función para generar un nuevo id / número de socio 
function generarNuevoId(socios) {
    const idMaximo = socios.reduce(
        (maximo, socioRegistrado) => {
            if (socioRegistrado.id > maximo) {
                return socioRegistrado.id;
            }
            return maximo;
        },
        9999
    );
    return idMaximo + 1;
}

//// Función para determinar la categoría de cuota según la edad
function categoriaCuota(edad) {
    return edad < 18 ? "Menor"
        : edad < 65 ? "Adulto"
        : "Senior";
}

//// Función para filtrar socios por categoría de cuota
function filtrarPorCategoria(lista, categoria) {
    return lista.filter(
        (socio) => categoriaCuota(calcularEdad(socio, fechaSistema)) === categoria
    );
}

//// Función para filtrar socios por estado de cuota o de apto
function filtrarPorEstado(lista, estado) {
    return lista.filter((socio) => {
        if (estado === "apto-vencido") {
            return aptoVencido(socio, fechaSistema);
        }
        if (estado === "sin-acceso") {
            return !tieneAcceso(socio, fechaSistema);
        }
        if (estado === "sin-autorizacion") {
            return autorizacionPendiente(socio, fechaSistema);
        }
        return estadoCuota(socio, fechaSistema) === estado;
    });
}

//// Función para buscar socios por número de socio, nombre, apellido, documento o email
function buscarPorTexto(lista, texto) {
    return lista.filter((socio) => {
        const { id, nombre, apellido, numDocumento, email } = socio;
        const nombreCompleto = (nombre + " " + apellido).toLowerCase();
        return id.toString().includes(texto) ||
            nombreCompleto.includes(texto) ||
            numDocumento.includes(texto) ||
            email.includes(texto);
    });
}

//// Función que junta en un solo array los pagos de todos los socios
function obtenerTodosLosPagos(lista) {
    const todosLosPagos = [];
    lista.forEach(({ pagos }) => todosLosPagos.push(...pagos));
    return todosLosPagos;
}

//// Función que calcula la cantidad de pagos y el total cobrado en un mes "MM/AAAA" (según la fecha de cada pago)
function recaudacionDelMes(pagos, mes) {
    const pagosDelMes = pagos.filter(({ fecha }) => fecha.slice(3) === mes);
    return {
        cantidad: pagosDelMes.length,
        total: pagosDelMes.reduce((suma, { total }) => suma + total, 0)
    };
}

//// Función que cuenta los socios que no pagaron la cuota de un mes "MM/AAAA" (pendientes y morosos).
//// Solo cuenta a los que ya estaban dados de alta en ese mes
function sociosSinPagar(lista, mes) {
    return lista.filter(({ fechaAlta, pagos }) =>
        mesANumero(fechaAlta.slice(3)) <= mesANumero(mes) &&
        !pagos.some((pago) => pago.mes === mes)
    ).length;
}

//// Función para validar los datos del formulario 
function validarDatos(nombre, apellido, fechaNacimiento, documento, email, fechaApto, idExcluido) {
    if (hayCamposVacios(nombre, apellido, fechaNacimiento, documento, email)) {
        return "Completá todos los campos obligatorios.";
    }
    if (!esTextoValido(nombre)) {
        return "El nombre es obligatorio y solo puede contener letras.";
    }
    if (!esTextoValido(apellido)) {
        return "El apellido es obligatorio y solo puede contener letras.";
    }
    if (!esFechaValida(fechaNacimiento) ||
        textoAFecha(fechaNacimiento).getFullYear() < 1900 ||
        textoAFecha(fechaNacimiento) > fechaSistema) {
        return `La fecha de nacimiento debe tener formato DD/MM/AAAA y estar entre 01/01/1900 y ${fechaATexto(fechaSistema)}.`;
    }
    if (!esNumeroValido(documento) || documento.length < 7 || documento.length > 8) {
        return "El documento debe tener 7 u 8 dígitos, sin puntos, signos ni espacios.";
    }
    if (documentoExiste(socios, documento, idExcluido)) {
        return `Ya existe otro socio con el documento ${documento}.`;
    }
    if (!esEmailValido(email)) {
        return "El email no es válido. Debe tener el formato nombre@dominio.com.";
    }
    if (emailExiste(socios, email, idExcluido)) {
        return `Ya existe otro socio con el email ${email}.`;
    }
    if (fechaApto !== "" && (!esFechaValida(fechaApto) || textoAFecha(fechaApto) > fechaSistema)) {
        return "La fecha del apto físico debe tener formato DD/MM/AAAA y no puede ser posterior a hoy. Si no tiene, dejala vacía.";
    }
    return "";
}

//// Función para validar los datos del adulto responsable de un menor.
//// Usa las mismas validaciones que el alta de socios
function validarAutorizacion(nombre, apellido, documento, email) {
    if (hayCamposVacios(nombre, apellido, documento, email)) {
        return "Completá todos los datos del adulto responsable.";
    }
    if (!esTextoValido(nombre)) {
        return "El nombre es obligatorio y solo puede contener letras.";
    }
    if (!esTextoValido(apellido)) {
        return "El apellido es obligatorio y solo puede contener letras.";
    }
    if (!esNumeroValido(documento) || documento.length < 7 || documento.length > 8) {
        return "El documento debe tener 7 u 8 dígitos, sin puntos, signos ni espacios.";
    }
    if (!esEmailValido(email)) {
        return "El email no es válido. Debe tener el formato nombre@dominio.com.";
    }
    return "";
}
