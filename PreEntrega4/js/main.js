//// Mi Primer Script Interactivo


//// Función para calcular la edad //// Recibe el año actual, el año de nacimiento y retorna la edad calculada.
function calcularEdad(anioActual, anioNacimiento) {
    return anioActual - anioNacimiento;
}

//// Función para mostrar los datos en consola //// Imprime datos ingresados en consola.
function mostrarDatos(nombre, apellido, anioActual, anioNacimiento, edad) {
    console.log("========== DATOS DEL USUARIO ==========");
    console.log("Nombre Completo: " + nombre + " " + apellido);
    console.log("Año actual: " + anioActual);
    console.log("Año de nacimiento: " + anioNacimiento);
    console.log("Edad: " + edad);
    console.log("Documento: " + numDocumento);
    console.log("=======================================");
}

//// Función para consultar si la persona es mayor o menor de edad //// Recibe la edad como parámetro.
function verificarMayorEdad(edad) {
    if (edad >= 18) {
        return "Sos mayor de edad.";
    } else {
        return "Sos menor de edad.";
    }
}

//// Función flecha para determinar la categoría de edad //// Recibe la edad como parámetro y retorna una categoría.
const categoriaEdad = (edad) => {
    if (edad < 18) {
        return "menor de edad";
    } else if (edad < 65) {
        return "adulto";
    } else {
        return "adulto mayor";
    }
};

//// Solicitar datos al usuario
const nombre = prompt("Ingrese su nombre");
const apellido = prompt("Ingrese su apellido");
const anioActual = parseInt(prompt("Ingrese el año actual en formato AAAA"));
const anioNacimiento = parseInt(prompt("Ingrese año de nacimiento en formato AAAA"));
const numDocumento = prompt("Ingrese número de documento");

//// Invoca la función calcularEdad() y guardamos el valor que retorna en una variable.
const edad = calcularEdad(anioActual, anioNacimiento);

//// Creamos un array utilizando los datos ingresados por el usuario.
let datosUsuario = [
    nombre,
    apellido,
    anioActual,
    anioNacimiento,
    numDocumento
];

//// Invoca la función mostrarDatos() 
mostrarDatos(nombre, apellido, anioActual, anioNacimiento, edad);

//// Mostrar resultado al usuario
alert(
    "Hola " + nombre + ", tu apellido es " + apellido + " y tu edad es de " + edad + " años."
);

//// Bucle para realizar consultas
let continuar = true;
let volverMenu = false;
console.log("========= CONSULTAS REALIZADAS =========");
while (continuar) {
    const menu = parseInt(
        prompt(
            "Ingrese una opción:\n" +
            "1 - Ver edad\n" +
            "2 - Consultar mayoría de edad\n" +
            "3 - Consultar categoría de edad\n" +
            "4 - Gestor de datos\n" +
            "0 - Salir"
        )
    );

//// Switch para las diferentes opciones (incluye manipulacion Arrays)
    switch (menu) {

        case 1:
            alert("Su edad es de " + edad + " años.");
            console.log("Ver edad");
            break;

        case 2:
            const menoroMayor = verificarMayorEdad(edad);
            alert(menoroMayor);
            console.log("Consulta mayoria edad");
            break;

        case 3:
            const categoria = categoriaEdad(edad);
            alert("Sos un " + categoria + ".");
            console.log("Consulta categoría de edad");
            break;

        case 4: 
            alert(
                "⚠️⚠️⚠️ \n" +  
                "Advertencia: las operaciones del Gestor de datos pueden modificar el orden o el contenido de los datos almacenados en el array" + 
                " y afectar la correspondencia con los datos originales.\n" + 
                "⚠️⚠️⚠️ \n"
            );
            
            //// Función para recorrer y mostrar los datos del array
            function mostrarArray(array) {
                let datosActualizados = "Datos en el Array\n\n";
                 for (const dato of array) {
                    datosActualizados += "- " + dato + "\n";
                }
                return datosActualizados;
            }            

            let gestionarDatos = true;
            console.log("Consulta gestor de datos"); 
            while (gestionarDatos) { 
                const opcionDatos = parseInt( 
                    prompt( 
                        "GESTOR DE DATOS\n\n" + 
                        "1 - Consultar un dato\n" + 
                        "2 - Agregar un dato\n" + 
                        "3 - Eliminar el último dato\n" + 
                        "4 - Modificar un dato\n" + 
                        "5 - Ver datos del Array\n" + 
                        "6 - Volver al Menú anterior\n" +
                        "0 - Salir" 
                    )
                ); 
                
                switch (opcionDatos) { 
                   

                    case 1: 
                        const datoConsultar = parseInt( 
                            prompt( 
                                "¿Qué dato querés consultar?\n\n" + 
                                "1 - Nombre\n" + 
                                "2 - Apellido\n" + 
                                "3 - Año actual\n" + 
                                "4 - Año de nacimiento\n" + 
                                "5 - Número de documento\n" + 
                                "6 - Volver al Menú anterior\n" +
                                "0 - Salir" 
                            ) 
                        );
                        let datoSeleccionado;
                        switch (datoConsultar) {
                            case 1: 
                              datoSeleccionado = nombre; 
                              break; 

                            case 2: 
                              datoSeleccionado = apellido; 
                              break; 
                            
                            case 3: 
                              datoSeleccionado = anioActual; 
                              break; 
                            
                            case 4: 
                              datoSeleccionado = anioNacimiento; 
                              break; 
                            
                            case 5: 
                              datoSeleccionado = numDocumento; 
                              break; 

                            case 6:
                              gestionarDatos = false;
                              volverMenu = true;
                              break; 

                            case 0:
                              gestionarDatos = false;
                              continuar = false;
                              break;
                            
                            default: 
                              alert( "Opción incorrecta." ); 
                              break;
                        } 
                        if (continuar && datoSeleccionado !== undefined) { 
                            if (datosUsuario.includes(datoSeleccionado)) { 
                                const posicion = datosUsuario.indexOf(datoSeleccionado); 
                                alert( 
                                    "El dato está registrado.\n\n" + 
                                    "Valor: " + datoSeleccionado + "\n" + 
                                    "Posición dentro de la lista: " + posicion 
                                ); 
                            } else { 
                                    alert("El dato no se encuentra registrado."); 
                                } 
                            } 
                            break;
                        
                    case 2: 
                        const nuevoDato = prompt( 
                            "AGREGAR DATO\n\n" + 
                            "Ingresá el nuevo dato que querés agregar:" 
                        ); 
                        if (nuevoDato === null) { 
                            gestionarDatos = false; 
                            continuar = false; 
                            break; 
                        } 
                            
                        const prioridad = parseInt( 
                            prompt( 
                                "¿Querés agregar este dato al principio del array?\n\n" + 
                                "1 - Sí\n" + 
                                "2 - No" 
                            ) 
                        ); 
                        if (prioridad === 1) { 
                            datosUsuario.unshift( 
                                nuevoDato 
                            ); 
                            alert( "El dato fue agregado en el primer lugar del array." 

                            ); 
                        } else { 
                            datosUsuario.push( nuevoDato ); 
                            alert( "El dato fue agregado correctamente." 
                            ); 
                        } 
                        break;
                        
                    case 3:
                        if (datosUsuario.length > 0) {
                            const datoEliminado = datosUsuario.pop();

                            alert(
                                "Se ha eliminado el elemento: " +
                                datoEliminado
                            );

                            const reemplazar = parseInt(
                                prompt(
                                    "¿Querés reemplazar el dato eliminado?\n\n" +
                                    "1 - Sí\n" +
                                    "2 - No"
                                )
                            );

                            if (reemplazar === 1) {
                                const datoReemplazo = prompt(
                                    "Ingresá el nuevo dato:"
                                );

                                if (datoReemplazo !== null) {
                                    datosUsuario.push(datoReemplazo);
                                    alert("El dato fue reemplazado correctamente.");
                                }
                            }
                        } else {
                            alert("No hay datos disponibles para eliminar.");
                        }
                        break;
                        
                    case 4:
                        const datoModificar =
                            parseInt(
                                prompt(
                                    "¿Qué dato querés modificar?\n\n" +
                                    "1 - Nombre\n" +
                                    "2 - Apellido\n" +
                                    "3 - Año actual\n" +
                                    "4 - Año de nacimiento\n" +
                                    "5 - Número de documento\n" +
                                    "6 - Volver al Menú anterior\n" +
                                    "0 - Salir"
                                )
                            );
                        let datoSeleccionadoModificar;
                        let indiceModificar;
                        switch (datoModificar) {

                            case 1:
                                datoSeleccionadoModificar = nombre;
                                break;

                            case 2:
                                datoSeleccionadoModificar = apellido;
                                break;

                            case 3:
                                datoSeleccionadoModificar = anioActual;
                                break;

                            case 4:
                                datoSeleccionadoModificar = anioNacimiento;
                                break;

                            case 5:
                                datoSeleccionadoModificar = numDocumento;
                                break;

                            case 6:
                                break; 

                            case 0:
                                gestionarDatos = false;
                                continuar = false;
                                break;

                            default:
                                alert("Opción incorrecta.");
                        }

                        if (continuar && datoSeleccionadoModificar !== undefined) {
                            indiceModificar = datosUsuario.indexOf(datoSeleccionadoModificar);
                            if (indiceModificar !== -1) {
                                const datoNuevo = prompt(
                                    "El dato actual es:\n\n" + datoSeleccionadoModificar + "\n\nIngresá el nuevo valor:");
                                if (datoNuevo === null) {
                                    gestionarDatos = false;
                                    continuar = false;
                                } else {
                                    datosUsuario.splice(
                                        indiceModificar,
                                        1,
                                        (datoModificar === 3 || datoModificar === 4)
                                            ? parseInt(datoNuevo)
                                            : datoNuevo
                                    );

                                    alert("El dato fue modificado correctamente.");
                                }

                            } else { 
                                const agregarDato = parseInt( 
                                    prompt( 
                                        "El dato no se encuentra registrado.\n\n" + 
                                        "¿Querés agregarlo ahora?\n\n" + 
                                        "1 - Sí\n" + 
                                        "2 - No" 
                                    ) 
                                ); 
                                if (agregarDato === 1) { 
                                    const nuevoDato = prompt( 
                                        "Ingresá el nuevo valor para este dato:" 
                                    ); 
                                    if (nuevoDato !== null) { 
                                            const valorFinal = 
                                            (datoModificar === 3 || datoModificar === 4) 
                                                ? parseInt(nuevoDato) 
                                                : nuevoDato; 
                                            datosUsuario.push(valorFinal); 
                                            alert("El dato fue agregado correctamente."); 
                                        } 
                                    } else if (agregarDato === 2) { 
                                        alert("El dato no fue agregado."); 
                                    } else { 
                                        alert("Opción incorrecta."); 
                                    } 
                                }
                        }
                        break;
                        
                    case 5: 
                        alert(mostrarArray(datosUsuario));
                        break; 
                        
                    case 6:
                        gestionarDatos = false;
                        volverMenu = true;
                        break;

                    case 0:
                        gestionarDatos = false;
                        continuar = false;
                        break;
                        
                    default: alert( "Opción incorrecta. Seleccioná una opción del 1 al 6." ); 
                } 
            } 
            break;

        case 0: 
            continuar = false;
            alert("Gracias por utilizar el simulador.");
            console.log("El usuario salió del simulador.");
            break;

        default:
            alert("Opción incorrecta. Por favor, seleccione una opción del 1 al 4.");
            console.log("Opción incorrecta ingresada: " + menu);
}

//// Preguntar si desea realizar otra consulta 
    if (continuar && !volverMenu) {
        const nuevaConsulta = parseInt( 
            prompt( 
                "¿Desea realizar otra consulta?\n" + 
                "1 - Sí, realizar otra consulta\n" + 
                "2 - No, salir" ) 
        ); 

        if (nuevaConsulta === 2) { 
            continuar = false; 
            alert("Gracias por utilizar el simulador."); 
            console.log("El usuario salió del simulador."); 
        } 
    } 
}
