import OpenAI from "openai";
import type { Run } from "openai/resources/beta/threads/runs/runs";
import type { Thread } from "openai/resources/beta/threads/threads";
import { tools } from '../tools/alltools';

export async function handleRunToolCalls(run: Run, client: OpenAI, thread: Thread): Promise<Run> {

    // console.log(`💾 Handling tool calls for run ${run.id}`);

    const toolCalls = run.required_action?.submit_tool_outputs?.tool_calls;
    if (!toolCalls) return run;

    const toolOutputs = await Promise.all(
        toolCalls.map(async (tool) => {
            const toolConfig = tools[tool.function.name];
            if (!toolConfig) {
                // console.error(`Tool "${tool.function.name}" not found. Available tools: ${Object.keys(tools).join(', ')}`);
                return {
                    tool_call_id: tool.id,
                    output: `Error: Tool "${tool.function.name}" is not available. Please use one of: ${Object.keys(tools).join(', ')}`
                };
            }

            // console.log(`💾 Executing: ${tool.function.name}`);

            try {
                const args = JSON.parse(tool.function.arguments);
                const output = await toolConfig.handler(args);
                return {
                    tool_call_id: tool.id,
                    output: String(output)
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    tool_call_id: tool.id,
                    output: `Error: ${errorMessage}`
                };
            }
        })
    );

    const validOutputs = toolOutputs.filter(Boolean) as OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[];
    if (validOutputs.length === 0) return run;

    return client.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: validOutputs }
    );
}