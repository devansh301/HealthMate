const pdfParse = require("pdf-parse");
const fs = require("fs");

async function parsePDF(filePath) {
  console.log(filePath);
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  console.log("data", data);
  const text = data.text;

  // Extract fields using regular expressions
  const nameMatch = text.match(/Name:\s*([\w\s]+)/);
  const ageMatch = text.match(/Age:\s*(\d+)/);
  const locationMatch = text.match(/Location:\s*([\w\s,]+)/);
  const bmiMatch = text.match(/BMI:\s*(\d+\.\d+)/);
  const bloodGroupMatch = text.match(/Blood Group:\s*(\w+)/);
  const bloodPressureMatch = text.match(/Blood Pressure:\s*(\d+\/\d+)/);
  const cholesterolMatch = text.match(/Cholesterol:\s*(\d+)/);
  const heartRateMatch = text.match(/Heart Rate:\s*(\d+)/);
  const glucoseLevelMatch = text.match(/Blood Glucose Level:\s*(\d+)/);
  const hemoglobinLevelsMatch = text.match(/Hemoglobin Levels:\s*(\d+\.\d+)/);
  const ecgMatch = text.match(/ECG:\s*([\w\s]+)/);
  const lipidProfileMatch = text.match(/Lipid Profile:\s*([\w\s]+)/);
  const bloodGlucoseLevelMatch = text.match(/Blood Glucose Level:\s*(\d+)/);
  const rbcCountMatch = text.match(/RBC Count:\s*(\d+\.\d+)/);
  const plateletsMatch = text.match(/Platelets:\s*(\d+)/);
  const lftMatch = text.match(/Liver Function Test \(LFT\):\s*([\w\s]+)/);
  const kftMatch = text.match(/Kidney Function Test:\s*([\w\s]+)/);
  const coagulationProfileMatch = text.match(/Coagulation Profile:\s*([\w\s]+)/);
  const boneHealthMatch = text.match(/Bone Health:\s*([\w\s]+)/);
  const wbcCountMatch = text.match(/WBC Count:\s*(\d+\.\d+)/);

  return {
    name: nameMatch ? nameMatch[1].trim() : null,
    age: ageMatch ? parseInt(ageMatch[1], 10) : null,
    location: locationMatch ? locationMatch[1].trim() : null,
    bmi: bmiMatch ? parseFloat(bmiMatch[1]) : null,
    bloodGroup: bloodGroupMatch ? bloodGroupMatch[1].trim() : null,
    bloodPressure: bloodPressureMatch ? bloodPressureMatch[1].trim() : null,
    cholesterol: cholesterolMatch ? parseInt(cholesterolMatch[1], 10) : null,
    heartRate: heartRateMatch ? parseInt(heartRateMatch[1], 10) : null,
    glucoseLevel: glucoseLevelMatch ? parseInt(glucoseLevelMatch[1], 10) : null,
    hemoglobinLevels: hemoglobinLevelsMatch ? parseFloat(hemoglobinLevelsMatch[1]) : null,
    ecg: ecgMatch ? ecgMatch[1].trim() : null,
    lipidProfile: lipidProfileMatch ? lipidProfileMatch[1].trim() : null,
    bloodGlucoseLevel: bloodGlucoseLevelMatch ? parseInt(bloodGlucoseLevelMatch[1], 10) : null,
    rbcCount: rbcCountMatch ? parseFloat(rbcCountMatch[1]) : null,
    platelets: plateletsMatch ? parseInt(plateletsMatch[1], 10) : null,
    lft: lftMatch ? lftMatch[1].trim() : null,
    kft: kftMatch ? kftMatch[1].trim() : null,
    coagulationProfile: coagulationProfileMatch ? coagulationProfileMatch[1].trim() : null,
    boneHealth: boneHealthMatch ? boneHealthMatch[1].trim() : null,
    wbcCount: wbcCountMatch ? parseFloat(wbcCountMatch[1]) : null,
  };
}

module.exports = parsePDF;
