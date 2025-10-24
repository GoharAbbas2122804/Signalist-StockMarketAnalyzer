import { success } from "better-auth";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { sendWelcomeEmail } from "../NodeMailer";
import { getAllUsersForNewsEmail } from "../actions/user.actions";

export const sendSignUpEmail =  inngest.createFunction(
    {id: 'sign-up-email'},
    {event: 'app/user.created'},

    async ({event, step}) => {
        const userProfile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}

        `
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        //now its time to call gemini api to generate the personalized welcome email
        const response = await  step.ai.infer("generate-welcome-intro" , {
            model : step.ai.models.gemini({model : 'gemini-2.5-flash-lite'}),
            body: {
                contents : [
                    {
                        role: 'user',
                        parts: [
                            {text: prompt}
                        ]
                    }
                ]
            }
        })


        await step.run('send-welcome-email' , async()=>{
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null)  || "Thanks for joining Signalist. You now have tools to track market and make smarter moves.";


            // Email Sending Logic

            const {data: {email , name}} = event;


            return await sendWelcomeEmail({
                email , name , intro:introText
            })
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
        
    }


    
)

export const sendDailyNewsSummary = inngest.createFunction(
    {id: 'daily-news-summary'},
    [{event: 'app/send.daily.news'},  {cron: '0 12 * * *'} ],
    async ({step}) => {
        //step 1: get all the users who have enabled daily news summary 
        const users = await step.run('get-all-users', getAllUsersForNewsEmail);

        //if there are no users who have enabled daily news summary , then return
        if(!users || users.length === 0) {
            return {
                success: true,
                message: 'No users found for daily news summary'
            }
        }

        //steps 2: personalize the news summary email for each user
        //steps 3: Summarize these news via Ai Api and get the summary for each user
        //steps 4: send the personalized news summary email to each user
    }
)