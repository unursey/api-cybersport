// const http = require("node:http")
import http from "node:http" // прописали type: "module"
import fs from "node:fs/promises";
import { sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import { handleClientsRequest } from "./modules/handleClientsRequest.js";
import { handleUpdateClient } from "./modules/handleUpdateClient.js";

const PORT = 8080;
const GAMES = './games.json';
export const CLIENTS = './clients.json';

const startServer = async () => {
  if (!(await checkFile(GAMES))) {
    return;
  }

  await checkFile(CLIENTS, true);

  const gamesData = await fs.readFile(GAMES, 'utf-8');
  const games = JSON.parse(gamesData);

  http
    .createServer( async (req, res) => {
      try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        const segments = req.url.split("/").filter(Boolean);
  
        if (req.method === "GET" && segments[0] === 'games') {
          handleComediansRequest(req, res, games, segments);
          return; 
        } 
        
        if (req.method === "POST" && segments[0] === 'clients') {
          handleAddClient(req, res);
          return;
          // Добавление клиента
        }
  
        if (
          req.method === "GET" && 
          segments[0] === 'clients' && 
          segments.length === 2
          ) {
            const ticketNumber = segments[1];
            handleClientsRequest(req, res, ticketNumber);
            return;
            // Получение клиента по номеру билета
        }
  
        if (
          req.method === "PATCH" && 
          segments[0] === 'clients' && 
          segments.length === 2
          ) {
            handleUpdateClient(req, res, segments);
            return;
            // Обновление клиента по номеру билета
        }
        sendError(res, 404, "Not found");
      } catch (error) {
        sendError(res, 500, `Ошибка сервера: ${error}`) 
      }              
    })
    .listen(PORT);
      console.log(`Сервер запущен на http://localhost:${PORT}`);  
}

startServer();