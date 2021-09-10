import express from "express";
import { VaultManager } from "./vaultManager";

const app = express();
const port = 3000; // default port to listen

// define a route handler for the default home page
app.get( "/", async(req, res, next) => {
    res.end(JSON.stringify(await new VaultManager().getRawVaults()));
} );

// start the Express server
app.listen( port, () => {
     // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

