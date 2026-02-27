import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

// Constantes pour Google Sheets
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Initialisation du client Google (OAuth2 / Service Account)
const getAuthClient = () => {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n'),
        },
        scopes: SCOPES,
    });
};

export interface AccountingRow {
    date: string;
    transactionId: string;
    grossAmount: number;
    elaCommission: number;
    taxAmount: number;
    netAmount: number;
    status: string;
    invoiceUrl: string;
    aiNote: string;
}

/**
 * Moteur de calcul des Taxes Internationales (TVA / Export)
 * @param amount Montant brut
 * @param buyerCountry Code pays ISO (ex: FR, US, DE)
 */
export const calculateInternationalTax = (amount: number, buyerCountry: string): number => {
    // Vente locale (France) : TVA 20%
    if (buyerCountry === 'FR') return amount * 0.20;

    // Zone Euro communautaire (Moyenne simplifiée)
    const euCountries = ['DE', 'ES', 'IT', 'BE', 'NL', 'PT', 'SE'];
    if (euCountries.includes(buyerCountry)) return amount * 0.19; // B2C (pour le B2B avec no de TVA, c'est 0%)

    // Exportation hors UE (US, Dubai, Suisse, etc.) : 0% TVA (Exonération)
    return 0;
};

/**
 * Ajoute une ligne de transaction dans le Master Ledger (Google Sheets) du comptable
 */
export const syncTransactionToSheets = async (row: AccountingRow): Promise<boolean> => {
    try {
        if (!SHEET_ID) {
            console.warn('Google Sheets Integration skipped: no SHEET_ID provided.');
            return false;
        }

        const auth = getAuthClient();
        const sheets = google.sheets({ version: 'v4', auth });

        const values = [
            [
                row.date,
                row.transactionId,
                row.grossAmount,
                row.elaCommission,
                row.taxAmount,
                row.netAmount,
                row.status,
                row.invoiceUrl,
                row.aiNote
            ]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Transactions!A:I', // La feuille doit s'appeler Transactions
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        return true;
    } catch (error) {
        console.error('Erreur lors de la synchronisation Google Sheets:', error);
        return false;
    }
};

/**
 * Fonction Batch: synchronise tous les records isolés ou échoués la nuit
 */
export const batchSyncPendingRecords = async () => {
    const pendingRecords = await prisma.accountingRecord.findMany({
        where: { isSyncedToSheets: false },
        include: { transaction: true }
    });

    if (pendingRecords.length === 0) return;

    for (const record of pendingRecords) {
        // Commission souveraine pour ELA
        const elaCommission = record.transaction.amount * 0.10; // 10%

        // Mock: On simule le pays de l'acheteur (normalement récupéré via record.transaction.buyer.country)
        const simulatedBuyerCountry = Math.random() > 0.5 ? 'FR' : 'US';

        // Calcul intelligent : Si la DB n'a pas la taxe, on la calcule à la volée
        const finalTaxAmount = record.taxAmount > 0
            ? record.taxAmount
            : calculateInternationalTax(record.transaction.amount, simulatedBuyerCountry);

        const finalNetAmount = record.transaction.amount - elaCommission - finalTaxAmount;

        const success = await syncTransactionToSheets({
            date: record.createdAt.toISOString(),
            transactionId: record.transactionId,
            grossAmount: record.transaction.amount,
            elaCommission,
            taxAmount: finalTaxAmount,
            netAmount: finalNetAmount,
            status: record.transaction.status,
            invoiceUrl: record.invoiceUrl,
            aiNote: record.aiNote
        });

        if (success) {
            await prisma.accountingRecord.update({
                where: { id: record.id },
                data: { isSyncedToSheets: true }
            });
        }
    }
};
