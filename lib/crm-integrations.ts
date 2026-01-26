/**
 * 🔗 CRM Integrations - HubSpot, Salesforce, Pipedrive
 * Délégué entièrement à Make.com via Conductor Pattern
 */

import { triggerAutomation } from "./automations";

export type CRMProvider = "HUBSPOT" | "SALESFORCE" | "PIPEDRIVE";

export type CRMLead = {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  customFields?: Record<string, any>;
};

/**
 * Synchronise un lead vers un CRM spécifique via Make
 */
async function syncViaMake(provider: CRMProvider, lead: CRMLead): Promise<{ success: boolean; contactId?: string }> {
  console.log(`[CRM] Syncing new lead to ${provider} via Make...`);

  const result = await triggerAutomation("SYNC_CRM", {
    provider,
    lead: {
      email: lead.email,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      phone: lead.phone,
      customFields: lead.customFields
    }
  });

  if (result.success) {
    return {
      success: true,
      contactId: result.data?.id || "pending_async_sync"
    };
  }

  return { success: false };
}

/**
 * Synchronise un lead vers HubSpot
 */
export async function syncToHubSpot(lead: CRMLead): Promise<{ success: boolean; contactId?: string }> {
  return syncViaMake("HUBSPOT", lead);
}

/**
 * Synchronise vers Salesforce
 */
export async function syncToSalesforce(lead: CRMLead): Promise<{ success: boolean }> {
  return syncViaMake("SALESFORCE", lead);
}

/**
 * Synchronise vers Pipedrive
 */
export async function syncToPipedrive(lead: CRMLead): Promise<{ success: boolean; personId?: number }> {
  const result = await syncViaMake("PIPEDRIVE", lead);
  // Pipedrive attend un number ID parfois, mais on caste pour l'instant
  return {
    success: result.success,
    personId: result.contactId ? Number(result.contactId) : undefined
  };
}

/**
 * Sync multi-CRM (tous en parallèle)
 */
export async function syncToAllCRMs(lead: CRMLead): Promise<Record<CRMProvider, boolean>> {
  const [hubspot, salesforce, pipedrive] = await Promise.all([
    syncToHubSpot(lead),
    syncToSalesforce(lead),
    syncToPipedrive(lead),
  ]);

  return {
    HUBSPOT: hubspot.success,
    SALESFORCE: salesforce.success,
    PIPEDRIVE: pipedrive.success,
  };
}





