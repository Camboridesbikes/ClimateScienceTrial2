## Trail Task 2

This firbase function is a coding trial for ClimateScience.

My experience lies with aws and mongodb for nosql, serverless databases - so this was my first day using firebase. I was able to get this function running on the firebase function emulator, but have not taught myself the nuances of using firestore yet - so the logic this function uses has not been tested with firestore.

I was able to process ten to twenty objects with repeating values quickly using a recursive function to find teams with the same score adjacent to the team at the index of the percentile - but when processing 500 to 900 objects that method exceeded the call stack size. So I simplified and used a while loop with a counter instead. The code has been tested with the given json file and processes in less than a second. 

If this function was working with firestore I think the biggest two things I would need to do to prepare for production would be to secure the database with firestore authentication (api access) as well as hide the sensitive data with environmental variables. 

With that taken care of, my code does not catch errors, so I would need to add error logging into the function so that debugging would be much easier and a bad request wouldn't kill the whole app. 

Regardless of the outcome of this trial, I enjoyed learning firebase and will devote some time to become proficient with it. 