use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::{instruction as metadata_instruction, ID as METAPLEX_ID};

declare_id!("YourProgramIDHere"); // Replace with your program ID after deployment

#[program]
pub mod ticket_dapp {
    use super::*;

    pub fn create_event(ctx: Context<CreateEvent>, name: String, symbol: String, uri: String, price: u64, supply: u64) -> Result<()> {
        let event = &mut ctx.accounts.event;
        event.organizer = *ctx.accounts.organizer.key;
        event.name = name;
        event.symbol = symbol;
        event.uri = uri;
        event.price = price;
        event.supply = supply;
        event.minted = 0;
        Ok(())
    }

    pub fn mint_ticket(ctx: Context<MintTicket>, amount: u64) -> Result<()> {
        let event = &mut ctx.accounts.event;
        if event.minted + amount > event.supply {
            return Err(ErrorCode::ExceedsSupply.into());
        }

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.organizer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::mint_to(cpi_ctx, 1)?;

        event.minted += amount;

        // Create metadata for the NFT ticket
        let accounts = vec![
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.mint.to_account_info(),
            ctx.accounts.organizer.to_account_info(),
            ctx.accounts.organizer.to_account_info(),
            ctx.accounts.token_metadata_program.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];
        let ix = metadata_instruction::create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(),
            ctx.accounts.metadata.key(),
            ctx.accounts.mint.key(),
            ctx.accounts.organizer.key(),
            ctx.accounts.organizer.key(),
            ctx.accounts.organizer.key(),
            event.name.clone(),
            event.symbol.clone(),
            event.uri.clone(),
            None,
            1,
            true,
            false,
            None,
            None,
            None,
        );
        anchor_lang::solana_program::program::invoke(&ix, &accounts)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(init, payer = organizer, space = 8 + 32 + 64 + 64 + 64 + 8 + 8)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintTicket<'info> {
    #[account(mut)]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_metadata_program: Program<'info, METAPLEX_ID>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    /// CHECK: Metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
}

#[account]
pub struct Event {
    pub organizer: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub price: u64,
    pub supply: u64,
    pub minted: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Exceeds maximum ticket supply.")]
    ExceedsSupply,
}