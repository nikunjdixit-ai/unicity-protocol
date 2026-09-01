import os

from dotenv import load_dotenv
from algosdk import account, mnemonic

from blockchain.config import algod_client

load_dotenv()


def create_wallet():
    """
    Create a new Algorand wallet.

    IMPORTANT:
    Mnemonic must be stored safely.
    Never commit it to GitHub.
    """

    private_key, address = account.generate_account()

    wallet_mnemonic = mnemonic.from_private_key(private_key)

    return {
        "address": address,
        "private_key": private_key,
        "mnemonic": wallet_mnemonic
    }


def load_wallet():
    """
    Load the project wallet from environment variable.

    Required:
    ALGORAND_MNEMONIC=your 25 word mnemonic
    """

    wallet_mnemonic = os.getenv("ALGORAND_MNEMONIC")

    if not wallet_mnemonic:
        raise ValueError(
            "ALGORAND_MNEMONIC not found. "
            "Add it to your .env file."
        )

    private_key = mnemonic.to_private_key(wallet_mnemonic)
    address = account.address_from_private_key(private_key)

    return {
        "address": address,
        "private_key": private_key
    }


def get_wallet_address():
    """
    Return current project wallet address.
    """

    wallet = load_wallet()

    return wallet["address"]


def get_wallet_balance(address=None):
    """
    Get Algorand wallet balance.
    """

    if address is None:
        address = get_wallet_address()

    account_info = algod_client.account_info(address)

    return {
        "address": address,
        "balance_microalgos": account_info.get("amount", 0),
        "balance_algo": account_info.get("amount", 0) / 1_000_000,
        "min_balance_microalgos": account_info.get("min-balance", 0)
    }


if __name__ == "__main__":

    print("Creating test wallet...\n")

    wallet = create_wallet()

    print("ADDRESS:")
    print(wallet["address"])

    print("\nMNEMONIC:")
    print(wallet["mnemonic"])

    print("\nIMPORTANT: Save this mnemonic securely.")