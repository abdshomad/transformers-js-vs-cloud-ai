import { pipeline, PipelineType } from '@xenova/transformers';

// Singleton instance to prevent reloading models unnecessarily
class TransformerService {
  private static instance: TransformerService;
  private sentimentPipeline: any = null;
  private detectionPipeline: any = null;

  private constructor() {}

  public static getInstance(): TransformerService {
    if (!TransformerService.instance) {
      TransformerService.instance = new TransformerService();
    }
    return TransformerService.instance;
  }

  /**
   * Loads the sentiment analysis pipeline (distilbert-base-uncased-finetuned-sst-2-english)
   */
  public async getSentimentPipeline() {
    if (!this.sentimentPipeline) {
      // @ts-ignore - types for pipeline are sometimes loose in this environment
      this.sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    }
    return this.sentimentPipeline;
  }

  /**
   * Loads the object detection pipeline (detr-resnet-50)
   */
  public async getObjectDetectionPipeline() {
    if (!this.detectionPipeline) {
       // @ts-ignore
      this.detectionPipeline = await pipeline('object-detection', 'Xenova/detr-resnet-50');
    }
    return this.detectionPipeline;
  }
}

export const transformerService = TransformerService.getInstance();