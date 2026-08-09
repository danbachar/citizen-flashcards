import type { CurriculumSeed } from "../src/lib/seed";

// Curriculum vocabulary. `satisfies` keeps this file honest against the schema-
// derived types; `npm run db:seed` loads it.
export default [
    {
        'tier': 'Foundation',
        'levels': [
            {
                "level": "Red",
                "type": null,
                "pairs": [
                    { "hebrew": "שָׁלוֹם", "english": "Hello / Peace" },
                    { "hebrew": "תּוֹדָה", "english": "Thank you" },
                    { "hebrew": "כֵּן", "english": "Yes" },
                    { "hebrew": "לֹא", "english": "No" },
                    { "hebrew": "בְּבַקָּשָׁה", "english": "Please / You're welcome" },
                    { "hebrew": "טוֹב", "english": "Good" },
                    { "hebrew": "מַיִם", "english": "Water" },
                    { "hebrew": "לֶחֶם", "english": "Bread" },
                    { "hebrew": "סְלִיחָה", "english": "Excuse me / Sorry" },
                    { "hebrew": "לְהִתְרָאוֹת", "english": "Goodbye" }
                ]
            },
            {
                "level": "Orange",
                "type": null,
                "pairs": [
                    { "hebrew": "אֲנִי", "english": "I" },
                    { "hebrew": "אַתָּה", "english": "You (m)" },
                    { "hebrew": "הוּא", "english": "He" },
                    { "hebrew": "הִיא", "english": "She" },
                    { "hebrew": "אֲנַחְנוּ", "english": "We" },
                    { "hebrew": "לֶאֱכוֹל", "english": "To eat" },
                    { "hebrew": "לִשְׁתּוֹת", "english": "To drink" },
                    { "hebrew": "לָלֶכֶת", "english": "To go" },
                    { "hebrew": "גָּדוֹל", "english": "Big" },
                    { "hebrew": "קָטָן", "english": "Small" }
                ]
            },
            {
                "level": "Pink",
                "type": null,
                "pairs": [
                    { "hebrew": "הַיּוֹם", "english": "Today" },
                    { "hebrew": "מָחָר", "english": "Tomorrow" },
                    { "hebrew": "אֶתְמוֹל", "english": "Yesterday" },
                    { "hebrew": "פֹּה", "english": "Here" },
                    { "hebrew": "שָׁם", "english": "There" },
                    { "hebrew": "בֹּקֶר", "english": "Morning" },
                    { "hebrew": "עֶרֶב", "english": "Evening" },
                    { "hebrew": "לַיְלָה", "english": "Night" },
                    { "hebrew": "עַכְשָׁיו", "english": "Now" },
                    { "hebrew": "תָּמִיד", "english": "Always" }
                ]
            },
            {
                "level": "Yellow",
                "type": null,
                "pairs": [
                    { "hebrew": "מִי", "english": "Who" },
                    { "hebrew": "מָה", "english": "What" },
                    { "hebrew": "אֵיפֹה", "english": "Where" },
                    { "hebrew": "מָתַי", "english": "When" },
                    { "hebrew": "לָמָּה", "english": "Why" },
                    { "hebrew": "אֵיךְ", "english": "How" },
                    { "hebrew": "כַּמָּה", "english": "How much / How many" },
                    { "hebrew": "יָפֶה", "english": "Beautiful" },
                    { "hebrew": "קָשֶׁה", "english": "Hard" },
                    { "hebrew": "קַל", "english": "Easy" }
                ]
            }]
    },
    {
        'tier': 'Flow',
        'levels': [
            {
                "level": "Light Blue",
                "type": null,
                "pairs": [
                    { "hebrew": "עֲבוֹדָה", "english": "Work" },
                    { "hebrew": "בַּיִת", "english": "House / Home" },
                    { "hebrew": "מִשְׁפָּחָה", "english": "Family" },
                    { "hebrew": "חָבֵר", "english": "Friend" },
                    { "hebrew": "לְדַבֵּר", "english": "To speak" },
                    { "hebrew": "לַעֲשׂוֹת", "english": "To do" },
                    { "hebrew": "לָדַעַת", "english": "To know" },
                    { "hebrew": "כֶּסֶף", "english": "Money" },
                    { "hebrew": "זְמַן", "english": "Time" },
                    { "hebrew": "אָהֲבָה", "english": "Love" }
                ]
            },
            {
                "level": "Blue",
                "type": null,
                "pairs": [
                    { "hebrew": "מְכוֹנִית", "english": "Car" },
                    { "hebrew": "רְחוֹב", "english": "Street" },
                    { "hebrew": "עִיר", "english": "City" },
                    { "hebrew": "אֶרֶץ", "english": "Country" },
                    { "hebrew": "סֵפֶר", "english": "Book" },
                    { "hebrew": "תְּמוּנָה", "english": "Picture" },
                    { "hebrew": "חָלוֹם", "english": "Dream" },
                    { "hebrew": "חַיִּים", "english": "Life" },
                    { "hebrew": "לִקְרֹא", "english": "To read" },
                    { "hebrew": "לִכְתֹּב", "english": "To write" }
                ]
            },
            {
                "level": "Lime",
                "type": null,
                "pairs": [
                    { "hebrew": "מִשְׂרָד", "english": "Office" },
                    { "hebrew": "מַחְשֵׁב", "english": "Computer" },
                    { "hebrew": "פְּגִישָׁה", "english": "Meeting" },
                    { "hebrew": "שְׁאֵלָה", "english": "Question" },
                    { "hebrew": "תְּשׁוּבָה", "english": "Answer" },
                    { "hebrew": "לְהָבִין", "english": "To understand" },
                    { "hebrew": "לְהַרְגִּישׁ", "english": "To feel" },
                    { "hebrew": "מְעַנְיֵן", "english": "Interesting" },
                    { "hebrew": "חָשׁוּב", "english": "Important" },
                    { "hebrew": "אֶפְשָׁר", "english": "Possible" }
                ]
            },
            {
                "level": "Green",
                "type": null,
                "pairs": [
                    { "hebrew": "בְּעָיָה", "english": "Problem" },
                    { "hebrew": "פִּתְרוֹן", "english": "Solution" },
                    { "hebrew": "מֶמְשָׁלָה", "english": "Government" },
                    { "hebrew": "חֶבְרָה", "english": "Society / Company" },
                    { "hebrew": "מַצָּב", "english": "Situation" },
                    { "hebrew": "לְהַחְלִיט", "english": "To decide" },
                    { "hebrew": "לְהַסְכִּים", "english": "To agree" },
                    { "hebrew": "בְּוַדַּאי", "english": "Certainly" },
                    { "hebrew": "לְמָשָׁל", "english": "For example" },
                    { "hebrew": "תּוֹצָאָה", "english": "Result" }
                ]
            },
        ]
    }, {
        'tier': 'Freedom',
        'levels': [
            {
                "level": "Dark Green",
                "type": 1,
                "pairs": [
                    { "hebrew": "מַגְנִיב", "english": "Cool" },
                    { "hebrew": "סָבָּבָּה", "english": "Awesome / Great" },
                    { "hebrew": "בָּאסָה", "english": "Bummer" },
                    { "hebrew": "יָאלְלָה", "english": "Let's go / Come on" },
                    { "hebrew": "אָחִי", "english": "My brother (bro)" },
                    { "hebrew": "שְׁטֻיּוֹת", "english": "Nonsense" },
                    { "hebrew": "בָּלָגָן", "english": "Mess" },
                    { "hebrew": "תַּכְלֶס", "english": "Actually / Bottom line" },
                    { "hebrew": "פָּנָן", "english": "Fun / Relaxed" },
                    { "hebrew": "חֲבָל עַל הַזְּמַן", "english": "Waste of time / Amazing" }
                ]
            },
            {
                "level": "Dark Green",
                "type": 2,
                "pairs": [
                    { "hebrew": "עַסְקָן", "english": "Hustler / Politician" },
                    { "hebrew": "מִפְעָל", "english": "Factory" },
                    { "hebrew": "תַּעֲשִׂיָּה", "english": "Industry" },
                    { "hebrew": "שִׁוּוּק", "english": "Marketing" },
                    { "hebrew": "מְכִירוֹת", "english": "Sales" },
                    { "hebrew": "לְהַשְׁקִיעַ", "english": "To invest" },
                    { "hebrew": "רֶוַח", "english": "Profit" },
                    { "hebrew": "הֶפְסֵד", "english": "Loss" },
                    { "hebrew": "תַּקְצִיב", "english": "Budget" },
                    { "hebrew": "מְנַהֵל", "english": "Manager" }
                ]
            },
            {
                "level": "Dark Green",
                "type": 3,
                "pairs": [
                    { "hebrew": "נְסִיעָה", "english": "Journey / Ride" },
                    { "hebrew": "טִיסָה", "english": "Flight" },
                    { "hebrew": "מָלוֹן", "english": "Hotel" },
                    { "hebrew": "תַּיָּר", "english": "Tourist" },
                    { "hebrew": "מַסְלוּל", "english": "Route" },
                    { "hebrew": "לְטַיֵּל", "english": "To travel" },
                    { "hebrew": "נוֹף", "english": "Scenery" },
                    { "hebrew": "הַרְפַּתְקָה", "english": "Adventure" },
                    { "hebrew": "מַדְרִיךְ", "english": "Guide" },
                    { "hebrew": "חוּפְשָׁה", "english": "Vacation" }
                ]
            },
            {
                "level": "Dark Green",
                "type": 4,
                "pairs": [
                    { "hebrew": "רוֹפֵא", "english": "Doctor" },
                    { "hebrew": "בֵּית חוֹלִים", "english": "Hospital" },
                    { "hebrew": "תְּרוּפָה", "english": "Medicine" },
                    { "hebrew": "מַחֲלָה", "english": "Disease" },
                    { "hebrew": "בְּרִיאוּת", "english": "Health" },
                    { "hebrew": "לִכְאוֹב", "english": "To hurt" },
                    { "hebrew": "כְּאֵב", "english": "Pain" },
                    { "hebrew": "גּוּף", "english": "Body" },
                    { "hebrew": "נֶפֶשׁ", "english": "Soul / Mind" },
                    { "hebrew": "לְהַחְלִים", "english": "To recover" }
                ]
            },
            {
                "level": "Turquoise",
                "type": 1,
                "pairs": [
                    { "hebrew": "פּוֹלִיטִיקָה", "english": "Politics" },
                    { "hebrew": "מִפְלָגָה", "english": "Political party" },
                    { "hebrew": "בְּחִירוֹת", "english": "Elections" },
                    { "hebrew": "דֶּמוֹקְרַטְיָה", "english": "Democracy" },
                    { "hebrew": "חֹק", "english": "Law" },
                    { "hebrew": "מִשְׁפָּט", "english": "Trial / Sentence" },
                    { "hebrew": "שׁוֹפֵט", "english": "Judge" },
                    { "hebrew": "זְכוּת", "english": "Right (entitlement)" },
                    { "hebrew": "חוֹבָה", "english": "Duty" },
                    { "hebrew": "אֶזְרָח", "english": "Citizen" }
                ]
            },
            {
                "level": "Turquoise",
                "type": 2,
                "pairs": [
                    { "hebrew": "אֵיכוּת סְבִיבָה", "english": "Environment quality" },
                    { "hebrew": "זִיהוּם", "english": "Pollution" },
                    { "hebrew": "מִחְזוּר", "english": "Recycling" },
                    { "hebrew": "אַקְלִים", "english": "Climate" },
                    { "hebrew": "הִתְחַמְּמוּת", "english": "Warming" },
                    { "hebrew": "טֶבַע", "english": "Nature" },
                    { "hebrew": "יַעַר", "english": "Forest" },
                    { "hebrew": "מִדְבָּר", "english": "Desert" },
                    { "hebrew": "חַיָּה", "english": "Animal" },
                    { "hebrew": "צֶמַח", "english": "Plant" }
                ]
            },
            {
                "level": "Turquoise",
                "type": 3,
                "pairs": [
                    { "hebrew": "מַדָּע", "english": "Science" },
                    { "hebrew": "מֶחְקָר", "english": "Research" },
                    { "hebrew": "תַּגְלִית", "english": "Discovery" },
                    { "hebrew": "טֶכְנוֹלוֹגְיָה", "english": "Technology" },
                    { "hebrew": "פִּתּוּחַ", "english": "Development" },
                    { "hebrew": "הַמְצָאָה", "english": "Invention" },
                    { "hebrew": "נִסּוּי", "english": "Experiment" },
                    { "hebrew": "חָלָל", "english": "Space" },
                    { "hebrew": "כּוֹכָב", "english": "Star" },
                    { "hebrew": "גָּלַקְסְיָה", "english": "Galaxy" }
                ]
            },
            {
                "level": "Turquoise",
                "type": 4,
                "pairs": [
                    { "hebrew": "אָמָּנוּת", "english": "Art" },
                    { "hebrew": "תַּרְבּוּת", "english": "Culture" },
                    { "hebrew": "סִפְרוּת", "english": "Literature" },
                    { "hebrew": "שִׁירָה", "english": "Poetry" },
                    { "hebrew": "מוּזִיקָה", "english": "Music" },
                    { "hebrew": "צִיּוּר", "english": "Painting" },
                    { "hebrew": "פֶּסֶל", "english": "Statue" },
                    { "hebrew": "תֵּאַטְרוֹן", "english": "Theater" },
                    { "hebrew": "הַצָּגָה", "english": "Play / Show" },
                    { "hebrew": "קוֹלְנוֹעַ", "english": "Cinema" }
                ]
            },
            {
                "level": "Indigo",
                "type": 1,
                "pairs": [
                    { "hebrew": "פִּילוֹסוֹפְיָה", "english": "Philosophy" },
                    { "hebrew": "מוּסָר", "english": "Ethics / Morals" },
                    { "hebrew": "מַשְׁמָעוּת", "english": "Meaning" },
                    { "hebrew": "קִיּוּם", "english": "Existence" },
                    { "hebrew": "תּוֹדָעָה", "english": "Consciousness" },
                    { "hebrew": "תְּפִיסָה", "english": "Perception" },
                    { "hebrew": "הִגָּיוֹן", "english": "Logic" },
                    { "hebrew": "סָפֵק", "english": "Doubt" },
                    { "hebrew": "אֱמֶת", "english": "Truth" },
                    { "hebrew": "שֶׁקֶר", "english": "Lie" }
                ]
            },
            {
                "level": "Indigo",
                "type": 2,
                "pairs": [
                    { "hebrew": "כַּלְכָּלָה", "english": "Economy" },
                    { "hebrew": "אִינְפְלַצְיָה", "english": "Inflation" },
                    { "hebrew": "מִסּוּי", "english": "Taxation" },
                    { "hebrew": "בּוּרְסָה", "english": "Stock exchange" },
                    { "hebrew": "מַשְׁבֵּר", "english": "Crisis" },
                    { "hebrew": "הִתְאוֹשְׁשׁוּת", "english": "Recovery" },
                    { "hebrew": "יְצוּא", "english": "Export" },
                    { "hebrew": "יְבוּא", "english": "Import" },
                    { "hebrew": "תַּחֲרוּת", "english": "Competition" },
                    { "hebrew": "מוֹנוֹפּוֹל", "english": "Monopoly" }
                ]
            },
            {
                "level": "Indigo",
                "type": 3,
                "pairs": [
                    { "hebrew": "פְּסִיכוֹלוֹגְיָה", "english": "Psychology" },
                    { "hebrew": "רֶגֶשׁ", "english": "Emotion" },
                    { "hebrew": "הִתְנַהֲגוּת", "english": "Behavior" },
                    { "hebrew": "מֵנִיעַ", "english": "Motive" },
                    { "hebrew": "תִּסְכּוּל", "english": "Frustration" },
                    { "hebrew": "שִׂמְחָה", "english": "Joy" },
                    { "hebrew": "עֶצֶב", "english": "Sadness" },
                    { "hebrew": "כַּעַס", "english": "Anger" },
                    { "hebrew": "חֲרָדָה", "english": "Anxiety" },
                    { "hebrew": "תִּקְוָה", "english": "Hope" }
                ]
            },
            {
                "level": "Indigo",
                "type": 4,
                "pairs": [
                    { "hebrew": "הִיסְטוֹרְיָה", "english": "History" },
                    { "hebrew": "תְּקוּפָה", "english": "Era / Period" },
                    { "hebrew": "אִימְפֶּרְיָה", "english": "Empire" },
                    { "hebrew": "מַהְפֵּכָה", "english": "Revolution" },
                    { "hebrew": "מִלְחָמָה", "english": "War" },
                    { "hebrew": "שָׁלוֹם", "english": "Peace" },
                    { "hebrew": "הֶסְכֵּם", "english": "Agreement" },
                    { "hebrew": "מַנְהִיג", "english": "Leader" },
                    { "hebrew": "מֶרֶד", "english": "Rebellion" },
                    { "hebrew": "עַצְמָאוּת", "english": "Independence" }
                ]
            },
            {
                "level": "Indigo",
                "type": 5,
                "pairs": [
                    { "hebrew": "סְפּוֹרְט", "english": "Sports" },
                    { "hebrew": "אַלִּיפוּת", "english": "Championship" },
                    { "hebrew": "מֶדַלְיָה", "english": "Medal" },
                    { "hebrew": "מְאַמֵּן", "english": "Coach" },
                    { "hebrew": "שַׂחְקָן", "english": "Player" },
                    { "hebrew": "נִצָּחוֹן", "english": "Victory" },
                    { "hebrew": "הֶפְסֵד", "english": "Defeat" },
                    { "hebrew": "קְבוּצָה", "english": "Team" },
                    { "hebrew": "מִשְׂחָק", "english": "Game" },
                    { "hebrew": "כֹּשֶׁר", "english": "Fitness" }
                ]
            },
            {
                "level": "Indigo",
                "type": 6,
                "pairs": [
                    { "hebrew": "מִיסְטִיקָה", "english": "Mysticism" },
                    { "hebrew": "רוּחָנִיּוּת", "english": "Spirituality" },
                    { "hebrew": "גּוֹרָל", "english": "Destiny" },
                    { "hebrew": "אֱמוּנָה", "english": "Belief / Faith" },
                    { "hebrew": "נְשָׁמָה", "english": "Soul" },
                    { "hebrew": "מֶדִיטַצְיָה", "english": "Meditation" },
                    { "hebrew": "הֶאָרָה", "english": "Enlightenment" },
                    { "hebrew": "תְּפִלָּה", "english": "Prayer" },
                    { "hebrew": "טֶקֶס", "english": "Ceremony" },
                    { "hebrew": "מָסוֹרֶת", "english": "Tradition" }
                ]
            },
            {
                "level": "Purple",
                "type": null,
                "pairs": [
                    { "hebrew": "הֶקְשֵׁר", "english": "Context" },
                    { "hebrew": "מַשְׁמָעוּתִי", "english": "Significant" },
                    { "hebrew": "תַּמְצִיתוּת", "english": "Conciseness" },
                    { "hebrew": "רְוָחָה", "english": "Well-being" },
                    { "hebrew": "הַשְׁרָאָה", "english": "Inspiration" },
                    { "hebrew": "הִתְמַדּוּת", "english": "Perseverance" },
                    { "hebrew": "סַקְרָנוּת", "english": "Curiosity" },
                    { "hebrew": "יְצִירָתִיּוּת", "english": "Creativity" },
                    { "hebrew": "הַגְשָׁמָה", "english": "Fulfillment" },
                    { "hebrew": "גְּמִישׁוּת", "english": "Flexibility" }
                ]
            }
        ]
    }
] satisfies CurriculumSeed;
