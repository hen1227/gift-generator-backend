// TODO: Keywords are to broad and vague. Need to be more specific. Need to directly relate to gift.
const numberPerRequest = 6;

export const initialContextPrompt = "" +
    "You are a gift idea generator. All your responses will only contain information about relevant gifts for target"  +
    " recipients. Do not include anything in your responses other than JSON data. Each message sent to you will"       +
    " contain information about a target recipient. You will return JSON information with a list of objects that"      +
    " would be good gifts for this recipient. The gifts you suggest should be unique suggestions." +
    " To the best of your ability, suggest gifts that might not be obvious." +
    " They provide details about who the person is, not exactly what would make a good gift. Your response should"     +
    " follow this format:\n" +
    "      {\n" +
    "        “conversation_title”: “A very short, concise title describing the request”," +
    "        “gifts”: [\n" +
    "            {\n" +
    "               “name”: “gift’s name”,\n" +
    // "               “description”: “1-2 sentence description”,\n"+
    "               “gift_topic”: “one or two word broad category”,\n" +
    "               “keywords”: “1-3 distinctive keywords separated by commas”,\n" +
    // "               “price”: “estimated price of project (e.g. 10.00)”,\n" +
    // "               “match”: “estimated quality based off recipient (e.g., 50.0%)”\n" +
    // ERROR with matching: It gave, which is interesting: "match": " eighty eight .0%\t"\n
    "           }\n" +
    "       ]\n" +
    "    }\n";

export const generateInitialPrompt = (data) => {
    const { age, gender, relationship, lowerBudgetRange, upperBudgetRange, occasion, interests, disinterests, preferences, openEndedAddition } = data;

    let prompt = `Generate a list of ${numberPerRequest} gifts based on the following characteristics: 
`;
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

export const generateFollowUpPrompt = (data) => {
    const { thumbsUpCategories, thumbsDownCategories } = data;

    if(thumbsUpCategories.length === 0 && thumbsDownCategories.length === 0)
        return `Good start! I want about ${numberPerRequest} more gift ideas that this person might enjoy. \n`;

    let prompt = `Good start! I want ${numberPerRequest} more gift ideas based of the following feedback: \n`;

    for(let i = 0; i < thumbsUpCategories.length; i++) {
        if(i === 0)
            prompt += `The suggestions about ${thumbsUpCategories[i]}, `;
        else if (i === thumbsUpCategories.length - 1)
            prompt += ` and ${thumbsUpCategories[i]} were good! Try more like that.`;
        else
            prompt += `${thumbsUpCategories[i]}, `;
    }

    for(let i = 0; i < thumbsDownCategories.length; i++) {
        if(i === 0)
            prompt += `The suggestions about ${thumbsDownCategories[i]}, `;
        else if (i === thumbsDownCategories.length - 1)
            prompt += ` and ${thumbsDownCategories[i]} were not as good. Try to avoid those.`;
        else
            prompt += `${thumbsDownCategories[i]}, `;
    }

    prompt += 'This feedback should help you peice together what sort of person I\'m searching for a gift for. Given this feedback, generate more gifts that they might also be interested in. ';
    prompt += 'Do your best to generate good gifts even if the feedback isn\'t great.';
    // prompt += 'You must maintain the format of your response';

    return prompt;
}


export const generateExpandUponPrompt = (data) => {
    const { expandingGiftTopic } = data;

    let prompt = `Good start! I want ${numberPerRequest} more gift ideas relating to ${expandingGiftTopic}! Please list more ideas like this one. \n`;
    prompt += 'Do your best to generate good gifts even if its hard to find related gifts';
    // prompt += 'You must maintain the format of your response';

    return prompt;
}
