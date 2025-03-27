import React, { useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

const idl = require("./idl.json");
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");

function App() {
  const [eventName, setEventName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [uri, setUri] = useState("");
  const [price, setPrice] = useState(0);
  const [supply, setSupply] = useState(0);

  const connection = new Connection(network, "confirmed");
  const provider = new Provider(connection, window.solana, {});
  const program = new Program(idl, programID, provider);

  const createEvent = async () => {
    const eventAccount = web3.Keypair.generate();
    await program.rpc.createEvent(eventName, symbol, uri, price, supply, {
      accounts: {
        event: eventAccount.publicKey,
        organizer: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [eventAccount],
    });
    alert("Event created!");
  };

  const mintTicket = async () => {
    const mint = web3.Keypair.generate();
    const tokenAccount = await web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    await program.rpc.mintTicket(1, {
      accounts: {
        event: "YourEventPublicKeyHere",
        mint: mint.publicKey,
        tokenAccount: tokenAccount[0],
        organizer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: METAPLEX_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        metadata: "YourMetadataPublicKeyHere",
      },
      signers: [mint],
    });
    alert("Ticket minted!");
  };

  return (
    <div>
      <h1>Decentralized Event Ticketing</h1>
      <h2>Create Event</h2>
      <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
      <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" />
      <input type="text" value={uri} onChange={(e) => setUri(e.target.value)} placeholder="URI" />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      <input type="number" value={supply} onChange={(e) => setSupply(e.target.value)} placeholder="Supply" />
      <button onClick={createEvent}>Create Event</button>

      <h2>Mint Ticket</h2>
      <button onClick={mintTicket}>Mint Ticket</button>
    </div>
  );
}

export default App;