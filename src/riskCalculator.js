export function calculateRisk(formData) {
  const riskFactors = {
    previousPretermBirth: 2.5,
    cervixLength: {
      lessThan15mm: 13.4,
      between15and20mm: 4.3,
      between20and25mm: 2.8,
      between25and30mm: 1.9,
      moreThan30mm: 1.0
    },
    gestationalAge: {
      lessThan24weeks: 3.2,
      between24and28weeks: 2.4,
      between28and32weeks: 1.8,
      moreThan32weeks: 1.0
    }
  };

  let riskScore = 1.0;

  // Parto prematuro previo
  if (formData.previousPreterm === 'yes') {
    riskScore *= riskFactors.previousPretermBirth;
  }

  // Longitud cervical
  const cervixLength = parseFloat(formData.cervixLength);
  if (cervixLength < 15) {
    riskScore *= riskFactors.cervixLength.lessThan15mm;
  } else if (cervixLength >= 15 && cervixLength < 20) {
    riskScore *= riskFactors.cervixLength.between15and20mm;
  } else if (cervixLength >= 20 && cervixLength < 25) {
    riskScore *= riskFactors.cervixLength.between20and25mm;
  } else if (cervixLength >= 25 && cervixLength < 30) {
    riskScore *= riskFactors.cervixLength.between25and30mm;
  }

  // Edad gestacional
  const gestationalAge = parseInt(formData.gestationalAge);
  if (gestationalAge < 24) {
    riskScore *= riskFactors.gestationalAge.lessThan24weeks;
  } else if (gestationalAge >= 24 && gestationalAge < 28) {
    riskScore *= riskFactors.gestationalAge.between24and28weeks;
  } else if (gestationalAge >= 28 && gestationalAge < 32) {
    riskScore *= riskFactors.gestationalAge.between28and32weeks;
  }

  return riskScore;
}
