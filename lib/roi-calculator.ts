import { db as prisma } from "@/core/db";

/**
 * ROI CALCULATOR
 * Widget public pour calculer le ROI avant achat
 * Lead magnet ultra puissant
 */

export interface ROIInputs {
    // Inputs utilisateur
    currentMonthlyRevenue: number;
    averageLeadValue: number;
    currentLeadsPerMonth: number;
    currentConversionRate: number; // %
    salesRepSalary: number;
    hoursSpentOnManualTasks: number; // per week
}

export interface ROIResults {
    // Résultats calculés
    expectedRevenueIncrease: number;
    timeSaved: number; // hours per month
    costSavings: number;
    totalROI: number;
    paybackPeriod: number; // months
    threeYearValue: number;

    // Breakdown
    leadIncreasePercent: number;
    conversionImprovementPercent: number;
    productivityGain: number;
}

export class ROICalculator {

    /**
     * Calcul du ROI complet
     */
    static calculate(inputs: ROIInputs, planPrice: number = 197): ROIResults {
        const {
            currentMonthlyRevenue,
            averageLeadValue,
            currentLeadsPerMonth,
            currentConversionRate,
            salesRepSalary,
            hoursSpentOnManualTasks
        } = inputs;

        // Assumptions basées sur nos moyennes clients
        const leadIncreasePercent = 45; // +45% leads avec automation
        const conversionImprovementPercent = 28; // +28% conversion avec lead scoring
        const productivityGainPercent = 65; // +65% productivité avec meeting assistant

        // Nouveaux leads
        const newLeadsPerMonth = currentLeadsPerMonth * (1 + leadIncreasePercent / 100);
        const additionalLeads = newLeadsPerMonth - currentLeadsPerMonth;

        // Nouvelle conversion
        const newConversionRate = currentConversionRate * (1 + conversionImprovementPercent / 100);

        // Revenue additionnel
        const additionalCustomers = additionalLeads * (newConversionRate / 100);
        const expectedRevenueIncrease = additionalCustomers * averageLeadValue;

        // Time saved
        const weeklyHoursSaved = hoursSpentOnManualTasks * (productivityGainPercent / 100);
        const monthlyHoursSaved = weeklyHoursSaved * 4;
        const timeSaved = monthlyHoursSaved;

        // Cost savings (temps gagné * taux horaire)
        const hourlyRate = salesRepSalary / 160; // 160h/mois
        const costSavings = timeSaved * hourlyRate;

        // Total ROI mensuel
        const totalMonthlyValue = expectedRevenueIncrease + costSavings;
        const totalROI = ((totalMonthlyValue - planPrice) / planPrice) * 100;

        // Payback period
        const paybackPeriod = planPrice / totalMonthlyValue;

        // 3-year value
        const threeYearValue = (totalMonthlyValue * 36) - (planPrice * 36);

        return {
            expectedRevenueIncrease,
            timeSaved,
            costSavings,
            totalROI,
            paybackPeriod,
            threeYearValue,
            leadIncreasePercent,
            conversionImprovementPercent,
            productivityGain: productivityGainPercent
        };
    }

    /**
     * Génération du widget HTML
     */
    static generateWidget(): string {
        return `
    < div id = "ela-roi-calculator" style = "max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; color: white; font-family: system-ui;" >
        <h2 style="font-size: 28px; margin-bottom: 20px; text-align: center;" >💰 Calculez Votre ROI </h2>

            < div style = "background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;" >
                <label style="display: block; margin-bottom: 15px;" >
                    <span style="display: block; margin-bottom: 5px; font-weight: bold;" > Revenu mensuel actuel(€) </span>
                        < input type = "number" id = "currentRevenue" placeholder = "50000" style = "width: 100%; padding: 12px; border-radius: 8px; border: none; font-size: 16px;" >
                            </label>

                            < label style = "display: block; margin-bottom: 15px;" >
                                <span style="display: block; margin-bottom: 5px; font-weight: bold;" > Valeur moyenne d'un lead (€)</span>
                                    < input type = "number" id = "leadValue" placeholder = "500" style = "width: 100%; padding: 12px; border-radius: 8px; border: none; font-size: 16px;" >
                                        </label>

                                        < label style = "display: block; margin-bottom: 15px;" >
                                            <span style="display: block; margin-bottom: 5px; font-weight: bold;" > Leads par mois </span>
                                                < input type = "number" id = "leadsPerMonth" placeholder = "100" style = "width: 100%; padding: 12px; border-radius: 8px; border: none; font-size: 16px;" >
                                                    </label>

                                                    < label style = "display: block; margin-bottom: 15px;" >
                                                        <span style="display: block; margin-bottom: 5px; font-weight: bold;" > Taux de conversion actuel(%) </span>
                                                            < input type = "number" id = "conversionRate" placeholder = "3" style = "width: 100%; padding: 12px; border-radius: 8px; border: none; font-size: 16px;" >
                                                                </label>

                                                                < button onclick = "calculateELAROI()" style = "width: 100%; padding: 15px; background: #FFD700; color: #000; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; margin-top: 10px;" >
                                                                    Calculer Mon ROI 🚀
</button>
    </div>

    < div id = "roi-results" style = "display: none; background: rgba(255,255,255,0.15); padding: 25px; border-radius: 10px;" >
        <h3 style="margin-top: 0; text-align: center; font-size: 22px;" > Vos Résultats </h3>
            < div style = "display: grid; gap: 15px;" >
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;" >
                    <div style="font-size: 14px; opacity: 0.9;" > Revenu Additionnel / Mois </div>
                        < div id = "revenue-increase" style = "font-size: 32px; font-weight: bold; margin-top: 5px;" > -</div>
                            </div>
                            < div style = "background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;" >
                                <div style="font-size: 14px; opacity: 0.9;" > ROI Total </div>
                                    < div id = "total-roi" style = "font-size: 32px; font-weight: bold; margin-top: 5px; color: #FFD700;" > -</div>
                                        </div>
                                        < div style = "background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;" >
                                            <div style="font-size: 14px; opacity: 0.9;" > Temps Économisé / Mois </div>
                                                < div id = "time-saved" style = "font-size: 32px; font-weight: bold; margin-top: 5px;" > -</div>
                                                    </div>
                                                    < div style = "background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;" >
                                                        <div style="font-size: 14px; opacity: 0.9;" > Retour sur 3 ans </div>
                                                            < div id = "three-year" style = "font-size: 32px; font-weight: bold; margin-top: 5px; color: #4ADE80;" > -</div>
                                                                </div>
                                                                </div>

                                                                < a href = "/signup?roi=calculated" style = "display: block; width: 100%; padding: 18px; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; text-decoration: none; border-radius: 12px; font-size: 20px; font-weight: bold; text-align: center; margin-top: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" >
            🎯 Commencer Maintenant
    </a>
    </div>
    </div>

    <script>
function calculateELAROI() {
    const revenue = parseFloat(document.getElementById('currentRevenue').value) || 0;
    const leadValue = parseFloat(document.getElementById('leadValue').value) || 0;
    const leads = parseFloat(document.getElementById('leadsPerMonth').value) || 0;
    const conversion = parseFloat(document.getElementById('conversionRate').value) || 0;

    // Calculs
    const additionalLeads = leads * 0.45; // +45%
    const newConversion = conversion * 1.28; // +28%
    const additionalCustomers = additionalLeads * (newConversion / 100);
    const revenueIncrease = additionalCustomers * leadValue;
    const timeSaved = 52; // heures/mois
    const roi = ((revenueIncrease / 197) * 100).toFixed(0);
    const threeYear = (revenueIncrease * 36 - 197 * 36).toFixed(0);

    // Affichage
    document.getElementById('revenue-increase').textContent = '€' + Math.round(revenueIncrease).toLocaleString();
    document.getElementById('total-roi').textContent = roi + '%';
    document.getElementById('time-saved').textContent = timeSaved + 'h';
    document.getElementById('three-year').textContent = '€' + parseInt(threeYear).toLocaleString();
    document.getElementById('roi-results').style.display = 'block';

    // Track event
    if (window.gtag) {
        gtag('event', 'roi_calculated', {
            revenue_increase: revenueIncrease,
            roi_percentage: roi
        });
    }
}
</script>
    `.trim();
    }

    /**
     * Enregistrer un calcul ROI (lead capture)
     */
    static async captureROILead(params: {
        email: string;
        inputs: ROIInputs;
        results: ROIResults;
    }): Promise<void> {
        const { email, inputs, results } = params;

        console.log(`[ROI] Lead captured: ${email} - ROI: ${results.totalROI.toFixed(0)}% `);

        // Créer lead dans CRM si ROI > 500%
        if (results.totalROI > 500) {
            console.log(`[ROI] High - value lead detected! ${email} `);
            // Intégration CRM ici
        }
    }
}
