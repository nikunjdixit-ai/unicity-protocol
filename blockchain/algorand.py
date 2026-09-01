import os
from dotenv import load_dotenv
from algosdk import account, mnemonic
from algosdk.v2client import algod

load_dotenv()


class AlgorandService:
    """
    Central service for Algorand Testnet operations.
    This module can be used by identity, API, x402,
    and frontend integration layers.
    """

    def init(self):
        self.network = os.getenv("ALGORAND_NETWORK", "testnet")

        self.algod_address = os.getenv(
            "ALGOD_ADDRESS",
            "https://testnet-api.algonode.cloud"
        )

        self.algod_token = os.getenv("ALGOD_TOKEN", "")

        self.client = algod.AlgodClient(
            self.algod_token,
            self.algod_address
        )

    def get_network_status(self):
        try:
            status = self.client.status()

            return {
                "success": True,
                "network": self.network,
                "last_round": status.get("last-round")
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_wallet_address(self):
        mnemonic_phrase = os.getenv("ALGORAND_MNEMONIC")

        if not mnemonic_phrase:
            raise ValueError(
                "ALGORAND_MNEMONIC not found in .env"
            )

        private_key = mnemonic.to_private_key(
            mnemonic_phrase
        )

        address = account.address_from_private_key(
            private_key
        )

        return address

    def get_balance(self):
        try:
            address = self.get_wallet_address()

            account_info = self.client.account_info(
                address
            )

            balance_microalgos = account_info.get(
                "amount",
                0
            )

            return {
                "success": True,
                "address": address,
                "balance_microalgos": balance_microalgos,
                "balance_algo": balance_microalgos / 1_000_000
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def get_account_info(self):
        try:
            address = self.get_wallet_address()

            account_info = self.client.account_info(
                address
            )

            return {
                "success": True,
                "address": address,
                "account_info": account_info
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


algorand_service = AlgorandService()


if __name__ == "__main__":

    print("\n--- ALGOrAND TESTNET CONNECTION ---\n")

    print("Network Status:")
    print(algorand_service.get_network_status())

    print("\nWallet Balance:")
    print(algorand_service.get_balance())