import OpenAI from "openai";
import React from 'react'
import { Pressable, Text } from "react-native";

const AIAgent = () => {


    async function AIResponse() {

        const client = new OpenAI();

        const response = await client.responses.create({
            model: "gpt-5.5",
            input: "Write a one-sentence bedtime story about a unicorn."
        });

        console.log(response.output_text);
    }


    return (
        <div>
            <Pressable onPress={AIResponse}>
                <Text>click to test AI respose</Text>
            </Pressable>

        </div>
    )
}

export default AIAgent
