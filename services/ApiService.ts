import params from '../configs/parameters';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { store } from '../stores/main';
import { serialize, deserialize } from 'jsonapi-fractal';
import { ILoginResponse, ILoginResult, OAuthTokenRequest, IUser } from './types';
import { ICategory, IProduct } from '../stores/reducers/data/types';
import { setLogin } from '../stores/reducers/auth/actionCreators';

export function oauthToken(params: OAuthTokenRequest): Promise<ILoginResult> {
  return call('POST', '/oauth/token', params).then((response: AxiosResponse<ILoginResponse>) => {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  });
}

export async function getCurrentUser(): Promise<IUser> {
  return deserialize((await call('GET', '/users/current')).data);
}

export async function listCategories(): Promise<Array<ICategory>> {
  return deserialize((await call('GET', '/product-categories')).data);
}

export async function createCategory(attributes: Partial<ICategory>): Promise<ICategory> {
  const requestData = serialize(attributes, 'product-categories', {});
  return deserialize((await call('POST', '/product-categories', requestData)).data);
}

export async function updateCategory(id: string, attributes: Partial<ICategory>): Promise<ICategory> {
  const requestData = serialize(attributes, 'product-categories', {});
  return deserialize((await call('PATCH', '/product-categories/' + id, requestData)).data);
}

export async function removeCategory(id: string): Promise<void> {
  await call('DELETE', '/product-categories/' + id);
}

export async function listProducts(categoryId: string): Promise<Array<IProduct>> {
  return deserialize((await call('GET', `/product-categories/${categoryId}/products`)).data);
}

export async function createProduct(categoryId: string, attributes: Partial<IProduct>): Promise<IProduct> {
  const requestData = serialize(attributes, 'products', {});
  return deserialize((await call('POST', `/product-categories/${categoryId}/products`, requestData)).data);
}

export async function updateProduct(categoryId: string, id: string, attributes: Partial<IProduct>): Promise<IProduct> {
  const requestData = serialize(attributes, 'products', {});
  return deserialize((await call('PATCH', `/product-categories/${categoryId}/products/${id}`, requestData)).data);
}

export async function removeProduct(categoryId: string, id: string): Promise<void> {
  await call('DELETE', `/product-categories/${categoryId}/products/${id}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function call<T = any>(method: string, path: string, body: any = null, tries = 0): Promise<AxiosResponse<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = {
    'Content-Type': 'application/json',
  };

  const accessToken = store.getState().auth.accessToken;
  const refreshToken = store.getState().auth.refreshToken;

  if (accessToken) {
    headers.Authorization = 'Bearer ' + accessToken;
  }

  try {
    return await axios({
      method: method,
      url: params.apiUrl + path,
      data: JSON.stringify(body),
      headers,
    } as AxiosRequestConfig);
  } catch (error) {
    if (error.response && error.response.status == 401 && tries < 1 && refreshToken) {
      try {
        const tokenResult = await oauthToken({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        });

        store.dispatch(
          setLogin({
            accessTokenVerified: true,
            accessToken: tokenResult.accessToken,
            refreshToken: tokenResult.refreshToken,
          }),
        );
      } catch (error2) {
        throw error;
      }

      return await call<T>(method, path, body, ++tries);
    } else {
      throw error;
    }
  }
}
