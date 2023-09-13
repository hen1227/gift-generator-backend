export const initialContextPrompt = "" +
    "You are a gift idea generator. All your responses will only contain information about relevant gifts for target recipients. Do not include anything in your responses other than JSON data. Each message sent to you will contain information about a target recipient. You will return JSON information with a list of objects that would be good gifts for this recipient. The gifts you suggest should not be direct results of their interests and should be unique suggestions. The details about the recipient should only slightly affect your suggestions. They provide details about who the person is, not exactly what would make a good gift. Your response should follow this format:\n" +
    "        [\n" +
    "            {\n" +
    "               “name”: “gift’s name”,\n" +
    "               “description”: “1-2 sentence description”,\n"+
    "               “gift_topic”: “one or two word broad category”,\n" +
    "               “keywords”: “1-5 keywords separated by commas”,\n" +
    "               “price”: “estimated price of project (e.g. 10.00)”,\n" +
    // "               “match”: “estimated quality based off recipient (e.g., 50.0%)”\n" +
    // It gave, which is interesting: "match": " eighty eight .0%\t"\n
    "           }\n" +
    "       ]\n";

export const generateInitialPrompt = (data) => {
    const { name, age, gender, relationship, lowerBudgetRange, upperBudgetRange, occasion, interests, disinterests, preferences, openEndedAddition } = data;

    let prompt = "Generate a list of 6 gifts based on the following characteristics: \n";
    if (relationship)
        prompt += `The person I'm getting the gift for is my ${relationship}. `

    if (age)
        prompt += `The person I'm getting the gift for is ${age} years old. `

    if (age)
        prompt += `This person is a ${gender}. `

    if(upperBudgetRange && lowerBudgetRange && occasion)
        prompt += `I would like to spend between ${upperBudgetRange} and ${lowerBudgetRange} dollars on this gift for ${occasion}. `;
    else if (upperBudgetRange && lowerBudgetRange)
        prompt += `I would like to spend between ${upperBudgetRange} and ${lowerBudgetRange} dollars on this gift. `;
    else if (occasion)
        prompt += `I would like to spend between 0 and 20 dollars on this gift for ${occasion}. `;
    else if(upperBudgetRange)
        prompt += `I would like to spend no more than ${upperBudgetRange} dollars on this gift. `;
    else if(lowerBudgetRange)
        prompt += `I would like to spend at least ${lowerBudgetRange} dollars on this gift. `;

    for(let i = 0; i < interests.length; i++) {
        if(i === 0)
            prompt += `This person ${interests[i].attitude} enjoys ${interests[i].activity}, `
        else if (i === interests.length - 1)
            prompt += ` and ${interests[i]}`
        else
            prompt += `${interests[i]}, `
    }

    for(let i = 0; i < disinterests.length; i++) {
        if(i === 0)
            prompt += `but ${disinterests[i].attitude} does not enjoy ${disinterests[i].activity}, `
        else if (i === disinterests.length - 1)
            prompt += ` and ${disinterests[i]}`
        else
            prompt += `${disinterests[i]}, `
    }

    for(let i = 0; i < preferences.length; i++) {
        if(i === 0)
            prompt += `and ${preferences[i].prefers} over ${preferences[i].over}.`
        else if (i === preferences.length - 1)
            prompt += ` and ${preferences[i].prefers} over ${preferences[i].over}`
        else
            prompt += `${preferences[i].prefers} over ${preferences[i].over}, `
    }

    if(openEndedAddition)
        prompt += ` ${openEndedAddition}.`

    return prompt;
}