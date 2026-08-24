//// Mi Primer Script Interactivo

//// Solicitar datos al usuario
const nombre = prompt("Ingrese su nombre");
const apellido = prompt("Ingrese su apellido");
const AñoActual = Number(prompt("Ingrese el año actual en formato AAAA"));
const AñoNacimiento = Number(prompt("Ingrese año de nacimiento en formato AAAA"));

//// Realizar la suma
const edad = AñoActual - AñoNacimiento;

//// Mostrar información en consola
console.log("Nombre Completo: " + nombre + " " + apellido);
console.log("Año actual: " + AñoActual);
console.log("Año de nacimiento: " + AñoNacimiento);
console.log("Edad: " + edad);

// Mostrar resultado al usuario
alert("Hola " + nombre + " tu apellido es " + apellido + ", tu edad es de: " + edad + " años");