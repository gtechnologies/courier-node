import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { CourierClient } from "../index";

import {
  ICourierProfileGetResponse,
  ICourierProfilePostResponse,
  ICourierProfilePutResponse
} from "../profiles/types";

const mockReplaceProfileResponse: ICourierProfilePutResponse = {
  status: "SUCCESS"
};

const mockMergeProfileResponse: ICourierProfilePostResponse = {
  status: "SUCCESS"
};

const mockGetProfileResponse: ICourierProfileGetResponse = {
  profile: {
    name: "Troy"
  }
};

describe("CourierProfiles", () => {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onPut(/\/profiles\/.*/).reply(200, mockReplaceProfileResponse);
    mock.onPost(/\/profiles\/.*/).reply(200, mockMergeProfileResponse);
    mock.onGet(/\/profiles\/.*/).reply(200, mockGetProfileResponse);
  });

  test(".replaceProfile", async () => {
    const { profiles } = CourierClient({
      authorizationToken: "AUTH_TOKEN"
    });

    await expect(
      profiles.replaceProfile({
        profile: {
          foo: "bar"
        },
        recipientId: "RECIPIENT_ID"
      })
    ).resolves.toMatchObject(mockReplaceProfileResponse);
  });

  test(".mergeProfile", async () => {
    const { profiles } = CourierClient({
      authorizationToken: "AUTH_TOKEN"
    });

    await expect(
      profiles.mergeProfile({
        profile: {
          foo: "bar"
        },
        recipientId: "RECIPIENT_ID"
      })
    ).resolves.toMatchObject(mockMergeProfileResponse);
  });

  test(".mergeProfile with Idempotency Key", async () => {
    const { profiles } = CourierClient({
      authorizationToken: "AUTH_TOKEN"
    });

    mock.onPost(/\/profiles\/.*/).reply(async (config) => {
      expect(config.headers["Idempotency-Key"]).toBe("IDEMPOTENCY_KEY_UUID");
      return [200];
    });

    await profiles.mergeProfile(
      {
        profile: {
          foo: "bar"
        },
        recipientId: "RECIPIENT_ID"
      },
      {
        idempotencyKey: "IDEMPOTENCY_KEY_UUID"
      }
    );
  });

  test(".getProfile", async () => {
    const { profiles } = CourierClient({
      authorizationToken: "AUTH_TOKEN"
    });

    await expect(
      profiles.getProfile({
        recipientId: "RECIPIENT_ID"
      })
    ).resolves.toMatchObject(mockGetProfileResponse);
  });
});