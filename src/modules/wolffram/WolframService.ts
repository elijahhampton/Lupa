import axios from 'axios';
import LOG, { LOG_ERROR } from '../../common/Logger';

const APP_ID = "9UR3XH-A84WW85J57";

function retrieveEndpoint(activity, time, age, gender, height, weight) {
    return `https://api.wolframalpha.com/v2/query?input=${activity}+${time}min%2C+%${age}yo+${gender}%2C+${height}%22%2C+${weight}lb&format=minput,plaintext&output=JSON&appid=${APP_ID}`
}

function WolfframService(age: number, gender: string, height: string, weight: string) {
    this.age = age;
    this.gender = gender;
    this.height = height;
    this.weight = weight;
}

WolfframService.prototype.queryActivity = async function(activity: string, time: string) {
    const endpoint = retrieveEndpoint(activity, this.time, this.age, this.gender, this.height, this.weight);
    axios({
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: endpoint,
        data: JSON.stringify({
            activity: activity
        })
    }).then(response => {
        LOG('WolfframService.ts', 'Finished running axios request.');
        return Promise.resolve(response.data)
    }).catch(error => {
        LOG_ERROR('WolfframService.ts', 'Error running axios request.', error);
    })
}

//EXAMPLE USAGE

//const QUERY_ACTIVITY_ENDPOINT = "https://api.wolframalpha.com/v2/query?input=running+30min%2C+28yo+female%2C+5'6%22%2C+135lb&format=minput,plaintext&output=JSON&appid=DEMO";

//const wolfframService = new WolfframSerice('28', 'female', "5'6", '130');
//const userExerciseData = wolfframService.queryActivity('running', '30')

/*
RESPONSE:

{
	"queryresult":{
		"success":true,
		"error":false,
		"numpods":2,
		"datatypes":"Formula",
		"timedout":"Formula",
		"timedoutpods":"",
		"timing":4.695,
		"parsetiming":1.348,
		"parsetimedout":false,
		"recalculate":"https:\/\/www4f.wolframalpha.com\/api\/v1\/recalc.jsp?id=MSPa298018a56g82abf1ei9i00005ggbd37a9ad21b7d1627542906415416375&output=JSON",
		"id":"MSP298118a56g82abf1ei9i000020c165g08bdb9f63",
		"host":"https:\/\/www4f.wolframalpha.com",
		"server":"32",
		"related":"https:\/\/www4f.wolframalpha.com\/api\/v1\/relatedQueries.jsp?id=MSPa298218a56g82abf1ei9i0000100hbi0621bb13dh1627542906415416375",
		"version":"2.6",
		"pods":[
			{
				"title":"Input information",
				"scanner":"Formula",
				"id":"Input",
				"position":100,
				"error":false,
				"numsubpods":1,
				"subpods":[
					{
						"title":"",
						"plaintext":"running | \ntime | 30 minutes\ngender | female\nage | 28 years\nheight | 5' 6\"\nbody weight | 135 lb (pounds)\npace | 8 min\/mi (minutes per mile)",
						"minput":"FormulaData[{\"Running\", \"Pace\"}, {\"t\" -> Quantity[30, \"Minutes\"]}]"
					}
				],
				"expressiontypes":{
					"name":"Grid"
				}
			},
			{
				"title":"Metabolic properties",
				"scanner":"Formula",
				"id":"MetabolicProperties",
				"position":200,
				"error":false,
				"numsubpods":1,
				"primary":true,
				"subpods":[
					{
						"title":"",
						"plaintext":"energy expenditure | 402 Cal (dietary calories)\nfat burned | 0.11 lb (pounds)\noxygen consumption | 21.2 gallons\nmetabolic equivalent | 12 metabolic equivalents\n(estimates based on CDC standards)"
					}
				],
				"expressiontypes":{
					"name":"Grid"
				},
				"states":[
					{
						"name":"Show metric",
						"input":"MetabolicProperties__Show metric"
					}
				]
			}
		],
		"assumptions":[
			{
				"type":"FormulaSolve",
				"template":"Calculate ${desc1}",
				"count":2,
				"values":[
					{
						"name":"Running.d",
						"desc":"distance",
						"input":"*FS-_**Running.d--"
					},
					{
						"name":"Running.p",
						"desc":"pace",
						"input":"*FS-_**Running.p--"
					}
				]
			},
			{
				"type":"FormulaVariable",
				"desc":"pace",
				"current":"1",
				"count":1,
				"values":{
					"name":"Running.p",
					"desc":"8 min\/mi",
					"valid":true,
					"input":"*F.Running.p-_8+min%2Fmi"
				}
			},
			{
				"type":"FormulaVariableOption",
				"template":"Assuming ${desc1}. Use ${desc2} instead",
				"count":2,
				"values":[
					{
						"name":"Running.p",
						"desc":"pace",
						"input":"*FVarOpt-_**Running.p-.*Running.age-.*Running.H--"
					},
					{
						"name":"Running.v",
						"desc":"speed",
						"input":"*FVarOpt-_**Running.v-.*Running.age-.*Running.H--"
					}
				]
			},
			{
				"type":"FormulaVariableInclude",
				"template":"Also include ${desc1}",
				"count":2,
				"values":[
					{
						"name":"Running.incline",
						"desc":"incline",
						"input":"*FVarOpt-_**Running.incline-.*Running.p-.*Running.age-.*Running.H--"
					},
					{
						"name":"Running.HRResting",
						"desc":"resting heart rate",
						"input":"*FVarOpt-_**Running.HRResting-.*Running.p-.*Running.age-.*Running.H--"
					}
				]
			}
		]
	}
}
*/