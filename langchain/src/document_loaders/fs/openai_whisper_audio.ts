import { type ClientOptions, OpenAI as OpenAIClient, toFile } from "openai";

import { Document } from "../../document.js";
import { BufferLoader } from "./buffer.js";

const MODEL_NAME = "whisper-1";

export class OpenAIWhisperAudio extends BufferLoader {
  private readonly openAIClient: OpenAIClient;

  constructor(
    filePathOrBlob: string | Blob,
    fields?: {
      clientOptions?: ClientOptions;
    }
  ) {
    super(filePathOrBlob);
    this.openAIClient = new OpenAIClient(fields?.clientOptions);
  }

  protected async parse(
    raw: Buffer,
    metadata: Record<string, string>
  ): Promise<Document[]> {
    const fileName =
      metadata.source === "blob" ? metadata.blobType : metadata.source;
    const transcriptionResponse =
      await this.openAIClient.audio.transcriptions.create({
        file: await toFile(raw, fileName),
        model: MODEL_NAME,
      });
    const document = new Document({
      pageContent: transcriptionResponse.text,
      metadata,
    });
    return [document];
  }
}
