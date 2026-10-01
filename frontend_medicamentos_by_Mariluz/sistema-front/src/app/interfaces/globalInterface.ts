export interface ResultResponse<T> {
  datos: T;
  success: boolean;
  Mensaje: Array<string>;
  status: number;
}

export interface ResultResponsePaginator<T> {
  datos: T;
  success: boolean;
  Mensaje: Array<string>;
  maxPages: number;
  currentpage: number;
  previous: boolean;
  next: boolean;
  status: number;
}

export interface Result {
  success: boolean;
  Mensaje: Array<string>;
  status: number;
}
