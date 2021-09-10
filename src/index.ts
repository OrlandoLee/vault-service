import express from "express";
import { VaultManager } from "./vaultManager";

const app = express();
const port = 3000; // default port to listen

const valueManager = new VaultManager();

// define a route handler for the default home page
app.get( "/vaults", async(req, res, next) => {
    res.end(JSON.stringify(await valueManager.getVaults()));
} );

// start the Express server
app.listen( port, () => {
    valueManager.turnCallBackOn();
     // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

