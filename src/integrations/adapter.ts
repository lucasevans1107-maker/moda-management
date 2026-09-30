// Integration adapter stub for n8n / voice platform integration.
// In production, replace these with authenticated HTTP calls to your backend.
// Browser localStorage cannot receive updates from n8n directly.

import type {
  LookupHomeownerRequest,
  LookupHomeownerResponse,
  GetPropertyContextRequest,
  GetPropertyContextResponse,
  CreateServiceRequestPayload,
  CreateServiceRequestResponse,
} from '../types';

export async function lookupHomeowner(
  _payload: LookupHomeownerRequest
): Promise<LookupHomeownerResponse> {
  // STUB — replace with authenticated backend call
  throw new Error('Integration not configured. This is a standalone demo.');
}

export async function getPropertyContext(
  _payload: GetPropertyContextRequest
): Promise<GetPropertyContextResponse> {
  // STUB — replace with authenticated backend call
  throw new Error('Integration not configured. This is a standalone demo.');
}

export async function createServiceRequest(
  _payload: CreateServiceRequestPayload
): Promise<CreateServiceRequestResponse> {
  // STUB — replace with authenticated backend call
  throw new Error('Integration not configured. This is a standalone demo.');
}
