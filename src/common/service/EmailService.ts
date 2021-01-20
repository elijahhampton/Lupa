

import axios from 'axios';

const SEND_FEEDBACK_SUBMISSION_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/sendFeedbackSubmission"


export default function sendFeedbackSubmission(user, feedback) {
    axios({
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        url: SEND_FEEDBACK_SUBMISSION_ENDPOINT,
        data: JSON.stringify({
            user_email: user,
            feedback_text: feedback,
        })
    }).then(response => {
       
    }).catch(error => {
      
    })
    
}
