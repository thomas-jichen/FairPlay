const ENGINEERING_CODES = ['ENBM', 'EBED', 'EGSD', 'ETSD', 'ENEV', 'MATS', 'ROBO', 'SFTD', 'TECA']

export function getRubricType(categoryCode) {
  return ENGINEERING_CODES.includes(categoryCode) ? 'engineering' : 'science'
}

export const SCIENCE_RUBRIC = `ISEF SCIENCE PROJECT EVALUATION CRITERIA

I. Research Question (10 points)
- Clear and focused purpose or research question
- Identifies contribution to the field of study
- Testable using scientific methods

II. Design and Methodology (15 points)
- Well-designed plan and data collection methods
- Variables and controls defined and appropriate

III. Execution: Data Collection, Analysis, and Interpretation (20 points)
- Systematic data collection with sufficient data to support interpretation
- Reproducibility of results addressed
- Appropriate application of mathematical and statistical methods
- Data collection and analysis are sufficient to support conclusions

IV. Creativity (20 points)
- Project demonstrates significant creativity in one or more of the above criteria
- Addresses a real-world problem or contributes meaningfully to the field
- Potential impact on science, technology, the economy, the environment, or society

V. Presentation (35 points)
  A. Poster (10 points)
  - Logical organization of material
  - Clarity of graphics and legends
  - Supporting documentation (abstract, research paper, notebook)

  B. Interview (25 points)
  - Clear, concise, and thoughtful responses to questions
  - Understanding of basic science relevant to the project
  - Understanding of the interpretation and limitations of results and conclusions
  - Degree of independence in conducting the project
  - Recognition of potential impact of the research
  - Quality of ideas for further research`

export const ENGINEERING_RUBRIC = `ISEF ENGINEERING PROJECT EVALUATION CRITERIA

I. Research Problem / Engineering Goals (10 points)
- Description of a practical need or problem to be solved
- Definition of criteria for a proposed solution
- Explanation of constraints

II. Design and Methodology (15 points)
- Exploration of alternatives to answer the need or problem
- Identification of a solution
- Development of a prototype/model

III. Execution: Construction and Testing (20 points)
- Prototype/model demonstrates intended design
- Testing in multiple conditions/trials
- Demonstration of engineering skill and completeness

IV. Creativity (20 points)
- Project demonstrates significant creativity in one or more of the above criteria
- Addresses a real-world problem or contributes meaningfully to the field
- Potential impact on science, technology, the economy, the environment, or society

V. Presentation (35 points)
  A. Poster (10 points)
  - Logical organization of material
  - Clarity of graphics and legends
  - Supporting documentation (abstract, research paper, notebook)

  B. Interview (25 points)
  - Clear, concise, and thoughtful responses to questions
  - Understanding of basic science/engineering relevant to the project
  - Understanding of the interpretation and limitations of results and conclusions
  - Degree of independence in conducting the project
  - Recognition of potential impact of the research
  - Quality of ideas for further research`
