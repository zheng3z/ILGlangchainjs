import { AnthropicFunctions } from "langchain/experimental/chat_models/anthropic_functions";
import { HumanMessage } from "langchain/schema";

const model = new AnthropicFunctions({
  temperature: 0.1,
}).bind({
  functions: [
    {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  ],
  // You can set the `function_call` arg to force the model to use a function
  function_call: {
    name: "get_current_weather",
  },
});

const response = await model.invoke([
  new HumanMessage({
    content: "What's the weather in Boston?",
  }),
]);

console.log(response);

/*
  AIMessage {
    content: '',
    additional_kwargs: {
      function_call: {
        name: 'get_current_weather',
        arguments: '{"location":"Boston, MA","unit":"fahrenheit"}'
      }
    }
  }
*/
