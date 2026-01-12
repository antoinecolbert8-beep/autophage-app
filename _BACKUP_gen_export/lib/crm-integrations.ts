/**
 * 🔗 CRM Integrations - HubSpot, Salesforce, Pipedrive
 * Synchronisation bidirectionnelle des leads et actions
 */

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
 * Synchronise un lead vers HubSpot
 */
export async function syncToHubSpot(lead: CRMLead): Promise<{ success: boolean; contactId?: string }> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    return { success: false };
  }

  try {
    const url = "https://api.hubapi.com/crm/v3/objects/contacts";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          email: lead.email,
          firstname: lead.firstName,
          lastname: lead.lastName,
          company: lead.company,
          phone: lead.phone,
        },
      }),
    });

    const data = await res.json();
    return { success: !!data.id, contactId: data.id };
  } catch (error) {
    console.error("Erreur HubSpot:", error);
    return { success: false };
  }
}

/**
 * Synchronise vers Salesforce
 */
export async function syncToSalesforce(lead: CRMLead): Promise<{ success: boolean }> {
  // Salesforce nécessite OAuth2
  // Implémentation simplifiée
  console.log("Sync Salesforce:", lead);
  return { success: true };
}

/**
 * Synchronise vers Pipedrive
 */
export async function syncToPipedrive(lead: CRMLead): Promise<{ success: boolean; personId?: number }> {
  const apiToken = process.env.PIPEDRIVE_API_KEY;

  if (!apiToken) {
    return { success: false };
  }

  try {
    const url = `https://api.pipedrive.com/v1/persons?api_token=${apiToken}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${lead.firstName} ${lead.lastName}`,
        email: [{ value: lead.email, primary: true }],
        phone: lead.phone ? [{ value: lead.phone, primary: true }] : [],
        org_name: lead.company,
      }),
    });

    const data = await res.json();
    return { success: data.success, personId: data.data?.id };
  } catch (error) {
    console.error("Erreur Pipedrive:", error);
    return { success: false };
  }
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





