import {
  ICourierClient,
  ICourierClientConfiguration,
  ICourierMessageGetResponse,
  ICourierProfileGetParameters,
  ICourierProfileGetResponse,
  ICourierProfilePostParameters,
  ICourierProfilePostResponse,
  ICourierProfilePutParameters,
  ICourierProfilePutResponse,
  ICourierSendParameters,
  ICourierSendResponse
} from "./types";

const send = (options: ICourierClientConfiguration) => {
  return async (
    params: ICourierSendParameters
  ): Promise<ICourierSendResponse> => {
    const res = await options.httpClient.post<ICourierSendResponse>("/send", {
      data: params.data,
      event: params.eventId,
      override: params.override,
      preferences: params.preferences,
      profile: params.profile,
      recipient: params.recipientId
    });
    return res.data;
  };
};

const getMessage = (options: ICourierClientConfiguration) => {
  return async (
    messageId: string
  ): Promise<ICourierMessageGetResponse> => {
    const res = await options.httpClient.get<ICourierMessageGetResponse>(
      `/messages/${messageId}`
    );
    return res.data;
  };
};

const replaceProfile = (options: ICourierClientConfiguration) => {
  return async (
    params: ICourierProfilePutParameters
  ): Promise<ICourierProfilePutResponse> => {
    const res = await options.httpClient.put<ICourierProfilePutResponse>(
      `/profiles/${params.recipientId}`,
      {
        profile: params.profile
      }
    );
    return res.data;
  };
};

const mergeProfile = (options: ICourierClientConfiguration) => {
  return async (
    params: ICourierProfilePostParameters
  ): Promise<ICourierProfilePostResponse> => {
    const res = await options.httpClient.post<ICourierProfilePostResponse>(
      `/profiles/${params.recipientId}`,
      {
        profile: params.profile
      }
    );
    return res.data;
  };
};

const getProfile = (options: ICourierClientConfiguration) => {
  return async (
    params: ICourierProfileGetParameters
  ): Promise<ICourierProfileGetResponse> => {
    const res = await options.httpClient.get<ICourierProfileGetResponse>(
      `/profiles/${params.recipientId}`
    );
    return res.data;
  };
};

export const client = (
  options: ICourierClientConfiguration
): ICourierClient => {
  return {
    getMessage: getMessage(options),
    getProfile: getProfile(options),
    mergeProfile: mergeProfile(options),
    replaceProfile: replaceProfile(options),
    send: send(options)
  };
};
