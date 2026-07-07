import apiRequest from "@/Server/Api";
import { toast } from "react-toastify";

interface ApiResponse {
  action: string;
  url: string;
  status: number | string;
}

interface ApiRequestResponse<T> {
  data: T;
  message: string;
  status: number | string;
}

export const CreateMetric = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/general/metric/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateChannel = async (payload: unknown): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/general/airplay/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateSocialStats = async (
  id: number,
  payload: unknown,
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `api/v1/projects/${id}/social-media/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const CreateDspStats = async (
  id: number,
  payload: unknown,
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `api/v1/projects/${id}/dsp/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const getAirPlayStats = async ({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/projects/${id}/airplay-stats/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getSocialMediaStats = async ({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/projects/${id}/social-media-stats/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getDSPStats = async ({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/projects/${id}/dsp-stats/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getAudienceStats = async ({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/projects/${id}/audience-target-reach-stats/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const geteSMActionStats = async ({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/projects/${id}/sm-action-stats/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const geteDSPPerformanceStats = async ({
  id,
  startDate,
  endDate,
}: {
  id: number;
  startDate?: string;
  endDate?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/projects/${id}/dsp-performance-stats/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const AddAirplayData = async (
  payload: unknown,
  id: number,
): Promise<void> => {
  try {
    const { data: response } = await apiRequest<
      ApiRequestResponse<ApiResponse>
    >({
      method: "POST",
      url: `/api/v1/projects/${id}/air-plays/`,
      data: payload,
      requireToken: true,
    });

    console.log(response);
    toast.success("Creation successful!");
  } catch (error: unknown) {
    return;
  }
};

export const getSpinsAnalytics = async (
  startDate?: string,
  endDate?: string,
): Promise<any | null> => {
  try {
    let url = `/api/v1/spins/audio-spins-analytics/`;
    if (startDate && endDate) {
      url += `?start_date=${startDate}&end_date=${endDate}`;
    }

    const response = await apiRequest({
      method: "GET",
      url: url,
      data: null,
      requireToken: false,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getSpinsNotificationPublic = async (
  spinId: string | string[] | undefined,
): Promise<any | null> => {
  try {
    let url = `/api/v1/spins/public-spin/${spinId}`;

    const response = await apiRequest({
      method: "GET",
      url: url,
      data: null,
      requireToken: false,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getCampaignClusters = async (): Promise<any | null> => {
  try {
    let url = `/api/v1/clusters/`;

    const response = await apiRequest({
      method: "GET",
      url: url,
      data: null,
      requireToken: false,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getSystemAudienceReach = async (): Promise<any | null> => {
  try {
    let url = `/api/v1/system-target-audience-reach/`;

    const response = await apiRequest({
      method: "GET",
      url: url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getCampaignSongISRC = async (
  song_isrc: string,
): Promise<any | null> => {
  try {
    let url = `/api/v1/songs/lookup?isrc=${song_isrc}`;

    const response = await apiRequest({
      method: "GET",
      url: url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};

export const getClusterDjs = async (params?: {
  cluster_id?: number | null;
  search?: string;
}): Promise<any | null> => {
  try {
    let url = `/api/v1/djs/`;
    const query = new URLSearchParams();

    if (params?.cluster_id != null) {
      query.append("cluster_id", String(params.cluster_id));
    }
    if (params?.search) {
      query.append("search", params.search);
    }

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await apiRequest({
      method: "GET",
      url,
      data: null,
      requireToken: true,
    });

    return response as any;
  } catch (error: unknown) {
    return null;
  }
};
