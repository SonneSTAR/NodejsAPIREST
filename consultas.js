
const { Pool } = require("pg");

const pool = new Pool({
user: "postgres",
host: "localhost",
password: "root",
port: 5432,
database:"bancosolar",
});
//CONSULTAR

async function consultar (){
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        return result;
    } catch (error) {
        console.log(error.code)
        return error;
    }
}

async function consultarTransferencias (){
    try {
        const result = await pool.query("SELECT * FROM transferencias");
        return result;
    } catch (error) {
        console.log(error.code)
        return error;
    }
}



// INSERT
async function insertar(datos){
    const consulta = {
        text: "INSERT INTO usuarios(nombre,balance) values ($1,$2)",
        values: datos,
    };
    try {
        const result = await pool.query(consulta)
        return result;
        
    } catch (error) {
        
        console.log("error consulta" + error.code);
        return error;

    }
}; 

async function insertarTransferencia(datos,emisor,receptor, monto){
    const consultaUno = {
        text: "INSERT INTO transferencias(emisor,receptor,monto) VALUES ($1,$2,$3)",
        values: datos,
    };
    const consultaDos = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE nombre = $2 RETURNING *",
        values: [monto,emisor],
    };
    const consultaTres = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE nombre = $2 RETURNING *",
        values: [monto,receptor],
    };
    try {
        const result = await pool.query(consultaUno)
        const result2 = await pool.query(consultaDos)
        const result3 = await pool.query(consultaTres) 
        return result;
        
    } catch (error) {
        
        console.log("error consulta: " + error.code);
        return error;

    }
};


async function editar(datos) {
    console.log(datos)
    const consulta = {
        text:`UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *`,
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        
        return result;
    } catch (error) {
        console.log(error)
        return error;
    };
}


async function eliminar(id) {
    try {
        const result = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`);
        return result;
        
    } catch (error) {
        console.log(error.code)
        return error;
    }
}

module.exports = { insertar, consultar, editar, eliminar, consultarTransferencias,insertarTransferencia };

