export const generarID = (listaItems) => {
    let nuevaID;

    if(listaItems.length > 0) {
        // Encontrar el ID mas alto en caso que la lista este desordenada.
        const maxID = Math.max(...listaItems.map(item => Number(item.id)));
        // Definir Proximo ID
        nuevaID = maxID + 1;
    } else {
        // Si la lista está vacía, empezar en 1.
        nuevaID = 1;
    }
    
    return nuevaID.toString();
}
