import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TicketDapp } from "../target/types/ticket_dapp";
import { PublicKey, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";

describe("ticket-dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TicketDapp as Program<TicketDapp>;

  const eventKeypair = Keypair.generate();
  const mintKeypair = Keypair.generate();

  it("Creates an event", async () => {
    await program.methods
      .createEvent("Test Event", "TST", "https://example.com/metadata.json", new anchor.BN(10), new anchor.BN(100))
      .accounts({
        event: eventKeypair.publicKey,
        organizer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([eventKeypair])
      .rpc();

    const eventData = await program.account.event.fetch(eventKeypair.publicKey);
    console.log("Event Data:", eventData);
  });

  it("Mints a ticket", async () => {
    const [metadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    const tokenAccount = await createAccount(
      provider.connection,
      provider.wallet.p