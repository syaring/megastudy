import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export enum ErrorCode {
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
}

interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  code: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
}

// API 클라이언트 클래스
class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.apiDemo,
      timeout: 5 * 60 * 1000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }

    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config;

        // 원본 요청이 없거나 이미 재시도된 요청인 경우
        if (!originalRequest || (originalRequest as RetryableRequest)._retry) {
          return Promise.reject(error);
        }

        // EXPIRED_TOKEN 에러 처리
        if (error.response?.data?.code === ErrorCode.EXPIRED_TOKEN) {
          if (this.isRefreshing) {
            // 토큰 갱신 중인 경우, 대기열에 추가
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;

                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          (originalRequest as RetryableRequest)._retry = true;

          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const username = localStorage.getItem('username');

            const response = await this.refreshToken(refreshToken!, username!);

            const { access_token, refresh_token } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // 대기 중인 요청들 처리
            this.refreshSubscribers.forEach((callback) => callback(access_token!));
            this.refreshSubscribers = [];

            // 원본 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // 토큰 갱신 실패 시 로그인 페이지로 이동
            this.handleAuthError();

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(refreshToken: string, username: string): Promise<ApiResponse<TokenResponse>> {
    return this.axiosInstance.post(
      '/api/v2/users/refresh',
      {
        refreshToken,
        username,
      },
    );
  }

  private handleAuthError(): void {
    // 인증 관련 데이터 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');

    // 로그인 페이지로 이동
    window.location.href = '/login';
  }

  public async get<T>(url: string, config = {}) {
    return this.axiosInstance.get<ApiResponse<T>>(url, config);
  }

  public async post<T>(url: string, data = {}, config = {}) {
    return this.axiosInstance.post<ApiResponse<T>>(url, data, config);
  }

  public async put<T>(url: string, data = {}, config = {}) {
    return this.axiosInstance.put<ApiResponse<T>>(url, data, config);
  }

  public async delete<T>(url: string, config = {}) {
    return this.axiosInstance.delete<ApiResponse<T>>(url, config);
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = ApiClient.getInstance();
