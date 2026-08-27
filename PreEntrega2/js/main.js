//// Mi Primer Script Interactivo

//// Solicitar datos al usuario
const nombre = prompt("Ingrese su nombre");
const apellido = prompt("Ingrese su apellido");
const anioActual = Number(prompt("Ingrese el año actual en formato AAAA"));
const anioNacimiento = Number(prompt("Ingrese año de nacimiento en formato AAAA"));

//// Realizar la suma
const edad = anioActual - anioNacimiento;

//// Mostrar información en consola
console.log("Nombre Completo: " + nombre + " " + apellido);
console.log("Año actual: " + anioActual);
console.log("Año de nacimiento: " + anioNacimiento);
console.log("Edad: " + edad);

//// Mostrar resultado al usuario
alert("Hola " + nombre + " tu apellido es " + apellido + ", tu edad es de " + edad + " años");

//// Bucle para realizar consultas
let continuar = true; 

while (continuar) { 
    const menu = parseInt(prompt( 
        "Ingrese una opción:\n" + 
        "1 - Ver edad\n" + 
        "2 - Consultar mayoría de edad\n" + 
        "3 - Consultar categoría de edad\n" +
        "4 - Salir"
    )); 
        
//// Switch para las diferentes opciones 
    switch (menu) { 
        case 1: alert("Su edad es de " + edad + " años.");
         break; 

        case 2: 
            if (edad >= 18) { 
                alert("sos mayor de edad."); 
            } else { 
                alert("sos menor de edad.");
            } break; 

        case 3: 
            if (edad < 18) {
                 alert("sos menor de edad."); 
            } else if (edad < 65) { 
                alert("sos un adulto."); 
            } else { 
                alert("sos un adulto mayor."); 
            } break; 

        case 4: 
            continuar = false; 
            alert("Gracias por utilizar el simulador."); 
            break;

        default: 
            alert("Opción incorrecta."); 

    } 
       
}
