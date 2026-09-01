import os

from dotenv import load_dotenv
from algosdk.v2client import algod, indexer

load_dotenv()

# ============================================================
# ALGOrAND TESTNET CONFIGURATION
# ============================================================

NETWORK = os.getenv("ALGORAND_NETWORK", "testnet")

# Public Algorand Testnet endpoints
ALGOD_ADDRESS = os.getenv(
    "ALGOD_ADDRESS",
    "https://testnet-api.algonode.cloud"
)

ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")

INDEXER_ADDRESS = os.getenv(
    "INDEXER_ADDRESS",
    "https://testnet-idx.algonode.cloud"
)

INDEXER_TOKEN = os.getenv("INDEXER_TOKEN", "")


# ============================================================
# CLIENTS
# ============================================================

algod_client = algod.AlgodClient(
    algod_token=ALGOD_TOKEN,
    algod_address=ALGOD_ADDRESS
)

indexer_client = indexer.IndexerClient(
    indexer_token=INDEXER_TOKEN,
    indexer_address=INDEXER_ADDRESS
)


# ============================================================
# REGISTRY CONFIGURATION
# ============================================================

# Every registry transaction note will start with this prefix.
# This makes it easy to find our transactions through Algorand Indexer.
REGISTRY_NOTE_PREFIX = "UNICITY_VHR_V1|"


def get_network_status():
    """
    Check whether connection to Algorand Testnet is working.
    """

    try:
        status = algod_client.status()

        return {
            "success": True,
            "network": NETWORK,
            "last_round": status.get("last-round")
        }

    except Exception as error:
        return {
            "success": False,
            "network": NETWORK,
            "error": str(error)
        }