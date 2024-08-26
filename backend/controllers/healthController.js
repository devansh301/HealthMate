const parsePDF = require("../utils/pdfParser");
const session = require("../config/neo4j");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

async function updateHealthDataInNeo4j(email, healthData) {
  const userResult = await session.run(
    `MATCH (p:Person {email: $email}) RETURN p`,
    { email }
  );

  if (userResult.records.length > 0) {
    await session.run(
      `MERGE (s:State {name: $stateName})
       MERGE (c:City {pin: $pinCode})
       MERGE (s)-[:HAS_CITY]->(c)
       MERGE (p:Person {email: $email})
       MERGE (c)-[:HAS_PERSON]->(p)
       CREATE (h:HealthReport {
          UploadTime: $UploadTime,
          BMI: $BMI,
          BloodGroup: $BloodGroup,
          BloodPressure: $BloodPressure,
          Cholesterol: $Cholesterol,
          HeartRate: $HeartRate,
          GlucoseLevel: $GlucoseLevel,
          HemoglobinLevels: $HemoglobinLevels,
          ECG: $ECG,
          LipidProfile: $LipidProfile,
          BloodGlucoseLevel: $BloodGlucoseLevel,
          RBCCount: $RBCCount,
          Platelets: $Platelets,
          LiverFunctionTest: $LiverFunctionTest,
          KidneyFunctionTest: $KidneyFunctionTest,
          CoagulationProfile: $CoagulationProfile,
          BoneHealth: $BoneHealth,
          WBCCount: $WBCCount
        })
       MERGE (p)-[:HAS_REPORT]->(h)`,
      {
        stateName: healthData.stateName || "",
        pinCode: healthData.pinCode || "",
        UploadTime: new Date().toISOString(),
        BMI: healthData.BMI || null,
        BloodGroup: healthData.BloodGroup || "",
        BloodPressure: healthData.BloodPressure || "",
        Cholesterol: healthData.Cholesterol || "",
        HeartRate: healthData.HeartRate || "",
        GlucoseLevel: healthData.GlucoseLevel || "",
        HemoglobinLevels: healthData.HemoglobinLevels || "",
        ECG: healthData.ECG || "",
        LipidProfile: healthData.LipidProfile || "",
        BloodGlucoseLevel: healthData.BloodGlucoseLevel || "",
        RBCCount: healthData.RBCCount || "",
        Platelets: healthData.Platelets || "",
        LiverFunctionTest: healthData.LiverFunctionTest || "",
        KidneyFunctionTest: healthData.KidneyFunctionTest || "",
        CoagulationProfile: healthData.CoagulationProfile || "",
        BoneHealth: healthData.BoneHealth || "",
        WBCCount: healthData.WBCCount || "",
      }
    );
    return { success: true, message: "Health data updated successfully" };
  } else {
    return { success: false, message: "User not found" };
  }
}

async function processHealthReport(req, res) {
  const filePath = req.file?.path;
  const email = req.user.email;

  if (!filePath) {
    return res.status(400).json({ error: "File path is required." });
  }

  try {
    const healthData = await parsePDF(filePath);
    // console.log(healthData);
    const result = await updateHealthDataInNeo4j(email, healthData);

    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(404).json({ error: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing health report" });
  }
}

// async function uploadCSV(req, res) {
//   const url = req.body.url;
//   try {
//     await session.run(
//     `
// LOAD CSV WITH HEADERS FROM ${url} AS row
// MERGE (s:State {name: row.State})
// MERGE (c:City {pin: toInteger(row.`City Pin`)})
// // Create Person nodes
// MERGE (p:Person {name: row.Name, yearOfBirth: toInteger(row.`Year of Birth`)})
// // Create Health Report nodes
// CREATE (hr:HealthReport {
//     BMI: toFloat(row.BMI),
//     BloodGroup: row.`Blood Group`,
//     BloodPressure: row.`Blood Pressure`,
//     Cholesterol: toFloat(row.`Cholesterol (mg/dL)`),
//     HeartRate: toInteger(row.`Heart Rate (bpm)`),
//     GlucoseLevel: toFloat(row.`Glucose Level (mg/dL)`),
//     HemoglobinLevels: toFloat(row.`Hemoglobin Levels (g/dL)`),
//     ECG: row.ECG,
//     LipidProfile: toFloat(row.`Lipid Profile (mg/dL)`),
//     RBCCount: toFloat(row.`RBC Count (million cells/µL)`),
//     Platelets: toInteger(row.`Platelets (platelets/µL)`),
//     LiverFunctionTest: row.`Liver Function Test (LFT)`,
//     KidneyFunctionTest: row.`Kidney Function Test (Serum Creatinine mg/dL)`,
//     CoagulationProfile: row.`Coagulation Profile (PT/INR)`,
//     BoneHealth: toFloat(row.`Bone Health (T-score)`),
//     WBCCount: toInteger(row.`WBC Count (cells/µL)`)
// })

// // Create Relationships
// MERGE (s)-[:HAS_CITY]->(c)
// MERGE (c)-[:HAS_PERSON]->(p)
// MERGE (p)-[:HAS_HEALTH_REPORT]->(hr)
// `
//   )
//   return res.status(200).json({message: "success"});
//   } catch (e) {
//     return res.status(500).json({error: e});
//   }
// }

module.exports = {
  processHealthReport: [upload.single("file"), processHealthReport],
};
