const session = require("../config/neo4j");
const llm = require("../config/bedrock");
require("dotenv").config();

async function askLLM(req, res) {
//   const { email } = req.user;
  const email = "rawatdevansh360@gmail.com";
  const msg = req.body.message;

  try {
    const result = await session.run(
      `MATCH (p:Person {email: $email})-[:HAS_HEALTH_REPORT]->(r:HealthReport) RETURN r`,
      { email }
    );
    console.log(result);

    if (result.records.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userData = result.records[0]._fields[0].properties;
    console.log(userData)

    const userInfo = `
      The following is detailed health information for a patient named ${userData.name}, who is ${userData.age} years old and resides in ${userData.location}.
      
      - **BMI**: ${userData.BMI}
      - **Blood Group**: ${userData.BloodGroup}
      - **Blood Pressure**: ${userData.BloodPressure}
      - **Cholesterol Levels**: ${userData.cholesterol}
      - **Heart Rate**: ${userData.heartRate}
      - **Glucose Level**: ${userData.glucoseLevel}
      - **Hemoglobin Levels**: ${userData.hemoglobinLevels}
      - **ECG Results**: ${userData.ecg}
      - **Lipid Profile**: ${userData.LipidProfile}
      - **Blood Glucose Level**: ${userData.bloodGlucoseLevel}
      - **RBC Count**: ${userData.rbcCount}
      - **Platelet Count**: ${userData.Platelets}
      - **Liver Function Test (LFT)**: ${userData.lft}
      - **Kidney Function Test**: ${userData.kidneyFunctionTest}
      - **Coagulation Profile**: ${userData.coagulationProfile}
      - **BoneHealth**: ${userData.BoneHealth}
      - **WBC Count**: ${userData.WBCCount}

      Please use this information to provide personalized and accurate health advice in response to the following query from the patient.
    `;
    console.log(userInfo);
    const aiMsg = await llm.invoke([
      [
        "system",
        `You are an experienced healthcare assistant. Based on the patient's detailed health information provided below, answer the patient's questions with personalized, accurate advice in very simple terms.${userInfo}`,
      ],
      ["human", msg],
    ]);

    return res.status(200).json({ message: aiMsg });
  } catch (error) {
    console.error("Error querying Neo4j or invoking LLM:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  askLLM,
};
