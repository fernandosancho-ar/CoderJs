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

//// Invoca la función calcularEdad() y guardamos el valor que retorna en una variable.
const edad = calcularEdad(anioActual, anioNacimiento);

//// Invoca la función mostrarDatos() 
mostrarDatos(nombre, apellido, anioActual, anioNacimiento, edad);

//// Mostrar resultado al usuario
alert(
    "Hola " + nombre + ", tu apellido es " + apellido + " y tu edad es de " + edad + " años."
);

//// Bucle para realizar consultas
let continuar = true;
console.log("========= CONSULTAS REALIZADAS =========");
while (continuar) {
    const menu = parseInt(
        prompt(
            "Ingrese una opción:\n" +
            "1 - Ver edad\n" +
            "2 - Consultar mayoría de edad\n" +
            "3 - Consultar categoría de edad\n" +
            "4 - Salir"
        )
    );

//// Switch para las diferentes opciones
    switch (menu) {

        case 1:
            alert("Su edad es de " + edad + " años.");
            console.log("Ver edad");
            break;

        case 2:
            const menoroMayor = verificarMayorEdad(edad);
            alert(menoroMayor);
            console.log("Consultar mayoria edad");
            break;

        case 3:
            const categoria = categoriaEdad(edad);
            alert("Sos un " + categoria + ".");
            console.log("Consultar categoría de edad");
            break;

        case 4:
            continuar = false;
            alert("Gracias por utilizar el simulador.");
            console.log("El usuario salió del simulador.");
            break;

        default:
            alert("Opción incorrecta. Por favor, seleccione una opción del 1 al 4.");
            console.log("Opción incorrecta ingresada: " + menu);
    }

//// Preguntar si desea realizar otra consulta 
    if (continuar) { 
        const nuevaConsulta = parseInt( 
            prompt( 
                "¿Desea realizar otra consulta?\n" + "1 - Sí, realizar otra consulta\n" + "2 - No, salir" ) 
        ); 

        if (nuevaConsulta === 2) { 
            continuar = false; 
            alert("Gracias por utilizar el simulador."); 
            console.log("El usuario salió del simulador."); 
        } 
    } 
}
