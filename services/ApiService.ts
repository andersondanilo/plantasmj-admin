import { Platform } from 'react-native';
import params from '../configs/parameters';
import { store } from '../stores/main';
import { serialize, deserialize } from 'jsonapi-fractal';
import {
  ILoginResponse,
  ILoginResult,
  OAuthTokenRequest,
  IUser,
  IFormDataFile,
  HTTPResponse,
  HTTPError,
} from './types';
import { ICategory, IProduct } from '../stores/reducers/data/types';
import { setLogin } from '../stores/reducers/auth/actionCreators';
import { dataURIToBlob } from './UtilsService';

export function oauthToken(params: OAuthTokenRequest): Promise<ILoginResult> {
  return call('POST', '/oauth/token', params).then((response: HTTPResponse<ILoginResponse>) => {
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

export async function createProduct(
  categoryId: string,
  attributes: Partial<IProduct>,
  image: IFormDataFile | null,
): Promise<IProduct> {
  const requestData = buildProductRequestData(attributes, image);
  return deserialize((await call('POST', `/product-categories/${categoryId}/products`, requestData)).data);
}

export async function updateProduct(
  categoryId: string,
  id: string,
  attributes: Partial<IProduct>,
  image: IFormDataFile | null,
): Promise<IProduct> {
  const requestData = buildProductRequestData(attributes, image);
  return deserialize((await call('PATCH', `/product-categories/${categoryId}/products/${id}`, requestData)).data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProductRequestData(attributes: Partial<IProduct>, image: IFormDataFile | null): any {
  const json = serialize(attributes, 'products', {});

  if (image) {
    const formData = new FormData();
    formData.append('json', JSON.stringify(json));

    if (Platform.OS === 'web') {
      formData.append('image', dataURIToBlob(image.uri), image.name);
    } else {
      formData.append('image', image);
    }

    return formData;
  } else {
    return json;
  }
}

export async function removeProduct(categoryId: string, id: string): Promise<void> {
  await call('DELETE', `/product-categories/${categoryId}/products/${id}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function call<T = any>(method: string, path: string, body: any = null, tries = 0): Promise<HTTPResponse<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = {};

  const accessToken = store.getState().auth.accessToken;
  const refreshToken = store.getState().auth.refreshToken;

  if (accessToken) {
    headers.Authorization = 'Bearer ' + accessToken;
  }

  let requestData = body;

  if (typeof requestData !== 'string') {
    if (!(requestData instanceof FormData)) {
      requestData = JSON.stringify(requestData);
      headers['Content-Type'] = 'application/json';
    }
  }

  if (method != 'POST' && method != 'PATCH') {
    requestData = null;
  }

  try {
    const fetchResponse = await fetch(params.apiUrl + path, {
      method: method,
      body: requestData,
      headers,
    });

    let jsonBody = null;

    try {
      jsonBody = await fetchResponse.json();
    } catch {
      jsonBody = null;
    }

    if (fetchResponse.status >= 300) {
      const error = new HTTPError();

      error.response = {
        status: fetchResponse.status,
        data: jsonBody,
      };

      throw error;
    }

    return {
      status: fetchResponse.status,
      data: jsonBody,
    };
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
