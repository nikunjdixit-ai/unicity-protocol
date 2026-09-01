import json
import hashlib

from algosdk import transaction
from algosdk.logic import get_application_address

from blockchain.config import (
    algod_client,
    REGISTRY_NOTE_PREFIX
)

from blockchain.wallet import load_wallet


def hash_value(value: str) -> str:
    """
    Convert sensitive/large value into SHA-256 hash.
    """

    return hashlib.sha256(
        value.encode("utf-8")
    ).hexdigest()


def build_registry_note(
    identity_commitment: str,
    nullifier: str,
    verification_level: str = "basic"
):
    """
    Build privacy-safe blockchain record.

    Raw identity information is NOT stored.
    We store hashes/commitments only.
    """

    record = {
        "type": "verified_human_registry",
        "version": "1.0",
        "identity_commitment": identity_commitment,
        "nullifier_hash": hash_value(nullifier),
        "verification_level": verification_level,
        "verified": True
    }

    note = (
        REGISTRY_NOTE_PREFIX +
        json.dumps(
            record,
            separators=(",", ":")
        )
    )

    return note.encode("utf-8")


def send_registry_transaction(
    identity_commitment: str,
    nullifier: str,
    verification_level: str = "basic"
):
    """
    Create, sign and submit a registry transaction
    to Algorand Testnet.
    """

    wallet = load_wallet()

    sender = wallet["address"]
    private_key = wallet["private_key"]

    # Get network transaction parameters
    params = algod_client.suggested_params()

    # Build note
    note = build_registry_note(
        identity_commitment=identity_commitment,
        nullifier=nullifier,
        verification_level=verification_level
    )

    # Create 0-ALGO self transaction.
    # Purpose: permanently record verification proof in transaction note.
    txn = transaction.PaymentTxn(
        sender=sender,
        sp=params,
        receiver=sender,
        amt=0,
        note=note
    )

    # Sign transaction
    signed_txn = txn.sign(private_key)

    # Send transaction
    tx_id = algod_client.send_transaction(
        signed_txn
    )

    # Wait for confirmation
    confirmation = transaction.wait_for_confirmation(
        algod_client,
        tx_id,
        4
    )

    return {
        "success": True,
        "transaction_id": tx_id,
        "confirmed_round": confirmation.get(
            "confirmed-round"
        ),
        "sender": sender
    }


def get_transaction_status(transaction_id: str):
    """
    Get transaction information from Algorand.
    """

    try:
        transaction_info = algod_client.pending_transaction_info(
            transaction_id
        )

        return {
            "success": True,
            "transaction_id": transaction_id,
            "confirmed_round": transaction_info.get(
                "confirmed-round"
            ),
            "pool_error": transaction_info.get(
                "pool-error"
            )
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }