/* IF */
let validar = true
let fruta = "sandia"
let mes = "enero"

if (fruta == "pera"){   
    console.log("me parece que es invierno")
} else if (fruta == "frutilla") {
    console.log("ME PARECE QUE ES PRIMAVERA")
} else {
    console.log("banana o manzana hay todo el año")
} 

/* OR || */
if(fruta == "sandia" || mes =="enero") {
    console.log("probable verano")
}

/* AND && */
if(fruta == "sandia" && mes == "enero") {
    console.log("confirmado es verano")
}

/* mayor o menor */
let edad = 18

if(edad > 18) {
    console.log("sos mayor")    
} else {
    console.log("sos menor")
}

/* FOR 
for("desde"; "hasta"; "freq_actualizacion") {
    // bloque de codigo a ejecutar
}


for(let i=1; i<=10; i++) {
    console.log(i)
}

let numero = parseInt(prompt("Bienvenido! Que tabla de multiplicar desea?"))
console.log("tabla de moultiplicar del  " + numero)
for(let i=1; i<=15; i++) {
    let resultado = numero*i
    console.log(numero + "x" + i + ": " + resultado)
}

*/


/* WHILE 

let continuar = true
while(continuar) {
    let numero = parseInt(prompt("Bienvenido! Que tabla de multiplicar desea?"))
    console.log("tabla de moultiplicar del  " + numero)
    for(let i=1; i<=15; i++) {
        let resultado = numero*i
         console.log(numero + "x" + i + ": " + resultado)
    }

    let confirmacion = prompt("desea hacer otro calculo (si/no)").toLocaleLowerCase()
    if(confirmacion == "no") {
        continuar = false
        console.log("Gracias!")
    }
}
*/


/* SWITCH - CASE 

 let menu = parseInt(prompt("Ingrese 1 para ver su cuenta, 2 para extraccion, 3 para deposito, otro numero para salir"))

switch(menu) {
    case 1:
        console.log("Total de la cuenta: $300")
        break
    case 2:
        console.log("Limite de extraccion: $70")
        break
    case 3:
        console.log("Limite de deposito: $50")
        break
    default:
        console.log("Retire su tarjeta")
} 
 */       

/*
let continuar = true 
while(continuar) {
    let menu = parseInt(prompt("Ingrese 1 para ver su cuenta, 2 para extraccion, 3 para deposito"))

    switch(menu) {
        case 1:
            alert("Total de la cuenta: 300")
            break
        case 2:
            alert("Limite de extraccion: 70")
            break
        case 3:
            alert("Limite de deposito: 50")
            break
        default:
            alert("Opcion incorrecta")
    }

    let confirmacion = prompt("Desea hacer otra consulta?(si/no)").toLowerCase()
    if(confirmacion == "no") {
        continuar = false
        alert("Retire su tarjeta")

    let confirmacion = confirm("¿Desea hacer otra consulta?")
    if (!confirmacion) {
        continuar = false
        alert("Retire su tarjeta")


    }
} 
*/

let contador = 5;

while (contador >= 0) {
    console.log(contador);
    contador--;
}


