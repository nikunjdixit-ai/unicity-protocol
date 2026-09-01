import { x402Client } from "@x402/core/client";
import * as avmModule from "@x402/avm";
import { ALGORAND_TESTNET } from "../algorand/testnet";

export function initializeClient(clientPrivateKeyBase64: string) {
  if (!clientPrivateKeyBase64) {
    throw new Error("Client private key is missing");
  }

  // Support root and submodule export conventions
  const toSigner =
    (avmModule as any).toClientAvmSigner ||
    (avmModule as any).toAvmSigner ||
    (avmModule as any).createAvmSigner;

  const ClientClass =
    (avmModule as any).ExactAvmClient ||
    (avmModule as any).AvmClient ||
    (avmModule as any).AvmPaymentClient;

  if (!toSigner) {
    throw new Error("Unable to locate client signer builder in @x402/avm");
  }

  const signer = toSigner(clientPrivateKeyBase64);
  const avmClient = ClientClass ? new ClientClass(signer) : signer;

  const client = new (x402Client as any)().register(
    ALGORAND_TESTNET.network,
    avmClient
  );

  return {
    client,
    signer,
    address: signer?.address || "",
  };
}