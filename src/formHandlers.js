import { calculateRisk } from './riskCalculator.js';
import { displayResults } from './displayResults.js';

export function setupFormHandlers() {
  const form = document.getElementById('riskForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      previousPreterm: document.getElementById('previousPreterm').value,
      cervixLength: document.getElementById('cervixLength').value,
      gestationalAge: document.getElementById('gestationalAge').value
    };

    const riskScore = calculateRisk(formData);
    displayResults(riskScore);
  });

  // Manejadores para campos numéricos
  const numericInputs = document.querySelectorAll('input[type="number"]');
  numericInputs.forEach(input => {
    input.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  });
}
