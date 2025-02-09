interface RiskResult {
    risk: number;
    category: string;
    recommendations: string;
}

interface FormData {
    gestationalWeeks: number;
    gestationalDays: number;
    cervicalLength: number;
    fetusCount: number;
    hasContractions: boolean;
    hasPreviousPretermBirth: boolean;
    hasMembraneRupture: boolean;
    hasCervicalSurgery: boolean;
}

export function displayResults(riskResult: RiskResult, formData: FormData) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv) return;

    const categoryColorClass = 
        riskResult.category === 'Alto' ? 'text-red-600' :
        riskResult.category === 'Moderado' ? 'text-yellow-600' :
        'text-green-600';

    resultDiv.innerHTML = `
        <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
                <h3 class="text-lg font-semibold text-gray-900">Resultados del Análisis</h3>
            </div>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-lg bg-gray-50 p-4">
                    <h4 class="text-sm font-medium text-gray-900">Riesgo Calculado</h4>
                    <p class="mt-1 text-2xl font-semibold ${categoryColorClass}">${(riskResult.risk).toFixed(1)}%</p>
                </div>
                
                <div class="rounded-lg bg-gray-50 p-4">
                    <h4 class="text-sm font-medium text-gray-900">Categoría</h4>
                    <p class="mt-1 text-2xl font-semibold ${categoryColorClass}">${riskResult.category}</p>
                </div>
            </div>

            <div class="mt-6">
                <h4 class="text-sm font-medium text-gray-900">Recomendaciones</h4>
                <div class="mt-2 text-sm text-gray-600">
                    ${riskResult.recommendations}
                </div>
            </div>

            <div class="mt-6 rounded-lg bg-gray-50 p-4">
                <h4 class="text-sm font-medium text-gray-900">Datos Ingresados</h4>
                <dl class="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Edad gestacional</dt>
                        <dd class="text-sm text-gray-900">${formData.gestationalWeeks} semanas, ${formData.gestationalDays} días</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Longitud cervical</dt>
                        <dd class="text-sm text-gray-900">${formData.cervicalLength} mm</dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500">Número de fetos</dt>
                        <dd class="text-sm text-gray-900">${formData.fetusCount}</dd>
                    </div>
                </dl>
            </div>
        </div>
    `;
    
    resultDiv.classList.remove('hidden');
}
