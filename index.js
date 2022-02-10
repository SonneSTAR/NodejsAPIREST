const Cursor = require("pg-cursor")
const {Pool} = require("pg")
const http = require("http");
const url = require("url");
const { getDate } = require("./consultas");
const { insertar, consultar, editar, eliminar, consultarTransferencias, insertarTransferencia } = require ("./consultas");
const fs = require("fs")

http
    .createServer(async (req, res) => {
        if (req.url == "/" && req.method === "GET") {

        res.setHeader("content-type", "text/html");
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html)

        }
        if(req.url == "/usuario" && req.method === "GET"){
            const registros = await consultar();
            res.end(JSON.stringify(registros));
        }


        if(req.url == "/transferencias" && req.method === "GET"){
            const registros = await consultarTransferencias();
            res.end(JSON.stringify(registros));
        }

        if(req.url == "/transferencia" && req.method === "POST"){
            let body = "";
            console.log("CAPTURO EL POST TRANSFERENCIA")
            req.on("data",(chunk) =>{
                body += chunk;
                console.log("asdad" + body)
            })
                req.on("end", async () =>{
                const datos = Object.values(JSON.parse(body));
                console.log("DATOS JSON.PARSE " + datos)
                const respuesta = await insertarTransferencia(datos);
                res.end(JSON.stringify(respuesta)); 
            });
        }




        if (req.url == "/usuario" && req.method === "POST") {
            let body = "";
            console.log(body)
            req.on("data",(chunk) =>{
                body += chunk;
                console.log("asdad" + body)
            })
                req.on("end", async () =>{
                const datos = Object.values(JSON.parse(body));
                console.log("DATOS JSON.PARSE " + datos)
                const respuesta = await insertar(datos);

                res.end(JSON.stringify(respuesta)); 
            });
            }

            
            if (req.url.startsWith("/usuario?") && req.method == "PUT") {
                let { id } = url.parse(req.url, true).query;
                let body = "";
                req.on("data", (chunk) => {
                    body += chunk;
                });
                req.on("end", async () => {
                const datos = Object.values(JSON.parse(body));

                console.log("PUT usuario" + datos)

                const respuesta = await editar([datos[1],datos[2],id]);
                res.end(JSON.stringify(respuesta));
                });
                }
            
            if (req.url.startsWith("/usuario?") && req.method == "DELETE") {

                const { nombre } = url.parse(req.url, true).query;
                const respuesta = await eliminar(nombre);
                res.end(JSON.stringify(respuesta));
                }
                    
        })
        
            
    .listen(3000);