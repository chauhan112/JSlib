export const getCVCreatePrompt = (
    personalDetails: string,
    jobDetails: string
) => {
    return `You are a professional CV writer. Based on the following personal details and job description, create a professional, well-structured CV tailored to this specific job.

Personal Details:
${personalDetails}

Job Details:
${jobDetails}

Please create a CV that:
1. Highlights the most relevant skills and experiences for this job
2. Uses a professional format with clear sections
3. Is concise but comprehensive
4. Focuses on achievements rather than just responsibilities
5. Uses action verbs and quantifiable results where possible

Format the CV with appropriate sections such as:
- Contact Information
- Professional Summary
- Work Experience
- Education
- Skills
- Achievements
- Certifications (if applicable)

Return only the CV content without any additional explanations.`;
};

export const getMotivationCreatePrompt = (
    personalDetails: string,
    jobDetails: string
) => {
    return `You are a professional motivation letter writer. Based on the following personal details and job description, create a compelling motivation letter tailored to this specific job.

Personal Details:
${personalDetails}

Job Details:
${jobDetails}

Please create a motivation letter that:
1. Clearly expresses interest in the position
2. Demonstrates understanding of the company and role
3. Highlights relevant skills and experiences from the candidate's background
4. Explains why the candidate is a good fit for this specific role
5. Shows enthusiasm and professionalism
6. Follows a formal letter structure

Format the motivation letter with:
- Appropriate salutation
- Introduction stating the position of interest
- Body paragraphs highlighting relevant qualifications
- Conclusion expressing interest in further discussion
- Professional closing

Return only the motivation letter content without any additional explanations.`;
};
