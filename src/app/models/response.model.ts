export interface ResponseModel<T> {
  errors: any;
  response: T;
  message: string;
}

export class PaginationResponse<T> {
  pageNumber!: number;
  pageSize!: number;
  previousPage!: number;
  result!: T;
  totalItems!: number;
  totalPages!: number;
}

export interface SearchDTO {
  search: string;
  pageNumber: number;
  pageSize: number;
}

export const InitialSearchDTO = {
  search: '',
  pageNumber: 1,
  pageSize: 5,
};

export const users = [
  {
    username: "alabimuhydeen@gmail.com",
    password: "123456",
    userId: 1,
    userRole: 'provider'
  },
  {
    username: "alabimuhydeen@yahoo.com",
    password: "123456",
    userId: 1,
    userRole: 'instructor'
  },
]

export const pageSizeOptionsDTO = [5, 10, 25, 100];
