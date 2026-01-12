'use server'

import { PrismaClient } from "@prisma/client"

// On crée une connexion temporaire pour récupérer l'argent
const prisma = new PrismaClient()

export async function getRealBalance() {
  try {
    // 1. On cherche le coffre fort (WarChest)
    const warChest = await prisma.warChest.findFirst();

    // 2. S'il n'existe pas, on dit 0 €
    if (!warChest) {
      return "0,00 €";
    }

    // 3. Sinon, on convertit les centimes en Euros (ex: 100000 -> 1000)
    const amount = warChest.available_budget_cents / 100;
    
    // 4. On formate joliement (ex: "1 000,00 €")
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  } catch (error) {
    console.error("Erreur récupération solde:", error);
    return "Err.";
  }
}
