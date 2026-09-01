import base64
import json
import hashlib

from blockchain.config import (
    indexer_client,
    REGISTRY_NOTE_PREFIX
)

from blockchain.transactions import (
    send_registry_transaction
)


def hash_nullifier(nullifier: str) -> str:
    """
    Hash nullifier before searching/storing.
    """

    return hashlib.sha256(
        nullifier.encode("utf-8")
    ).hexdigest()


def decode_registry_note(note_base64: str):
    """
    Decode Algorand transaction note.
    """

    try:

        decoded_note = base64.b64decode(
            note_base64
        ).decode("utf-8")

        if not decoded_note.startswith(
            REGISTRY_NOTE_PREFIX
        ):
            return None

        json_data = decoded_note.replace(
            REGISTRY_NOTE_PREFIX,
            "",
            1
        )

        return json.loads(json_data)

    except Exception:
        return None


def find_nullifier_on_chain(nullifier: str):
    """
    Search Algorand Indexer for an already registered
    nullifier hash.

    Returns the matching record if found.
    """

    try:

        nullifier_hash = hash_nullifier(nullifier)

        # Search all transactions that belong to our registry
        response = indexer_client.search_transactions(
            note_prefix=REGISTRY_NOTE_PREFIX.encode(
                "utf-8"
            ),
            limit=1000
        )

        transactions = response.get(
            "transactions",
            []
        )

        for txn in transactions:

            note = txn.get("note")

            if not note:
                continue

            record = decode_registry_note(note)

            if not record:
                continue

            if (
                record.get("nullifier_hash")
                == nullifier_hash
            ):

                return {
                    "exists": True,
                    "transaction_id": txn.get("id"),
                    "record": record
                }

        return {
            "exists": False
        }

    except Exception as error:

        return {
            "exists": False,
            "error": str(error)
        }


def register_verified_human(
    identity_commitment: str,
    nullifier: str,
    verification_level: str = "basic",
    proof_valid: bool = True
):
    """
    Main function used by the rest of the project.

    Workflow:

    Member 3
        ↓
    identity_commitment
    nullifier
    proof_valid
        ↓
    Check proof
        ↓
    Check duplicate nullifier
        ↓
    If unique → Algorand transaction
        ↓
    Return transaction ID
    """

    # Step 1: Validate input

    if not identity_commitment:
        return {
            "success": False,
            "error": "identity_commitment is required"
        }

    if not nullifier:
        return {
            "success": False,
            "error": "nullifier is required"
        }

    # Step 2: Member 3 verification result

    if not proof_valid:

        return {
            "success": False,
            "verified": False,
            "error": "Identity proof is invalid"
        }

    # Step 3: Anti-Sybil check

    existing_record = find_nullifier_on_chain(
        nullifier
    )

    if existing_record.get("exists"):

        return {
            "success": False,
            "verified": False,
            "sybil_detected": True,
            "message": (
                "Possible Sybil attack: "
                "this identity is already registered"
            ),
            "existing_transaction": existing_record.get(
                "transaction_id"
            )
        }

    # Step 4: Register on Algorand

    try:

        blockchain_result = send_registry_transaction(
            identity_commitment=identity_commitment,
            nullifier=nullifier,
            verification_level=verification_level
        )

        return {
            "success": True,
            "verified": True,
            "sybil_detected": False,
            "message": (
                "Verified human successfully "
                "registered on Algorand Testnet"
            ),
            "transaction_id": blockchain_result.get(
                "transaction_id"
            ),
            "confirmed_round": blockchain_result.get(
                "confirmed_round"
            ),
            "verification_level": verification_level
        }

    except Exception as error:

        return {
            "success": False,
            "verified": False,
            "error": str(error)
        }


def check_verified_human(nullifier: str):
    """
    API/AI Agent can call this function.

    Returns whether the nullifier is registered.
    """

    result = find_nullifier_on_chain(
        nullifier
    )

    if result.get("exists"):

        return {
            "verified": True,
            "sybil_detected": False,
            "transaction_id": result.get(
                "transaction_id"
            ),
            "record": result.get(
                "record"
            )
        }

    return {
        "verified": False,
        "sybil_detected": False,
        "message": "No verified identity found"
    }


if __name__ == "__main__":

    print("\n--- UNICITY VERIFIED HUMAN REGISTRY ---\n")

    result = register_verified_human(
        identity_commitment="demo_identity_commitment_12345",
        nullifier="demo_unique_nullifier_98765",
        verification_level="github_google",
        proof_valid=True
    )

    print(
        json.dumps(
            result,
            indent=4
        )
    )