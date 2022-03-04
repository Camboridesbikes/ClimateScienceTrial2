import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import scoreData from  './scoreData.json';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// console.log(scoreData.data);
admin.initializeApp({projectId: 'doesnt-matter'})

interface SCORE_DATA {
  id?: string,
  team: string,
  score : number
}

interface PERCENTILE_SCORES {
  ninty: {
    score: number,
    teams: SCORE_DATA[]
  },
  eighty: {
    score: number,
    teams: SCORE_DATA[]
  },
  ten: {
    score: number,
    teams: SCORE_DATA[]
  }
}


export const data = functions.https.onRequest( async (req, resp) => {

  functions.logger.info("calculating percentiles...", {structuredData: true} );

  //get data
  const data : SCORE_DATA[] = scoreData;

  const calcPercentile = (percentile : number) : number => {

    //CLACULATE index of precentiles (90th, 80th and 10th) --> convert p to percent and multiply by how many teams
    const calculated : number = (percentile / 100) * data.length;
  
    //IF calculated index isn't index, return next whole number
    if(calculated % 1 !== 0){
      return Math.ceil(calculated);      
    }else{
      return calculated;
    }
  }

  //sort data (if database doesn't do it for us)
  data.sort((a,b) => {
    return a.score - b.score
  })

  //find percentile index and return array with team at that index as well as any other teams with the same score
  const getPercentile = (percentile : number) : SCORE_DATA[] => {

    const tempArray : SCORE_DATA[] = [];//temp builder array to be returned at end of function

    const index : number = calcPercentile(percentile); //get the index of the team at the percentile

    const teamAtIndex : SCORE_DATA = data[index]; // temp variable to access the team info at percentile index

    tempArray.push(teamAtIndex); // add the team to the array builder


    //while loops to add teams with the same score to the builder array

    let counter : number = index - 1;

    while(data[counter] != undefined && data[counter].score === teamAtIndex.score){

        tempArray.push(data[counter]);

        --counter;      
    }
    
    counter = index - 1;

    while(data[counter] != undefined && data[counter].score === teamAtIndex.score){

        tempArray.push(data[counter]);

        ++counter;      
    }


    return tempArray;

  }

  const calculatedScores : PERCENTILE_SCORES = {
    ninty: {
      score: data[calcPercentile(90)].score,
      teams: getPercentile(90)
    },
    eighty: {
      score: data[calcPercentile(80)].score,
      teams: getPercentile(80)
    },
    ten: {
      score: data[calcPercentile(10)].score,
      teams: getPercentile(10)
    }
  }
  

  resp.send(calculatedScores);

  functions.logger.info("calculated percentiles sent.", {structuredData: true} );
});

