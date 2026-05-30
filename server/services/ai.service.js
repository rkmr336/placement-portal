export const analyzeResume =
  async (resumeText) => {

    try {

      let score = 40;

      const foundSkills = [];

      const lowerText =
        resumeText.toLowerCase();

      // Skill database
      const skillDatabase = [
        "react",
        "node",
        "mongodb",
        "express",
        "javascript",
        "python",
        "java",
        "c++",
        "docker",
        "aws",
        "sql",
        "html",
        "css",
      ];

      // Check skills
      skillDatabase.forEach(
        (skill) => {

          if (
            lowerText.includes(skill)
          ) {

            foundSkills.push(skill);

            score += 4;
          }
        }
      );

      // Project bonus
      if (
        lowerText.includes("project")
      ) {
        score += 10;
      }

      // Internship bonus
      if (
        lowerText.includes(
          "internship"
        )
      ) {
        score += 10;
      }

      // Experience bonus
      if (
        lowerText.includes(
          "experience"
        )
      ) {
        score += 10;
      }

      // Certification bonus
      if (
        lowerText.includes(
          "certificate"
        )
      ) {
        score += 5;
      }

      // Limit score
      if (score > 100) {
        score = 100;
      }

      // Missing skills
      const importantSkills = [
        "docker",
        "aws",
        "mongodb",
        "react",
      ];

      const missingSkills =
        importantSkills.filter(
          (skill) =>
            !lowerText.includes(
              skill
            )
        );

      // ATS Rating
      let ats = "Average";

      if (score >= 85) {
        ats = "Excellent";
      } else if (score >= 70) {
        ats = "Good";
      }

      // Final Response
      const analysis = `

Resume Score: ${score}/100

Technical Skills Found:
${foundSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Improvement Suggestions:
- Add more real-world projects
- Add achievements section
- Improve resume formatting
- Add certifications

ATS Compatibility:
${ats}

`;

      return analysis;

    } catch (error) {

      console.log(error);

      return "AI analysis failed";
    }
  };