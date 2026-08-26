//// Mi Primer Script Interactivo

//// Solicitar datos al usuario
const nombre = prompt("Ingrese su nombre");
const apellido = prompt("Ingrese su apellido");
const anioActual = parseInt(prompt("Ingrese el año actual en formato AAAA"));
const anioNacimiento = parseInt(prompt("Ingrese año de nacimiento en formato AAAA"));

//// Realizar la resta
const edad = anioActual - anioNacimiento;

//// Mostrar información en consola
console.log("Nombre Completo: " + nombre + " " + apellido);
console.log("Año actual: " + anioActual);
console.log("Año de nacimiento: " + anioNacimiento);
console.log("Edad: " + edad);

//// Mostrar resultado al usuario
alert("Hola " + nombre + " tu apellido es " + apellido + ", tu edad es de " + edad + " años");
