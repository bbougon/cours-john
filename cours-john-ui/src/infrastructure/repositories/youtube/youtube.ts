import { DisplayError } from '../../../components/DisplayErrorComponent.tsx';

export type YoutubeError = {
  error: {
    code: number;
    message: string;
    errors: [
      {
        message: string;
        domain: string;
        reason: string;
      },
    ];
  };
};

export const mapYoutubeError = (error: YoutubeError): DisplayError => ({
  message: 'Error requesting Youtube API',
  reason: error.error.errors.map((e) => e.reason),
  additionalMessage: error.error.errors.map((e) => e.message),
});
